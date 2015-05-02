crypto = require('crypto');
base64UrlCrypto = require('../bundled_modules/base64UrlCrypto');

cryptoAlgo = process.env.CRYPTO_ALGO || 'aes-256-cbc';
cryptoKey = process.env.CRYPTO_KEY || 'fun-password-here';

var Calendar = App.model('calendar');

exports.read = function (calendarId, callback) {
    var calendarIdParts = calendarId.split('~');
    if (calendarIdParts.length != 2) {
        callback(false);
        return;
    }
    try {
        var mongoId = base64UrlCrypto.decrypt(calendarIdParts[0], cryptoAlgo, cryptoKey, 'hex');
    } catch (e) {
        callback(false);
        return;
    }

    Calendar.findById(
        mongoId,
        function (err, calendar) {
            if (!err && calendar && calendar.id == calendarId) {
                callback(calendar);
            } else {
                callback(false);
            }
        }
    );
};

exports.create = function (callback) {
    makeRandomSecret(function (randomSecret) {
        var calendar = new Calendar({days: {'0-0-0': 0}});
        console.log('saving', calendar);
        calendar.save(function (err, calendar) {
            console.log('save cb called');
            if (!err) {

                var encryptedMongoId = base64UrlCrypto.encrypt(calendar._id.toString(), cryptoAlgo, cryptoKey, 'hex');
                calendar.id = encryptedMongoId + '~' + randomSecret;

                calendar.save(function (err) {
                    if (!err) {
                        callback(calendar.id)
                    } else {
                        console.error(err);
                        callback(false);
                    }
                });
            } else {
                console.error(err);
                callback(false);
            }
        });
    });
};

function makeRandomSecret(callback) {
    crypto.randomBytes(
        256 / 8,
        function (ex, buf) {
            callback(base64UrlCrypto.base64ToUrlBase64(buf.toString('base64')));
        }
    );
}