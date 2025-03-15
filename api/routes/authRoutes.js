// routes/authRoutes.js

const express = require('express');
const { register, login, logout, refresh } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh); // New endpoint for refreshing tokens
router.get('/user', authenticateJWT, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username } });
});

module.exports = router;