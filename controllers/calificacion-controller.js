const Sequelize = require('sequelize');
const Models = require('../models');
const configuracion = require('../config/userconfig.json');

/**
 * Visualizacion de la vista de calificaciones*/
const vistaCalif = async(req,res)=>{
    const grupo = await Models.grupo.findOne({where: {id: req.params.idgrupo}});
    const {asignatura, clave} = grupo;
    //Busqueda de temas por grupo.
    const temas = await Models.tema.findAll({
        where:{idgrupo:req.params.idgrupo}
    });

    //verificar si se selecciono un tema
    if(!req.params.idtema){
        res.render('calificacion/vista-grupo-calificaciones', {temas, idgrupo:req.params.idgrupo, asignatura, clave});
    }
    else {
        //Busqueda de las actividades por grupo
        const actividades = await Models.tarea.findAll({where:{idtema : req.params.idtema}})

        //Se busca la relación de los alumnos.
        const alumnogrupos = await Models.alumnogrupo.findAll({
            where: {
                idgrupo: req.params.idgrupo
            }
        });

        //Se genera un arreglo donde se guardan los alumnos relacionados con el grupo
        let alumnos = [];

        for (punteroAlumno in alumnogrupos){
            let alumno = await Models.alumno.findAll({
                where: {
                    id: alumnogrupos[punteroAlumno].dataValues.idalumno
                }
            });
            alumnos.push(alumno[0]);
        }
        alumnos.sort(function (a, b) {
            return a.dataValues.nombre.localeCompare(b.dataValues.nombre);
        });
        var calificaciones;
        var listaFormateada = [];
        for(let alumno in alumnos){
            let calificaciones = [];
            let acumulador = 0;
            let calcCalificacion;
            for(actividad in actividades){
                var calificacion = await Models.calificacion.findOne({where:{
                        idalumno: alumnos[alumno].dataValues.id,
                        idtarea: actividades[actividad].dataValues.id,}
                });
                if(!calificacion){
                    calificaciones.push("No capturado.");
                }
                else {
                    calcCalificacion = (calificacion.dataValues.valor* actividades[actividad].valor)/100;

                    switch (parseInt(configuracion.califi)){
                        case 0:
                            if(calificacion.dataValues.valor < 70){
                                acumulador = "NA"
                            }
                            else if (calificacion.dataValues.valor >= 70){
                                if(acumulador != "NA"){
                                    //Calculo de las calificaciones cuando se promedia.
                                    acumulador += calcCalificacion;
                                }
                            }
                            break;
                        case 1:
                            acumulador += calcCalificacion;
                            break;
                    }
                    calificaciones.push(calificacion.dataValues.valor);
                }
            }

            listaFormateada.push({
                clave: alumnos[alumno].dataValues.clave,
                nombre: alumnos[alumno].dataValues.nombre,
                calificaciones,
                califinal: acumulador
            })
        }

        listaFormateada = JSON.stringify(listaFormateada);

        res.render('calificacion/vista-grupo-calificaciones', {temas, idgrupo:req.params.idgrupo, actividades, listaFormateada,
            asignatura, clave});
    }
}


const renderVistaCalifI = async (req,res)=>{
    const alumnogrupos = await Models.alumnogrupo.findAll({
        where: {
            idgrupo: req.params.idgrupo
        }
    });

    //Se genera un arreglo donde se guardan los alumnos relacionados con el grupo
    let alumnos = [];

    for (punteroAlumno in alumnogrupos){
        let alumno = await Models.alumno.findAll({
            where: {
                id: alumnogrupos[punteroAlumno].dataValues.idalumno
            }
        });
        alumnos.push(alumno[0]);
    }
    alumnos.sort(function (a, b) {
        return a.dataValues.nombre.localeCompare(b.dataValues.nombre);
    });

    var calificacion = [];
    for (let alumno in alumnos){
        let valor = await Models.calificacion.findOne({
            where:{
                idtarea:req.params.idactividad,
                idalumno: alumnos[alumno].dataValues.id,
            }
        });

        if(!valor){
            calificacion.push(0)
        }
        else {
            calificacion.push(valor.dataValues.valor);
        }
    }

    var listaFormateada = [];
    for(let alumno = 0; alumno< alumnos.length; alumno++){
        listaFormateada.push({
            clave: alumnos[alumno].dataValues.clave,
            nombre: alumnos[alumno].dataValues.nombre,
            calificacion: calificacion[alumno]
        })
    }

    listaFormateada = JSON.stringify(listaFormateada);

    const actividad = await Models.tarea.findOne({
        where:{id:req.params.idactividad}
    })

    res.render('actividad/actividad-calificar-individual', {idgrupo:req.params.idgrupo, idtema:req.params.idtema, actividad, listaFormateada});
};


/*
* Guardar calificación individualmente**/
const calificarIndividual = async (req,res)=>{
    calificaciones = JSON.parse(req.body.valorTabla);

    //Datos alumno
    var alumnos = [];
    for(alumnopuntero in calificaciones){
        const alumno = await Models.alumno.findOne({
            where:{clave: calificaciones[alumnopuntero].clave}
        })
        //Buscar la calificación
        var calificacion = await Models.calificacion.findOne({
            where:{
                idalumno: alumno.dataValues.id,
                idtarea: req.params.idactividad
            }
        })
        //Si la calificacion == null
        //Agregar calificación
        if(!calificacion){
            await Models.calificacion.create({
                idtarea: req.params.idactividad,
                idalumno: alumno.dataValues.id,
                valor: calificaciones[alumnopuntero].calificacion
            })
        }else{
            //Si la calificación no es es null
            // calificación.update();
            calificacion.update({
                valor:parseInt(calificaciones[alumnopuntero].calificacion)
            })
        }
    }
    res.redirect('/grupo/actividades/'+req.params.idgrupo+'/'+req.params.idtema+'/'+req.params.idactividad);
}

module.exports = {
    renderVistaCalifI,
    calificarIndividual,
    vistaCalif

}