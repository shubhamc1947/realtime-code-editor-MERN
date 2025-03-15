// middleware/authMiddleware.js

const { verifyAccessToken } = require('../utils/jwt');

const authenticateJWT = (req, res, next) => {
  // First check if the token is in cookies
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  
  // As a fallback, check if it's in the authorization header
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
    
  const token = accessToken || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ msg: 'No access token provided, authorization denied' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    // If token is expired, client should use refresh endpoint
    if (error.message === 'Access token has expired') {
      return res.status(401).json({ 
        msg: 'Access token expired', 
        tokenExpired: true 
      });
    }
    return res.status(401).json({ msg: error.message });
  }
};

module.exports = {
  authenticateJWT
};