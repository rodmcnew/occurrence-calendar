calendarRepo = require('../repos/calendarRepo');

exports.postShared = function (req, res) {
   calendarRepo.createShared(function (calendar) {
        if (calendar) {
            // Send only the public properties of the calendar
            res.send(calendar.toPublic());
        } else {
            res.sendStatus(500);
        }
    });
};

exports.getShared = function (req, res) {
    calendarRepo.readShared(
        req.params.shareKey,
        function (calendar) {
            if (calendar) {
                // Send only the public properties of the calendar
                res.send(calendar.toPublic());
            } else {
                res.sendStatus(404);
            }
        }
    )
};

exports.get = function (req, res) {
    if(!req.isAuthenticated() || !req.user.ownsCalendar(req.params.id)){
        res.sendStatus(401);
        return;
    }
    calendarRepo.get(
        req.params.id,
        function (calendar) {
            if (calendar) {
                // Send only the public properties of the calendar
                res.send(calendar.toPublic());
            } else {
                res.sendStatus(404);
            }
        }
    )
};
