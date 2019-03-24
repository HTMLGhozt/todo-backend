const express = require('express');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const routes = require('./api/routes');
routes(server);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.info('Server running on port:' + port);
});
