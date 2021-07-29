//Requerimos los objetos individuales de Model y DataTypes provenientes de Sequelize
const {Deferrable} = require("sequelize");

//Exportamos el modelo de datos
module.exports = (sequelize, DataTypes) => {
    //Como es una tabla derivada se declara en una constante el modelo de datos
    //de esta manera no solo retornamos el modelo de datos, sino tambien
    //las referencias.
    const equipotema = sequelize.define('equipotema', {
            idequipo: {
                type: DataTypes.INTEGER,
                allowNull: false,
                //Declaramos que es una llave foranea
                foreignKey: 'idequipo',
                //Declaramos la tabla referenciada
                references:{
                    model: 'equipo',
                    key: 'id',
                    //Declaramos que el chequeo de las foreign keys debe ser inmediato
                    deferrable: Deferrable.INITIALLY_IMMEDIATE
                }

            },
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
            }
        },
        //Configuraciones secundarias
        {
            //Declaramos que el nombre de la tabla será el mismo que el modelo de datos
            //de lo contrario se agregará una s al final
            freezeTableName: true,
        }
    );

    //Las siguientes sentencias declaran a nivel modelo las asociaciones entre las tablas
    equipotema.associate = function (models){
        //Se declara que pertenece al modelo alumno
        equipotema.belongsTo(models.equipo,{
            //Información de la tabla a la que pertenece la tabla del modelo actual
            onDelete: 'CASCADE',
            foreignKey: 'idequipo',
            targetKey: 'id'
        })

        equipotema.belongsTo(models.tema,{
            onDelete: 'CASCADE',
            foreignKey: 'idtema',
            targetKey: 'id'
        })
    };

    //Finalmente retornamos el conjunto de instrucciones completo.
    return equipotema;
};