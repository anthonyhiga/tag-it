'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    ltId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    startedAt: DataTypes.DATE,
    completedAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};
