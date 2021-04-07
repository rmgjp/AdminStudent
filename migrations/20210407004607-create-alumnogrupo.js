'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alumnogrupo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idalumno: {
        type: Sequelize.INTEGER,
        references:{
          model: 'alumno',
          key:'id'
        }
      },
      idgrupo: {
        type: Sequelize.INTEGER,
        references:{
          model:'grupo',
          key:'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('alumnogrupo');
  }
};