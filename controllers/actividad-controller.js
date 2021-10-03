const Models = require('../models');
const {Op} = require('sequelize');
//Este controlador contiene unicamente métodos para realizar las busquedas y consultas de actividades
/*
 * retornar la actividad encontrada dado un ID*/
const getActivityById = async (idactividad) => {
    return  Models.tarea.findOne({
        where: {
            id: idactividad
        }
    })
}
//Guardar actividades alojadas en una tabla de la vista
const saveFromGrid = async (req, res, idtema) => {

    //Se obtiene el arreglo alojado en objeto invisible del body correspondiente a la tabla

    //Ciclo para iterar entre los datos del arreglo Tabla
    if(tryParseJSON(req.body.valorTabla)===false){
        req.flash('error_msg','No ha registrado ninguna actividad, registre al menos una');
        return false;
    }
    else{
        //
        let sumatoriaActividadesEx = 0;

        const actividades = await Models.tarea.findAll({
            where:{
                idtema: idtema
            }
        })

        let tareas = JSON.parse(req.body.valorTabla);
        let sumatoria = 0;
        for(let tarea in tareas){
            sumatoria += parseFloat(tareas[tarea].valorCol);
        }

        if(actividades.length > 0){
            for(let actividad in actividades){
                sumatoriaActividadesEx += actividades[actividad].dataValues.valor;
            }
            sumatoria += sumatoriaActividadesEx;
        }

        if(sumatoria <= 100){
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
            return true;
        }
        else{
            req.flash('error_msg', "La suma del valor de las actividades sobrepasa la cantidad de 100.")
            return  false;
        }
    }
};
/*
* Actualizar la actividad seleccinada*/
const editActivity = async (req, res) => {
    //Se extraen los datos desde la vista
    let {nombre, descripcion, valor, tipoBox} = req.body;
    //Se busca la actividad seleccionada a editar
    const idtarea = req.params.idactividad;
    const idgrupo = req.params.idgrupo;
    const idtema = req.params.idtema;

    let sumatoria = parseFloat(valor);
    let actividad = await Models.tarea.findOne({where: {id: idtarea}});



    let actividades = await Models.tarea.findAll({
        where:{
            idtema: idtema,
            id: {[Op.not]: actividad.dataValues.id}
        }
    });
    actividades.forEach(valor => {
        sumatoria = sumatoria + parseFloat(valor.dataValues.valor);
    })
    if(sumatoria <= 100){
        //Se actualizan los valores
        await actividad.update({
            nombre: nombre,
            descripcion: descripcion,
            valor: valor,
            tipo: tipoBox
        });
        req.flash('success_msg', 'La actividad se editó correctamente.')
    }
    else{
        req.flash('error_msg', "El nuevo valor ingresado de la actividad genera que la sumatoria total sea mayor a 100.")
    }

    res.redirect('/grupo/actividades/' + idgrupo + '/' + idtema + '/' + idtarea);
};
//Eliminar la actividad seleccionada
const deleteActivity = async (req, res) => {
    try {
        //Se hace una busqueda de las calificaciones asociadas a esa actividad
        let calificaciones = await Models.calificacion.findAll({where: {idtarea: req.params.idactividad}})
        //Ciclo para eliminar todas las calificaciones asociadas a la actividad
        for (calificacion in calificaciones) {
            await calificaciones[calificacion].destroy();
        }
        //Buscamos la actividad a eliminar y se destruye el objeto
        let actividad = await Models.tarea.findOne({where: {id: req.params.idactividad}});
        await actividad.destroy();
        req.flash('success_msg', 'La actividad se eliminó correctamente.')
        res.redirect('/grupo/actividades/' + req.params.idgrupo);
    } catch (err) {
        console.log(err);
    }
};
//Obtener todas las unidades de la asignatura y las actividades de está
const getTopicsAndActivities = async (req, res) => {
    //Obtener datos del grupo
    const menu = 1;
    const grupo = await Models.grupo.findOne({where: {id: req.params.idgrupo}});
    //Obtenemos temas de ese grupo
    const temas = await Models.tema.findAll({where: {idgrupo: req.params.idgrupo}});
    let datos = [];
    //Por cada tema se buscan sus actividades
    for (let tema in temas) {
        const actividades = await Models.tarea.findAll({where: {idtema: temas[tema].dataValues.id}});
        datos.push({
            tema: temas[tema].dataValues,
            actividades: actividades,
        })
    }
    res.render('actividad/vista-grupo-actividades', {
        idgrupo: req.params.idgrupo,
        asignatura: grupo.dataValues.asignatura,
        clave: grupo.dataValues.clave,
        datos, menu
    });
}
//Obtener los temas/unidades de la asignatura, las actividades de
// los mismos y la informacion adicional de la actividad seleccionada
const getTopicActivitiesAndActivity = async (req, res) => {
    //Obtener datos del grupo
    const grupo = await Models.grupo.findOne({where: {id: req.params.idgrupo}});
    //Obtenemos temas de ese grupo
    const temas = await Models.tema.findAll({where: {idgrupo: req.params.idgrupo}});
    const menu = 1;
    let datos = [];
    for (let tema in temas) {
        const actividades = await Models.tarea.findAll({where: {idtema: temas[tema].dataValues.id}});
        datos.push({
            tema: temas[tema].dataValues,
            actividades: actividades,
        });
    }
    const datosTema = await Models.tema.findOne({
        where:{
            id: req.params.idtema
        }

    })
    console.log(datosTema.dataValues.nombre)
    const actividad = await getActivityById(req.params.idactividad);
    //Renderizar la vista con los datos recuperados
    res.render('actividad/vista-grupo-actividades', {
        idgrupo: req.params.idgrupo,
        datos,
        idtema: req.params.idtema,
        actividad,
        nombreTema: datosTema.dataValues.nombre,
        tipoActividad: actividad.tipo,
        asignatura: grupo.dataValues.asignatura,
        clave: grupo.dataValues.clave,
        menu
    });

}
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
module.exports = {
    getTopicActivitiesAndActivity,
    getTopicsAndActivities,
    deleteActivity,
    editActivity,
    getActivityById,
    saveFromGrid,
}