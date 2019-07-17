'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['SETUP', 'REGISTRATION', 'RUNNING', 'SCORING', 'COMPLETE']
    },
    ltId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    startedAt: DataTypes.DATE,
    completedAt: DataTypes.DATE,

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};
