const express = require('express');
const router = express.Router();
const temaController = require('../controllers/tema-controller');
const actividadController = require('../controllers/actividad-controller');


router.get('/grupo/actividades/:idgrupo', async (req,res)=>{
    //Metodo para buscar Temas
    const temas = await temaController.getTemasByGrupoEtiquetas(req.params.idgrupo);
    //Metodo para buscar Actividades

    //Renderización de la vista.
    res.render('grupo/vista-grupo-actividades', {idgrupo:req.params.idgrupo, temas});
});

router.get('/grupo/actividades/:idgrupo/:idtema', async (req,res)=>{
    //Metodo para buscar Temas
    const temas = await temaController.getTemasByGrupoEtiquetas(req.params.idgrupo);
    //Metodo para buscar Actividades
    const actividades = await actividadController.getAllTareasByTema(req.params.idtema);
    //Renderización de la vista.
    res.render('grupo/vista-grupo-actividades', {idgrupo:req.params.idgrupo, temas, actividades});
});

module.exports = router;