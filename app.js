// Require dependencies
config = require('./config');
express = require('express');

// Setup express app
var app = express();
//app.use(express.bodyParser());
//app.use(express.CORS());
app.use(express.static('public'));

// Include of sub-module dependencies
module.exports.config = config;
module.exports.app = app;
module.exports.express = express;


// Include route file
routes = require('./routes');

// Start app
app.listen(process.env.PORT || 1338, function () {
        console.log('%s listening at %s', app.name, app.url);
    }
);