const Sequelize = require('sequelize');
const Models = require('../models');

const getActividadById = async (idactividad)=>{
    try{
        return await Models.tarea.findOne({
            where:{
                id: idactividad
            }
        })
    }
    catch (e){
        console.log(e)
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
        res.redirect('/grupo/actividades/'+ req.params.idgrupo);
    }
    catch(err){
        console.log(err);
    }
};

const getTemasAndActividades = async (req,res)=>{
    //Obtener datos del grupo
    const grupo = await Models.grupo.findOne({where:{id: req.params.idgrupo}});
    //Obtenemos temas de ese grupo
    const temas = await Models.tema.findAll({where:{idgrupo:req.params.idgrupo}});
    var datos = [];
    for (let tema in temas){
        const actividades = await Models.tarea.findAll({where:{idtema:temas[tema].dataValues.id}});
        datos.push({
            tema: temas[tema].dataValues,
            actividades: actividades,
        })
    }
    res.render('actividad/vista-grupo-actividades', {idgrupo: req.params.idgrupo, asignatura: grupo.dataValues.asignatura, clave:grupo.dataValues.clave,datos});
}

const getTemasActividadesAndActividad = async (req,res)=>{
    //Obtener datos del grupo
    const grupo = await Models.grupo.findOne({where:{id: req.params.idgrupo}});
    //Obtenemos temas de ese grupo
    const temas = await Models.tema.findAll({where:{idgrupo:req.params.idgrupo}});
    var datos = [];
    for (let tema in temas) {
        const actividades = await Models.tarea.findAll({where: {idtema: temas[tema].dataValues.id}});
        datos.push({
            tema: temas[tema].dataValues,
            actividades: actividades,
        });
    }
    const actividad = await getActividadById(req.params.idactividad);
    res.render('actividad/vista-grupo-actividades', {idgrupo:req.params.idgrupo, datos, idtema:req.params.idtema, actividad, tipoActividad:actividad.tipo, asignatura:grupo.dataValues.asignatura,clave: grupo.dataValues.clave});

}
module.exports = {
    getTemasActividadesAndActividad,
    getTemasAndActividades,
    eliminarActividad,
    editarActividad,
    getActividadById,
    guardarDesdeGrid,
}