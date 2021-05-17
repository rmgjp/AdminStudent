'use strict';
//Requerimos los objetos individuales de Model y DataTypes provenientes de Sequelize

//Exportamos el modelo de datos
module.exports = (sequelize, DataTypes) => {
  //Retornamos el modelo de datos
  const alumno = sequelize.define('alumno',{
        nombre: DataTypes.STRING,
        apellidos: DataTypes.STRING,
        clave: DataTypes.STRING,
        correo: DataTypes.STRING
      },
      //Configuraciones secundarias
      {
        //Declaramos que el nombre de la tabla será el mismo que el modelo de datos
        //de lo contrario se agregará una s al final
        freezeTableName: true,
        sequelize,
        //Declaramos manialmente el nombre del modelo
      }
  );

  alumno.associate = function (models){
      alumno.belongsToMany(models.grupo, {onDelete: 'CASCADE', through: models.alumnogrupo, foreignKey:'idalumno',otherKey:'idgrupo'});
  }
  return alumno;
};