const Sequelize = require('sequelize');
const Models = require('../models');
/**
 * Método para obtener los temas por grupo
 * **/
const getTemasByGrupo = async (req,res) =>{
    try{
        //Obtenemos el ID del grupo
        const idgrupo = req.params.idgrupo;
        //Obtenemos los datos del grupo
        const grupo = await Models.grupo.findOne({
            where: {
                id: req.params.idgrupo
            }
        });
        //Se extraen los atributos del grupo
        const {asignatura, clave} = grupo;
        const tema = await Models.tema.findAll({
            where: {
                idgrupo: req.params.idgrupo
            }
        });
        console.log(tema);
        res.render('grupo/vista-grupo-temas', {tema, idgrupo, asignatura, clave});
    }
    catch(err){
        console.log(err);
    }
}
const guardarTema = async (req,res) =>{
    //Obtenemos los valores del formulario para crear un nuevo tema
    const {nombre} = req.body;
    const idgrupo = req.params.idgrupo;
    const errors = [];
    //Verificamos que el atributo no este vacío
    if(!nombre){
        erros.push({text: "El campo está vacío"});
        res.render('tema/tema-nuevo', {errors});
    }
    else{
        try{
            await Models.tema.create({
                idgrupo: idgrupo,
                nombre: req.body.nombre
            })
            res.redirect('/grupo/temas/' + idgrupo);
        }
        catch(err){
            console.log(err);
        }
    }
}
module.exports = {
    getTemasByGrupo,
    guardarTema
}