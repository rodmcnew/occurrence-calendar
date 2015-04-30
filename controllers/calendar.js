calendarRepo = require('../repos/calendarRepo');

exports.post = function (req, res, next) {
    calendarRepo.create(function (calenderId) {
        if (calenderId) {
            res.header('Location', '/api/calendars/' + calenderId);
            res.sendStatus(302);
        } else {
            res.sendStatus(500);
        }
    });
};

exports.get = function (req, res, next) {
    calendarRepo.read(
        req.params.calendarId,
        function (calendar) {
            if (calendar) {
                // Send only the public properties of the calendar
                res.send({id: calendar.id, days: calendar.days});
            } else {
                res.sendStatus(404);
            }
        }
    )
};