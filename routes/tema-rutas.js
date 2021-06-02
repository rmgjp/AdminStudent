const express = require('express');
const controladorTema = require('../controllers/tema-controller');
const router = express.Router();



router.get('/grupo/temas/:idgrupo', controladorTema.getTemasByGrupo);

router.get('/tema/nuevo-tema/:idgrupo', (req,res) =>{
    res.render('tema/tema-nuevo', {idgrupo: req.params.idgrupo});
});

router.post('/tema/nuevo-tema/:idgrupo', controladorTema.guardarTemaActividades);

router.put('/tema/editar-tema/:idgrupo/:idtema', controladorTema.editarTema);

router.delete('/tema/eliminar-tema/:idgrupo/:idtema', controladorTema.eliminarTema);

module.exports = router;