'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('GamePlayerScores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        type: Sequelize.INTEGER
      },
      teamId: {
        type: Sequelize.INTEGER
      },
      playerId: {
        type: Sequelize.INTEGER
      },
      totalTagsReceived: {
        type: Sequelize.INTEGER
      },
      totalTagsGiven: {
        type: Sequelize.INTEGER
      },
      survivedTimeSec: {
        type: Sequelize.INTEGER
      },
      zoneTimeSec: {
        type: Sequelize.INTEGER
      },
      ltGameId: {
        type: Sequelize.INTEGER
      },
      ltTeamId: {
        type: Sequelize.INTEGER
      },
      ltPlayerId: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      avatarUrl: {
        type: Sequelize.STRING
      },
      iconUrl: {
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
    return queryInterface.dropTable('GamePlayerScores');
  }
};
