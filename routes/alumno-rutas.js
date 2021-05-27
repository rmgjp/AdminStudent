const express = require('express');
const controladorAlumno = require('../controllers/alumno-controller');
const router = express.Router();
/**
 * Rutas para añadir alumnos a un grupo manualmente
**/

router.get('/alumno/wizard-agregar-alumnos-manual/:idGrupo', (req,res)=>(
    res.render('alumno/grid-alumnos', {idgrupo: req.params.idGrupo})
));

router.post('/alumno/wizard-agregar-alumnos-manual/:idGrupo', controladorAlumno.guardarDesdeGrid);


router.get('/grupo/alumnos/:idgrupo', controladorAlumno.getListAlumnosByGroup);

router.get('/grupo/alumnos/:idgrupo/:clave', controladorAlumno.getAlumnoAndAlumnosByGroup);

module.exports = router;