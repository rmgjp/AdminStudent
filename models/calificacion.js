'use strict';
const {Deferrable} = require('sequelize')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class calificacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      calificacion.belongsTo(models.tarea,{
        onDelete: 'CASCADE',
        foreignKey: 'idtarea'
      });
      calificacion.belongsTo(models.alumno,{
        onDelete: 'CASCADE',
        foreignKey: 'idalumno'
      });
    }
  };
  calificacion.init({
    idtarea:{
      type: DataTypes.INTEGER,
      allowNull: false,
      //Declaramos que es una llave foranea
      foreignKey: 'idtarea',
      //Declaramos la tabla referenciada
      references: {
        model: 'tarea',
        key: 'id',
        //Declaramos que el chequeo de las foreign keys debe ser inmediato
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    idalumno:{
      type: DataTypes.INTEGER,
      allowNull: false,
      //Declaramos que es una llave foranea
      foreignKey: 'idalumno',
      //Declaramos la tabla referenciada
      references: {
        model: 'alumno',
        key: 'id',
        //Declaramos que el chequeo de las foreign keys debe ser inmediato
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    valor: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'calificacion',
    freezeTableName: true
  });
  return calificacion;
};