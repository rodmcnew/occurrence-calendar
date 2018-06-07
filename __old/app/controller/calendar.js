import calendarRepo from '../repos/calendarRepo';

/**
 * Handle post requests for shared calendars
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
exports.postShared = function (req, res) {
   calendarRepo.createShared(function (calendar) {
        if (calendar) {
            res.send(calendar.toPublic());
        } else {
            res.sendStatus(500);
        }
    });
};

/**
 * Handle get requests for shared calendars
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
exports.getShared = function (req, res) {
    calendarRepo.readShared(
        req.params.shareKey,
        function (calendar) {
            if (calendar) {
                res.send(calendar.toPublic());
            } else {
                res.sendStatus(404);
            }
        }
    )
};

/**
 * Handle get requests for private calendars
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
exports.getPrivate = function (req, res) {
    if(!req.isAuthenticated() || !req.user.ownsCalendar(req.params.id)){
        res.sendStatus(401);
        return;
    }
    calendarRepo.get(
        req.params.id,
        function (calendar) {
            if (calendar) {
                res.send(calendar.toPublic());
            } else {
                res.sendStatus(404);
            }
        }
    )
};
