'use strict';
const {Deferrable} = require("sequelize");
module.exports = (sequelize, DataTypes) => {

  const tarea = sequelize.define('tarea',{
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
    },
    nombre: DataTypes.STRING,
    valor: DataTypes.INTEGER,
    tipo: DataTypes.INTEGER
  },
      {
        freezeTableName: true,
        sequelize,
      });
  tarea.associate = function (models){
    tarea.belongsTo(models.tema,{
      as: 'tema',
      foreignKey:'idtema',
      targetKey:'id'
    })
  };
  return tarea;
};