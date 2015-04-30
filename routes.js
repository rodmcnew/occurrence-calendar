// Get restify app from parent module
app = module.parent.exports.app;
express = module.parent.exports.express;

// Static files


// Api Routes for Calender
var calendarController = require('./controllers/calendar');
app.post('/api/calendars', calendarController.post);
app.get('/api/calendars/:calendarId', calendarController.get);

// Api Routes for Day
var dayController = require('./controllers/day');
app.get('/api/calendars/:calendarId/days', dayController.list);
app.get('/api/calendars/:calendarId/days/:dayId', dayController.get);
app.put('/api/calendars/:calendarId/days/:dayId', dayController.put);