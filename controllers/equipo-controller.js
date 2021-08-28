const Models = require('../models');
const temaController = require('./tema-controller');
const alumnoController = require('./alumno-controller');
const configuracion = require('../config/userconfig.json');

const retriveTeamsData = async (req, res) => {
    const equipos = await Models.equipo.findAll({where: {idgrupo: req.params.idgrupo}});

    if (!equipos || equipos.length === 0) {
        const menu = 1;
        res.render('equipo/vista-grupo-equipo', {idgrupo: req.params.idgrupo, menu})
    } else {
        res.redirect('/grupo/equipos/' + req.params.idgrupo + '/' + equipos[0].dataValues.id);
    }
}

const getDataTeams = async (req, res) => {
    return Models.equipo.findAll({where: {idgrupo: req.params.idgrupo}});
}

const renderSelectionTeamsAct = async (req, res) => {
    let second = 0;
    if(req.params.second){
        second = 1;
    }
    const equipos = await Models.equipo.findAll(
        {
            where:
                {idgrupo: req.params.idgrupo},
            include: [{
                model: Models.equipotema,
                where: {idtema: req.params.idtema}
            }]
        },
    );

    res.render('equipo/seleccion-equipo', {equipos: JSON.stringify(equipos), idgrupo: req.params.idgrupo, idactividad: req.params.idactividad, idtema: req.params.idtema,second});
}


const renderSelectedTeams = async (req, res) => {
    const equipo = await Models.equipo.findOne({where: {id: req.params.idequipo}});
    const temas = await Models.tema.findAll({
        include: [{
            model: Models.equipotema,
            where: {
                idequipo: req.params.idequipo
            }
        }]
    })
    const alumnos = await Models.alumno.findAll({
        include: [{
            model: Models.alumnoequipo,
            where: {idequipo: req.params.idequipo}
        }]
    })
    console.log({alumnos});
    const equipos = await Models.equipo.findAll({where: {idgrupo: req.params.idgrupo}});
    const menu = 1;

    res.render('equipo/vista-grupo-equipo', {
        idgrupo: req.params.idgrupo,
        equipo,
        menu,
        equipos,
        listaFormateadaAlumnos: JSON.stringify(alumnos),
        listaFormateadaTemas: JSON.stringify(temas)
    })
}

const renderNewTeam = async (req, res) => {
    let listaFormateadaTemas = [];
    let listaFormateadaAlumnos = [];
    const temas = await temaController.getTopicsByGroupLabel(req.params.idgrupo);
    const alumnos = await alumnoController.getAllStudents(req, res);

    for (let tema in temas) {
        listaFormateadaTemas.push(temas[tema].dataValues);
    }
    listaFormateadaTemas = JSON.stringify(listaFormateadaTemas);

    for (let alumno in alumnos) {
        listaFormateadaAlumnos.push(alumnos[alumno].dataValues);
    }
    listaFormateadaAlumnos = JSON.stringify(listaFormateadaAlumnos);

    res.render('equipo/equipo-nuevo', {listaFormateadaAlumnos, listaFormateadaTemas, idgrupo: req.params.idgrupo});
}

const saveTeam = async (req, res) => {
    const nombre = req.body.nombreBox;
    const listaTemas = tryParseJSON(req.body.listaTemas);
    const listaAlumnos = tryParseJSON(req.body.listaAlumnos);
    let errors = [];
    const validacion = await validateStudents(req, res);


    if(configuracion.valequipo === '1'){
        if(validacion.estado){
            for (let alumno in validacion.alumnos) {
                errors.push({text: `El alumno ${validacion.alumnos[alumno].nombre} ya esta agregado a un equipo existente con los temas seleccionados.`});
            }
        }
    }

    if (!listaTemas || !listaAlumnos || (configuracion.valequipo === '1' && validacion.estado)) {
        //const listaFormateadaAlumnos = req.body.valorTablaAlumnos.value;
        //const listaFormateadaTemas = req.body.valorTablaTemas.value;
        if (!listaTemas) {
            errors.push({text: 'No se ha seleccionado ningún tema.'});
        }
        if (!listaAlumnos) {
            errors.push({text: 'No se ha seleccionado ningún alumno.'});
        }

        res.render('equipo/equipo-nuevo', {
            listaFormateadaAlumnos: req.body.valorTablaAlumnos,
            listaFormateadaTemas: req.body.valorTablaTemas,
            idgrupo: req.params.idgrupo,
            errors
        })
    } else {
        const equipo = await Models.equipo.create({
            nombre: nombre,
            idgrupo: req.params.idgrupo
        });

        for (let alumno in listaAlumnos) {
            await Models.alumnoequipo.create({
                idequipo: equipo.id,
                idalumno: listaAlumnos[alumno].id,
            });
        }
        for (let tema in listaTemas) {
            await Models.equipotema.create({
                idequipo: equipo.id,
                idtema: listaTemas[tema].id,
            });
        }
        req.flash('success_msg', 'El equipo se creó correctamente.');
        res.redirect('/grupo/equipos/' + req.params.idgrupo);
    }
}

const validateStudents = async (req, res) => {
    const listaTemas = tryParseJSON(req.body.listaTemas);
    const listaAlumnos = tryParseJSON(req.body.listaAlumnos);

    let resultado = {
        estado: false,
        alumnos: []
    };

    for (let tema in listaTemas) {
        const equipos = await Models.equipotema.findAll({
            idtema: listaTemas[tema].id,
        });

        for (let equipo in equipos) {
            for (let alumno in listaAlumnos) {
                const alumnosequipo = await Models.alumnoequipo.findOne({where: {idalumno: listaAlumnos[alumno].id}})
                if (alumnosequipo) {
                    resultado.estado = true;
                    resultado.alumnos.push(listaAlumnos[alumno]);
                }
            }
        }
    }

    resultado.alumnos = resultado.alumnos.filter((value, index) => resultado.alumnos.indexOf(value) === index);

    return resultado;
}

const deleteTeam = async (req, res) => {
    const alumnoEquipo = await Models.alumnoequipo.findAll({
        where: {
            idequipo: req.params.idequipo
        }
    });

    for (let alumno in alumnoEquipo) {
        await alumnoEquipo[alumno].destroy();
    }

    const equipoTema = await Models.equipotema.findAll({
        where: {
            idequipo: req.params.idequipo
        }
    });

    for (let tema in equipoTema) {
        await equipoTema[tema].destroy();
    }

    const equipo = await Models.equipo.findOne({where: {id: req.params.idequipo}});
    await equipo.destroy();
    req.flash('info_msg', 'El equipo se eliminó permanentemente.');
    res.redirect('/grupo/equipos/' + req.params.idgrupo);
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
    getDataTeams,
    retriveTeamsData,
    renderSelectedTeams,
    renderNewTeam,
    saveTeam,
    renderSelectionTeamsAct,
    deleteTeam
}