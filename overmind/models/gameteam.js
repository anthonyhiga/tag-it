'use strict';
module.exports = (sequelize, DataTypes) => {
  const GameTeam = sequelize.define('GameTeam', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    gameId: DataTypes.INTEGER,
    ltGameId: DataTypes.INTEGER,
    ltPlayerId: DataTypes.INTEGER,
    ltTeamId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  GameTeam.associate = function(models) {
    // associations can be defined here
  };
  return GameTeam;
};
