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

import teamGame from "./games/team-game";

gameManager.cleanUpOldGames();
gameManager.registerGameMachine(teamGame);

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
    schemas: [arbiters.buildSchema(), gameManager.buildSchema()]
  })
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`  Server ready at ${PORT}`);
});
