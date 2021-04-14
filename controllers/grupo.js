const Sequelize = require('sequelize');
const Models = require('../models');

const getAllGrupos = async (req, res, next) => {
    const grupos =  await Models.grupo.findAll({});
    console.log({grupos})
    res.render('index', {grupos})
}

const getAllGruposByState = async(req, res, next)=>{
    const grupos = await Models.grupo.findAll({
        where:{
            estado: req.params.estado
        }
    })
    console.log({grupos})
    res.render('index', {grupos})
}

const createGrupoManual = async (req,res)=>{
    const {clave,asignatura,estado} = req.body;
    console.log({clave,asignatura,estado});
    try {
        await Models.grupo.create({
            clave: req.body.clave,
            asignatura: req.body.asignatura,
            estado: parseInt(estado,10)
        })
        console.log('Guardado');
    }
    catch (err){
        console.log(err)
    }
    res.redirect('/alumno/wizard-agregar-alumnos-manual');
}

module.exports = {
    getAllGrupos,
    getAllGruposByState,
    createGrupoManual
}
