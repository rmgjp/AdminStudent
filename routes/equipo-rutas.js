const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipo-controller');

router.get('/grupo/equipos/:idgrupo',equipoController.renderAllTeams);

router.get('/equipo/nuevo/:idgrupo', equipoController.renderNewTeam);


module.exports = router;