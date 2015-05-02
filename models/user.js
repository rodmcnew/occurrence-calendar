var mongoose = require('mongoose');

var schema = mongoose.Schema({
    facebookId: {type: String, required: true, unique: true},
    calendars: Array
});
schema.methods.ownsCalendar = function (calenderId) {
    for (var i = 0; i < this.calendars.length; ++i) {
        if (calenderId == this.calendars[i].id) {
            return true;
        }
    }
    return false;
};

var Model = mongoose.model('User', schema);

module.exports = Model;