crypto = require('crypto');

var Calendar = require('../model/calendar');

exports.readShared = function (shareUrl, callback) {
    var urlParts = shareUrl.split('.');
    if (urlParts.length != 2) {
        callback(false);
        return;
    }

    Calendar.findOne(
        {
            _id: urlParts[0],
            shareKey: urlParts[1]
        },
        function (err, calendar) {
            if (!err) {
                callback(calendar);
            } else {
                callback(false);
            }
        }
    );
};

exports.get = function (id, callback) {
    Calendar.findOne(
        {
            _id: id
        },
        function (err, calendar) {
            if (!err) {
                callback(calendar);
            } else {
                callback(false);
            }
        }
    );
};

exports.createShared = function (callback) {
    makeShareKey(function (shareKey) {
        var calendar = new Calendar({shareKey: shareKey});
        calendar.save(function (err, calendar) {
            if (!err) {
                callback(calendar)
            } else {
                callback(false);
            }
        });
    });
};

exports.create = function (callback) {
    var calendar = new Calendar();
    calendar.save(function (err, calendar) {
        if (!err) {
            callback(calendar)
        } else {
            callback(false);
        }
    });
};

/**
 * Make the share key for a calendar.
 *
 * 8 bytes should take 292471208 years to brute force at 1000 tries per second
 * 256^8/1000/60/60/24/365/2=292471208
 *
 * @param callback
 */
function makeShareKey(callback) {
    crypto.randomBytes(
        8,
        function (ex, buf) {
            callback(buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/g, ''));
        }
    );
}
