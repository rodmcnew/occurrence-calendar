var mongoose = require('mongoose');

//@TODO VALIDATE THAT EMAIL IS EMAIL

var schema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
});

var Model = calendar = mongoose.model('User', schema);

module.exports = Model;