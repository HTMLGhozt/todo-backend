const express = require('express');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const routes = require('./api/routes');
routes(server);

module.exports = server;
