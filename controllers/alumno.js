const Sequelize = require('sequelize');
const Models = require('../models');
//Metodo para guardar los alumnos dentro de la tabla/Grid
const guardarDesdeGrid = async (req,res)=>{
    //Se obtiene el arreglo alojado en objeto invisible del body correspondiente a la tabla
    const tabla = JSON.parse(req.body.valorTabla);
    //console.log(tabla);
    //Ciclo para iterar entre los datos del arreglo Tabla
    for(let i = 0; i<tabla.length; i++){
        try {
            //Llamado del modelo para buscar el registro
            //si existe el registro no se guarda
            //si no existe el registro se guarda
            //evita duplicados.
            await Models.alumno.findOrCreate(
                {
                    where: {
                        clave:tabla[i].clave.toUpperCase()
                    },
                    defaults:{
                        clave:tabla[i].clave.toUpperCase(),
                        nombre: tabla[i].nombre.toUpperCase(),
                        apellidos: tabla[i].apellidos.toUpperCase()
                    }
            })
        }
        catch (err){
            console.log(err)
        }
    }
    //Llamada del método para asociar la tabla alumno y grupo
    //con la tabla alumnogrupo resultado de una relación muchos a
    //muchos.
    await agregaraGrupo(req.params.idGrupo, tabla);
    res.redirect('/');
}
//Metodo para consultar los registros de la tabla alumno
const getAllAlumnos = async (req, res, next) => {
    //Objeto que alojara el arreglo de alumnos recueprado de la base de datos atravez del modelo de datos
    const alumnos =  await Models.alumno.findAll({});
    console.log(alumnos)
    //res.render('index', {alumnos})
}
/**
 * Sección para metodos de la relación Alumno-Grupo
 */
//Metodo para agregar el id del grupo y id del alumno y relacionar ambas tablas.
const agregaraGrupo = async (idgrupo, tabla)=>{
    for(let i = 0; i<tabla.length; i++){
        try{
                //Busqueda del alumno para obtener el id interno de la base de datos.
                const alumno = await Models.alumno.findOne({clave: tabla[i].clave.toUpperCase()});
                await Models.alumnogrupo.create({
                    idalumno: alumno.dataValues.id,
                    idgrupo: idgrupo,
                })
        }
        catch (err){
            console.log(err);
        }
    }
}
//Exportación de los métodos para su posterior uso dentro del programa
module.exports = {
    guardarDesdeGrid,
    getAllAlumnos
}