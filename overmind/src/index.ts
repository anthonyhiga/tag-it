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

import gameSolo from "./games/solo-game";
import game2Team from "./games/2-team-game";
import game3Team from "./games/3-team-game";
import game2HideSeek from "./games/2-hide-seek-game";
import game3HideSeek from "./games/3-hide-seek-game";
import gameOverpowered from "./games/overpowered-game";

gameManager.cleanUpOldGames();
gameManager.registerGameMachine(gameSolo);
gameManager.registerGameMachine(game2Team);
gameManager.registerGameMachine(game3Team);
gameManager.registerGameMachine(game2HideSeek);
gameManager.registerGameMachine(game3HideSeek);
gameManager.registerGameMachine(gameOverpowered);

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

app.use('/', express.static('../../../referee/build'));

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`  Server ready at ${PORT}`);
});
