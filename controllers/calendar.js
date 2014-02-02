calendarRepo = require('../repos/calendarRepo');

exports.post = function (req, res, next) {
    calendarRepo.create(function (calenderId) {
        if (calenderId) {
            res.header('Location', '/api/calendars/' + calenderId);
            res.send(302);
        } else {
            res.send(500);
        }
    });
};

exports.get = function (req, res, next) {
    calendarRepo.read(
        req.params.calendarId,
        function (calendar) {
            if (calendar) {
                res.send(publicizeCalendar(calendar));
            } else {
                res.send(404);
            }
        }
    )
};

function publicizeCalendar(calendar) {
    return {id: calendar.id, days: calendar.days};
}