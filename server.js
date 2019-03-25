const server = require('./app');
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.info('Server running on port:' + port);
});
