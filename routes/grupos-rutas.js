const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controladorGrupo = require('../controllers/grupo-controller')


router.use(function (req, res, next) {
    next();
});
/**
 * se define la constante storage pare definir los terminos al leer/cargar un archivo**/
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/doc'),
    filename: (req, file, cb) => {
        cb(null, file.originalname.toString().replace(' ', ''));
    }
});
const load = (multer({
    storage: storage
}));

/**
 * Rutas para CRUD de la tabla grupo
 */
//Ruta de inicio del wizard para crear un grupo
router.get('/grupo/wizard-crear-grupo', ((req, res) =>
        res.render('grupo/inicio-wizard')
));

//Ruta para crear un grupo manualmente
router.get('/grupo/crear-grupo', ((req, res) =>
        res.render('grupo/datosgrupo')
));
router.post('/grupo/crear-grupo', controladorGrupo.createGroup);

router.post('/grupo/crear-grupo/:archivo', controladorGrupo.createGroup);
//Rutas para importar archivo excel

router.post('/grupo/importar-archivo', load.single('archivo'), async (req, res) => {
    let file = req.file;
    if(!file){
        let error = "No se ha seleccionado un archivo.";
        res.render('grupo/inicio-wizard', {error});
    }else{
        let archivo = file.originalname.toString().replace(' ', '');
        res.redirect('/grupo/wizard-crear-grupo-importado/' + archivo);
    }
});

router.get('/grupo/wizard-crear-grupo-importado/:archivo', controladorGrupo.getGroupDataFromFile);

//Rutas de Edición del grupo
router.get('/grupo/editar/:idgrupo', controladorGrupo.renderGroupEdit);
router.put('/grupo/editar/:idgrupo', controladorGrupo.editGroup);

//Ruta para vista inicial del grupo
router.get('/grupo-inicio/:idgrupo', controladorGrupo.retriveGroupData);


//Ruta que grafica la información del grupo con un tema especifico
router.get('/grupo-inicio/:idgrupo/:idtema', controladorGrupo.renderGroupData);
//Ruta que grafica la información del grupo en todos los temas
router.get('/grupo/vista-general/:idgrupo', controladorGrupo.renderGeneralView);

//Ruta para renderizar la lista de alumnos para su selección
router.get('/grupo-inicio/lista/alumnos/:idgrupo', controladorGrupo.renderGroupDataListStudents)
router.get('/grupo-inicio/alumnos/:idgrupo/:idtema', controladorGrupo.renderGroupDataListStudents);

//Ruta para graficar la información del alumno.
router.get('/grupo-inicio/alumno/:idgrupo/:idtema/:idalumno', controladorGrupo.renderStudentData);
router.get('/grupo/vista-general/:idgrupo/:idalumno',controladorGrupo.renderGeneralViewStudent)

//Renderizar Equipos
router.get('/grupo-inicio/equipos/:idgrupo/:idtema', controladorGrupo.renderGroupDataListTeams);
router.get('/grupo-inicio/lista/equipos/:idgrupo', controladorGrupo.renderGroupDataListTeams);

router.get('/grupo-inicio/equipo/:idgrupo/:idtema/:idequipo', controladorGrupo.renderTeamData);
router.get('/grupo/vista-general-equipo/:idgrupo/:idequipo',controladorGrupo.renderGeneralTeamData);


//Ruta para eliminar el grupo cuando se cancela el Wizard.
router.get('/abortar-grupo/:idgrupo', controladorGrupo.abortGroup);

//Ruta para mover el grupo a la papelera de reciclaje.
router.put('/moverapapelera/:idgrupo', controladorGrupo.removeGroup);

//Ruta para sacar el grupo de la papelera de reciclaje.
router.put('/restaurargrupo/:idgrupo', controladorGrupo.restoreGroup);

//Ruta para eliminar el grupo junto con los datos asociados a el.
router.delete('/eliminargrupo/:idgrupo', controladorGrupo.deleteGroup);


module.exports = router;