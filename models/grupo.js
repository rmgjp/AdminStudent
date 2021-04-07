'use strict';
const {Model, DataTypes } = require("sequelize");
class grupo extends Model{}
module.exports = (sequelize) => {
  return sequelize.define('grupo',{
    clave: DataTypes.STRING,
    asignatura: DataTypes.STRING
  },
      {
        freezeTableName: true,
        modelName: 'grupo'
      });
};