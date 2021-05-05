//Requerimos los objetos individuales de Model y DataTypes provenientes de Sequelize
const {Deferrable} = require("sequelize");

//Exportamos el modelo de datos
module.exports = (sequelize, DataTypes) => {
  //Como es una tabla derivada se declara en una constante el modelo de datos
  //de esta manera no solo retornamos el modelo de datos, sino tambien
  //las referencias.
  const alumnogrupo = sequelize.define('alumnogrupo', {
        idalumno: {
          type: DataTypes.INTEGER,
          allowNull: false,
          //Declaramos que es una llave foranea
          foreignKey: 'idalumno',
          //Declaramos la tabla referenciada
          references:{
            model: 'alumno',
            key: 'id',
            //Declaramos que el chequeo de las foreign keys debe ser inmediato
            deferrable: Deferrable.INITIALLY_IMMEDIATE
          }

        },
        idgrupo:{
          type: DataTypes.INTEGER,
          allowNull: false,
          foreignKey: 'idgrupo',
          references:{
            model: 'grupo',
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE
          }
        }
      },
      //Configuraciones secundarias
      {
        //Declaramos que el nombre de la tabla será el mismo que el modelo de datos
        //de lo contrario se agregará una s al final
        freezeTableName: true,
      }
  );
/*
  //Las siguientes sentencias declaran a nivel modelo las asociaciones entre las tablas
  alumnogrupo.associate = function (models){
    //Se declara que pertenece al modelo alumno
    alumnogrupo.belongsTo(models.alumno,{
      //Información de la tabla a la que pertenece la tabla del modelo actual
      as:'alumno',
      foreignKey: 'idalumno',
      targetKey: 'id'
    })

    alumnogrupo.belongsTo(models.grupo,{
      as:'grupo',
      foreignKey: 'idgrupo',
      targetKey: 'id'
    })
  };*/

  //Finalmente retornamos el conjunto de instrucciones completo.
  return alumnogrupo;
};