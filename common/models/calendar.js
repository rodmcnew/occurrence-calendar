'use strict';

module.exports = function (Calendar) {
    Calendar.beforeRemote('create', function (ctx, modelInstance, next) {
        ctx.req.body.createdDate = new Date();
        ctx.req.body.modifiedDate = new Date();
        next();
    });

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

            for (let occurrence of occurrences) {
                //Throw error if not in YYYY-MM-DD format.
                if (occurrence.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*$/i) === null) {
                    const error = new Error('Invalid occurrence format');
                    error.status = 400;
                    return cb(error);
                }
            }

            instance.occurrences = occurrences;
            instance.modifiedDate = new Date();
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
            {arg: 'occurrences', type: ['string'], description: 'Occurrences', required: false},
        ],
        returns: {arg: 'data', type: Calendar, root: true},
        http: {verb: 'patch', path: '/:id'}
    });
};
