const express = require('express');
const { registrar, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registrar);
router.post('/login', login);
router.post('/google-token', authController.googleLogin);

module.exports = router;
