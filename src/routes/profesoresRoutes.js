const express = require('express');
const router = express.Router();
const profesoresController = require('../controllers/profesoresController');
const { verificarToken, verificarRol } = require('../middleware/auth');
const upload = require('../config/multer'); 

router.get('/', verificarToken, verificarRol(["admin", "coordinacion", "secretaria","orientacion"]), profesoresController.getAllProfesores);
router.get('/:id', verificarToken, verificarRol(["admin", "coordinacion", "secretaria","orientacion"]), profesoresController.getProfesorById);

router.post("/", verificarToken, verificarRol(["admin"]),upload.single("Foto"), profesoresController.createProfesor);
router.put('/:id', verificarToken, verificarRol(["admin"]), profesoresController.updateProfesor);
router.delete('/:id', verificarToken, verificarRol(["admin"]),profesoresController.deleteProfesor);
router.get('/by-correo/:correo', verificarToken, verificarRol(["admin"]), profesoresController.getProfesorByCorreo);


module.exports = router;