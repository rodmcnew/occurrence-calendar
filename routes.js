// Get restify server from parent module
server = module.parent.exports.server;
restify = module.parent.exports.restify;

// Static files (should be served through Amazon S3 instead of Node.JS but too lazy for that now)
server.get('/', restify.serveStatic({
    directory: './public',
    default: 'index.html'
}));
server.get(/\/assets\/?.*/, restify.serveStatic({
    directory: './public/assets'
}));

// Api Routes for Calender
var calendarController = require('./controllers/calendar');
server.post('/api/calendars', calendarController.post);
server.get('/api/calendars/:calendarId', calendarController.get);

// Api Routes for Day
var dayController = require('./controllers/day');
server.get('/api/calendars/:calendarId/days', dayController.list);
server.get('/api/calendars/:calendarId/days/:dayId', dayController.get);
server.put('/api/calendars/:calendarId/days/:dayId', dayController.put);