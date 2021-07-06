const express = require('express');
const router = express.Router();
const temaController = require('../controllers/tema-controller');
const actividadController = require('../controllers/actividad-controller');
const grupoController = require('../controllers/grupo-controller');

//renderizacion de la vista de actividades
router.get('/grupo/actividades/:idgrupo', actividadController.getTemasAndActividades);

//ruta para eliminar actividad
router.delete('/actividad/eliminar-actividad/:idgrupo/:idtema/:idactividad', actividadController.eliminarActividad);

router.get('/grupo/actividades/:idgrupo/:idtema/:idactividad', actividadController.getTemasActividadesAndActividad);

router.put('/actividad/editar-actividad/:idgrupo/:idtema/:idactividad', actividadController.editarActividad);


router.get('/actividad/nueva-actividad/:idgrupo/:idtema', (req,res)=>{
   res.render('actividad/actividad-nuevo', {idtema:req.params.idtema, idgrupo:req.params.idgrupo});
});

router.post('/actividad/nueva-actividad/:idgrupo/:idtema', async(req,res)=>{
    actividadController.guardarDesdeGrid(req,res,req.params.idtema);
    res.redirect('/grupo/actividades/'+req.params.idgrupo+'/'+req.params.idtema);
});





module.exports = router;