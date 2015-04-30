var crypto = require('crypto');

exports.encrypt = function (str, algo, key, fromEncoding) {
    // init cipher
    var cipher = crypto.createCipher(algo, key);

    // encrypt and convert to base64Url format
    return exports.base64ToUrlBase64(
        cipher.update(str, fromEncoding, 'base64') + cipher.final('base64')
    );
};

exports.decrypt = function (urlBase64Str, algo, key, toEncoding) {
    //init decipher
    var decipher = crypto.createDecipher(algo, key);

    // convert from base64Url format and decrypt
    return decipher.update(exports.baseUrlBase64ToBase64(urlBase64Str), 'base64', toEncoding)
        + decipher.final(toEncoding);
};

exports.base64ToUrlBase64 = function (base64Str) {
    return base64Str.replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/g, '');
};

exports.baseUrlBase64ToBase64 = function (urlBase64Str) {
    return urlBase64Str.replace(/_/g, '/').replace(/-/g, '+');
};