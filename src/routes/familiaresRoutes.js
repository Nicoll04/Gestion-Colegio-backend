const express = require('express');
const router = express.Router();
const familiaresController = require('../controllers/familiaresController');
const {verificarToken, verificarRol } = require('../middleware/auth')

router.get('/', verificarToken, verificarRol(["admin","coordinacion","secretaria"]),familiaresController.getAllFamiliares);
router.get('/:id', verificarToken, verificarRol(["admin","coordinacion","secretaria"]),familiaresController.getFamiliarById);

router.post('/',verificarToken, verificarRol(["admin"]), familiaresController.createFamiliar);
router.put('/:id',verificarToken, verificarRol(["admin"]), familiaresController.updateFamiliar);
router.delete('/:id',verificarToken, verificarRol(["admin"]), familiaresController.deleteFamiliar);
router.post('/asociar', verificarToken, verificarRol(["admin"]), familiaresController.agregarOFamiliarExistente);


module.exports = router;