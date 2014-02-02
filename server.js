// Require dependencies
config = require('./config');
restify = require('restify');

// Setup restify server
server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.CORS());

// Include of sub-module dependencies
module.exports.config = config;
module.exports.server = server;
module.exports.restify = restify;

// Include route file
routes = require('./routes');

// Start server
server.listen(process.env.PORT || 8080, function () {
        console.log('%s listening at %s', server.name, server.url);
    }
);