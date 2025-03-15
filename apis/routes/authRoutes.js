// routes/authRoutes.js

const express = require('express');
const { register, login, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); // New logout route

module.exports = router;
