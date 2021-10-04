const Models = require('../models');
const actividadControler = require('../controllers/actividad-controller');
const path = require('path');
const fs = require('fs');
/**
 * Esté controlador contiene las funciones requeridas para buscar y consultar los temas
 * **/
//Obtener temas mediante el id del grupo
const getTopicByGroup = async (req, res) => {

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
    const menu = 1;
    res.render('tema/vista-grupo-temas', {tema, menu ,idgrupo, asignatura, clave});
}


const getTopicsByGroupLabel = async (idGrupo) => {
    return Models.tema.findAll({where: {idgrupo: idGrupo}});
}
//Retorna el tema consultado
const getTopicData = async (idGrupo, Nombre) => {
    return Models.tema.findOne({
        where: {
            idgrupo: idGrupo,
            nombre: Nombre
        }
    });

}
//Guardar tema con actividades
const saveTopicsAndActivities = async (req, res) => {

    const {nombre, numerotema} = req.body;
    const idgrupo = req.params.idgrupo;
    const errors = [];
    //Verificamos que el atributo no este vacío
    if (!nombre){
        errors.push({text: "El campo nombre está vacío"});
        res.render('tema/tema-nuevo', {errors ,idgrupo} );
    } else {
        //guardamos los valores recuperados
        await Models.tema.create({
            idgrupo: idgrupo,
            nombre: req.body.nombre,
            numerotema: req.body.numerotema
        })
        if (tryParseJSON(req.body.valorTabla) != false) {
            let tema = await getTopicData(req.params.idgrupo, req.body.nombre);
            const {id} = tema;
            const resActividades = await actividadControler.saveFromGrid(req, res, id);
            if(resActividades){
                req.flash('success_msg', 'El tema se ha creado correctamente.');
                res.redirect('/grupo/temas/' + req.params.idgrupo);
            }
            else {
                await tema.destroy();
                res.render('tema/tema-nuevo', {errors ,idgrupo, numerotema, nombre} );
            }
        }

    }
}
//Actualizar tema
const editTopic = async (req, res) => {
    let {unidad, nombre} = req.body;
    //Buscar el registro a actualizar
    let tema = await Models.tema.findOne({
        where: {id: req.params.idtema}
    })
    await tema.update({
        numerotema: parseInt(unidad),
        nombre: nombre
    });
    req.flash('success_msg', 'El equipo se editó correctamente.');
    res.redirect('/grupo/temas/' + req.params.idgrupo);
}
//Guardar temas desde un grid en la vista
const saveTopicByGrid = async (req, res) => {
    //Se obtienen los temas de la tabla
    let temas = req.body.valorTabla;
    temas = JSON.parse(temas);
    //Se guardan todos los temas obtenidos
    for (let tema in temas) {
        await Models.tema.create({
            idgrupo: req.params.idgrupo,
            nombre: temas[tema].nombre,
            numerotema: temas[tema].numerotema
        })
    }
    req.flash('success_msg', 'Los temas se han importado correctamente.');
    res.redirect('/grupo/temas/' + req.params.idgrupo);
}

const deleteTopic = async (req, res) => {
    //Busqueda de las actividades que corresponden a ese tema/unidad.
    let actividades = await Models.tarea.findAll({
        where: {idtema: req.params.idtema}
    });
    let equipos = await Models.equipotema.findAll({
        where:{
            idtema: req.params.idtema
        }
    })
    for(let equipo in equipos){
        await equipos[equipo].destroy();
    }
    //Busqueda y eliminacion de las calificaciones relacionadas con las actividades.
    for (let actividad in actividades) {
        //Busqueda de las calificaciones
        let calificaciones = await Models.calificacion.findAll({
            where: {
                idtarea: parseInt(actividades[actividad].id)
            }
        });
        //Eliminacion de las calificaciones
        for (let calificacion in calificaciones) {
            await calificaciones[calificacion].destroy();
        }
        //Eliminación de la actividad apuntada por el for
        await actividades[actividad].destroy();
    }
    //busqueda y eliminacion del tema
    let tema = await Models.tema.findOne({
        where: {id: req.params.idtema}
    });
    //Eliminacion del tema
    await tema.destroy();
    req.flash('info_msg', 'El tema se ha eliminado permanentemente.');
    res.redirect('/grupo/temas/' + req.params.idgrupo);
};

const getTopicsByFile = async (req, res) => {
    let archivo = req.params.archivo;

    let txtFile = path.join(__dirname, '../public/doc/' + archivo);
    await fs.readFile(txtFile, "binary", async (err, data) => {
        if (err) {
            res.redirect('/filtro/1');
            throw err;
        } else {
            if (data.includes("MATERIA") && data.includes("MAESTRO") && data.includes("GRUPO") && data.includes("PERIODO") && data.includes("PRE") && data.includes("BR") && data.includes("I")) {
                //data = Buffer.from(data, 'utf-8');
                //Se busca la etiqueta </BR> para obtener los indices del contenido.
                let inicioBR = data.lastIndexOf('</BR>') + 5;
                //Se busca la etiqueta </I> para obtener el ultimo indice del contenido.
                let finI = data.lastIndexOf("</I>");
                let contenidoBR = data.substring(inicioBR, finI);
                let temas = contenidoBR.split(',');
                let indice;
                let numerotema = 1;

                let listaFormateada = [];
                for (tema in temas) {
                    indice = temas[tema].indexOf('-');
                    listaFormateada.push(
                        {
                            numerotema: numerotema,
                            nombre: temas[tema].substring(indice + 1, temas[tema].length)
                        }
                    );
                    numerotema += 1;
                }
                listaFormateada = JSON.stringify(listaFormateada);

                res.render('tema/importar-tema', {idgrupo: req.params.idgrupo, listaFormateada});
            } else {
                const error = "Archivo no valido: el archivo no contiene información de la materia y temas de la materia.";
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
                const menu = 1;
                res.render('tema/vista-grupo-temas', {tema, menu , idgrupo, asignatura, clave, error});

            }
        }
    });
}

module.exports = {
    saveTopicByGrid,
    deleteTopic,
    getTopicByGroup,
    saveTopicsAndActivities,
    editTopic,
    getTopicsByGroupLabel,
    getTopicsByFile
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