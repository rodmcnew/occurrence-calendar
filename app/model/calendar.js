var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    shareKey: String,
    days: Array
});

schema.methods.getShareUrl = function () {
    if (this.shareKey) {
        return this._id + '.' + this.shareKey;
    }
    return false;
};
schema.methods.getDays = function () {
    //if (this.days) {
        return this.days;
    //}
    //return [];
};
schema.methods.toPublic = function () {
    return {
        shareUrl: this.getShareUrl(),
        days: this.getDays()
    };
};

var Model = mongoose.model('Calendar', schema);

module.exports = Model;