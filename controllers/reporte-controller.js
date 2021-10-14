const Models = require('../models');
const configuracion = require('../config/userconfig.json');

const renderFormReporte = async (req, res) => {
    const grupos = await Models.grupo.findAll({
        where: {
            estado: 1
        }
    });
    res.render('reporte/formulario-reporte-desercion', {listaFormateada: JSON.stringify(grupos)});
}

const generarReporte = async (req, res) => {
    const mes = {0: "enero", 1: "febrero", 2: "marzo", 3: "abril",
        4: "mayo", 5: 'junio', 6:'julio', 7:'agosto', 8:'septiembre',
        9: "octubre", 10: 'noviembre', 11: 'diciembre'
    }
    const date = new Date();

    const fecha = `${date.getDate()}/${mes[date.getMonth()]}/${date.getFullYear()}`;
    let {coordinadorNombre, pronombre, carrera, mensaje, valorTabla} = req.body;
    valorTabla = JSON.parse(valorTabla);
    let error;
    if (valorTabla.length === 0) {
        error = 'No se ha seleccionado ningún grupo para incluir en el reporte.';
        const grupos = await Models.grupo.findAll({
            where: {
                estado: 1
            }
        });
        res.render('reporte/formulario-reporte-desercion', {listaFormateada: JSON.stringify(grupos), error});

    } else {

        let reprobacionGrupos = [];
        for(let grupo in valorTabla){
            reprobacionGrupos.push(await calcularReprobacion(valorTabla[grupo].id));
        }

        let indiceMayor = 0;

        for(let indice = 0; indice < reprobacionGrupos.length; indice++){
            if(reprobacionGrupos[indice].temas.length > reprobacionGrupos[indiceMayor].temas.length){
                indiceMayor = indice;
            }
        }

        const temas =  reprobacionGrupos[indiceMayor].temas;

        res.render('reporte/vista-previa-reporte-desercion', {coordinadorNombre, pronombre, carrera, mensaje, fecha,listaFormateada: JSON.stringify(reprobacionGrupos), temas, nombreDocente: configuracion.nombre, cargo: configuracion.grado})
    }

}

const calcularReprobacion = async (idgrupo) => {

    const grupo = await Models.grupo.findOne({
        where: {id: idgrupo}
    })

    const temas = await Models.tema.findAll({
        where: {idgrupo: idgrupo}
    });

    const alumnos = await Models.alumno.findAll({
        include: [{
            model: Models.alumnogrupo,
            where: {
                idgrupo: idgrupo
            }
        }]
    });

    let reprobacionGrupo = {
        clave: grupo.dataValues.clave,
        asignatura: grupo.dataValues.asignatura,
        temas: []
    }

    for (let tema in temas) {
        let contReprobados = 0;
        //verificación si el tema cuenta con actividades calificadas.
        const verificacionTema = await Models.calificacion.findAll({
            include:[
                {
                    model: Models.tarea,
                    where: {
                        idtema: temas[tema].dataValues.id
                    }
                }
            ]
        });
        if(verificacionTema.length > 0){
            for (let alumno in alumnos) {
                const calificacionFinal = await calcularCalfAlumno(alumnos[alumno].id, temas[tema])
                if (calificacionFinal === 'NA') {
                    contReprobados++;
                }
            }
            const indiceReprobacion = Math.round((100*contReprobados)/alumnos.length);
            reprobacionGrupo.temas.push(indiceReprobacion + '%');
        }
        else {
            reprobacionGrupo.temas.push('NC');
        }

    }
    return reprobacionGrupo;
}

const calcularCalfAlumno = async (idalumno, tema) => {

    //Lista de las calificaciones de las unidad.

    const actividades = await Models.tarea.findAll({where: {idtema: tema.dataValues.id}});
    let califinal = 0;
    let calcCalificacion;

    for (let actividad in actividades) {
        let calificacion = await Models.calificacion.findOne({
            where: {
                idalumno: idalumno,
                idtarea: actividades[actividad].dataValues.id,
            }
        });

        if (calificacion != null) {
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
                    break;
                case 1:
                    califinal += calcCalificacion;
                    break;
            }
        }
    }
    if (califinal < 70) {
        califinal = 'NA';
    }
    return califinal;
}
module.exports = {
    renderFormReporte,
    generarReporte
}