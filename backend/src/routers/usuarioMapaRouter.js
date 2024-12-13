const express = require('express');
const router = express.Router();
const usuarioMapaController = require('../controllers/usuarioMapaController');

// Rutas para UsuarioMapa
// Añadir o actualizar un marcador
router.post('/marcador', usuarioMapaController.addOrUpdateMarker);

// Obtener el mapa de un usuario (marcadores y visitas)
router.get('/:email', usuarioMapaController.getUserMap);

// Registrar una visita a un mapa
router.post('/visita', usuarioMapaController.addVisit);

// Eliminar un marcador
router.delete('/marcador', usuarioMapaController.deleteMarker);

module.exports = router;
