const Sequelize = require('sequelize');
const Models = require('../models');



const guardarDesdeGrid = async (req,res)=>{
    const tabla = JSON.parse(req.body.valorTabla);
    console.log(tabla);
    for(let i = 0; i<tabla.length; i++){
        try {
            await Models.alumno.create({
                clave:tabla[i].clave,
                nombre: tabla[i].nombre,
                apellidos: tabla[i].apellidos
            })
        }
        catch (err){
            console.log(err)
        }

    }
    res.redirect('/')
}

const getAllAlumnos = async (req, res, next) => {
    const alumnos =  await Models.alumno.findAll({});
    console.log(alumnos)
    //res.render('index', {alumnos})
}

module.exports = {
    guardarDesdeGrid,
    getAllAlumnos
}