const Sequelize = require('sequelize');
const Models = require('../models');

//Método para obtener todos los grupos sin importar otros campos.
//Utilizado principalmente en la pagina de inicio.
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

//Método para crear un grupo mediante el modo manual de la aplicación.
const createGrupoManual = async (req,res)=>{
    const {clave,asignatura,estado} = req.body;
    console.log({clave,asignatura,estado});
    try {
        await Models.grupo.create({
            clave: req.body.clave.toUpperCase(),
            asignatura: req.body.asignatura,
            estado: parseInt(estado,10)
        })

        const grupo = await Models.grupo.findOne({
            where:{
                clave: req.body.clave.toUpperCase()
            }
        })
        console.log({grupo})
        //Renderizado de la vista para agregar alumnos y posteriormente
        //relacionarlos.
        res.render('alumno/grid-alumnos', {grupo});
    }
    catch (err){
        console.log(err)
    }

}
//Exportación de los métodos para su uso interno en aplicación.
module.exports = {
    getAllGrupos,
    getAllGruposByState,
    createGrupoManual
}
