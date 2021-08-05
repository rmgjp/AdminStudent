const Models = require('../models');



const renderFormReporte = async (req, res) =>{
    const grupos = await Models.grupo.findAll({
        where:{
            estado: 1
        }
    });
    res.render('reporte/formulario-reporte-desercion', {listaFormateada: JSON.stringify(grupos)});
}

const generarReporte = async (req,res)=>{
    const {coordinadorNombre, pronombre, carrera, mensaje, valorTabla} = req.body;
    console.log({coordinadorNombre, pronombre, carrera, mensaje, valorTabla});
    res.render('reporte/vista-previa-reporte-desercion', {coordinadorNombre, pronombre, carrera, mensaje})
}
module.exports={
    renderFormReporte,
    generarReporte
}