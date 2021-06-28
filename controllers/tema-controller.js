const Sequelize = require('sequelize');
const Models = require('../models');
const actividadControler = require('../controllers/actividad-controller');
/**
 * Método para obtener los temas por grupo
 * **/
const getTemasByGrupo = async (req,res) =>{
    try{
        //Obtenemos el ID del grupo
        const idgrupo = req.params.idgrupo;
        //Obtenemos los datos del grupo
        const grupo = await Models.grupo.findOne({
            where: {
                id: req.params.idgrupo
            }
        });
        //Se extraen los atributos del grupo
        const {asignatura, clave} = grupo;
        const tema = await Models.tema.findAll({
            where: {
                idgrupo: req.params.idgrupo
            }
        });
        console.log(tema);
        res.render('tema/vista-grupo-temas', {tema, idgrupo, asignatura, clave});
    }
    catch(err){
        console.log(err);
    }
}

const getTemasByGrupoEtiquetas = async (idGrupo) =>{
    try{
        const temas = await Models.tema.findAll({where:{idgrupo: idGrupo}});
        return temas;
    }
    catch(err){
        console.log(err);
    }
}

const getTemaData = async (idGrupo, Nombre) =>{
    const tema = await Models.tema.findOne({
        where: {
            idgrupo: idGrupo,
            nombre: Nombre
        }
    });
    return tema;
}

const guardarTemaActividades = async (req, res) =>{

    await guardarTema(req,res);

    if(tryParseJSON(req.body.valorTabla) != false){
        tema = await getTemaData(req.params.idgrupo, req.body.nombre);
        const {id} = tema;
        console.log("idtema: " + id);
        await actividadControler.guardarDesdeGrid(req,res,id);
        console.log('Tema con actividades Guardado');
    }
    res.redirect('/grupo/temas/' + req.params.idgrupo)
}

const editarTema = async (req,res)=>{
    var {unidad, nombre} = req.body;
    //Buscar el registro a actualizar
    var tema = await Models.tema.findOne({
        where: {id: req.params.idtema}
    })
    await tema.update({
        numerotema: parseInt(unidad),
        nombre: nombre
    });
    res.redirect('/grupo/temas/' + req.params.idgrupo);
}

const guardarTema = async (req,res) =>{
    //Obtenemos los valores del formulario para crear un nuevo tema
    const {nombre, numerotema} = req.body;
    const idgrupo = req.params.idgrupo;
    const errors = [];
    //Verificamos que el atributo no este vacío
    if(!nombre || !numerotema){
        errors.push({text: "El campo está vacío"});
        res.render('tema/tema-nuevo', {errors});
    }
    else{
        try{
            await Models.tema.create({
                idgrupo: idgrupo,
                nombre: req.body.nombre,
                numerotema: req.body.numerotema
            })
            res.redirect('/grupo/temas/' + idgrupo);
        }
        catch(err){
            console.log(err);
        }
    }
}

const eliminarTema = async (req,res)=>{
    //Busqueda de las actividades que corresponden a ese tema/unidad.
    var actividades = await Models.tarea.findAll({
        where:{idtema: req.params.idtema}
    });
    //Busqueda y eliminacion de las calificaciones relacionadas con las actividades.
    for(var actividad in actividades){
        //Busqueda de las calificaciones
        var calificaciones = await Models.calificacion.findAll({
           where:{
               idtarea:parseInt(actividades[actividad].id)
           }
        });
        //Eliminacion de las calificaciones
        for(var calificacion in calificaciones){
            await calificaciones[calificacion].destroy();
        }
        //Eliminación de la actividad apuntada por el for
        await actividades[actividad].destroy();
    }
    //busqueda y eliminacion del tema
    var tema = await Models.tema.findOne({
        where:{id: req.params.idtema}
    });
    //Eliminacion del tema
    await tema.destroy();
    res.redirect('/grupo/temas/'+req.params.idgrupo);
};

module.exports = {
    eliminarTema,
    getTemasByGrupo,
    guardarTema,
    guardarTemaActividades,
    editarTema,
    getTemasByGrupoEtiquetas
}

function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }
    return false;
};