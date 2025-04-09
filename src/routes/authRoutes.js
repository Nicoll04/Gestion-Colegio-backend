const express = require('express');
const { registrar, login, googleLogin, asignarRol } = require('../controllers/authController');
const { verificarToken} = require('../middleware/auth'); 

const router = express.Router();

router.post('/register', registrar);
router.post('/login', login);
router.post('/google-token', googleLogin); 
router.post('/asignar-rol', verificarToken, asignarRol);


module.exports = router;
