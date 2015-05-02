var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser')

global.App = {
    app: express(),
    port: process.env.PORT || 8080,
    root: path.join(__dirname, '..'),
    appPath: function (path) {
        return this.root + '/' + path;
    },
    require: function (path) {
        return require(this.appPath(path));
    },
    env: process.env.NODE_ENV || 'development',
    start: function () {
        // Start app
        this.app.listen(this.port, function () {
                console.log('Listening on ' + App.port);
            }
        );
    },
    route: function (path) {
        return this.require('routes/' + path);
    },
    model: function (path) {
        return this.require('models/' + path);
    }
};

var secretConfig = App.require('config/secretConfig');
var app = App.app;

app.set('views', App.appPath('views'));
app.set('view engine', 'jade');
app.set('view options', {pretty: App.env === 'development'});

app.use(express.static(App.appPath('public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
App.require('config/database')(process.env.MONGOHQ_URL || 'mongodb://localhost/test');
App.require('initializers/passport.js')(app, secretConfig.facebook, secretConfig.sessionCookieSecret);

App.require('config/routes')(app);