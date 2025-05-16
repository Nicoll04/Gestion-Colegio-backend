const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const { verificarToken, verificarRol} = require('../middleware/auth'); 


router.get('/', verificarToken, verificarRol(["admin", "coordinacion", "secretaria","orientacion"]), cursosController.getAllCursos);
router.get('/:id', verificarToken, verificarRol(["admin", "coordinacion", "secretaria","orientacion"]), cursosController.getCursoById);
router.get('/:id/estudiantes', verificarToken, verificarRol(["admin", "coordinacion", "secretaria","orientacion"]), cursosController.getEstudiantesByCurso);

router.post('/', verificarToken, verificarRol(["admin"]),cursosController.createCurso);
router.put('/:id', verificarToken,verificarRol(["admin"]), cursosController.updateCurso);
router.delete('/:id', verificarToken,verificarRol(["admin"]), cursosController.deleteCurso);
router.get('/mi-curso', verificarToken, verificarRol(["profesor"]), cursosController.obtenerCursoDelProfesor);


module.exports = router;
