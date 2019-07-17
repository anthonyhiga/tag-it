/********************************************************
 *
 * Overmind - Core Intelligence of the Tag-It System
 *
 ********************************************************/
const { mergeSchemas } = require("graphql-tools");
const { ApolloServer } = require("apollo-server-express");
import arbiters from "./arbiters";
import games from "./games.js";
import http from "http";
import express from "express";

import baseGame from "./base-game.js";

games.cleanUpOldGames();
games.registerGameMachine(baseGame);

/*
 * Setup WebSockets
 */
const PORT = 4000;

const app = express();

const server = new ApolloServer({
  subscriptions: {
    onConnect: () => {
      games.forceSubscriptionUpdate();
    }
  },
  schema: mergeSchemas({
    schemas: [arbiters.schema, games.schema]
  })
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`  Server ready at ${PORT}`);
});
