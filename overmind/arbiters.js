const { gql, PubSub, withFilter} = require('apollo-server');
const {ArbiterSettings} = require("./models");

const ARBITER_SETTINGS_UPDATED = 'ARBITER_SETTINGS_UPDATED';
const ARBITER_ACTIVE_COMMANDS_UPDATED = 'ARBITER_ACTIVE_COMMANDS_UPDATED';

// We build a command cache, because we don't want these to be persistent
const commandCache = [];

function genId() {
    min = Math.ceil(0);
    max = Math.floor(2147483646);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function findActiveCommands(id) {
  return commandCache.filter(
    (command) => (command.status === "START" ||  command.status === "RUNNING")
      && command.arbiterId === id);
}

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
  enum ArbiterCommandStatus {
    START 
    RUNNING 
    COMPLETE 
    FAILED 
  }

  type ArbiterCommand {
    id: ID!
    arbiterId: ID!
    status: ArbiterCommandStatus!
    message: String!
    response: String
  }

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
    arbiter_active_commands(id: ID!): [ArbiterCommand]
  }

  type Subscription {
    arbiter_settings_updated(id: ID!): ArbiterSettings 
    arbiter_active_commands(id: ID!): [ArbiterCommand]
  }

  input UpdateArbiterSettings {
    id: ID!
    zoneType: ArbiterZoneMode!
  }

  type Mutation {
    register_arbiter_settings(id: ID!): ArbiterSettings
    update_arbiter_settings(settings: UpdateArbiterSettings): ArbiterSettings 

    send_arbiter_command(arbiterId: ID!, message: String!): ArbiterCommand
    respond_arbiter_command(id: ID!, response: String, status: ArbiterCommandStatus!): ArbiterCommand
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
    arbiter_active_commands: (root, args, context) => {
      return findActiveCommands(args.id);
    }
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

    send_arbiter_command: async (root, args, context) => {
      const command = {
        id: genId(),
        arbiterId: args.arbiterId,
        status: 'START',
        message: args.message,
      }
      commandCache.push(command);

      pubsub.publish(ARBITER_ACTIVE_COMMANDS_UPDATED, {
        arbiterId: command.arbiterId,
        arbiter_active_commands: findActiveCommands(args.arbiterId) 
      });

      return command;
    },

    respond_arbiter_command: async (root, args, context) => {
      for (command of commandCache) {
        if (command.id == args.id) {
          command.response = args.response;
          command.status = args.status;

          if (command.status == "FAILED") {
            console.warn(command);
          }

          pubsub.publish(ARBITER_ACTIVE_COMMANDS_UPDATED, {
            arbiterId: command.arbiterId,
            arbiter_active_commands: findActiveCommands(command.arbiterId) 
          });

          return command;
        }
      }

      // We clean up the cache
      commandCache = commandCache.filter(
        command => command.status !== "COMPLETE" && command.status != "FAILED");

      return null;
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
    arbiter_active_commands: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(ARBITER_ACTIVE_COMMANDS_UPDATED),
        (payload, variables) => {
          console.log("SUB DATA: ");
          console.log(variables);
          console.log(payload);
          return payload.arbiterId === variables.id;
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
