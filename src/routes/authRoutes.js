const express = require('express');
const { registrar, login, googleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registrar);
router.post('/login', login);
router.post('/google-token', googleLogin); 

module.exports = router;
