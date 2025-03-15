const express = require('express');
const { register, login, logout, refresh } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { validateLogin, validateRegister } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh', refresh); 
router.get('/user', authenticateJWT, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username } });
});

module.exports = router;