var mongoose = require('mongoose');

module.exports = function (connectionString) {
    mongoose.connect(connectionString);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Couldn\'t connect to mongo:'));
    db.once('open', function () {
        console.log('Mongoose connected successfully.');
    });
};
