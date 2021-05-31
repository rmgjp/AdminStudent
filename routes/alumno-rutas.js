const express = require('express');
const controladorAlumno = require('../controllers/alumno-controller');
const router = express.Router();
/**
 * Rutas para añadir alumnos a un grupo manualmente
**/
//Agregar alumnos a grupo mientras se crea el grupo.
router.get('/alumno/wizard-agregar-alumnos-manual/:idGrupo/:add', (req,res)=>(
    res.render('alumno/grid-alumnos', {idgrupo: req.params.idGrupo, adds:req.params.add})
));

router.post('/alumno/wizard-agregar-alumnos-manual/:idGrupo/:add', controladorAlumno.guardarDesdeGrid);


router.get('/grupo/alumnos/:idgrupo', controladorAlumno.getListAlumnosByGroup);

router.get('/grupo/alumnos/:idgrupo/:clave', controladorAlumno.getAlumnoAndAlumnosByGroup);

router.put('/grupo/alumnos/:idgrupo/:idalumno', controladorAlumno.editarAlumno);



module.exports = router;

