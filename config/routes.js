// Get restify app from parent module

module.exports = function (app) {

    // Api Routes for Calender
    var calendarRoutes = App.route('calendar');
    app.post('/api/calendars', calendarRoutes.post);
    app.get('/api/calendars/:calendarId', calendarRoutes.get);

    // Api Routes for Day
    var dayRoutes = App.route('day');
    app.get('/api/calendars/:calendarId/days', dayRoutes.list);
    app.get('/api/calendars/:calendarId/days/:dayId', dayRoutes.get);
    app.put('/api/calendars/:calendarId/days/:dayId', dayRoutes.put);

    var sessionRoutes = App.route('sessionRoutes');
    app.get('/sign_out', sessionRoutes.destroy);
};