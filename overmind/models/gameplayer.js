'use strict';
module.exports = (sequelize, DataTypes) => {
  const GamePlayer = sequelize.define('GamePlayer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    playerId: DataTypes.STRING,
    gameId: DataTypes.INTEGER,
    teamId: DataTypes.INTEGER,
    ltGameId: DataTypes.INTEGER,
    ltPlayerId: DataTypes.INTEGER,
    ltTeamId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  GamePlayer.associate = function(models) {
    // associations can be defined here
  };
  return GamePlayer;
};
