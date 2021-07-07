const express = require('express');
const controladorAlumno = require('../controllers/alumno-controller');
const router = express.Router();
/**
 * Rutas para añadir alumnos a un grupo manualmente
**/
//Agregar alumnos a grupo mientras se crea el grupo.
router.get('/alumno/wizard-agregar-alumnos-manual/:idgrupo/:add', (req,res)=>(
    res.render('alumno/grid-alumnos', {idgrupo: req.params.idgrupo, adds:req.params.add})
));

router.get('/alumno/wizard-agregar-alumnos-manual/:idgrupo/:add/:archivo', controladorAlumno.getStudentList);


//Ruta para guardar un conjunto de alumnos y asociarlos a un grupo.
router.post('/alumno/wizard-agregar-alumnos-manual/:idgrupo/:add', controladorAlumno.saveFromGrid);

//Ruta para obtener los alumnos asociados a un grupo
router.get('/grupo/alumnos/:idgrupo', controladorAlumno.getStudentListByGroup);

//Ruta para obtener un conjunto de alumnos y uno alumno especifico.
router.get('/grupo/alumnos/:idgrupo/:clave', controladorAlumno.getStudentAndStudents);

//Ruta para edición de los datos de un alumno.
router.put('/grupo/alumnos/:idgrupo/:idalumno', controladorAlumno.editStudent);

//Ruta para la des-asociación de un alumno a un grupo.
router.delete('/alumnos/eliminar-alumno/:idgrupo/:idalumno', controladorAlumno.disassociateFromGroup);



module.exports = router;

