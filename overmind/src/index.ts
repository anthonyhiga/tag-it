/********************************************************
 *
 * Overmind - Core Intelligence of the Tag-It System
 *
 ********************************************************/
const { mergeSchemas } = require("graphql-tools");
const { ApolloServer } = require("apollo-server-express");
import arbiters from "./arbiters";
import gameManager from "./game-manager";
import http from "http";
import express from "express";

import baseGame from "./base-game";

gameManager.cleanUpOldGames();
gameManager.registerGameMachine(baseGame);

/*
 * Setup WebSockets
 */
const PORT = 4000;

const app = express();

const server = new ApolloServer({
  subscriptions: {
    onConnect: () => {
      gameManager.forceSubscriptionUpdate();
    }
  },
  schema: mergeSchemas({
    schemas: [arbiters.buildSchema(), gameManager.schema]
  })
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`  Server ready at ${PORT}`);
});
