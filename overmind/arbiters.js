const { gql, PubSub, withFilter} = require('apollo-server');
const {ArbiterSettings} = require("./models");

const ARBITER_SETTINGS_UPDATED = 'ARBITER_SETTINGS_UPDATED';

/*
 * Boot up persistence layer
 */
let sequelize = null;
const initialize = (db) => {
  sequelize = db;
}

// Private PUBSUB for Arbiters
const pubsub = new PubSub();

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  enum ArbiterZoneMode {
    DISABLED
    SUPPLY_ZONE
    HOSTILE_ZONE
    CONTESTED_ZONE
  }

  type ArbiterSettings {
    id: ID! 
    zoneType: ArbiterZoneMode!
  }

  type Query {
    arbiter_settings_list: [ArbiterSettings]
    arbiter_settings(id: ID!): ArbiterSettings
  }

  type Subscription {
    arbiter_settings_updated(id: ID!): ArbiterSettings 
  }

  input UpdateArbiterSettings {
    id: ID!
    zoneType: ArbiterZoneMode!
  }

  type Mutation {
    register_arbiter_settings(id: ID!): ArbiterSettings
    update_arbiter_settings(settings: UpdateArbiterSettings): ArbiterSettings 
  }
`;

const resolvers = {
  Query: {
    arbiter_settings_list: async (root, args, context) => {
      return await ArbiterSettings.findAll();
    },
    arbiter_settings: async (root, args, context) => {
      return await ArbiterSettings.findByPk(args.id);
    },
  },

  Mutation: {
    register_arbiter_settings: async (root, args, context) => {
      const settings = await ArbiterSettings
        .findOrCreate({
          where: {
            id: args.id
          },
          defaults: {
            zoneType: 'DISABLED' 
          }
        });

      pubsub.publish(ARBITER_SETTINGS_UPDATED, {
        arbiter_settings_updated: settings[0]
      });

      return settings[0];
    },

    update_arbiter_settings: async (root, args, context) => { 
      const updateSettings = args.settings;
      const settings = await ArbiterSettings.findByPk(updateSettings.id);

      for (key in updateSettings) {
        settings[key] = updateSettings[key]
      }

      const updatedSettings = await settings.save();

      pubsub.publish(ARBITER_SETTINGS_UPDATED, {
        arbiter_settings_updated: settings
      });
      return settings;
    },
  },

  Subscription: {
    arbiter_settings_updated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ARBITER_SETTINGS_UPDATED),
        (payload, variables) => {
          console.log(variables);
          console.log(payload);
          return payload.arbiter_settings_updated.id === variables.id;
        }
      )
    },
  },
};

module.exports = {
  initialize,
  typeDefs,
  resolvers,
};
