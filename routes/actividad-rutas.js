const express = require('express');
const router = express.Router();
const actividadController = require('../controllers/actividad-controller');

//renderizacion de la vista de actividades
router.get('/grupo/actividades/:idgrupo', actividadController.getTopicsAndActivities);

//ruta para eliminar actividad
router.delete('/actividad/eliminar-actividad/:idgrupo/:idtema/:idactividad', actividadController.deleteActivity);
//Vista para visualizar la lista de actividades e información extra de la actividad seleccionada
router.get('/grupo/actividades/:idgrupo/:idtema/:idactividad', actividadController.getTopicActivitiesAndActivity);

router.put('/actividad/editar-actividad/:idgrupo/:idtema/:idactividad', actividadController.editActivity);


router.get('/actividad/nueva-actividad/:idgrupo/:idtema', (req,res)=>{
   res.render('actividad/actividad-nuevo', {idtema:req.params.idtema, idgrupo:req.params.idgrupo});
});

router.post('/actividad/nueva-actividad/:idgrupo/:idtema', async(req,res)=>{
    await actividadController.saveFromGrid(req,res,req.params.idtema);
    res.redirect('/grupo/actividades/'+req.params.idgrupo);
});





module.exports = router;