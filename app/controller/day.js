calendarRepo = require('../repos/calendarRepo');

/**
 * Put or Delete an occurrence day on the given calendar with the given action
 * then return the appropriate http response.
 *
 * @param {Calendar} calendar the calendar to modify
 * @param {String} dayId the day te to modify in YYYY-MM-DD format
 * @param {Response} res the response object
 * @param {string} action must be either 'put' or 'delete'
 */
function modifyOccurrence(calendar, dayId, res, action) {

    if (!calendar) {
        res.sendStatus(404);
        return;
    }

    if (!validateDay(dayId)) {
        res.sendStatus(400);
        return;
    }

    var index = calendar.days.indexOf(dayId);
    var modified = false;

    if (action == 'put' && index == -1) {
        calendar.days.push(dayId);
        modified = true;
    } else if (action == 'delete' && index != -1) {
        calendar.days.splice(index, 1);
        modified = true;
    }

    // If the db already reflects what the client asked for, just return 200
    if (!modified) {
        res.sendStatus(200);
        return;
    }

    calendar.markModified('days');
    calendar.save(function (err) {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}

/**
 * Returns true if day is in the valid YYYY-MM-DD format
 *
 * @param {String} day the day te to modify in YYYY-MM-DD format
 *
 * @returns {boolean}
 */
function validateDay(day) {
    var dayParts = day.split('-');
    return dayParts.length == 3
        && isFinite(dayParts[0]) && dayParts[0] >= 2000 && dayParts[0] <= 2100
        && isFinite(dayParts[1]) && dayParts[1] >= 0 && dayParts[1] <= 12
        && isFinite(dayParts[2]) && dayParts[2] >= 1 && dayParts[2] <= 31;
}

/**
 * Handle a put or delete for private calendars
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {String} action must be either 'put' or 'delete'
 */
function modifyOccurrencePrivate(req, res, action) {
    if (!req.isAuthenticated() || !req.user.ownsCalendar(req.params.id)) {
        res.sendStatus(401);
        return;
    }
    calendarRepo.get(
        req.params.id,
        function (calendar) {
            modifyOccurrence(calendar, req.params.dayId, res, action);
        }
    );
}

/**
 * Handle a put or delete for public calendars
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {String} action must be either 'put' or 'delete'
 */
function modifyOccurrenceShared(req, res, action) {
    calendarRepo.readShared(
        req.params.shareKey,
        function (calendar) {
            modifyOccurrence(calendar, req.params.dayId, res, action);
        }
    );
}

/**
 * Add an occurrence day to a shared calendar
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
exports.putShared = function (req, res) {
    modifyOccurrenceShared(req, res, 'put');
};

/**
 * Delete an occurrence day from a shared calendar
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
exports.deleteShared = function (req, res) {
    modifyOccurrenceShared(req, res, 'delete');
};

/**
 * Add an occurrence day to a private calendar
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
exports.putPrivate = function (req, res) {
    modifyOccurrencePrivate(req, res, 'put');
};

/**
 * Delete an occurrence day from a private calendar
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
exports.deletePrivate = function (req, res) {
    modifyOccurrencePrivate(req, res, 'delete');
};