const express = require('express');
const router = express.Router();

const controladorGrupo = require('../controllers/grupo-controller')

router.use(function(req, res, next) {
    next();
});

/**
 * Rutas para CRUD de la tabla grupo
 */
//Ruta de inicio del wizard para crear un grupo
router.get('/grupo/wizard-crear-grupo', ((req,res)=>
    res.render('grupo/inicio-wizard')
));

//Ruta para crear un grupo manualmente
router.get('/grupo/wizard-crear-grupo-manual', ((req,res)=>
        res.render('grupo/datosgrupo')
));
router.post('/grupo/wizard-crear-grupo-manual', controladorGrupo.createGrupoManual);

//Ruta para importar archivo excel
router.get('/grupo/wizard-crear-grupo-importado', ((req,res)=>
        res.render('grupo/datosgrupo')
));

router.get('/grupo/editar/:idgrupo',  controladorGrupo.getDatosGrupoEditar);

router.put('/grupo/editar/:idgrupo', controladorGrupo.updateGrupo);


router.get('/grupo-inicio/:idgrupo', controladorGrupo.getDatosGrupo)

router.get('/abortar-grupo/:idgrupo', controladorGrupo.abortarGrupo)



//router.post('/crearusuario/manual', controladorGrupo.create);
module.exports = router;