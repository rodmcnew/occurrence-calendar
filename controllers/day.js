calendarRepo = require('../repos/calendarRepo');

exports.list = function (req, res, next) {
    calendarRepo.read(
        req.params.calendarId,
        function (calendar) {
            if (calendar) {
                res.send(calendar.days);
            } else {
                res.sendStatus(404);
            }
        }
    );
};

exports.get = function (req, res, next) {
    calendarRepo.read(
        req.params.calendarId,
        function (calendar) {
            if (calendar && validateDay(req.params.dayId)) {
                if (calendar.days[req.params.dayId]) {
                    res.send(publicizeDay(req.params.dayId, calendar.days[req.params.dayId]))
                } else {
                    res.send(publicizeDay(req.params.dayId, 0));
                }

            } else {
                res.sendStatus(404);
            }
        }
    );
};

exports.put = function (req, res, next) {
    calendarRepo.read(
        req.params.calendarId,
        function (calendar) {
            if (calendar) {
                if (validateDay(req.params.dayId)
                    && validateDayValue(req.params.value)
                    ) {

                    if (req.params.value > 0) {
                        calendar.days[req.params.dayId] = req.params.value;
                    } else {
                        delete calendar.days[req.params.dayId];
                    }
                    calendar.markModified('days');

                    calendar.save(function (err, calendar) {
                        if (err) {
                            console.error(err);
                        }
                        res.send(publicizeDay(req.params.dayId, req.params.value));
                    });
                } else {
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(404);
            }
        }
    );
};

function validateDay(day) {
    var dayParts = day.split('-');
    return dayParts.length == 3
        && isFinite(dayParts[0]) && dayParts[0] >= 2000 && dayParts[0] <= 2100
        && isFinite(dayParts[1]) && dayParts[1] >= 0 && dayParts[1] <= 12
        && isFinite(dayParts[2]) && dayParts[2] >= 1 && dayParts[2] <= 31;
}

function validateDayValue(value) {
    return value >= 0 && value <= 3;
}

function publicizeDay(dayId, value) {
    return {id: dayId, value: value};
}