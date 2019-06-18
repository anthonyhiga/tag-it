'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ArbiterCommands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['START', 'COMPLETE', 'FAILED', 'RUNNING']
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING
      },
      response: {
        allowNull: false,
        type: Sequelize.STRING
      },
      arbiterId: {
        allowNull: false,
        type: Sequelize.STRING
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ArbiterCommands');
  }
};
