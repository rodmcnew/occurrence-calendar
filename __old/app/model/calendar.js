var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    shareKey: String,
    days: Array
});

/**
 * Returns the calendar's shareUrl if it has one.
 * @returns {*}
 */
schema.methods.getShareUrl = function () {
    if (this.shareKey) {
        return this._id + '.' + this.shareKey;
    }
    return false;
};

/**
 * Returns a publicly shareable version of the calendar that can be
 * sent to clients.
 *
 * @returns {{shareUrl: *, days: *}}
 */
schema.methods.toPublic = function () {
    return {
        shareUrl: this.getShareUrl(),
        days: this.days
    };
};

var Model = mongoose.model('Calendar', schema);

module.exports = Model;