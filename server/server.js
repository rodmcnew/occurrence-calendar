var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());

var config = require('./config');
var mongoose = require('mongoose/');

// Connect to mongo
mongoose.connect(config.db);

// Create mongoose schema/model
var Calender = mongoose.model(
    'Calender', new mongoose.Schema({ key: String, days: Object})
);

// Routes
server.post('/calendars', postCalender);
server.get('/calendars/:auth', getCalender);
server.get('/calendars/:auth/days', getDays);
server.put('/calendars/:auth/days/:day', putDay);

// Test Routs
server.get('/calendars-test-post', postCalender);
server.get('/calendars-test-day-put/:auth', putDayTest);

//Start server
server.listen(8080, '127.0.0.1', function () {
        console.log('%s listening at %s', server.name, server.url);
    }
);

function getCalender(req, res, next) {
    queryDays(
        req.params.auth,
        function (days) {
            if (days) {
                res.send({days: days});
            } else {
                res.send(404);
            }
        }
    )
}

function getDays(req, res, next) {
    queryDays(
        req.params.auth,
        function (days) {
            if (days) {
                res.send(days);
            } else {
                res.send(404);
            }
        }
    );
}

function putDay(req, res, next) {
    queryCalender(
        req.params.auth,
        function (calender) {
            if (calender) {
                if (
                    validateDay(req.day)
                        && validateDayValue(req.value)
                    ) {
                    calender.days[req.day] = req.value;
                    console.log(calender);
                    calender.save(function(a,b){
                        console.log(a,b);
                    });
                    res.send(200);
                } else {
                    res.send(400);
                }
            } else {
                res.send(404);
            }
        }
    );
}

function putDayTest(req, res, next) {
    req.day = '2014-3-1';
    req.value = '1';
    putDay(req, res, next);
}

function postCalender(req, res, next) {
    getNewKey(function (key) {
        var calender = new Calender();
        calender.key = key;
        calender.save(function (err, doc) {
            if (!err) {
                var auth = key + doc._id;
                res.header('Location', '/calendars/' + auth);
                res.send(302);
            } else {
                console.error(err);
                res.send(500);
            }
        });
    });
}

function queryCalender(auth, callback) {
    var key = auth.substr(0, config.keyLength);
    var id = auth.substr(config.keyLength)

    Calender.findById(
        id,
        function (err, calender) {
            if (!err && calender.key == key) {
                if (!calender.days) { //mongoose doesn't story empty objects
                    calender.days = {};
                }
                callback(calender);
            } else {
                callback(false);
            }
        }
    );
}


function queryDays(auth, callback) {
    queryCalender(
        auth,
        function (calender) {
            if (calender) {
                callback(calender.days);
            }
            callback(false);
        }
    )
}

function getNewKey(callback) {
    require('crypto').randomBytes(
        config.keyLength * 8,
        function (ex, buf) {
            callback(
                buf.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
                    .substr(0, config.keyLength)
            );
        }
    );
}

function validateDay(day) {
    var dayParts = day.split('-');
    return dayParts.length == 3
        && isFinite(dayParts[0]) && dayParts[0] >= 2000 && dayParts[0] <= 2100
        && isFinite(dayParts[1]) && dayParts[1] >= 1 && dayParts[1] <= 12
        && isFinite(dayParts[2]) && dayParts[2] >= 1 && dayParts[2] <= 31;
}

function validateDayValue(value) {
    return value >= 1 && value <= 2;
}