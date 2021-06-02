const Sequelize = require('sequelize');
const Models = require('../models');

//Metodo para guardar los alumnos dentro de la tabla/Grid
const guardarDesdeGrid = async (req, res) => {
    var idgrupo = req.params.idGrupo;
    var add = req.params.add;
    //Se obtiene el arreglo alojado en objeto invisible del body correspondiente a la tabla
    if(tryParseJSON(req.body.valorTabla) == false){
        console.log('Alumnos Vacios');
        let errors = []
        errors.push({text: 'No ha registrado ningún alumno, registre al menos uno'})
        res.render('alumno/grid-alumnos', {errors,idgrupo})
    }
    else{
        alumnos = tryParseJSON(req.body.valorTabla)
        console.log("Alumnos leidos: " + alumnos);
        //Ciclo para iterar entre los datos del arreglo Tabla
        console.log('Alumnos con datos');
        for (let alumno in alumnos) {
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
        }
        console.log(idgrupo)
        await agregaraGrupo(idgrupo, alumnos);
        //Llamada del método para asociar la tabla alumno y grupo
        //con la tabla alumnogrupo resultado de una relación muchos a
        //muchos.
        if(add == 0){
            res.redirect('/');
        }
        else{
            res.redirect('/grupo/alumnos/'+idgrupo);
        }
    }
}

function tryParseJSON (jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }
    return false;
};
//Metodo para buscar a un alumno mediante la clave de este
const getAlumnoByClave = async (claveAlumno) =>{
    //Objeto que recibe el resultado de la consulta select, es decir el alumno buscado
    console.log(claveAlumno);
    const alumno = await Models.alumno.findOne({
        where: {
            clave: claveAlumno,
        }
    })

    return alumno;
}

//Metodo para consultar los registros de la tabla alumno
const getAllAlumnos = async (req, res, next) => {
    //Objeto que alojara el arreglo de alumnos recueprado de la base de datos atravez del modelo de datos
    const alumnos = await Models.alumno.findAll({});
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
//metodo para desasociar alumno y borrar calificaciones correspondientes
const desasociarAlumno = async (req,res)=>{
    //Buscar las calificaciones relacionadas al alumno
    var calificaciones = await Models.calificacion.findAll({
        where:{idalumno: req.params.idalumno}
    })
    //Eliminar calificaciones
    for(var calificacion in calificaciones){
        await calificaciones[calificacion].destroy();
    }
    //Busqueda de la asociación de alumno con grupo por medio de la tabla alumnogrupo
    var alumnogrupo = await Models.alumnogrupo.findOne({
        where:{idalumno: req.params.idalumno}
    });
    //Eliminación de la asociación
    await alumnogrupo.destroy();
    res.redirect('/grupo/alumnos/'+req.params.idgrupo);
}
//metodo para actualizar el registro de alumno
const editarAlumno = async (req,res)=>{
    const {clave, apellidos, nombre, correo} = req.body;
    try{
        var alumno = await Models.alumno.findOne({where: {id: req.params.idalumno}})
        await alumno.update({
            clave: clave.toUpperCase(),
            apellidos: apellidos.toUpperCase(),
            nombre: nombre.toUpperCase(),
            correo: correo
        });
        res.redirect('/grupo/alumnos/'+req.params.idgrupo+'/'+ alumno.clave);
    }catch(err){
        console.log(err);
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
            let alumno = await Models.alumno.findAll({
                where: {
                    id: alumnogrupos[punteroAlumno].dataValues.idalumno
                }
            });
            alumnos.push(alumno[0]);
        }
        alumnos.sort(function (a, b) {
            return a.dataValues.apellidos.localeCompare(b.dataValues.apellidos);
        });
        res.render('grupo/vista-grupo-alumnos', {alumnos, idgrupo, asignatura, clave});

    } catch (err) {
        console.log(err);
    }
}
//Método para obtener los alumnos relacionados con X grupo.
const getAlumnoAndAlumnosByGroup = async (req, res) => {
    try {
        //Obtención del id
        const idgrupo = req.params.idgrupo;
        const claveAlumno = req.params.clave;

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
            let alumnoTemp = await Models.alumno.findAll({
                where: {
                    id: alumnogrupos[punteroAlumno].dataValues.idalumno
                }
            });
            alumnos.push(alumnoTemp[0]);
        }

        const alumno = await getAlumnoByClave(claveAlumno);
        res.render('grupo/vista-grupo-alumnos', {alumnos, idgrupo, asignatura, clave, alumno});

    } catch (err) {
        console.log(err);
    }
}
//Exportación de los métodos para su posterior uso dentro del programa
module.exports = {
    desasociarAlumno,
    editarAlumno,
    getAlumnoAndAlumnosByGroup,
    getAlumnoByClave,
    guardarDesdeGrid,
    getAllAlumnos,
    getListAlumnosByGroup
}