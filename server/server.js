var restify = require('restify');
var server = restify.createServer();
server.use(restify.bodyParser());

var mongoose = require('mongoose/');
var config = require('./config');
db = mongoose.connect(config.db),
    Schema = mongoose.Schema;

// Create a schema for our data
var CalenderSchema = new Schema({
    key: String,
    data: Array
});
// Use the schema to register a model with MongoDb
mongoose.model('Calender', CalenderSchema);
var Calender = mongoose.model('Calender');

// This function is responsible for returning all entries for the Message model
function getCalender(req, res, next) {


    var authParts = req.params.auth.split('.');
    var id = authParts[0];
    var key = authParts[1];

    setCorsHeaders(res);

    Calender.findById(
        id,
        function (err, calender) {
            console.log(calender.key, key);
            if (err) {
                console.error(err);
            } else {
                if (calender && calender.key == key) {
                    res.send(calender.data);
                } else {
                    res.send('not found');
                }
            }
        }
    );
}

function getNewKey(callback) {
    require('crypto').randomBytes(64, function (ex, buf) {
        callback(buf.toString('base64').replace(/[^a-zA-Z0-9]/g,''));
    });
}

function postCalender(req, res, next) {
    setCorsHeaders(res);
    var calender = new Calender();
    calender.data = 'hi';
    getNewKey(function (key) {
        calender.key = key;
        calender.save(function (err, doc) {
            if (err) {
                console.error(err);
            } else {
                var auth = doc._id + '.' + key;
                res.header('Location', '/calendars/' + auth);
                res.send(302);
            }
        });
    });
}

function setCorsHeaders(res) {
    // Resitify currently has a bug which doesn't allow you to set default headers
    // This headers comply with CORS and allow us to server our response to any origin
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
}

// Set up our routes and start the server
server.get('/calendars/:auth', getCalender);
server.get('/calendarspost', postCalender);

server.listen(8080, '127.0.0.1', function () {
    console.log('%s listening at %s', server.name, server.url);
});
