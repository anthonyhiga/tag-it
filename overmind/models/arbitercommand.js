'use strict';
module.exports = (sequelize, DataTypes) => {
  const ArbiterCommand = sequelize.define('ArbiterCommand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['START', 'COMPLETE', 'FAILED', 'RUNNING']
    },
    message: DataTypes.STRING,
    response: DataTypes.STRING,
    arbiterId: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  ArbiterCommand.associate = function(models) {
    // associations can be defined here
  };
  return ArbiterCommand;
};
