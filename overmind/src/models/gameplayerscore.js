'use strict';
module.exports = (sequelize, DataTypes) => {
  const GamePlayerScore = sequelize.define('GamePlayerScore', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gameId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    totalTagsReceived: DataTypes.INTEGER,
    totalTagsGiven: DataTypes.INTEGER,
    survivedTimeSec: DataTypes.INTEGER,
    zoneTimeSec: DataTypes.INTEGER,
    ltGameId: DataTypes.INTEGER,
    ltTeamId: DataTypes.INTEGER,
    ltPlayerId: DataTypes.INTEGER,
    name: DataTypes.STRING, 
    avatarUrl: DataTypes.STRING, 
    iconUrl: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  GamePlayerScore.associate = function(models) {
    // associations can be defined here
  };
  return GamePlayerScore;
};
