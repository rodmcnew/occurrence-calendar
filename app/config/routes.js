module.exports = function (app) {

    // Api Routes for Calendar
    var calendar = require('../controller/calendar');
    app.get('/api/calendars/:id', calendar.getPrivate);
    app.get('/api/shared-calendars/:shareKey', calendar.getShared);
    app.post('/api/shared-calendars', calendar.postShared);

    // Api Routes for Day
    var day = require('../controller/day');
    app.put('/api/shared-calendars/:shareKey/:dayId', day.putShared);
    app.put('/api/calendars/:id/:dayId', day.putPrivate);
    app.delete('/api/shared-calendars/:shareKey/:dayId', day.deleteShared);
    app.delete('/api/calendars/:id/:dayId', day.deletePrivate);

    // Api routes for info about the current user
    var user = require('../controller/user');
    app.get('/api/user', user.getCurrent);
};