const express = require('express');
const controladorAlumno = require('../controllers/alumno-controller');
const router = express.Router();
/**
 * Rutas para añadir alumnos a un grupo manualmente
**/
router.post('/alumno/wizard-agregar-alumnos-manual/:idGrupo', controladorAlumno.guardarDesdeGrid);


router.get('/grupo/alumnos/:idgrupo', controladorAlumno.getListAlumnosByGroup)
module.exports = router;