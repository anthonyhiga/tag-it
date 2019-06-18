/********************************************************
 *
 * Overmind - Core Intelligence of the Tag-It System
 *
 ********************************************************/
const { makeExecutableSchema } = require('graphql-tools');
const { ApolloServer } = require('apollo-server-express');
const { merge } = require('lodash');
const Sequelize = require('sequelize');
const arbiters = require('./arbiters.js');
const http = require("http");
const express = require("express");
const morgan = require('morgan')

/*
 * Boot up persistence layer
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

arbiters.initialize(sequelize);

/*
 * Setup WebSockets 
 */
const PORT = 4000;

const app = express();
app.use(morgan('combined'))

const schema = makeExecutableSchema({
  typeDefs: [arbiters.typeDefs],
  resolvers: merge(arbiters.resolvers),
});
const server = new ApolloServer({ schema });

server.applyMiddleware({app});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`  Server ready at ${PORT}`);
  console.log(`  Subscriptions server ready at ${PORT}`);
});
