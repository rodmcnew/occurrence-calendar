calendarRepo = require('../repos/calendarRepo');

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

function validateDay(day) {
    var dayParts = day.split('-');
    return dayParts.length == 3
        && isFinite(dayParts[0]) && dayParts[0] >= 2000 && dayParts[0] <= 2100
        && isFinite(dayParts[1]) && dayParts[1] >= 0 && dayParts[1] <= 12
        && isFinite(dayParts[2]) && dayParts[2] >= 1 && dayParts[2] <= 31;
}

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

function modifyOccurrenceShared(req, res, action) {
    calendarRepo.readShared(
        req.params.shareKey,
        function (calendar) {
            modifyOccurrence(calendar, req.params.dayId, res, action);
        }
    );
}

exports.putShared = function (req, res) {
    modifyOccurrenceShared(req, res, 'put');
};

exports.deleteShared = function (req, res) {
    modifyOccurrenceShared(req, res, 'delete');
};

exports.putPrivate = function (req, res) {
    modifyOccurrencePrivate(req, res, 'put');
};

exports.deletePrivate = function (req, res) {
    modifyOccurrencePrivate(req, res, 'delete');
};