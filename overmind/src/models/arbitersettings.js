'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArbiterSettings = sequelize.define('ArbiterSettings', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    zoneType: {
      type: DataTypes.ENUM,
      values: ['DISABLED', 'SUPPLY_ZONE', 'HOSTILE_ZONE', 'CONTESTED_ZONE']
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  ArbiterSettings.associate = function(models) {
    // associations can be defined here
  };
  return ArbiterSettings;
};
