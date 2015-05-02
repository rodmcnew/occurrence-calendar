// Get restify app from parent module

module.exports = function (app) {

    // Api Routes for Calender
    var calendar = App.route('calendar');
    app.post('/api/calendars', calendar.post);
    app.get('/api/calendars/:calendarId', calendar.get);

    // Api Routes for Day
    var day = App.route('day');
    app.get('/api/calendars/:calendarId/days', day.list);
    app.get('/api/calendars/:calendarId/days/:dayId', day.get);
    app.put('/api/calendars/:calendarId/days/:dayId', day.put);

    var user = App.route('user');
    app.get('/user/create', user.form);
    app.post('/user/create', user.create);

    var sessionRoutes = App.route('sessionRoutes');
    app.get('/sign_out', sessionRoutes.destroy);
};