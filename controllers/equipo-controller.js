const Models = require('../models');
const temaController = require('./tema-controller');
const alumnoController = require('./alumno-controller');

const renderAllTeams = async (req, res) => {
    res.render('equipo/vista-grupo-equipo', {idgrupo: req.params.idgrupo})
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
module.exports = {
    renderAllTeams,
    renderNewTeam
}