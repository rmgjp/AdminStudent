'use strict';
const {Deferrable} = require("sequelize");
module.exports = (sequelize, DataTypes) =>{

    const equipo = sequelize.define('equipo',{
        nombre: DataTypes.STRING,
        idtema: {
            type: DataTypes.INTEGER,
            allowNull: false,
            //Declaramos que es una llave foranea
            foreignKey: 'idtema',
            //Declaramos la tabla referenciada
            references: {
                model: 'tema',
                key: 'id',
                //Declaramos que el chequeo de las foreign keys debe ser inmediato
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        }
    },{
        freezeTableName: true,
        sequelize
    });
    equipo.associate = function (models){
        equipo.belongsTo(models.tema,{
            onDelete: 'CASCADE',
            as: 'tema',
            foreignKey:'idtema'
        });
    }
    return equipo;
}