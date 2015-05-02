var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser');

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


App.app.set('views', App.appPath('views'));
App.app.set('view engine', 'jade');
App.app.set('view options', {pretty: App.env === 'development'});

App.app.use(express.static(App.appPath('public')));
App.app.use(bodyParser.json());
App.app.use(bodyParser.urlencoded({extended: true}));

App.require('config/database')(process.env.MONGOHQ_URL || 'mongodb://localhost/test');

App.require('config/routes')(App.app);
//App.require('initializers/passport.js')();
