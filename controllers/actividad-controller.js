const Sequelize = require('sequelize');
const Models = require('../models');
const alumnoController = require('./alumno-controller');


const getAllTareas = async (idGrupo)=>{
    try{
        const tareas = Models.tarea.findAll({

        })
    }
    catch (err){

    }
}

const getActividadById = async (idactividad)=>{
    try{
        const tarea = await Models.tarea.findOne({
            where:{
                id: idactividad
            }
        })
        return tarea;
    }
    catch (e){
        console.log(e)
    }
}

const getAllTareasByTema = async (idTema)=>{
    try{
        const tareas = await Models.tarea.findAll({
            where:{
                idtema: idTema
            }
        });
        return tareas;
    }
    catch (err){
        console.log(err)
    }
}

const guardarDesdeGrid = async (req, res, idtema) => {
    //Se obtiene el arreglo alojado en objeto invisible del body correspondiente a la tabla
    tareas = JSON.parse(req.body.valorTabla);
    console.log("Tareas leidos: " + {tareas});
    //Ciclo para iterar entre los datos del arreglo Tabla

    for (let tarea in tareas) {
        //Llamado del modelo para buscar el registro
        //si existe el registro no se guarda
        //si no existe el registro se guarda
        //evita duplicados.
        await Models.tarea.create(
            {
                idtema: idtema,
                nombre: tareas[tarea].nombreCol,
                valor: tareas[tarea].valorCol,
                tipo: tareas[tarea].tipoCol,
                descripcion: tareas[tarea].descripcionCol,
            });
    }
};

const editarActividad = async (req,res)=>{
    var {nombre, descripcion, valor, tipoBox} = req.body;
    const idtarea = req.params.idactividad;
    const idgrupo = req.params.idgrupo;
    const idtema =  req.params.idtema;
    var actividad = await Models.tarea.findOne({where:{id: idtarea}});
    await actividad.update({
        nombre: nombre,
        descripcion: descripcion,
        valor: parseInt(valor),
        tipo: tipoBox
    });
    res.redirect('/grupo/actividades/'+idgrupo+'/'+idtema+'/'+idtarea);
};

const eliminarActividad = async (req,res)=>{
    try{
        //Se hace una busqueda de las calificaciones asociadas a esa actividad
        var calificaciones = await Models.calificacion.findAll({where:{idtarea:req.params.idactividad}})
        //Ciclo para eliminar todas las calificaciones asociadas a la actividad
        for(calificacion in calificaciones){
            await calificaciones[calificacion].destroy();
        }
        var actividad = await Models.tarea.findOne({where:{id:req.params.idactividad}});
        await actividad.destroy();
        res.redirect('/grupo/actividades/'+ req.params.idgrupo +'/' + req.params.idtema);
    }
    catch(err){
        console.log(err);
    }
};

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
module.exports = {
    renderVistaCalifI,
    eliminarActividad,
    editarActividad,
    getActividadById,
    guardarDesdeGrid,
    calificarIndividual,
    getAllTareasByTema,
    getAllTareas

}