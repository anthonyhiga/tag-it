'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ArbiterSettings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      zoneType: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['DISABLED', 'SUPPLY_ZONE', 'HOSTILE_ZONE', 'CONTESTED_ZONE']
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
    return queryInterface.dropTable('ArbiterSettings');
  }
};
