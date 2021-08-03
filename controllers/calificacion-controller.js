const Models = require('../models');
const configuracion = require('../config/userconfig.json');
const alumnoController = require('./alumno-controller')
//Este controlador contiene las funciones requeridas para la busqueda y consulta de las calificaciones

/**
 * Visualizacion de la vista de calificaciones*/

const calcCalif = async (req, res) => {
    const tema = await Models.tema.findOne({where: {id: req.params.idtema}});
    //Busqueda de las actividades por grupo
    const actividades = await Models.tarea.findAll({where: {idtema: req.params.idtema}})

    const alumnos = await alumnoController.getAllStudents(req, res);

    let listaFormateada = [];
    for (let alumno in alumnos) {
        let calificaciones = [];
        let acumulador = 0;
        let calcCalificacion;
        //ciclo para recuperar las calificaciones relacionadas a cada alumno del grupo
        for (actividad in actividades) {
            let calificacion = await Models.calificacion.findOne({
                where: {
                    idalumno: alumnos[alumno].dataValues.id,
                    idtarea: actividades[actividad].dataValues.id,
                }
            });
            //Si no hay calificacion se asigna como no asignado
            if (!calificacion) {
                calificaciones.push("No capturado.");
            } else {
                //Si hay calificacion se calcula el valor correspondiente con relación al valor de la actividad
                calcCalificacion = (calificacion.dataValues.valor * actividades[actividad].valor) / 100;
                //Se asigna la calificacion dependiendo de los parametros de configuracion establecidos por el usuario
                switch (parseInt(configuracion.califi)) {
                    case 0:
                        //Si es 0 se promedia unicamente si todas las actividades estan aprovadas
                        if (calificacion.dataValues.valor < 70) {
                            acumulador = "NA"
                        } else if (calificacion.dataValues.valor >= 70) {
                            if (acumulador !== "NA") {
                                //Calculo de las calificaciones cuando se promedia.
                                acumulador += calcCalificacion;
                            }
                        }
                        break;
                    case 1:
                        //Si es 1, se promedia independientemente de si están todas las actividades aprobado o no
                        acumulador += calcCalificacion;
                        break;
                }
                calificaciones.push(calificacion.dataValues.valor);
            }
        }

        acumulador = Math.round(acumulador);
        if (acumulador < 70 || acumulador === "NA") {
            acumulador = "NA";
        }
        //Se añade la inforamcion recuperada del alumno y sus calificaciones correspindientes con el formato de JSON
        listaFormateada.push({
            clave: alumnos[alumno].dataValues.clave,
            nombre: alumnos[alumno].dataValues.nombre,
            calificaciones,
            califinal: acumulador
        })
    }

    listaFormateada = JSON.stringify(listaFormateada);
    return listaFormateada;
}
const retriveCalf = async (req, res) => {
    const temas = await Models.tema.findAll({where: {idgrupo: req.params.idgrupo}})
    res.redirect("/grupo/calificaciones/" + req.params.idgrupo + "/" + temas[0].dataValues.id + "/0");
}


const viewCalf = async (req, res) => {
    const grupo = await Models.grupo.findOne({where: {id: req.params.idgrupo}});
    const {asignatura, clave} = grupo;
    //Busqueda de temas por grupo.
    const temas = await Models.tema.findAll({
        where: {idgrupo: req.params.idgrupo}
    });

    //verificar si se selecciono un tema
    if (!req.params.idtema) {
        res.render('calificacion/vista-grupo-calificaciones', {temas, idgrupo: req.params.idgrupo, asignatura, clave});
    } else {
        const tema = await Models.tema.findOne({where: {id: req.params.idtema}});
        //Busqueda de las actividades por grupo
        const actividades = await Models.tarea.findAll({where: {idtema: req.params.idtema}})

        let listaFormateada = await calcCalif(req, res);

        res.render('calificacion/vista-grupo-calificaciones', {
            temas, idgrupo: req.params.idgrupo, actividades, listaFormateada,
            asignatura, clave, tema
        });
    }
}


const renderViewCalif = async (req, res) => {
    const alumnos = await alumnoController.getAllStudents(req, res);

    let calificacion = [];
    for (let alumno in alumnos) {
        let valor = await Models.calificacion.findOne({
            where: {
                idtarea: req.params.idactividad,
                idalumno: alumnos[alumno].dataValues.id,
            }
        });

        if (!valor) {
            calificacion.push(0)
        } else {
            calificacion.push(valor.dataValues.valor);
        }
    }

    let listaFormateada = [];
    for (let alumno = 0; alumno < alumnos.length; alumno++) {
        listaFormateada.push({
            clave: alumnos[alumno].dataValues.clave,
            nombre: alumnos[alumno].dataValues.nombre,
            calificacion: calificacion[alumno]
        })
    }

    listaFormateada = JSON.stringify(listaFormateada);

    const actividad = await Models.tarea.findOne({
        where: {id: req.params.idactividad}
    })

    res.render('actividad/actividad-calificar-individual', {
        idgrupo: req.params.idgrupo,
        idtema: req.params.idtema,
        actividad,
        listaFormateada
    });
};


/*
* Guardar calificación individualmente**/
const scoreSingle = async (req, res) => {
    let calificaciones = JSON.parse(req.body.valorTabla);

    //Datos alumno
    for (alumnopuntero in calificaciones) {
        const alumno = await Models.alumno.findOne({
            where: {clave: calificaciones[alumnopuntero].clave}
        })
        //Buscar la calificación
        let calificacion = await Models.calificacion.findOne({
            where: {
                idalumno: alumno.dataValues.id,
                idtarea: req.params.idactividad
            }
        })
        //Si la calificacion == null
        //Agregar calificación
        if (!calificacion) {
            await Models.calificacion.create({
                idtarea: req.params.idactividad,
                idalumno: alumno.dataValues.id,
                valor: calificaciones[alumnopuntero].calificacion
            })
        } else {
            //Si la calificación no es es null
            // calificación.update();
            calificacion.update({
                valor: parseInt(calificaciones[alumnopuntero].calificacion)
            })
        }
    }
    res.redirect('/grupo/actividades/' + req.params.idgrupo + '/' + req.params.idtema + '/' + req.params.idactividad);
}
/*Opción 1: hace referencia al caso en el que todos los integrantes obtendrán la misma calificación*/
const renderScoreTeam = async (req, res) => {
    const actividad = await Models.tarea.findOne({
        where: {
            id: req.params.idactividad
        }
    });
    const equipos = await Models.equipo.findAll({
        where: {
            id: req.params.idequipo
        }
    });
    let valorTablaEquipo = [];
    valorTablaEquipo.push({
        id: equipo.dataValues.id,
        nombre: equipo.dataValues.nombre,
        calificacion: 0
    });

    valorTablaEquipo = JSON.stringify(valorTablaEquipo);
    const alumnos = await Models.alumno.findAll({
        include:[{
            model: Models.alumnoequipo,
            where:{idequipo: req.params.idequipo}
        }]
    });

    let calificacion = [];
    for (let alumno in alumnos) {
        let valor = await Models.calificacion.findOne({
            where: {
                idtarea: req.params.idactividad,
                idalumno: alumnos[alumno].dataValues.id,
            }
        });

        if (!valor) {
            calificacion.push(0)
        } else {
            calificacion.push(valor.dataValues.valor);
        }
    }

    let valorTablaAlumnos = [];
    for (let alumno = 0; alumno < alumnos.length; alumno++) {
        valorTablaAlumnos.push({
            id: alumnos[alumno].dataValues.id,
            clave: alumnos[alumno].dataValues.clave,
            nombre: alumnos[alumno].dataValues.nombre,
            calificacion: calificacion[alumno]
        })
    }

    valorTablaAlumnos = JSON.stringify(valorTablaAlumnos);
    res.render('actividad/actividad-calificar-equipo',{idgrupo: req.params.idgrupo, idtema: req.params.idtema, actividad, idequipo:req.params.idequipo, valorTablaEquipo,valorTablaAlumnos});
}

const scoreTeam = async (req, res) => {
    switch (parseInt(configuracion.calife)) {
        /*Opción 0: hace referencia al caso en el que todos los integrantes obtendrán la misma calificación*/
        case 0:

            break;
        /*Opción 1: hace referencia al caso en el que los integrantes obtendrán la calificación sumando un rubro individual y uno en equipo*/
        case 1:
            break;
    }
}
module.exports = {
    renderScoreTeam,
    renderViewCalif,
    retriveCalf,
    scoreSingle,
    viewCalf,
    calcCalif
}