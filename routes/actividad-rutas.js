const express = require('express');
const router = express.Router();
const temaController = require('../controllers/tema-controller');
const actividadController = require('../controllers/actividad-controller');


router.get('/grupo/actividades/:idgrupo', async (req,res)=>{
    //Metodo para buscar Temas
    const temas = await temaController.getTemasByGrupoEtiquetas(req.params.idgrupo);
    //Metodo para buscar Actividades

    //Renderización de la vista.
    res.render('grupo/vista-grupo-actividades', {idgrupo:req.params.idgrupo, temas , idtema:''});
});

//Visualización de Actividades por tema
router.get('/grupo/actividades/:idgrupo/:idtema', async (req,res)=>{
    //Metodo para buscar Temas
    const temas = await temaController.getTemasByGrupoEtiquetas(req.params.idgrupo);
    //Metodo para buscar Actividades
    const actividades = await actividadController.getAllTareasByTema(req.params.idtema);
    //Renderización de la vista.
    res.render('grupo/vista-grupo-actividades', {idgrupo:req.params.idgrupo, temas, actividades, idtema:req.params.idtema});
});


router.get('/grupo/actividades/:idgrupo/:idtema/:idactividad', async (req,res)=>{
    //Método para buscar Temas
    const temas = await temaController.getTemasByGrupoEtiquetas(req.params.idgrupo);
    //Método para buscar Actividades
    const actividades = await actividadController.getAllTareasByTema(req.params.idtema);
    //Método para buscar una sola actividad
    const actividad = await actividadController.getActividadById(req.params.idactividad);
    //Renderización de la vista.
    res.render('grupo/vista-grupo-actividades', {idgrupo:req.params.idgrupo, temas, actividades, idtema:req.params.idtema, actividad});
});



router.get('/actividad/nueva-actividad/:idgrupo/:idtema', (req,res)=>{
   res.render('actividad/actividad-nuevo', {idtema:req.params.idtema, idgrupo:req.params.idgrupo});
});

router.post('/actividad/nueva-actividad/:idgrupo/:idtema', async(req,res)=>{
    actividadController.guardarDesdeGrid(req,res,req.params.idtema);
    res.redirect('/grupo/actividades/'+req.params.idgrupo+'/'+req.params.idtema);
});
module.exports = router;