const express = require('express');
const { registrar, login, googleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registrar);
router.post('/login', login);
router.post('/google-token', googleLogin); 
router.post('/asignar-rol', verificarToken, asignarRol);


module.exports = router;
