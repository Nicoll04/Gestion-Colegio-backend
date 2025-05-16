    const express = require('express');
    const router = express.Router();
    const familiaresController = require('../controllers/familiaresController');
    const {verificarToken, verificarRol } = require('../middleware/auth')

    router.get('/', verificarToken, verificarRol(["admin","coordinacion","secretaria","orientacion","profesor"]),familiaresController.getAllFamiliares);
    router.get('/:id', verificarToken, verificarRol(["admin","coordinacion","secretaria","orientacion","profesor"]),familiaresController.getFamiliarById);

    router.post('/',verificarToken, verificarRol(["admin"]), familiaresController.createFamiliar);
    router.put('/:id',verificarToken, verificarRol(["admin"]), familiaresController.updateFamiliar);
    router.delete('/:id',verificarToken, verificarRol(["admin"]), familiaresController.deleteFamiliar);



    module.exports = router;