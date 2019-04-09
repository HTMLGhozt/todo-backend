const express = require('express');
const cors = require('cors');

const { isTestEnv } = require('./env.js');

const server = express();

// TODO: correctly configure CORS
const corsOptions = {
  origin: isTestEnv ? '*' : null,
};

server.use(cors(corsOptions));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const routes = require('./api/routes');
routes(server);

module.exports = server;
