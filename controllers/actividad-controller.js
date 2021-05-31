const Sequelize = require('sequelize');
const Models = require('../models');

const getAllTareas = async (idGrupo)=>{
    try{
        const tareas = Models.tareas.findAll({

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

module.exports = {
    editarActividad,
    getActividadById,
    guardarDesdeGrid,
    getAllTareasByTema,
    getAllTareas

}