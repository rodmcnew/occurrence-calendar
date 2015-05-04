var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    secretConfig = require('./secrets');

app.port = process.env.PORT || 8080;
app.env = process.env.NODE_ENV || 'development';

//@TODO remove this hack that was added because couldn't get heroku ENV working
if (process.env.MONGOHQ_URL) {
    app.env = 'production';
}

var baseUrl = 'http://ocal.rodmcnew.com';
if (app.env == 'development') {
    baseUrl = 'http://local.ocal.rodmcnew.com:8080';
}

// Init dependencies
require('../initializer/mongoose')(
    process.env.MONGOHQ_URL || 'mongodb://localhost/test'
);
require('../initializer/passportFacebook.js')(
    app,
    baseUrl + '/login/facebook/callback',
    secretConfig.facebook.appId,
    secretConfig.facebook.appSecret,
    secretConfig.sessionCookieSecret
);

// Init middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Init router
require('./routes')(app);

// Return configured express app
module.exports = app;