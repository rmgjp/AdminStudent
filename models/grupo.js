'use strict';

module.exports = (sequelize, DataTypes) => {
    //Retorno del modelo de datos especificado
  return sequelize.define('grupo',{
      //Cuerpo del modelo de datos
    clave: DataTypes.STRING,
    asignatura: DataTypes.STRING,
          estado: DataTypes.INTEGER,
  },
      {
          //Declaramos que el nombre de la tabla será el mismo que el modelo de datos
          //de lo contrario se agregará una s al final
        freezeTableName: true,
          sequelize,
      });
};