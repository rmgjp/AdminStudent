'use strict';
const {Deferrable} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const tema = sequelize.define('tema',{
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
    },
    numerotema:{
      type: DataTypes.INTEGER,
      allowNull: false
    },

    nombre:{
      type: DataTypes.STRING,
      allowNull: false
    }

  },{
    freezeTableName: true,
    sequelize,
  });

  tema.associate= function(models){
    tema.belongsTo(models.grupo,{
      onDelete: 'CASCADE',
      as: 'grupo',
      foreignKey:'idgrupo',
      targetKey:'id'
    })
  };
  return tema;
};