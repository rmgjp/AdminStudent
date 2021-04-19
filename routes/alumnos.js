const express = require('express');
const controladorAlumno = require('../controllers/alumno');
const router = express.Router();
/**
 * Rutas para añadir alumnos a un grupo manualmente
**/
router.post('/alumno/wizard-agregar-alumnos-manual/:idGrupo', controladorAlumno.guardarDesdeGrid);


module.exports = router;