const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacion-controller');

router.get('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad', calificacionController.renderViewCalif);

router.put('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad', calificacionController.scoreSingle);

router.get('/grupo/calificaciones/:idgrupo', calificacionController.retriveCalf);

router.get('/grupo/calificaciones/:idgrupo/:idtema/:modo', calificacionController.viewCalf);

module.exports = router;