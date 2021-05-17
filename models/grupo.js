'use strict';

module.exports = (sequelize, DataTypes) => {
    //Retorno del modelo de datos especificado
    const grupo = sequelize.define('grupo',{
            //Cuerpo del modelo de datos
            clave: DataTypes.STRING,
            asignatura: DataTypes.STRING,
            estado: DataTypes.INTEGER,
            img: DataTypes.INTEGER,
            periodo: DataTypes.STRING,
        },
        {
            //Declaramos que el nombre de la tabla será el mismo que el modelo de datos
            //de lo contrario se agregará una s al final
            freezeTableName: true,
            sequelize,
        });
        grupo.asociate = function(models){
            grupo.belongsToMany(models.alumno, {
                onDelete: 'CASCADE',
                through: models.alumnogrupo,
                foreignKey:'idgrupo',
                otherKey: 'idalumno'
            });
        }
    return grupo;
};