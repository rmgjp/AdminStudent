'use strict';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('grupo',{
    clave: DataTypes.STRING,
    asignatura: DataTypes.STRING,
          estado: DataTypes.INTEGER,
  },
      {
        freezeTableName: true,
          sequelize,
      });
};