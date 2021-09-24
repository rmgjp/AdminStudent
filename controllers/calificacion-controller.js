const Models = require('../models');
const configuracion = require('../config/userconfig.json');
const alumnoController = require('./alumno-controller')
const {Op} = require('sequelize');
const {calcCalifStudentTopic} = require("./alumno-controller");
//Este controlador contiene las funciones requeridas para la busqueda y consulta de las calificaciones

/**
 * Visualizacion de la vista de calificaciones*/

const calcCalif = async (req, res) => {
    //Busqueda de las actividades por grupo
    const actividades = await Models.tarea.findAll({where: {idtema: req.params.idtema}})

    const alumnos = await alumnoController.getAllStudents(req, res);

    let listaFormateada = [];
    for (let alumno in alumnos) {
        let calificaciones = [];
        let calificacionesSegundaOp = [];
        let acumulador = 0;
        let calcCalificacion;
        let valorCalificacion;

        //ciclo para recuperar las calificaciones relacionadas a cada alumno del grupo
        for (let actividad in actividades) {
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
                if(!req.params.modo){
                    valorCalificacion = calificacion.dataValues.valor;
                    calificacionesSegundaOp.push(calificacion.dataValues.valor_s2);
                }
                else{
                    //Segunda oportunidad
                    if(calificacion.dataValues.valor_s2 !== null){
                        valorCalificacion = calificacion.dataValues.valor_s2;

                    }
                    else {
                        valorCalificacion = calificacion.dataValues.valor;

                    }
                }
                calcCalificacion = (valorCalificacion * actividades[actividad].valor) / 100;

                //Se asigna la calificacion dependiendo de los parametros de configuracion establecidos por el usuario
                switch (parseInt(configuracion.califi)) {
                    case 0:
                        //Si es 0 se promedia unicamente si todas las actividades estan aprovadas
                        if (valorCalificacion < 70) {
                            acumulador = "NA"
                        } else if (valorCalificacion >= 70) {
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
                calificaciones.push(valorCalificacion);
            }
        }
        if (!acumulador === "NA") {
            acumulador = Math.round(acumulador);
        }
        if (acumulador < 70 || acumulador === "NA") {
            acumulador = "NA";
        }

        //Se añade la inforamcion recuperada del alumno y sus calificaciones correspindientes con el formato de JSON
        listaFormateada.push({
            clave: alumnos[alumno].dataValues.clave,
            nombre: alumnos[alumno].dataValues.nombre,
            calificaciones,
            calificacionesSegundaOp,
            califinal: acumulador,
        });

    }

    listaFormateada = JSON.stringify(listaFormateada);
    return listaFormateada;
}
const retriveCalf = async (req, res) => {
    const temas = await Models.tema.findAll({where: {idgrupo: req.params.idgrupo}})
    const menu = 1;
    if (!temas || temas.length === 0) {
        res.render('calificacion/vista-grupo-calificaciones', {idgrupo: req.params.idgrupo, menu, visualizacion: 1});
    } else {

        res.redirect("/grupo/calificaciones/" + req.params.idgrupo + "/" + temas[0].dataValues.id);
    }
}


const viewCalf = async (req, res) => {
    const grupo = await Models.grupo.findOne({where: {id: req.params.idgrupo}});
    const {asignatura, clave} = grupo;
    let title;
    let listaFormateada;
    //Busqueda de temas por grupo.
    const temas = await Models.tema.findAll({
        where: {idgrupo: req.params.idgrupo}
    });


    //verificar si se selecciono un tema
    if (!req.params.idtema) {
        const menu = 1;
        res.render('calificacion/vista-grupo-calificaciones', {
            temas,
            idgrupo: req.params.idgrupo,
            asignatura,
            clave,
            menu,
            visualizacion: 1
        });
    } else {
        const tema = await Models.tema.findOne({where: {id: req.params.idtema}});
        //Busqueda de las actividades por grupo
        const actividades = await Models.tarea.findAll({where: {idtema: req.params.idtema}})

        listaFormateada = await calcCalif(req, res);

        title = (!req.params.modo) ? null : 1;

        const menu = 1;
        res.render('calificacion/vista-grupo-calificaciones', {
            temas, idgrupo: req.params.idgrupo, actividades, listaFormateada,
            asignatura, clave, tema, menu, visualizacion: 1, title
        });
    }
}


const renderViewCalif = async (req, res) => {
    let listaFormateada = [];
    let segundaoportunidad = 0;
    let alumnos;

    if (!req.params.second) {

        alumnos = await alumnoController.getAllStudents(req, res);
        for (let alumno in alumnos) {
            let valor = await Models.calificacion.findOne({
                where: {
                    idtarea: req.params.idactividad,
                    idalumno: alumnos[alumno].dataValues.id,
                }
            });

            listaFormateada.push({
                clave: alumnos[alumno].dataValues.clave,
                nombre: alumnos[alumno].dataValues.nombre,
                calificacion: (!valor)? 0 : valor.dataValues.valor
            })
        }

    } else {
        segundaoportunidad = 1;
        alumnos = await Models.alumno.findAll({
            include: [{
                model: Models.calificacion,
                where: {
                    idtarea: req.params.idactividad,
                    valor: {
                        [Op.lt]: 70
                    }
                }
            }]
        })
        for (let alumno in alumnos) {
            let valor = await Models.calificacion.findOne({
                where: {
                    idtarea: req.params.idactividad,
                    idalumno: alumnos[alumno].dataValues.id,
                }
            });

            if(configuracion.califi === "1"){
                if(await calcCalifStudentTopic(req.params.idtema, alumnos[alumno]) === "NA") {
                    listaFormateada.push({
                        clave: alumnos[alumno].dataValues.clave,
                        nombre: alumnos[alumno].dataValues.nombre,
                        calificacion: (!valor.dataValues.valor_s2) ? valor.dataValues.valor : valor.dataValues.valor_s2,
                    })
                }
            }
            else{
                listaFormateada.push({
                    clave: alumnos[alumno].dataValues.clave,
                    nombre: alumnos[alumno].dataValues.nombre,
                    calificacion: (!valor.dataValues.valor_s2) ? valor.dataValues.valor: valor.dataValues.valor_s2,
                })
            }
        }

    }
    listaFormateada = JSON.stringify(listaFormateada);

    const actividad = await Models.tarea.findOne({
        where: {id: req.params.idactividad}
    })
    res.render('actividad/actividad-calificar-individual', {
        idgrupo: req.params.idgrupo,
        idtema: req.params.idtema,
        actividad,
        listaFormateada,
        segundaoportunidad
    });
};


/*
* Guardar calificación individualmente**/
const scoreSingle = async (req, res) => {
    let calificaciones = JSON.parse(req.body.valorTabla);

    //Datos alumno
    for (let alumnopuntero in calificaciones) {
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
            if (!req.params.second) {
                await calificacion.update({
                    valor: parseInt(calificaciones[alumnopuntero].calificacion)
                })
            } else {
                await calificacion.update({
                    valor_s2: parseInt(calificaciones[alumnopuntero].calificacion)
                })
            }
        }
    }
    req.flash('success_msg', 'La actividad se calificó correctamente.');
    res.redirect('/grupo/actividades/' + req.params.idgrupo + '/' + req.params.idtema + '/' + req.params.idactividad);
}
/*Opción 1: hace referencia al caso en el que todos los integrantes obtendrán la misma calificación*/
const renderScoreTeam = async (req, res) => {
    let alumnos;
    let second = (req.params.second)? 1:0;
    let calificacion = [];
    let valorTablaEquipo = [];
    let valorTablaAlumnos = [];


    const actividad = await Models.tarea.findOne({
        where: {
            id: req.params.idactividad
        }
    });
    const equipo = await Models.equipo.findOne({
        where: {
            id: req.params.idequipo
        }
    });
    //Aplicar calificación para todo el equipo
    valorTablaEquipo.push({
        id: equipo.dataValues.id,
        nombre: equipo.dataValues.nombre,
        calificacion: 0
    });
    valorTablaEquipo = JSON.stringify(valorTablaEquipo);

    //Calificaciones individuales
    alumnos = await Models.alumno.findAll({
        include: [{
            model: Models.alumnoequipo,
            where: {idequipo: req.params.idequipo}
        }]
    });

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

    for (let alumno in alumnos) {
        if (!req.params.second) {
            valorTablaAlumnos.push({
                id: alumnos[alumno].dataValues.id,
                clave: alumnos[alumno].dataValues.clave,
                nombre: alumnos[alumno].dataValues.nombre,
                calificacion: calificacion[alumno]
            })
        } else {
            //configuracion modo

            if(configuracion.califi === '1'){
                if (calificacion[alumno] < 70 && await calcCalifStudentTopic(req.params.idtema, alumnos[alumno])) {
                    valorTablaAlumnos.push({
                        id: alumnos[alumno].dataValues.id,
                        clave: alumnos[alumno].dataValues.clave,
                        nombre: alumnos[alumno].dataValues.nombre,
                        calificacion: calificacion[alumno]
                    })
                }
            }
            else{
                if (calificacion[alumno] < 70) {
                    valorTablaAlumnos.push({
                        id: alumnos[alumno].dataValues.id,
                        clave: alumnos[alumno].dataValues.clave,
                        nombre: alumnos[alumno].dataValues.nombre,
                        calificacion: calificacion[alumno]
                    })
                }
            }
        }
    }

    valorTablaAlumnos = JSON.stringify(valorTablaAlumnos);
    res.render('actividad/actividad-calificar-equipo', {
        idgrupo: req.params.idgrupo,
        idtema: req.params.idtema,
        actividad,
        idequipo: req.params.idequipo,
        valorTablaEquipo,
        valorTablaAlumnos,
        second
    });
}

const scoreTeam = async (req, res) => {
    const datosEquipo = JSON.parse(req.body.valorTablaEquipo);
    const datosAlumnos = JSON.parse(req.body.valorTablaAlumnos);
    const valorSwitch = (req.body.estado === 'true');
    const second = (req.params.second)? true:false;
    if (valorSwitch) {
        for (let alumno in datosAlumnos) {

            let calificacion = await Models.calificacion.findOne({
                where: {
                    idtarea: req.params.idactividad,
                    idalumno: datosAlumnos[alumno].id,
                }
            })
            if (!calificacion) {
                await Models.calificacion.create({
                    idtarea: req.params.idactividad,
                    idalumno: datosAlumnos[alumno].id,
                    valor: datosEquipo[0].calificacion
                });
            } else {
                if(second){
                    await calificacion.update({
                        valor_s2: datosEquipo[0].calificacion
                    });
                }
                else{
                    await calificacion.update({
                        valor: datosEquipo[0].calificacion
                    });
                }
            }
        }
    } else {
        for (let alumno in datosAlumnos) {
            let calificacion = await Models.calificacion.findOne({
                where: {
                    idtarea: req.params.idactividad,
                    idalumno: datosAlumnos[alumno].id,
                }
            })
            if (!calificacion) {
                await Models.calificacion.create({
                    idtarea: req.params.idactividad,
                    idalumno: datosAlumnos[alumno].id,
                    valor: datosAlumnos[alumno].calificacion
                });
            } else {
                if(second){
                    await calificacion.update({
                        valor_s2: datosAlumnos[alumno].calificacion
                    });
                }
                else{
                    await calificacion.update({
                        valor: datosAlumnos[alumno].calificacion
                    });
                }
            }
        }
    }
    req.flash('success_msg', 'La actividad se calificó correctamente.');
    if(second){
        res.redirect(`/equipo/seleccion/${req.params.idgrupo}/${req.params.idtema}/${req.params.idactividad}/1`);
    }
    else{
        res.redirect(`/equipo/seleccion/${req.params.idgrupo}/${req.params.idtema}/${req.params.idactividad}`);
    }
    //res.redirect(`/grupo/actividades/${req.params.idgrupo}/${req.params.idtema}/${req.params.idactividad}`);
}
module.exports = {
    renderScoreTeam,
    scoreTeam,
    renderViewCalif,
    retriveCalf,
    scoreSingle,
    viewCalf,
    calcCalif
}