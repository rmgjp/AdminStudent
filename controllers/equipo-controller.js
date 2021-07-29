const Models = require('../models');
const temaController = require('./tema-controller');
const alumnoController = require('./alumno-controller');

const retriveTeamsData = async (req, res) => {
    const temas = await Models.tema.findAll({
        where: {
            idgrupo: req.params.idgrupo
        }
    })
    const equipos = await Models.equipo.findAll({where: {idgrupo: req.params.idgrupo}});

    if (!equipos || equipos.length === 0) {
        res.render('equipo/vista-grupo-equipo', {idgrupo: req.params.idgrupo})
    } else {
        res.redirect('/grupo/equipos/' + req.params.idgrupo + '/' + equipos[0].dataValues.id);
    }
}

const renderSelectedTeams = async (req, res) => {
    const equipo = await Models.equipo.findOne({where: {id: req.params.idequipo}});
    const temas = await Models.tema.findAll({
        include:[{
            model : Models.equipotema,
            where:{
                idequipo: req.params.idequipo
            }
        }]
    })
    const alumnos = await Models.alumno.findAll({
        include: [{
            model : Models.alumnoequipo,
            where:{idequipo: req.params.idequipo}
        }]
    })
    console.log({alumnos});
    const equipos = await Models.equipo.findAll({where: {idgrupo: req.params.idgrupo}});


    res.render('equipo/vista-grupo-equipo', {idgrupo: req.params.idgrupo, equipo, equipos,listaFormateadaAlumnos: JSON.stringify(alumnos), listaFormateadaTemas: JSON.stringify(temas)})
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
    if (!listaTemas || !listaAlumnos) {
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
        res.redirect('/grupo/equipos/' + req.params.idgrupo);
    }

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
    retriveTeamsData,
    renderSelectedTeams,
    renderNewTeam,
    saveTeam
}