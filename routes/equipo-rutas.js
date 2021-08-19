const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipo-controller');

router.get('/grupo/equipos/:idgrupo',equipoController.retriveTeamsData);
router.get('/grupo/equipos/:idgrupo/:idequipo',equipoController.renderSelectedTeams);

router.delete('/equipo/eliminar/:idgrupo/:idequipo',equipoController.deleteTeam);

router.get('/equipo/nuevo/:idgrupo', equipoController.renderNewTeam);
router.post('/equipo/nuevo/:idgrupo', equipoController.saveTeam);

router.get('/equipo/seleccion/:idgrupo/:idtema/:idactividad', equipoController.renderSelectionTeamsAct)

router.get('/equipo/seleccion/:idgrupo/:idtema/:idactividad/:second', equipoController.renderSelectionTeamsAct)



module.exports = router;