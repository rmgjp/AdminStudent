const express = require('express');
const router = express.Router();

router.get('/alumno/wizard-agregar-alumnos-manual', (req,res)=>{
    res.render('alumno/grid-alumnos');
});

router.post('/alumno/wizard-agregar-alumnos-manual', (req,res)=>{
    var {alumnos} = res.body.table;
    console.log('Alumnos: ');
    console.log(alumnos);
    res.redirect('/')
});


module.exports = router;