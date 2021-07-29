'use strict';
const {Deferrable} = require("sequelize");
module.exports = (sequelize, DataTypes) =>{

    const equipo = sequelize.define('equipo',{
        nombre: DataTypes.STRING,
        idgrupo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            //Declaramos que es una llave foranea
            foreignKey: 'idgrupo',
            //Declaramos la tabla referenciada
            references: {
                model: 'grupo',
                key: 'id',
                //Declaramos que el chequeo de las foreign keys debe ser inmediato
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        }
    }, {
        freezeTableName: true,
        sequelize
    });
    equipo.associate = function (models){
        equipo.hasMany(models.equipotema, {onDelete: 'CASCADE', hooks:true, foreignKey:'idequipo',});
        equipo.hasMany(models.alumnoequipo, {onDelete: 'CASCADE', hooks:true, foreignKey:'idequipo',});
    }
    return equipo;
}