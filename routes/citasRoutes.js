const express = require('express');
const router = express.Router();
const { agendarCita, getTodasCitas, eliminarCita } = require('../controllers/citasController');

router.post('/agendar', agendarCita);
router.get('/historial/:id_usuario', getTodasCitas);
router.delete('/:id', eliminarCita);

module.exports = router;
