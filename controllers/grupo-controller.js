const Models = require('../models');
const fs = require('fs');
const path = require('path');
const config = require('../config/userconfig.json');
const calificacionController = require('./calificacion-controller');
const configuracion = require("../config/userconfig.json");
const alumnoController = require("./alumno-controller");
//const {JSON} = require("sequelize");
let menu;
const visualizacion = 0;

/*Este controlador contiene unicamente métodos relacionados con el manejo
del modelo de datos Grupo*/

//Obtener todos los grupos sin importar otros campos.
/*Utilizado principalmente en la pagina de inicio.*/
const getAllGroups = async (req, res) => {
    return grupos = await Models.grupo.findAll({
        where: {
            estado: [0, 1]
        }
    });
}

//Renderizar todos los grupos
const renderAllGroups = async (req, res) => {
    const estado = 3;
    const grupos = await getAllGroups(req, res).catch((reason => {
        res.render("error", {error: reason});
    }))
    menu = 0;
    res.render('index', {grupos, config, estado, menu});
}

//Actualizar grupo a estado 2 (papelera)
const removeGroup = async (req, res) => {
    const grupo = await getGroupData(req, res);
    await grupo.update({estado: 2});
    req.flash('info_msg', 'El grupo se ha movido a la papelera.')
    res.redirect('/');
}

//Restaurar grupo, pasa de estado 1
const restoreGroup = async (req, res) => {
    let grupo = await getGroupData(req, res);
    await grupo.update({estado: 1});
    req.flash('info_msg', 'El grupo se ha restaurado y su estado cambió a activo.')
    res.redirect('/');
};

//Eliminar completamente el grupo.
const deleteGroup = async (req, res) => {
    //Busqueda del grupo.
    let grupo = await getGroupData(req, res);
    //Busqueda relacion alumnogrupo
    let alumnos = await Models.alumnogrupo.findAll({where: {idgrupo: req.params.idgrupo}});
    //Busqueda de los temas que contiene  ese grupo
    let temas = await Models.tema.findAll({
        where: {idgrupo: req.params.idgrupo}
    });
    for (let tema in temas) {
        //Busqueda de las actividades que corresponden a ese tema/unidad.
        let actividades = await Models.tarea.findAll({
            where: {idtema: temas[tema].id}
        });
        for (let actividad in actividades) {
            //Busqueda de calificaciones correspondientes a esas actividades
            let calificaciones = await Models.calificacion.findAll({
                where: {
                    idtarea: parseInt(actividades[actividad].id)
                }
            });
            //Eliminamos las calificaciones
            for (let calificacion in calificaciones) {
                await calificaciones[calificacion].destroy();
            }
            //Eliminamos las actividades
            await actividades[actividad].destroy();
        }
        //Eliminamos el tema
        await temas[tema].destroy();
    }
    //Eliminamos los alumnos del grupo mediante la relacion alumnogrupo
    for (let alumno in alumnos) {
        await alumnos[alumno].destroy();
    }
    await grupo.destroy();
    req.flash('info_msg', 'El grupo se ha eliminado permanentemente.')
    res.redirect('/filtro/2')
};

//Consultar los grupos dependiendo del estado
const getAllGroupsByState = async (req, res, next) => {
    //Busqueda de los grupos que coinciden con el estado especificado
    const grupos = await Models.grupo.findAll({
        where: {
            estado: req.params.estado
        }
    })
    menu = 0;
    //console.log({grupos})
    //Renderiza la vista index, sobrecargando el objeto grupos
    res.render('index', {grupos, estado: req.params.estado, config, menu})
}

//Obtener todos los datos del grupo.
const getGroupData = async (req, res) => {
    return Models.grupo.findOne({
        where: {
            id: req.params.idgrupo
        }
    });
}

//Renderizar los datos del grupo.
const retriveGroupData = async (req, res) => {
    const temas = await Models.tema.findAll({
        where:{idgrupo: req.params.idgrupo}
    })
    if(!temas || temas.length === 0){
        const grupo = await getGroupData(req, res);
        menu = 1;
        const visualizacion = 0;
        res.render('grupo/vista-inicio-grupo', {asignatura: grupo.dataValues.asignatura, clave: grupo.dataValues.clave ,idgrupo: grupo.dataValues.id, menu, visualizacion});
    }
    else{
        res.redirect("/grupo-inicio/"+ req.params.idgrupo+"/"+temas[0].dataValues.id);
    }
}
const renderGroupDataListStudents = async (req,res)=>{
    const temas = await Models.tema.findAll({
        where:{idgrupo: req.params.idgrupo}
    });
    const grupo = await getGroupData(req, res);
    const alumnos = await Models.alumno.findAll({
        include:[{
            model : Models.alumnogrupo,
            where:{
                idgrupo: req.params.idgrupo
            }
        }]
    });
    menu = 1;
    if(req.params.idtema){
        const tema = await Models.tema.findOne({
            where:{id: req.params.idtema}
        });
        res.render('grupo/vista-inicio-grupo-lista', {asignatura: grupo.dataValues.asignatura, clave: grupo.dataValues.clave, idgrupo: grupo.dataValues.id, temas, tema, menu, visualizacion, alumnos});
    }else{
        res.render('grupo/vista-inicio-grupo-lista', {asignatura: grupo.dataValues.asignatura, clave: grupo.dataValues.clave, idgrupo: grupo.dataValues.id, temas, menu, visualizacion, alumnos});
    }

}
const renderGroupDataListTeams = async (req,res)=>{
    const temas = await Models.tema.findAll({
        where:{idgrupo: req.params.idgrupo}
    });

    const grupo = await getGroupData(req, res);

    const tema = await Models.tema.findOne({
        where:{id: req.params.idtema}
    });
    const equipos = await Models.equipo.findAll({
        include:[{
            model: Models.equipotema,
            where:{
                idtema: tema.id
            }
        }]
    })
    res.render('grupo/vista-inicio-grupo-lista', {asignatura: grupo.dataValues.asignatura, clave: grupo.dataValues.clave, idgrupo: grupo.dataValues.id, temas, tema, menu, visualizacion, equipos});
}
const renderStudentData = async (req,res) =>{
    const temas = await Models.tema.findAll({
        where:{idgrupo: req.params.idgrupo}
    })
    const grupo = await getGroupData(req, res);
    const tema = await Models.tema.findOne({where:{id: req.params.idtema}});
    const alumno = await Models.alumno.findOne({where:{id: req.params.idalumno}});
    menu = 1;
    //Primer oportunidad
    let calificaciones = [];
    let actAprobadas = 0;
    let actReprobadas = 0;
    //Segunda oportunidad
    let calificacionesS2 = [];
    let actAprobadasS2 = 0;
    let actReprobadasS2 = 0;

    const actividades = await Models.tarea.findAll({where:{idtema: req.params.idtema}});
    for(let actividad in actividades){
        const calificacion = await Models.calificacion.findOne({where:{idtarea: actividades[actividad].id, idalumno: alumno.dataValues.id}});
        if(!calificacion){
            actReprobadas++;
            actAprobadasS2++;
            calificaciones.push({
                label: actividades[actividad].nombre,
                value: 0
            })
            calificacionesS2.push({
                label: actividades[actividad].nombre,
                value: 0
            })
        }
        else{
            if(calificacion.valor >= 70){
                actAprobadas++;
            }
            else{
                actReprobadas++;
            }
            calificaciones.push({
                label: actividades[actividad].nombre,
                value: calificacion.valor
            })
            //Conteo Segunda oportunidad
            if(calificacion.valor_s2 != null){
                if(calificacion.valor_s2 >= 70){
                    actAprobadasS2++;
                }
                else{
                    actReprobadasS2++;
                }
            }
            else {
                if(calificacion.valor >= 70){
                    actAprobadasS2++;
                }
                else{
                    actReprobadasS2++;
                }
            }

            calificacionesS2.push({
                label: (calificacion.valor_s2 != null) ? actividades[actividad].nombre + " 2da Oportunidad" : actividades[actividad].nombre,
                value: (calificacion.valor_s2 != null) ? calificacion.valor_s2 : calificacion.valor
            })
        }
    }
    const aprobadasPorcentaje = Math.round((actAprobadas*100)/(actividades.length));
    const aprobadasPorcentajeS2 = Math.round((actAprobadasS2*100)/(actividades.length));

    let dataReprobacion = JSON.stringify([{label:"Aprobadas", value: aprobadasPorcentaje},{label : "No aprobadas", value: (100-aprobadasPorcentaje)}]);
    let dataReprobacionS2 = JSON.stringify([{label:"Aprobadas", value: aprobadasPorcentajeS2},{label : "No aprobadas", value: (100-aprobadasPorcentajeS2)}]);

    res.render('grupo/vista-inicio-grupo-seleccion', {actAprobadas,actReprobadas,actAprobadasS2,actReprobadasS2,dataReprobacionAct: JSON.stringify(calificaciones), dataReprobacion ,dataReprobacionActS2: JSON.stringify(calificacionesS2), dataReprobacionS2 ,idtema: req.params.idtema ,asignatura: grupo.dataValues.asignatura, clave: grupo.dataValues.clave, idgrupo: grupo.dataValues.id,temas, tema, alumno, menu })
}
const renderGroupData = async (req, res) =>{
    const temas = await Models.tema.findAll({
        where:{idgrupo: req.params.idgrupo}
    })

    const tema = await Models.tema.findOne({where:{id: req.params.idtema}});
    const grupo = await getGroupData(req, res);
    const actividades = await Models.tarea.findAll({where:{idtema: req.params.idtema}})

    let calificaciones = JSON.parse(await calificacionController.calcCalif(req,res));
    req.params.modo = 1;
    //Obtencion de la calificación contemplando calificaciones de Segunda oportunidad
    let calificacionesS2 = JSON.parse(await calificacionController.calcCalif(req,res) )
    //Si encuentra una SO -->
    //
    let reprobados = 0;
    let reprobadosS2 = 0;
    //Primer oportunidad
    for(let calificacion in calificaciones){
        if(calificaciones[calificacion].califinal === "NA"){
            reprobados++;
        }
    }
    //Calcular reprobados, contemplando la segunda oportunidad
    calificacionesS2.forEach((element)=>{
        if(element.califinal ==="NA"){
            reprobadosS2++;
        }
    })
    let reprobadosPorcentaje = Math.round((reprobados * 100)/calificaciones.length);
    let aprobadosPorcentaje= 100 - reprobadosPorcentaje;
    let aprobados =  calificaciones.length - reprobados;

    let reprobadosPorcentajeS2 = Math.round((reprobadosS2 * 100)/calificacionesS2.length);
    let aprobadosPorcentajeS2= 100 - reprobadosPorcentajeS2;
    let aprobadosS2 =  calificacionesS2.length - reprobadosS2;

    //Grafica de dona
    let dataReprobacion = [{label:"Aprobados", value: aprobadosPorcentaje},{label : "No aprobados", value: reprobadosPorcentaje}]
    let dataReprobacionS2 = [{label:"Aprobados", value: aprobadosPorcentajeS2},{label : "No aprobados", value: reprobadosPorcentajeS2}]

    let dataReprobacionAct = [];
    let dataReprobacionActS2 = [];

    for(let actividad in actividades){
        let cantReprobados = 0;
        let cantReprobadosS2 = 0;
        let cantAprobadosS2 = 0;
        for(let calificacion in calificaciones){if(calificaciones[calificacion].calificaciones[actividad] < 70 ||calificaciones[calificacion].calificaciones[actividad] === "No capturado."){
                cantReprobados++;
            }
            if(calificaciones[calificacion].calificacionesSegundaOp[actividad] != null ){

                if(calificaciones[calificacion].calificacionesSegundaOp[actividad] < 70){
                    cantReprobadosS2++;
                }
                else{
                    cantAprobadosS2++;
                }

            }
        }

        dataReprobacionActS2.push({label:actividades[actividad].dataValues.nombre, a:cantAprobadosS2,b:cantReprobadosS2})
        dataReprobacionAct.push({label:actividades[actividad].dataValues.nombre, a:calificaciones.length-cantReprobados,b:cantReprobados})
    }
    //Conversión del JSON a String para lectura en script de la vista.
    dataReprobacion = JSON.stringify(dataReprobacion);
    dataReprobacionS2 = JSON.stringify(dataReprobacionS2);
    dataReprobacionAct = JSON.stringify(dataReprobacionAct);
    dataReprobacionActS2 = JSON.stringify(dataReprobacionActS2);

    menu = 1;

    const visualizacion = 0;
    res.render('grupo/vista-inicio-grupo', {dataReprobacionActS2,
        asignatura: grupo.dataValues.asignatura, clave: grupo.dataValues.clave,
        idgrupo: grupo.dataValues.id,temas, dataReprobacion, reprobados,
        aprobados, tema, dataReprobacionAct, menu, visualizacion, reprobadosS2, aprobadosS2,
        dataReprobacionS2
    });
}

//Renderizar los datos del grupo para su edición
const renderGroupEdit = async (req, res) => {
    const grupo = await getGroupData(req, res);

    let listaFormateada = await Models.alumno.findAll({
        include:[{
            model : Models.alumnogrupo,
            where:{
                idgrupo: req.params.idgrupo
            },
        }],
        order:[
            ['nombre', 'ASC']
        ]
    });

    listaFormateada = JSON.stringify(listaFormateada);

    res.render('grupo/datos-grupo-editar', {idgrupo: req.params.idgrupo, grupo, listaFormateada});
}

//Eliminar un grupo si se da click en cancelar mientras se están ingresando los datos
//para su administración en el sistema.
const abortGroup = async (req, res) => {
    await Models.grupo.destroy({
        where: {
            id: req.params.idgrupo
        }
    })
    res.redirect('/')
}

//Crear un grupo mediante el ingreso manual de los datos.
const createGroup = async (req, res) => {
    const file = req.params.archivo;
    const {clave, asignatura, estado, imagen} = req.body;
    const errors = [];
    //Validación de datos de la vista
    if (!clave || !asignatura) {
        errors.push({text: 'Uno o más campos están vacíos.'});
        res.render('grupo/datosgrupo', {errors});
    }
    //Si los datos son valido
    else {
        let grupodata = await Models.grupo.create({
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
        const {id} = grupodata;

        //Renderizado de la vista para agregar alumnos y posteriormente
        //relacionarlos.
        if (!file) {
            res.redirect('/alumno/wizard-agregar-alumnos-manual/' + id + '/0');
        } else {
            res.redirect('/alumno/wizard-agregar-alumnos-manual/' + id + '/0/' + file);
        }
    }
}

//Obtener los datos del grupo mediante un archivo.
const getGroupDataFromFile = async (req, res) => {
    var archivo = req.params.archivo;
    var txtFile = path.join(__dirname, '../public/doc/' + archivo);
    await fs.readFile(txtFile, "binary", (err, data) => {
        if (err) {
            res.redirect('/');
            throw err;
        } else {
            if(data.includes("MATERIA") && data.includes("MAESTRO") && data.includes("GRUPO")&&data.includes("PERIODO") && data.includes("PRE")){
                //data = Buffer.from(data, 'utf-8');
                //Se busca el inicio el cierre de la etiqueta <PRE> para obtener los indices del contenido.
                var inicioPRE = data.indexOf('PRE')
                var finPRE = data.indexOf("/PRE");
                var contenidoPRE = data.substring(inicioPRE, finPRE);
                //Se busca el inicio y el final del contendio de MATERIA haciendo uso de una expresion regular
                var materiaIndex = data.search(/^(MATERIA)\s*:\s?(\w+)\s*((\w+)\s?(\w+)\s?)*/mg, data);
                var materiaLastIndex = data.search("MAESTRO", data) - 1;
                //Se obtiene un subString con los indices encontrados
                var materiaContenido = data.substring(materiaIndex, materiaLastIndex).trim();
                //Se busca el inicio y el final del contendio de GRUPO haciendo uso de una expresion regular
                var grupoIndex = data.search(/\s+(GRUPO)\s*:\s?(\w+)/mg, data);
                var grupoLastIndex = data.search("EXTEN", data) - 1;
                //Se obtiene un subString con los indices encontrados
                var grupoContenido = data.substring(grupoIndex, grupoLastIndex).trim();

                //Se busca el inicio y el final del contendio de PERIODO haciendo uso de una expresion regular
                var periodoIndex = data.search(/\s+(PERIODO)\s*:\s?(\w+)/mg, data);
                var periodoLastIndex = data.search("MATERIA", data) - 1;
                //Se obtiene un subString con los indices encontrados
                var periodoContenido = data.substring(periodoIndex, periodoLastIndex).trim();

                var grupo = grupoContenido.split(":");
                var materia = materiaContenido.split(":");
                var periodo = periodoContenido.split(":");

                var datos = {grupo: grupo[1].trim(), materia: materia[1].trim(), periodo: periodo[1].trim()};

                res.render('grupo/datosgrupo', {datos, archivo});
            }
            else{
                let error = "Archivo no valido: el archivo no contiene información de la materia y lista de alumnos.";
                res.render('grupo/inicio-wizard', {error});
            }
        }
    });
}

//Editar el grupo.
const editGroup = async (req, res) => {
    const {clave, asignatura, estado, imagen} = req.body;
    let grupo = await getGroupData(req, res);
    const alumnosEliminados = JSON.parse(req.body.idAlumnosEliminados);
    const alumnos = JSON.parse(req.body.valorTabla);

    await grupo.update({
        clave: req.body.clave.toUpperCase(),
        asignatura: req.body.asignatura,
        estado: parseInt(estado, 10),
        periodo: req.body.periodo.toUpperCase(),
        img: req.body.imagen,
    });


    for(let alumno in alumnosEliminados){
        req.params.idalumno = alumnosEliminados;
        await alumnoController.disassociateFromGroup(req,res);
    }

    await alumnoController.addToGroup(grupo.dataValues.id,alumnos);

    req.flash('success_msg', "El grupo se editó correctamente.");
    res.redirect('/');
}

const renderGeneralView = async (req,res) => {
    const grupo = await getGroupData(req, res);
    //Contador de alumnos reprobados en primera oportunidad.
    let reprobados = 0;
    //Contador de alumnos reprobados en segunda oportunidad.
    let reprobadosS2 = 0;

    const temas = await Models.tema.findAll({
        where:{idgrupo: req.params.idgrupo}
    })

    const alumnos = await Models.alumno.findAll({
        include:[{
            model : Models.alumnogrupo,
            where:{
                idgrupo: req.params.idgrupo
            }
        }]
    });

    let conteoPorTema = [];
    let conteoPorTemaS2 = [];

    for(let tema in temas){
        conteoPorTema.push(
            {
                id: temas[tema].dataValues.id,
                label:  temas[tema].dataValues.nombre,
                a: 0,
                b: 0
            }
        )
        conteoPorTemaS2.push(
            {
                id: temas[tema].dataValues.id,
                label:  temas[tema].dataValues.nombre,
                a: 0,
                b: 0
            }
        )
    }
    for(let alumno in alumnos){
        let calificaciones = [];
        //Variable que ayuda a identificar si el alumno esta reprobado y añadirlo al conteo de alumnos reprobados
        let reprobado = false;
        //Variable que ayuda a identificar si el alumno esta reprobado y añadirlo al conteo de alumnos reprobados
        //en segunda oportunidad
        let reprobadoS2 = false;

        for (let tema in conteoPorTema) {
            const actividades = await Models.tarea.findAll({where: {idtema: conteoPorTema[tema].id}});
            let califinal = 0;
            let califinalS2 = 0;
            let calcCalificacion;
            let calcCalificacionS2;

            for (let actividad in actividades) {
                let calificacion = await Models.calificacion.findOne({
                    where: {
                        idalumno: alumnos[alumno].dataValues.id,
                        idtarea: actividades[actividad].dataValues.id,
                    }
                });

                if (calificacion != null) {
                    if(calificacion.dataValues.valor_s2 !== null){
                        calcCalificacionS2 = (calificacion.dataValues.valor_s2 * actividades[actividad].valor) / 100;
                    }
                    else{
                        calcCalificacionS2 = (calificacion.dataValues.valor * actividades[actividad].valor) / 100;
                    }
                    calcCalificacion = (calificacion.dataValues.valor * actividades[actividad].valor) / 100;

                    switch (parseInt(configuracion.califi)) {
                        case 0:
                            if (calificacion.dataValues.valor < 70) {
                                califinal = "NA";
                            } else if (calificacion.dataValues.valor >= 70) {
                                if (califinal !== "NA") {
                                    //Calculo de las calificaciones cuando se promedia.
                                    califinal += calcCalificacion;
                                }
                            }

                            if(calificacion.dataValues.valor_s2 < 70){
                                califinalS2 = "NA";
                            }
                            else if (calificacion.dataValues.valor_s2 >= 70) {
                            if (califinalS2 !== "NA") {
                                //Calculo de las calificaciones cuando se promedia.
                                califinalS2 += calcCalificacionS2;
                            }
                        }
                            break;
                        case 1:
                            califinal += calcCalificacion;
                            califinalS2 += calcCalificacionS2;
                            break;
                    }
                }
            }
            if(califinal < 70){
                califinal = 'NA';
                conteoPorTema[tema].b++;
            }
            else {
                conteoPorTema[tema].a++;
            }
            if(califinalS2 < 70){
                califinalS2 = 'NA';
                conteoPorTemaS2[tema].b++;
            }
            else {
                conteoPorTemaS2[tema].a++;
            }
            calificaciones.push({a: califinal, b: califinalS2});


        }

        for(let calificacion in calificaciones){
            if(calificaciones[calificacion].a === 'NA'){
                reprobado = true;
            }
            if(calificaciones[calificacion].b === 'NA'){
                reprobadoS2 = true;
            }
        }
        //reprobados por tema, primer oportunidad
        if(reprobado){
            reprobados++
        }
        //reprobados por tema, segunda oportunidad
        if(reprobadoS2) {
            reprobadosS2++;
        }
    }
    //Calculo de porcentaje de alumnos reprobados y aprobados 1er oportunidad
    let reprobadosPorcentaje = Math.round((reprobados * 100)/alumnos.length);
    let aprobadosPorcentaje= 100 - reprobadosPorcentaje;
    let aprobados =  alumnos.length - reprobados;

    let reprobadosPorcentajeS2 = Math.round((reprobadosS2 * 100)/alumnos.length);
    let aprobadosPorcentajeS2 = 100 - reprobadosPorcentajeS2;
    let aprobadosS2 =  alumnos.length - reprobadosS2;

    const dataReprobacion = JSON.stringify([{label:"Aprobados", value: aprobadosPorcentaje},{label : "No aprobados", value: reprobadosPorcentaje}]);
    const dataReprobacionS2 = JSON.stringify([{label:"Aprobados", value: aprobadosPorcentajeS2},{label : "No aprobados", value: reprobadosPorcentajeS2}]);


    res.render('grupo/vista-inicio-grupo', {dataReprobacion, dataReprobacionS2, temas,
        asignatura: grupo.dataValues.asignatura, clave: grupo.dataValues.clave,
        idgrupo: grupo.dataValues.id, title: 'General',
        menu:1, aprobados, reprobados, aprobadosS2 , reprobadosS2,
        dataReprobacionAct: JSON.stringify(conteoPorTema),
        dataReprobacionActS2: JSON.stringify(conteoPorTemaS2)
    })
}


const renderGeneralViewStudent = async (req, res)=>{
    const grupo = await Models.grupo.findOne({
        where: {id: req.params.idgrupo}
    })

    const alumno = await Models.alumno.findOne({where:{
            id: req.params.idalumno
        }
    });
    const temas = await Models.tema.findAll({
        where:
            {idgrupo: req.params.idgrupo}
    });

    const listaFormateada = await alumnoController.calCalifStudent(temas, alumno);

    //Barra
    let dataReprobacionAct = [];
    let dataReprobacionActS2 = [];

    let unidadReprobada = 0;
    let unidadReprobadaS2 = 0;

    listaFormateada.forEach(element => {
        dataReprobacionActS2.push({label: element.nombre, value: (element.califinal === "NA") ? 0 : element.califinal});
        dataReprobacionAct.push({label: element.nombre, value: (element.califinalPreS2 === "NA") ? 0 : element.califinalPreS2});
    });

    for(let calif in listaFormateada){
        if(listaFormateada[calif].califinal === "NA"){
            unidadReprobadaS2++;
        }
        if(listaFormateada[calif].califinalPreS2 < 70 ){
            unidadReprobada++;
        }
    }
    /**
     * 100 -- no.unidades
     * X ---no.reprobadas**/
    let reprobadasPorcentaje = Math.round(((unidadReprobada*100)/listaFormateada.length));
    let reprobadasPorcentajeS2 = Math.round(((unidadReprobadaS2*100)/listaFormateada.length));

    //Dona

    let dataReprobacion = JSON.stringify([{label:"Aprobados", value: (100-reprobadasPorcentaje)},{label : "No aprobados", value: reprobadasPorcentaje}]);
    let dataReprobacionS2 = JSON.stringify([{label:"Aprobados", value: (100-reprobadasPorcentajeS2)},{label : "No aprobados", value: reprobadasPorcentajeS2}]);


    res.render('grupo/vista-inicio-grupo-seleccion', {title: "Todos",actAprobadas: (listaFormateada.length-unidadReprobada),
        actReprobadas: unidadReprobada,dataReprobacionAct: JSON.stringify(dataReprobacionAct),
        dataReprobacionActS2: JSON.stringify(dataReprobacionActS2),
        dataReprobacion,idtema: req.params.idtema,
        asignatura: grupo.dataValues.asignatura, clave: grupo.dataValues.clave,
        idgrupo: grupo.dataValues.id,temas, alumno, menu, dataReprobacionS2,
        actAprobadasS2: (listaFormateada.length-unidadReprobadaS2),
        actReprobadasS2: unidadReprobadaS2})
}
//Exportación de los métodos para su uso interno en aplicación.
module.exports = {
    renderStudentData,
    renderGroupDataListTeams,
    renderGroupDataListStudents,
    retriveGroupData,
    renderAllGroups,
    removeGroup,
    restoreGroup,
    deleteGroup,
    getAllGroupsByState,
    renderGroupData,
    renderGroupEdit,
    abortGroup,
    createGroup,
    getGroupDataFromFile,
    editGroup,
    renderGeneralView,
    renderGeneralViewStudent
}
