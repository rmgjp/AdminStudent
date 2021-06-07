const Sequelize = require('sequelize');
const Models = require('../models');
const { Op } = require("sequelize");
//Método para obtener todos los grupos sin importar otros campos.
//Utilizado principalmente en la pagina de inicio.
const getAllGrupos = async (req, res) => {
    try {
        const grupos = await Models.grupo.findAll({
            where: {
                estado:[0,1]
            }
        });
        return grupos;
    } catch (err) {
        console.log(err)
    }
}

//Metodo para renderizar todos los grupos
const renderAllGrupos = async (req, res) =>{
    const grupos = await getAllGrupos(req,res);
    res.render('index', {grupos});
}

//Metodo para actualizar grupo a estado 2 (papelera)
const moveraPapelera = async (req,res)=>{
    const grupo = await getDatosGrupo(req,res);
    await grupo.update({estado:2});
    res.redirect('/');
}
//Metodo para restaurar grupo, pasa de estado 1
const restaurarGrupo = async (req,res)=>{
    var grupo = await getDatosGrupo(req,res);
    await grupo.update({estado:1});
    res.redirect('/');
};

const eliminarGrupo = async (req,res)=>{
    //Busqueda del grupo.
    var grupo = await getDatosGrupo(req,res);
    //Busqueda relacion alumnogrupo
    var alumnos = await Models.alumnogrupo.findAll({where:{idgrupo:req.params.idgrupo}});
    //Busqueda de los temas que contiene  ese grupo
    var temas = await Models.tema.findAll({
        where:{idgrupo: req.params.idgrupo}
    });
    for(tema in temas){
        //Busqueda de las actividades que corresponden a ese tema/unidad.
        var actividades = await Models.tarea.findAll({
            where:{idtema: temas[tema].id}
        });
        for(actividad in actividades){
            //Busqueda de calificaciones correspondientes a esas actividades
            var calificaciones = await Models.calificacion.findAll({
                where:{
                    idtarea:parseInt(actividades[actividad].id)
                }
            });
            //Eliminamos las calificaciones
            for(calificacion in calificaciones){
                await calificaciones[calificacion].destroy();
            }
            //Eliminamos las actividades
            await actividades[actividad].destroy();
        }
        //Eliminamos el tema
        await temas[tema].destroy();
    }
    //Eliminamos los alumnos del grupo mediante la relacion alumnogrupo
    for(alumno in alumnos){
        await alumnos[alumno].destroy();
    }
    await grupo.destroy();
    res.redirect('/')

};
//Método para consultar los grupos dependiendo del estado
const getAllGruposByState = async (req, res, next) => {
    try {
        //Busqueda de los grupos que coinciden con el estado especificado
        const grupos = await Models.grupo.findAll({
            where: {
                estado: req.params.estado
            }
        })
        //console.log({grupos})
        //Renderiza la vista index, sobrecargando el objeto grupos
        res.render('index', {grupos, estado:req.params.estado})
    } catch (err) {
        console.log(err)
    }
}
//Metodo para obtener todos los datos del grupo.
const getDatosGrupo = async (req, res) => {
    try {
        const grupo = await Models.grupo.findOne({
            where: {
                id: req.params.idgrupo
            }
        })

        return grupo;
    } catch (err) {
        console.log(err)
    }
}

const renderDatosGrupo = async (req,res) =>{
    const grupo = await getDatosGrupo(req,res);
    res.render('grupo/vista-inicio-grupo', {grupo});
}

const getDatosGrupoEditar = async (req, res) => {
    try {
        const grupo = await getDatosGrupo(req,res);
        res.render('grupo/datos-grupo-editar', {idgrupo: req.params.idgrupo, grupo});
    } catch (err) {
        console.log(err)
    }
}
//Metodo para eliminar un grupo si se da click en cancelar.
const abortarGrupo = async (req, res) => {
    try {
        await Models.grupo.destroy({
            where: {
                id: req.params.idgrupo
            }
        })
        res.redirect('/')
    } catch (err) {
        console.log(err);
    }
}
//Método para crear un grupo mediante el modo manual de la aplicación.
const createGrupoManual = async (req, res) => {
    const {clave, asignatura, estado, imagen} = req.body;
    const errors = [];
    //Validación de datos de la vista
    if (!clave || !asignatura) {
        errors.push({text: 'Uno o más campos están vacíos.'});
        res.render('grupo/datosgrupo', {errors});
    }
    //Si los datos son valido
    else {
        try {
            await Models.grupo.create({
                clave: req.body.clave.toUpperCase(),
                asignatura: req.body.asignatura,
                estado: parseInt(estado, 10),
                periodo: req.body.periodo.toUpperCase(),
                img: req.body.imagen,
            });

            const grupo = await Models.grupo.findOne({
                where: {
                    clave: req.body.clave.toUpperCase()
                }
            });
            const {id} = grupo;
            //console.log({grupo})
            console.log("Id" + id);
            //Renderizado de la vista para agregar alumnos y posteriormente
            //relacionarlos.
            res.redirect('/alumno/wizard-agregar-alumnos-manual/' + id + '/0');
        } catch (err) {
            console.log(err)
        }
    }
}

const editarGrupo = async (req, res) => {
    const {clave, asignatura, estado, imagen} = req.body;
    try {
        var grupo = await getDatosGrupo(req,res);

        await grupo.update({
            clave: req.body.clave.toUpperCase(),
            asignatura: req.body.asignatura,
            estado: parseInt(estado, 10),
            periodo: req.body.periodo.toUpperCase(),
            img: req.body.imagen,
        })
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
}
//Exportación de los métodos para su uso interno en aplicación.
module.exports = {
    renderDatosGrupo,
    renderAllGrupos,
    restaurarGrupo,
    eliminarGrupo,
    moveraPapelera,
    getDatosGrupoEditar,
    editarGrupo,
    abortarGrupo,
    getAllGrupos,
    getDatosGrupo,
    getAllGruposByState,
    createGrupoManual
}
