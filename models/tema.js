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
    //Añadimos atributo idtema en la tabla de tarea
    tema.hasMany(models.tarea,{
      onDelete: 'CASCADE',
      foreignKey:'idtema',
    })

    tema.hasMany(models.equipotema,{
      onDelete: 'CASCADE',
      foreignKey:'idtema',
    })
  };
  return tema;
};