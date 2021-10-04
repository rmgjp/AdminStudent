const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacion-controller');

router.get('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad', calificacionController.renderViewCalif);

router.put('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad', calificacionController.scoreSingle);

router.get('/actividad/calificar-individual/:idgrupo/:idtema/:idactividad/:second', calificacionController.renderViewCalif)

router.put('/actividad/calificar-individual-segunda-oportunidad/:idgrupo/:idtema/:idactividad/:second', calificacionController.scoreSingle);
//
router.get('/grupo/calificaciones/:idgrupo', calificacionController.retriveCalf);
//Originalmente esta ruta contenia el parametro modo, fue removido para la renderización de la vista de calificaciones de 2da oportunidad
router.get('/grupo/calificaciones/:idgrupo/:idtema/', calificacionController.viewCalf);

//Esta ruta ahora pertenece a la vista para vista de calificaciones de segunda oportunidad
router.get('/grupo/calificaciones/:idgrupo/:idtema/:modo', calificacionController.viewCalf);

router.get('/grupo/calificaciones-todo/:idgrupo/:modo', calificacionController.renderViewCalfTopics);
router.get('/grupo/calificaciones-todo/:idgrupo', calificacionController.renderViewCalfTopics);

router.get('/actividad/calificar-equipo/:idgrupo/:idtema/:idactividad/:idequipo', calificacionController.renderScoreTeam);

router.get('/actividad/calificar-equipo/:idgrupo/:idtema/:idactividad/:idequipo/:second', calificacionController.renderScoreTeam);

router.put('/actividad/calificar-equipo/:idgrupo/:idtema/:idactividad/:idequipo', calificacionController.scoreTeam)

router.put('/actividad/calificar-equipo/:idgrupo/:idtema/:idactividad/:idequipo/:second', calificacionController.scoreTeam)

module.exports = router;

