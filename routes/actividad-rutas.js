const express = require('express');
const router = express.Router();
const temaController = require('../controllers/tema-controller');
const actividadController = require('../controllers/actividad-controller');
const grupoController = require('../controllers/grupo-controller');

//
router.get('/grupo/actividades/:idgrupo', async (req,res)=>{
    //Metodo para buscar Temas
    const temas = await temaController.getTemasByGrupoEtiquetas(req.params.idgrupo);
    //Datos grupo
    const grupo = await grupoController.getDatosGrupo(req,res);
    const {asignatura,clave} = grupo;
    //Metodo para buscar todas las Actividades

    //Renderización de la vista.
    res.render('grupo/vista-grupo-actividades', {idgrupo:req.params.idgrupo, temas , idtema:'',asignatura,clave});
});

//Visualización de Actividades por tema
router.get('/grupo/actividades/:idgrupo/:idtema', async (req,res)=>{
    //Metodo para buscar Temas
    const temas = await temaController.getTemasByGrupoEtiquetas(req.params.idgrupo);
    //Metodo para buscar Actividades
    const actividades = await actividadController.getAllTareasByTema(req.params.idtema);
    //Datos grupo
    const grupo = await grupoController.getDatosGrupo(req,res);
    const {asignatura,clave} = grupo;
    //Renderización de la vista.
    res.render('grupo/vista-grupo-actividades', {idgrupo:req.params.idgrupo, temas, actividades, idtema:req.params.idtema, asignatura,clave});
});
//ruta para eliminar actividad
router.delete('/actividad/eliminar-actividad/:idgrupo/:idtema/:idactividad', actividadController.eliminarActividad);

router.get('/grupo/actividades/:idgrupo/:idtema/:idactividad', async (req,res)=>{
    //Método para buscar Temas
    const temas = await temaController.getTemasByGrupoEtiquetas(req.params.idgrupo);
    //Método para buscar Actividades
    const actividades = await actividadController.getAllTareasByTema(req.params.idtema);
    //Método para buscar una sola actividad
    const actividad = await actividadController.getActividadById(req.params.idactividad);

    var tipoActividad = actividad.tipo;

    //Datos grupo
    const grupo = await grupoController.getDatosGrupo(req,res);
    const {asignatura,clave} = grupo;
    //Renderización de la vista.
    res.render('grupo/vista-grupo-actividades', {idgrupo:req.params.idgrupo, temas, actividades, idtema:req.params.idtema, actividad, tipoActividad, asignatura,clave});
});

router.put('/actividad/editar-actividad/:idgrupo/:idtema/:idactividad', actividadController.editarActividad);


router.get('/actividad/nueva-actividad/:idgrupo/:idtema', (req,res)=>{
   res.render('actividad/actividad-nuevo', {idtema:req.params.idtema, idgrupo:req.params.idgrupo});
});

router.post('/actividad/nueva-actividad/:idgrupo/:idtema', async(req,res)=>{
    actividadController.guardarDesdeGrid(req,res,req.params.idtema);
    res.redirect('/grupo/actividades/'+req.params.idgrupo+'/'+req.params.idtema);
});


module.exports = router;