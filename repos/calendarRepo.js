config = require('../config');

mongoose = require('mongoose/');
crypto = require('crypto');
base64UrlCrypto = require('../bundled_modules/base64UrlCrypto');

// Connect to mongo
mongoose.connect(process.env.MONGOHQ_URL || config.db);

// Create mongoose schema/model
Schema = mongoose.Schema;
Calendar = mongoose.model(
    'Calendar', new Schema({id: String, days: Schema.Types.Mixed})
);

cryptoAlgo = process.env.CRYPTO_ALGO || config.crypto.algo;
cryptoKey = process.env.CRYPTO_KEY || config.crypto.key;

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
        var calendar = new Calendar();
        calendar.days = {'0-0-0': 0};
        calendar.save(function (err, calendar) {
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
        config.randomSecretBytes,
        function (ex, buf) {
            callback(base64UrlCrypto.base64ToUrlBase64(buf.toString('base64')));
        }
    );
}