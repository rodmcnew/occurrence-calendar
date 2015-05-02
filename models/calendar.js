var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    shareKey: String,
    days: mongoose.Schema.Types.Mixed
});

schema.methods.getShareUrl = function () {
    if (this.shareKey) {
        return this._id + '.' + this.shareKey;
    }
    return false;
};
schema.methods.getDays = function () {
    if (this.days) {
        return this.days;
    }
    return {};
};
schema.methods.toRest = function () {
    return {
        shareUrl: this.getShareUrl(),
        days: this.getDays()
    };
};
/**
 * @TODO FIND BETTER WAY
 */
schema.methods.ensureHasDays = function () {
    if (!this.days) {
        this.days = {};
    }
};

var Model = mongoose.model('Calendar', schema);

module.exports = Model;