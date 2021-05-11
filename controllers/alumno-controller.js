const Sequelize = require('sequelize');
const Models = require('../models');

//Metodo para guardar los alumnos dentro de la tabla/Grid
const guardarDesdeGrid = async (req, res) => {
    //Se obtiene el arreglo alojado en objeto invisible del body correspondiente a la tabla
    try {
        alumnos = JSON.parse(req.body.valorTabla);

        //Ciclo para iterar entre los datos del arreglo Tabla
        for (let alumno in alumnos) {
            try {
                //Llamado del modelo para buscar el registro
                //si existe el registro no se guarda
                //si no existe el registro se guarda
                //evita duplicados.
                await Models.alumno.findOrCreate(
                    {
                        where: {
                            clave: alumnos[alumno].clave.toUpperCase()
                        },
                        defaults: {
                            clave: alumnos[alumno].clave.toUpperCase(),
                            nombre: alumnos[alumno].nombre.toUpperCase(),
                            apellidos: alumnos[alumno].apellidos.toUpperCase()
                        }
                    });
            } catch (err) {
                console.log(err)
            }

        }
        await agregaraGrupo(req.params.idGrupo, alumnos);
    } catch (error) {
        const errors = []
        errors.push({text: 'No ha registrado ningún alumno, registre al menos uno'})
        res.render('alumno/grid-alumnos', {errors})
    }

    //Llamada del método para asociar la tabla alumno y grupo
    //con la tabla alumnogrupo resultado de una relación muchos a
    //muchos.

    res.redirect('/');
}
//Metodo para consultar los registros de la tabla alumno
const getAllAlumnos = async (req, res, next) => {
    //Objeto que alojara el arreglo de alumnos recueprado de la base de datos atravez del modelo de datos
    const alumnos = await Models.alumno.findAll({});
    console.log(alumnos)
    //res.render('index', {alumnos})
}
/**
 * Sección para metodos de la relación Alumno-Grupo
 */
//Metodo para agregar el id del grupo y id del alumno y relacionar ambas tablas.
const agregaraGrupo = async (idgrupo, alumnos) => {

    for (let alumno in alumnos) {
        try {
            console.log(alumnos[alumno].clave.toUpperCase());
            //Busqueda del alumno para obtener el id interno de la base de datos.
            const findAlumno = await Models.alumno.findOne({
                where: {
                    clave: alumnos[alumno].clave.toUpperCase()
                }
            });
            await Models.alumnogrupo.findOrCreate({
                where: {
                    idalumno: findAlumno.dataValues.id,
                    idgrupo: idgrupo
                },
                defaults: {
                    idalumno: findAlumno.dataValues.id,
                    idgrupo: idgrupo
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

}
//Método para obtener los alumnos relacionados con X grupo.
const getListAlumnosByGroup = async (req, res) => {
    try {
        //Obtención del id
        const idgrupo = req.params.idgrupo;

        //Se obtienen todos los datos del grupo mediante el id
        const grupo = await Models.grupo.findOne({
            where: {
                id: req.params.idgrupo
            }
        });

        //Se separan los datos del grupo
        const {asignatura, clave} = grupo;

        //Se busca la relación de los alumnos.
        const alumnogrupos = await Models.alumnogrupo.findAll({
            where: {
                idgrupo: req.params.idgrupo
            }
        });

        //Se genera un arreglo donde se guardan los alumnos relacionados con el grupo
        let alumnos = [];

        for (punteroAlumno in alumnogrupos){
            const alumno = await Models.alumno.findAll({
                where: {
                    id: alumnogrupos[punteroAlumno].dataValues.idalumno
                }
            });
            alumnos.push(alumno[0]);
        }
        console.log({alumnos});
        res.render('grupo/vista-grupo-alumnos', {alumnos, idgrupo, asignatura, clave});
    } catch (err) {
        console.log(err);
    }

}
//Exportación de los métodos para su posterior uso dentro del programa
module.exports = {
    guardarDesdeGrid,
    getAllAlumnos,
    getListAlumnosByGroup
}