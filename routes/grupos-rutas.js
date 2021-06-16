const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controladorGrupo = require('../controllers/grupo-controller')
const fileReader = require('../helpers/lector-archivos-helper')

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
router.get('/grupo/wizard-crear-grupo-manual', ((req, res) =>
        res.render('grupo/datosgrupo')
));
router.post('/grupo/wizard-crear-grupo-manual', controladorGrupo.createGrupoManual);

router.post('/grupo/wizard-crear-grupo-manual/:archivo', controladorGrupo.createGrupoManual);
//Rutas para importar archivo excel

router.post('/grupo/importar-archivo', load.single('archivo'), async (req, res) => {
    let file = req.file;
    let archivo = file.originalname.toString().replace(' ', '');
    //fileReader.obtenerListaAlumnos(file.originalname.toString().replace(' ', ''));
    //fileReader.obtenerDatosGrupo(file.originalname.toString().replace(' ', ''));
    res.redirect('/grupo/wizard-crear-grupo-importado/' + archivo);
});

router.get('/grupo/wizard-crear-grupo-importado/:archivo', controladorGrupo.obtenerDatosGrupo);

//Rutas de Edición del grupo
router.get('/grupo/editar/:idgrupo', controladorGrupo.getDatosGrupoEditar);

router.put('/grupo/editar/:idgrupo', controladorGrupo.editarGrupo);

//Ruta para vista inicial del grupo.
router.get('/grupo-inicio/:idgrupo', controladorGrupo.renderDatosGrupo);

//Ruta para eliminar el grupo cuando se cancela el Wizard.
router.get('/abortar-grupo/:idgrupo', controladorGrupo.abortarGrupo);

//Ruta para mover el grupo a la papelera de reciclaje.
router.put('/moverapapelera/:idgrupo', controladorGrupo.moveraPapelera);

//Ruta para sacar el grupo de la papelera de reciclaje.
router.put('/restaurargrupo/:idgrupo', controladorGrupo.restaurarGrupo);

//Ruta para eliminar el grupo junto con los datos asociados a el.
router.delete('/eliminargrupo/:idgrupo', controladorGrupo.eliminarGrupo);

//router.post('/crearusuario/manual', controladorGrupo.create);
module.exports = router;