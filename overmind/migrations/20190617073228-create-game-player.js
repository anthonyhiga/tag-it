'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('GamePlayers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      playerId: {
        type: Sequelize.STRING
      },
      gameId: {
        type: Sequelize.INTEGER
      },
      teamId: {
        type: Sequelize.INTEGER
      },
      ltGameId: {
        type: Sequelize.INTEGER
      },
      ltPlayerId: {
        type: Sequelize.INTEGER
      },
      ltTeamId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('GamePlayers');
  }
};