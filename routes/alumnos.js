const express = require('express');
const controladorAlumno = require('../controllers/alumno');
const boostrapTable = ('bootstrap-table')
const getScriptTagVars = require('get-script-tag-vars')
const router = express.Router();

router.get('/alumno/wizard-agregar-alumnos-manual', (req,res)=>{
    res.render('alumno/grid-alumnos');
});

router.post('/alumno/wizard-agregar-alumnos-manual', controladorAlumno.guardarDesdeGrid);


module.exports = router;