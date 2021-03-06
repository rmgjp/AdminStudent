const Models = require('../models');
const temaController = require('./tema-controller');
const alumnoController = require('./alumno-controller');
const configuracion = require('../config/userconfig.json');
const {Op} = require('sequelize');


const retriveTeamsData = async (req, res) => {
    const {asignatura, clave} = await Models.grupo.findOne({where: {id: req.params.idgrupo}});
    const equipos = await Models.equipo.findAll({where: {idgrupo: req.params.idgrupo}});

    if (!equipos || equipos.length === 0) {
        const menu = 1;
        res.render('equipo/vista-grupo-equipo', {idgrupo: req.params.idgrupo, menu, asignatura, clave})
    } else {
        res.redirect('/grupo/equipos/' + req.params.idgrupo + '/' + equipos[0].dataValues.id);
    }
}

const getDataTeams = async (req, res) => {
    return Models.equipo.findAll({where: {idgrupo: req.params.idgrupo}});
}

const renderSelectionTeamsAct = async (req, res) => {
    let second = 0;
    if (req.params.second) {
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

    res.render('equipo/seleccion-equipo', {
        equipos: JSON.stringify(equipos),
        idgrupo: req.params.idgrupo,
        idactividad: req.params.idactividad,
        idtema: req.params.idtema,
        second
    });
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
        }],
        order:[
            ['nombre', 'ASC']
        ]
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


    if (configuracion.valequipo === '1') {
        if (validacion.estado) {
            for (let alumno in validacion.alumnos) {
                errors.push({text: `El alumno ${validacion.alumnos[alumno].nombre} ya esta agregado a un equipo existente con los temas seleccionados.`});
            }
        }
    }

    if (!listaTemas || !listaAlumnos || (configuracion.valequipo === '1' && validacion.estado)) {
        //const listaFormateadaAlumnos = req.body.valorTablaAlumnos.value;
        //const listaFormateadaTemas = req.body.valorTablaTemas.value;
        if (!listaTemas) {
            errors.push({text: 'No se ha seleccionado ning??n tema.'});
        }
        if (!listaAlumnos) {
            errors.push({text: 'No se ha seleccionado ning??n alumno.'});
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
        req.flash('success_msg', 'El equipo se cre?? correctamente.');
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
            where: {idtema: listaTemas[tema].id}
        });

        for (let equipo in equipos) {
            for (let alumno in listaAlumnos) {
                const alumnosequipo = await Models.alumnoequipo.findOne({
                    where: {
                        idalumno: listaAlumnos[alumno].id,
                        idequipo: equipos[equipo].id
                    }
                })
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
    req.flash('info_msg', 'El equipo se elimin?? permanentemente.');
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

const findStudent = async (req, res) => {
    const datosAlumno = req.params.datos;
    const idequipo = req.params.idequipo;

    console.log(datosAlumno)
    const alumno = await Models.alumno.findOne({
        where: {
            [Op.or]: [
                {nombre: datosAlumno},
                {clave: datosAlumno}
            ]
        },
        include: [{
            model: Models.alumnogrupo,
            idgrupo: req.params.idgrupo
        }]
    });
    //Verificaci??n de existencia del alumno buscado.
    if (alumno) {
        //Verificaci??n de la asociaci??n entre el alumno y equipo
        const relacion = await Models.alumnoequipo.findOne({
            where: {
                idequipo: idequipo,
                idalumno: alumno.dataValues.id
            }
        })
        //Si no existe la relaci??n se agrega al equipo
        if (!relacion) {

            if(configuracion.valequipo === '1'){
                const result = await validateStudentAjax(req.params.idequipo, req.params.idgrupo, alumno);
                if (result) {
                    req.flash('error_msg', 'El alumno ya est?? agregado a un equipo existente asociado a uno o m??s temas de este equipo.');
                }
                else{
                    await addStudentToTeam(idequipo, alumno.dataValues.id);
                    req.flash('success_msg', 'El alumno se a agregado al equipo correctamente.');
                    res.send(JSON.stringify(alumno));
                }
            }
            else{
                await addStudentToTeam(idequipo, alumno.dataValues.id);
                req.flash('success_msg', 'El alumno se a agregado al equipo correctamente.');
                res.send(JSON.stringify(alumno));
            }
        } else {
            req.flash('error_msg', 'El alumno ya pertenece al equipo.');
        }
    } else {
        req.flash('error_msg', 'No se encontr?? el alumno.');
    }
    res.redirect(`/grupo/equipos/${req.params.idgrupo}/${req.params.idequipo}`)
}
const addStudentToTeam = async (idequipo, idalumno) =>{
    await Models.alumnoequipo.create({
        idequipo: idequipo,
        idalumno: idalumno
    })
}


const validateStudentAjax = async (idEquipo, idGrupo, datosAlumno) => {

    const temas = await Models.equipotema.findAll({
        where: {
            idequipo: idEquipo
        }
    })

    for (let tema in temas) {
        const equipos = await Models.equipotema.findAll({
            where: {idtema: temas[tema].id,}
        });

        for (let equipo in equipos) {

            const alumnosequipo = await Models.alumnoequipo.findOne({
                where: {
                    idalumno: datosAlumno.dataValues.id,
                    idequipo: equipos[equipo].id
                }
            })
            if (alumnosequipo) {
                return true;
            }
        }
    }
    return false;
}
const deleteStudentToTeam = async (req,res) => {
    const alumnos = JSON.parse(req.params.datos);
    for(let alumno in alumnos){
        const alumnoequipo = await Models.alumnoequipo.findOne({
            where:{
                idalumno: alumnos[alumno],
                idequipo: req.params.idequipo
            }
        })
        await alumnoequipo.destroy();

    }
    req.flash('success_msg', 'El alumno se a elimino correctamente del equipo.');
    res.send(true);
}
module.exports = {
    deleteStudentToTeam,
    getDataTeams,
    retriveTeamsData,
    renderSelectedTeams,
    renderNewTeam,
    saveTeam,
    renderSelectionTeamsAct,
    deleteTeam,
    findStudent
}