const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const { verificarToken, verificarRol} = require('../middleware/auth'); 


router.get('/', verificarToken, verificarRol(["admin", "coordinacion", "secretaria"]), cursosController.getAllCursos);
router.get('/:id', verificarToken, verificarRol(["admin", "coordinacion", "secretaria"]), cursosController.getCursoById);
router.get('/:id/estudiantes', verificarToken, verificarRol(["admin", "coordinacion", "secretaria"]), cursosController.getEstudiantesByCurso);

router.post('/', verificarToken, cursosController.createCurso);
router.put('/:id', verificarToken, cursosController.updateCurso);
router.delete('/:id', verificarToken, cursosController.deleteCurso);
router.get('/mi-curso', verificarToken, verificarRol(['profesor']), cursosController.obtenerCursoDelProfesor);


module.exports = router;
