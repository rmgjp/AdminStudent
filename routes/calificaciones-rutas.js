const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacion-controller');

router.get('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad', calificacionController.renderVistaCalifI);

router.put('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad', calificacionController.calificarIndividual);

router.get('/grupo/calificaciones/:idgrupo', calificacionController.vistaCalif)

router.get('/grupo/calificaciones/:idgrupo/:idtema/:modo', calificacionController.vistaCalif)

module.exports = router;