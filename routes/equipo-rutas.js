const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipo-controller');

router.get('/grupo/equipos/:idgrupo',equipoController.retriveTeamsData);
router.get('/grupo/equipos/:idgrupo/:idequipo',equipoController.renderSelectedTeams);


router.get('/equipo/nuevo/:idgrupo', equipoController.renderNewTeam);
router.post('/equipo/nuevo/:idgrupo', equipoController.saveTeam);

router.get('/equipo/seleccion/:idgrupo/:idtema/:idactividad', equipoController.renderSelectionTeamsAct)


module.exports = router;