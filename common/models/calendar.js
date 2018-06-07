'use strict';

module.exports = function (Calendar) {
    Calendar.findByIdAndAuthorization = function (id, authorization, cb) {
        Calendar.findById(id, function (err, instance) {
            if (instance === null) {
                const error = new Error('Not found');
                error.status = 404;
                return cb(error);
            }
            if (authorization !== instance.authorization) {
                const error = new Error('Invalid authorization');
                error.status = 401;
                return cb(error);
            }
            cb(null, instance);
        });
    };
    Calendar.remoteMethod('findByIdAndAuthorization', {
        description: 'Read a calendar by id',
        accessType: 'READ',
        accepts: [
            {
                arg: 'id', type: 'any', description: 'Model id', required: true,
                http: {source: 'path'}
            },
            {
                arg: 'authorization', type: 'any', description: 'Authorization token', required: true,
                http: {source: 'query'}
            },
        ],
        returns: {arg: 'data', type: Calendar, root: true},
        http: {verb: 'get', path: '/:id'}
    });

    Calendar.patchByIdAndAuthorization = function (id, authorization, occurrences, cb) {
        Calendar.findById(id, function (err, instance) {
            if (instance === null) {
                const error = new Error('Not found');
                error.status = 404;
                return cb(error);
            }
            if (authorization !== instance.authorization) {
                const error = new Error('Invalid authorization');
                error.status = 401;
                return cb(error);
            }
            instance.occurrences = occurrences; //@TODO validate day string formats
            instance.save(function () {
                cb(null, instance);
            });
        });
    };
    Calendar.remoteMethod('patchByIdAndAuthorization', {
        description: 'Update the occurrences on a calendar.',
        accessType: 'WRITE',
        accepts: [
            {
                arg: 'id', type: 'any', description: 'Model id', required: true,
                http: {source: 'path'}
            },
            {
                arg: 'authorization', type: 'any', description: 'Authorization token', required: true,
                http: {source: 'query'}
            },
            {arg: 'occurrences', type: ['strin'], description: 'Occurrences', required: false},
        ],
        returns: {arg: 'data', type: Calendar, root: true},
        http: {verb: 'patch', path: '/:id'}
    });
};
