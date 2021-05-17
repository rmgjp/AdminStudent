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
//Metodo para obtener todos los datos del grupo.
const getDatosGrupo = async (req, res) =>{
    try{
        const grupo = await Models.grupo.findOne({
            where: {
                id:  req.params.idgrupo
            }
        })
        res.render('grupo/vista-inicio-grupo', {grupo});
    }catch (err){
            console.log(err)
    }
}
//Metodo para eliminar un grupo si se da click en cancelar.
const abortarGrupo = async (req, res) =>{
    try{
        await Models.grupo.destroy({
            where:{
                id: req.params.idgrupo
            }
        })
        res.redirect('/')
    }catch (err){
        console.log(err);
    }
}
//Método para crear un grupo mediante el modo manual de la aplicación.
const createGrupoManual = async (req,res)=>{
    const {clave,asignatura,estado,imagen} = req.body;
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
                estado: parseInt(estado,10),
                img: req.body.imagen,
            });

            const grupo = await Models.grupo.findOne({
                where:{
                    clave: req.body.clave.toUpperCase()
                }
            });
            const {id} = grupo;
            //console.log({grupo})
            console.log("Id" + id);
            //Renderizado de la vista para agregar alumnos y posteriormente
            //relacionarlos.
            res.redirect('/alumno/wizard-agregar-alumnos-manual/' + id);
        }
        catch (err){
            console.log(err)
        }
    }
}
//Exportación de los métodos para su uso interno en aplicación.
module.exports = {
    abortarGrupo,
    getAllGrupos,
    getDatosGrupo,
    getAllGruposByState,
    createGrupoManual
}
