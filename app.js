var app = require('./app/config/application');
app.listen(app.port, function () {
    console.log('Listening on ' + app.port)
});