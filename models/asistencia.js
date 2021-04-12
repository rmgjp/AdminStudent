'use strict';
const {Deferrable} = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  const asistencia = sequelize.define('asistencia',{
    idalumnogrupo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //Declaramos que es una llave foranea
      foreignKey: 'idalumnogrupo',
      //Declaramos la tabla referenciada
      references: {
        model: 'alumnogrupo',
        key: 'id',
        //Declaramos que el chequeo de las foreign keys debe ser inmediato
        deferrable: Deferrable.INITIALLY_IMMEDIATE
      }
    },
    fecha: DataTypes.DATE
  },{
    freezeTableName: true,
    sequelize,
  });
  asistencia.associate = function(models){
    asistencia.belongsTo(models.alumnogrupo,{
      as: 'alumnogrupo',
      foreignKey:'idalumnogrupo',
      targetKey:'id'
    });
  };
  return asistencia;
};