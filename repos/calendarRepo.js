crypto = require('crypto');

var Calendar = App.model('calendar');

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

function makeShareKey(callback) {
    crypto.randomBytes(
        256 / 8,
        function (ex, buf) {
            callback(buf.toString('base64').replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/g, ''));
        }
    );
}
