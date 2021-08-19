const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacion-controller');

router.get('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad', calificacionController.renderViewCalif);

router.put('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad', calificacionController.scoreSingle);

router.get('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad/:second', calificacionController.renderViewCalif)

router.put('/actividad/calificar-individual-segunda-oportunidad/:idgrupo/:idtema/:idactividad/:second', calificacionController.scoreSingle);

router.get('/grupo/calificaciones/:idgrupo', calificacionController.retriveCalf);

router.get('/grupo/calificaciones/:idgrupo/:idtema/:modo', calificacionController.viewCalf);

router.get('/actividad/calificar-equipo/:idgrupo/:idtema/:idactividad/:idequipo', calificacionController.renderScoreTeam);

router.get('/actividad/calificar-equipo/:idgrupo/:idtema/:idactividad/:idequipo/:second', calificacionController.renderScoreTeam);

router.put('/actividad/calificar-equipo/:idgrupo/:idtema/:idactividad/:idequipo', calificacionController.scoreTeam)

router.put('/actividad/calificar-equipo/:idgrupo/:idtema/:idactividad/:idequipo/:second', calificacionController.scoreTeam)

module.exports = router;

