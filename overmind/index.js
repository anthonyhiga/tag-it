/********************************************************
 *
 * Overmind - Core Intelligence of the Tag-It System
 *
 ********************************************************/
const { mergeSchemas } = require('graphql-tools');
const { ApolloServer } = require('apollo-server-express');
const Sequelize = require('sequelize');
const arbiters = require('./arbiters.js');
const games = require('./games.js');
const buildMachine = require('./base-game.js');
const http = require("http");
const express = require("express");

/*
 * Boot up persistence layer
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

games.initialize(sequelize);
arbiters.initialize(sequelize);

const machine = buildMachine();

/*
 * Setup WebSockets 
 */
const PORT = 4000;

const app = express();

const server = new ApolloServer({
  schema: mergeSchemas({
    schemas: [arbiters.schema, games.schema]
  })
});

server.applyMiddleware({app});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`  Server ready at ${PORT}`);
});
