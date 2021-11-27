/**
 *
 *
 *
 */
import "graphql-import-node";

import * as typeDefs from "./schema/arbiters.graphql";
import Channels from "./channels";
import Commands from "./commands";
import { Channel } from "./base-types";

import { PubSub, withFilter } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
const { ArbiterSettings } = require("./models");

const ARBITER_SETTINGS_UPDATED = "ARBITER_SETTINGS_UPDATED";
const ARBITER_ACTIVE_COMMANDS_UPDATED = "ARBITER_ACTIVE_COMMANDS_UPDATED";
const ARBITER_CHANNEL_UPDATED = "ARBITER_CHANNEL_UPDATED";

type HandlerType = "onChannelUpdated";

export class Arbiters {
  // Private PUBSUB for Arbiters
  pubsub = new PubSub();

  handlers: {
    onChannelUpdated?: (channel: Channel) => void;
  } = {};

  setHandler = (name: HandlerType, method: any) => {
    this.handlers[name] = method;
  };

  broadcastArbiterCommand = (message: Object) => {
    ArbiterSettings.findAll().then((arbiters: []) => {
      arbiters.forEach((arbiter: { id: string }) => {
        console.log("BROADCAST TO: " + arbiter.id);
        console.log(message);
        this.sendArbiterCommand(arbiter.id, message);
      });
    });
  };

  sendArbiterCommand = (arbiterId: string, message: Object) => {
    const command = {
      arbiterId: arbiterId,
      status: "START",
      message: JSON.stringify(message)
    };
    Commands.add(command);

    this.pubsub.publish(ARBITER_ACTIVE_COMMANDS_UPDATED, {
      arbiterId: command.arbiterId,
      arbiter_active_commands: Commands.findActiveCommands(arbiterId)
    });

    return command;
  };

  getChannelList = () => {
    return Channels.all();
  };

  updateChannelStatus = (arbiterId: string, name: string, status: string) => {
    const channel = Channels.findChannel(arbiterId, name);
    if (channel != null) {
      channel.status = status;
    }
  };

  // GraphQL handlers
  updateArbiterChannel = async (
    root: Object,
    args: {
      arbiterId: string;
      name: string;
      type: string;
      status: string;
      totemId: number;
    }
  ) => {
    const channel: Channel = {
      id: "",
      arbiterId: args.arbiterId,
      name: args.name,
      type: args.type,
      status: args.status,
      totemId: args.totemId
    };

    const currentChannel = Channels.addOrUpdateChannel(channel);

    this.pubsub.publish(ARBITER_CHANNEL_UPDATED, {
      arbiter_channel_updated: currentChannel
    });

    if (this.handlers.onChannelUpdated) {
      this.handlers.onChannelUpdated(currentChannel);
    }

    return currentChannel;
  };

  registerArbiterSettings = async (
    root: Object,
    args: {
      id: string;
    }
  ) => {
    const settings = await ArbiterSettings.findOrCreate({
      where: {
        id: args.id
      },
      defaults: {
        zoneType: "DISABLED"
      }
    });

    // console.warn(settings);

    this.pubsub.publish(ARBITER_SETTINGS_UPDATED, {
      arbiter_settings_updated: settings[0]
    });

    return settings[0];
  };

  updateArbiterSettings = async (
    root: Object,
    args: {
      settings: {
        id: string;
      };
    }
  ) => {
    const updateSettings = args.settings;
    const settings = await ArbiterSettings.findByPk(updateSettings.id);

    for (const key in updateSettings) {
      settings[key] = updateSettings[key];
    }

    await settings.save();

    this.pubsub.publish(ARBITER_SETTINGS_UPDATED, {
      arbiter_settings_updated: settings
    });
    return settings;
  };

  sendArbiterCommandMutation = async (
    root: Object,
    args: { arbiterId: string; message: string }
  ) => {
    const command = {
      arbiterId: args.arbiterId,
      status: "START",
      message: args.message
    };
    Commands.add(command);

    this.pubsub.publish(ARBITER_ACTIVE_COMMANDS_UPDATED, {
      arbiterId: command.arbiterId,
      arbiter_active_commands: Commands.findActiveCommands(args.arbiterId)
    });

    return command;
  };

  respondArbiterCommand = async (
    root: Object,
    args: { id: number; response: string; status: string }
  ) => {
    const command = Commands.find(args.id);
    if (command != null) {
      command.response = args.response;
      command.status = args.status;

      if (command.status == "FAILED") {
        console.warn(command);
      }

      this.pubsub.publish(ARBITER_ACTIVE_COMMANDS_UPDATED, {
        arbiterId: command.arbiterId,
        arbiter_active_commands: Commands.findActiveCommands(command.arbiterId)
      });
    } else {
      console.warn("WARNING: Command not found");
    }

    // We clean up the cache
    Commands.clean();
    return command;
  };

  buildSchema = () => {
    const resolvers = {
      Query: {
        arbiter_settings_list: async () => await ArbiterSettings.findAll(),
        arbiter_settings: async (root: Object, args: { id: string }) =>
          await ArbiterSettings.findByPk(args.id),
        arbiter_active_commands: (root: Object, args: { id: string }) =>
          Commands.findActiveCommands(args.id)
      },

      Mutation: {
        update_arbiter_channel: this.updateArbiterChannel,
        register_arbiter_settings: this.registerArbiterSettings,
        update_arbiter_settings: this.updateArbiterSettings,
        send_arbiter_command: this.sendArbiterCommandMutation,
        respond_arbiter_command: this.respondArbiterCommand
      },

      Subscription: {
        arbiter_settings_updated: {
          subscribe: withFilter(
            () => this.pubsub.asyncIterator(ARBITER_SETTINGS_UPDATED),
            (payload, variables) =>
              payload.arbiter_settings_updated.id === variables.id
          )
        },
        arbiter_active_commands: {
          subscribe: withFilter(
            () => this.pubsub.asyncIterator(ARBITER_ACTIVE_COMMANDS_UPDATED),
            (payload, variables) => payload.arbiterId === variables.id
          )
        }
      }
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    });

    return schema;
  };
}

const arbiters = new Arbiters();
export default arbiters;
