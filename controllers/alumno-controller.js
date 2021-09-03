const Models = require('../models');
const fs = require('fs');
const path = require('path');
const tableToJSON = require('tabletojson').Tabletojson;
const configuracion = require('../config/userconfig.json');

//Controlador que contiene métodos relacionados con el manejo de los datos del modelo alumno
//y su asociación con el modelo grupo.

//Guardar contenidos en la tabla/grid
const saveFromGrid = async (req, res) => {
    let idgrupo = req.params.idgrupo;
    let add = req.params.add;
    //Se obtiene el arreglo alojado en objeto invisible del body correspondiente a la tabla
    if (tryParseJSON(req.body.valorTabla) === false) {

        let errors = []
        errors.push({text: 'No ha registrado ningún alumno, registre al menos uno'})
        res.render('alumno/grid-alumnos', {errors, idgrupo, add})
    } else {
        let alumnos = tryParseJSON(req.body.valorTabla)

        //Ciclo para iterar entre los datos del arreglo Tabla

        for (let alumno in alumnos) {
            //Llamado del modelo para buscar el registro
            //si existe el registro no se guarda
            //si no existe el registro se guarda
            //evita duplicados.
            await Models.alumno.findOrCreate(
                {
                    where: {
                        clave: alumnos[alumno].clave.toUpperCase()
                    },
                    defaults: {
                        clave: alumnos[alumno].clave.toUpperCase(),
                        nombre: alumnos[alumno].nombre.toUpperCase(),
                    }
                });
        }
        await addToGroup(idgrupo, alumnos);
        //Llamada del método para asociar la tabla alumno y grupo
        //con la tabla alumnogrupo resultado de una relación muchos a
        //muchos.
        if (add === 0) {
            req.flash('success_msg', 'El grupo se creó correctamente.')
            res.redirect('/');
        } else if(add === 1) {
            req.flash('success_msg', 'El/los alumnos se agregaron al grupo correctamente.')
            res.redirect('/grupo/alumnos/' + idgrupo);
        }
    }
}

//Obtener la lista de estudiantes mediante un archivo de texto.
const getStudentList = async (req, res) => {
    let file = req.params.archivo;
    let txtFile = path.join(__dirname, '../public/doc/' + file);
    await fs.readFile(txtFile, "binary", (err, data) => {
        if (err) {

            throw err;
        } else {
            let listaAlumnos = tableToJSON.convert(data, {onlyColumns: [1, 2]});
            listaAlumnos = JSON.stringify(listaAlumnos[0]);
            let listaFormateada = JSON.parse(listaAlumnos, function (k, v) {
                if (k.match(/^Nombre\s+Temas->/gm)) {
                    this.nombre = v;
                    return;
                } else if (k.match("Num Ctrol")) {
                    this.clave = v;
                    return;
                }
                return v;
            })
            listaFormateada = JSON.stringify(listaFormateada);
            res.render('alumno/grid-alumnos', {idgrupo: req.params.idgrupo, add: req.params.add, listaFormateada});
        }
    });
}


//Verifica si el contenido se puede parsear como JSON
function tryParseJSON(jsonString) {
    try {
        let o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    } catch (e) {
    }
    return false;
}

//Buscar a un alumno mediante la clave del mismo
const getStudentByKey = async (claveAlumno) => {
    //Objeto que recibe el resultado de la consulta select, es decir el alumno buscado
    return Models.alumno.findOne({
        where: {
            clave: claveAlumno,
        }
    })
}


/**
 * Sección para metodos de la relación Alumno-Grupo
 */

//Relación del Grupo y Alumno agregando ambos ID dentro de la tabla Alumno-Grupo
const addToGroup = async (idgrupo, alumnos) => {

    for (let alumno in alumnos) {
        //Busqueda del alumno para obtener el id interno de la base de datos.
        const findAlumno = await Models.alumno.findOne({
            where: {
                clave: alumnos[alumno].clave.toUpperCase()
            }
        });
        await Models.alumnogrupo.findOrCreate({
            where: {
                idalumno: findAlumno.dataValues.id,
                idgrupo: idgrupo
            },
            defaults: {
                idalumno: findAlumno.dataValues.id,
                idgrupo: idgrupo
            }
        });
    }
}
//Desasociar alumno del grupo y borrar calificaciones correspondientes
const disassociateFromGroup = async (req, res) => {
    //Buscar las calificaciones relacionadas al alumno
    let calificaciones = await Models.calificacion.findAll({
        where: {idalumno: req.params.idalumno}
    })
    //Eliminar calificaciones
    for (let calificacion in calificaciones) {
        await calificaciones[calificacion].destroy();
    }
    //Busqueda de la asociación de alumno con grupo por medio de la tabla alumnogrupo
    let alumnogrupo = await Models.alumnogrupo.findOne({
        where: {idalumno: req.params.idalumno}
    });
    //Eliminación de la asociación
    await alumnogrupo.destroy();
    req.flash('success_msg', 'El alumno se elimino de grupo correctamente.');
    res.redirect('/grupo/alumnos/' + req.params.idgrupo);
}

//Actualizar el registro de alumno
const editStudent = async (req, res) => {
    const {clave, nombre, correo} = req.body;

    let alumno = await Models.alumno.findOne({where: {id: req.params.idalumno}})
    await alumno.update({
        clave: clave.toUpperCase(),
        nombre: nombre.toUpperCase(),
        correo: correo
    });
    req.flash('success_msg', 'Los datos del alumno se han actualizado correctamente.');
    res.redirect('/grupo/alumnos/' + req.params.idgrupo + '/' + alumno.clave);

}


//Consultar los registros de la tabla alumno
const getAllStudents = async (req, res) => {
    //Se busca la relación de los alumnos.
    const alumnos = await Models.alumno.findAll({
        include:[{
            model : Models.alumnogrupo,
            where:{
                idgrupo: req.params.idgrupo
            }
        }]
    })
    alumnos.sort(function (a, b) {
        return a.dataValues.nombre.localeCompare(b.dataValues.nombre);
    });
    return alumnos;
}

//Obtener los alumnos relacionados con el grupo.
const getStudentListByGroup = async (req, res) => {
    //Lista de alumnos relacionada al grupo
    const alumnos = await getAllStudents(req,res);
    res.redirect("/grupo/alumnos/"+req.params.idgrupo+"/"+alumnos[0].dataValues.clave);
   //res.render('alumno/vista-grupo-alumnos', {alumnos, idgrupo:req.params.idgrupo, asignatura, clave});
}

//Obtener la información de un alumno en concreto y la lista de alumnos.
const getStudentAndStudents = async (req, res) => {
    const claveAlumno = req.params.clave;
    //Obtención del id
    const idgrupo = req.params.idgrupo;
    //Se obtienen todos los datos del grupo mediante el id
    const grupo = await Models.grupo.findOne({
        where: {
            id: req.params.idgrupo
        }
    });
    //Se separan los datos del grupo
    const {asignatura, clave} = grupo;

    let alumnos = await getAllStudents(req,res);

    const alumno = await getStudentByKey(claveAlumno);

    //Calculo de calificaciones por unidad

    const temas = await Models.tema.findAll({
        where: {idgrupo: req.params.idgrupo}
    });
    //Lista de las calificaciones de las unidad.
    let listaFormateada = await calCalifStudent(temas, alumno);

    listaFormateada = JSON.stringify(listaFormateada);
    const menu = 1;
    res.render('alumno/vista-grupo-alumnos', {alumnos, idgrupo, asignatura, clave, alumno, listaFormateada, menu});
}
const calcCalifStudentTopic = async (idtema, alumno) =>{
    const actividades = await Models.tarea.findAll({where: {idtema: idtema}});
    let califinal = 0;
    let calcCalificacion;

    for (let actividad in actividades) {
        let calificacion = await Models.calificacion.findOne({
            where: {
                idalumno: alumno.dataValues.id,
                idtarea: actividades[actividad].dataValues.id,
            }
        });

        if (calificacion != null) {
            calcCalificacion = (calificacion.dataValues.valor * actividades[actividad].valor) / 100;
            switch (parseInt(configuracion.califi)) {
                case 0:
                    if (calificacion.dataValues.valor < 70) {
                        califinal = "NA";
                    } else if (calificacion.dataValues.valor >= 70) {
                        if (califinal !== "NA") {
                            //Calculo de las calificaciones cuando se promedia.
                            califinal += calcCalificacion;
                        }
                    }
                    break;
                case 1:
                    califinal += calcCalificacion;
                    break;
            }
        }
    }
    if(califinal < 70){
        califinal = 'NA';
    }

    return califinal;
}

const calCalifStudent = async (temas, alumno)=>{
    let listaFormateada = [];


    for (let tema in temas) {
        const actividades = await Models.tarea.findAll({where: {idtema: temas[tema].dataValues.id}});
        let califinal = 0;
        let calcCalificacion;

        for (let actividad in actividades) {
            let calificacion = await Models.calificacion.findOne({
                where: {
                    idalumno: alumno.dataValues.id,
                    idtarea: actividades[actividad].dataValues.id,
                }
            });

            if (calificacion != null) {
                if (calificacion.dataValues.valor_s2 !== null) {
                    calcCalificacion = (calificacion.dataValues.valor_s2 * actividades[actividad].valor) / 100;
                } else {
                    calcCalificacion = (calificacion.dataValues.valor * actividades[actividad].valor) / 100;
                }
                switch (parseInt(configuracion.califi)) {
                    case 0:
                        if (calificacion.dataValues.valor < 70) {
                            califinal = "NA";
                        } else if (calificacion.dataValues.valor >= 70) {
                            if (califinal !== "NA") {
                                //Calculo de las calificaciones cuando se promedia.
                                califinal += calcCalificacion;
                            }
                        }
                        break;
                    case 1:
                        califinal += calcCalificacion;
                        break;
                }
            }
        }
        if(califinal < 70){
            califinal = 'NA';
        }
        listaFormateada.push({
            no_unidad: temas[tema].dataValues.numerotema,
            nombre: temas[tema].dataValues.nombre,
            califinal: califinal,
        });
    }
    return listaFormateada;
}
//Exportación de los métodos para su posterior uso dentro del programa
module.exports = {
    calcCalifStudentTopic,
    calCalifStudent,
    getStudentList,
    saveFromGrid,
    disassociateFromGroup,
    editStudent,
    getStudentListByGroup,
    getStudentAndStudents,
    getAllStudents,
    getStudentByKey



}