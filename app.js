// Require dependencies
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

// Setup express app
var app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// Include of sub-module dependencies
module.exports.config = config;
module.exports.app = app;
module.exports.express = express;


// Include route file
routes = require('./routes');

// Start app
app.listen(process.env.PORT || 8080, function () {
        console.log('%s listening at %s', app.name, app.url);
    }
);