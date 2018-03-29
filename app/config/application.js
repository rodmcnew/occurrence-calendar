var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.port = process.env.PORT || 8080;
app.env = process.env.NODE_ENV || 'development';

//@TODO remove this hack that was added because couldn't get heroku ENV working
if (process.env.MONGODB_URI) {
    app.env = 'production';
}

// Init dependencies
require('../initializer/mongoose')(
    process.env.MONGODB_URI || 'mongodb://localhost/test'
);

require('../initializer/passportFacebook.js')(
    app,
    process.env.BASE_URL + '/login/facebook/callback',
    process.env.FACEBOOK_APP_ID,
    process.env.FACEBOOK_APP_SECRET,
    process.env.SESSION_COOKIE_SECRET
);

// Init middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Init router
require('./routes')(app);

// Return configured express app
module.exports = app;
