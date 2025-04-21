const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudiantesController');
const { verificarToken, verificarRol } = require('../middleware/auth');
const upload = require('../config/multer'); 

router.get('/con-familiares', verificarToken, verificarRol(["admin", "coordinacion", "secretaria"]), estudianteController.getEstudiantesConFamiliares);
router.get('/', verificarToken, verificarRol(["admin", "coordinacion", "secretaria"]), estudianteController.getAllEstudiantes);
router.get('/:id', verificarToken, verificarRol(["admin", "coordinacion", "secretaria"]), estudianteController.getEstudianteById);

router.post("/", verificarToken, verificarRol(["admin"]), upload.single("Foto"), estudianteController.createEstudiante);
router.put('/:id', verificarToken, verificarRol(["admin"]),estudianteController.updateEstudiante);
router.delete('/:id', verificarToken, verificarRol(["admin"]), estudianteController.deleteEstudiante);


module.exports = router;
