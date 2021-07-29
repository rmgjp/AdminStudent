'use strict';
const {Deferrable} = require("sequelize");
module.exports = (sequelize, DataTypes) => {

    const alumnoequipo = sequelize.define('alumnoequipo', {
        idequipo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: 'idequipo',
            references: {
                model: 'equipo',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        idalumno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: 'idalumno',
            references: {
                model: 'alumno',
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        }
    },
    {
        freezeTableName: true,
            sequelize
    }
)
    ;

    alumnoequipo.associate = function (models) {
        alumnoequipo.belongsTo(models.alumno,{
            //Información de la tabla a la que pertenece la tabla del modelo actual
            onDelete: 'CASCADE',
            foreignKey: 'idalumno',
            targetKey: 'id'
        });

        alumnoequipo.belongsTo(models.equipo,{
            //Información de la tabla a la que pertenece la tabla del modelo actual
            onDelete: 'CASCADE',
            foreignKey: 'idequipo',
            targetKey: 'id'
        })
    }
    return alumnoequipo;
}