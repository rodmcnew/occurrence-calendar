var mongoose = require('mongoose');

var schema = mongoose.Schema({
    id: String,
    days: mongoose.Schema.Types.Mixed
});

var Model = calendar = mongoose.model('Calendar', schema);

module.exports = Model;