const Sequelize = require('sequelize');
const Models = require('../models');

//Método para obtener todos los grupos sin importar otros campos.
//Utilizado principalmente en la pagina de inicio.
const getAllGrupos = async (req, res, next) => {
    try {
        const grupos =  await Models.grupo.findAll({});
        console.log({grupos})

        res.render('index', {grupos});
    }
    catch (err){
        console.log(err)
    }

}
//Método para consultar los grupos dependiendo del estado
const getAllGruposByState = async(req, res, next)=>{
    try{
        //Busqueda de los grupos que coinciden con el estado especificado
        const grupos = await Models.grupo.findAll({
            where:{
                estado: req.params.estado
            }
        })
        //console.log({grupos})
        //Renderiza la vista index, sobrecargando el objeto grupos
        res.render('index', {grupos})
    }
    catch (err){
        console.log(err)
    }

}

//Método para crear un grupo mediante el modo manual de la aplicación.
const createGrupoManual = async (req,res)=>{
    const {clave,asignatura,estado} = req.body;
    console.log({clave,asignatura,estado});
    const errors = [];
    //Validación de datos de la vista
    if(!clave || !asignatura){
        errors.push({text: 'Uno o más campos están vacíos.'});
        res.render('grupo/datosgrupo', {errors});
    }
    //Si los datos son valido
    else {
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
}
//Exportación de los métodos para su uso interno en aplicación.
module.exports = {
    getAllGrupos,
    getAllGruposByState,
    createGrupoManual
}
