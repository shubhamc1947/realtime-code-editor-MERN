// controllers/authController.js

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10); // Increased salt rounds
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    
    // Store refresh token in database with expiry
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
    
    newUser.refreshTokens = [{
      token: refreshToken,
      expiresAt: refreshExpiry
    }];
    await newUser.save();
    
    // Set cookies
    res.cookie('accessToken', accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      path: '/api/auth/refresh', // Only sent to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ msg: 'Registration successful', username: newUser.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Store refresh token in database with expiry
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
    
    // Limit number of refresh tokens per user (optional)
    if (user.refreshTokens && user.refreshTokens.length >= 5) {
      // Keep only the 4 most recent tokens and add the new one
      user.refreshTokens = user.refreshTokens.slice(-4);
    }
    
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: refreshExpiry
    });
    await user.save();
    
    // Set cookies
    res.cookie('accessToken', accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      path: '/api/auth/refresh', // Only sent to refresh endpoint
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ msg: 'Login successful', username: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    // If we have a refresh token, remove it from the database
    if (refreshToken) {
      const user = await User.findOne({ 'refreshTokens.token': refreshToken });
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
        await user.save();
      }
    }
    
    // Clear cookies regardless
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    
    res.json({ msg: 'Logout successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ msg: 'No refresh token provided' });
  }
  
  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user and check if the refresh token exists and is not expired
    const user = await User.findOne({ 
      _id: decoded.id,
      'refreshTokens.token': refreshToken
    });
    
    if (!user) {
      return res.status(401).json({ msg: 'Invalid refresh token' });
    }
    
    // Check if token is expired in the database
    const tokenDoc = user.refreshTokens.find(t => t.token === refreshToken);
    if (new Date() > tokenDoc.expiresAt) {
      // Remove expired token
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();
      return res.status(401).json({ msg: 'Refresh token has expired' });
    }
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    // Replace old refresh token with new one
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
    
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: refreshExpiry
    });
    
    await user.save();
    
    // Set new cookies
    res.cookie('accessToken', newAccessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', newRefreshToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ msg: 'Token refresh successful' });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: err.message || 'Failed to refresh token' });
  }
};

// Add a method to clean up expired tokens (could be called by a cron job)
const cleanupExpiredTokens = async () => {
  try {
    const now = new Date();
    // Find users with expired tokens
    const users = await User.find({
      'refreshTokens.expiresAt': { $lt: now }
    });
    
    // Remove expired tokens for each user
    for (let user of users) {
      user.refreshTokens = user.refreshTokens.filter(token => token.expiresAt > now);
      await user.save();
    }
    
    console.log('Expired tokens cleanup completed');
  } catch (err) {
    console.error('Error during token cleanup:', err.message);
  }
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  cleanupExpiredTokens
};