// Get restify app from parent module

module.exports = function (app) {

    // Api Routes for Calender
    var calendar = App.route('calendar');
    app.get('/api/calendars/:id', calendar.get);
    app.get('/api/shared-calendars/:shareKey', calendar.getShared);
    app.post('/api/shared-calendars', calendar.postShared);

    // Api Routes for Day
    var day = App.route('day');
    app.put('/api/shared-calendars/:shareKey/:dayId', day.putShared);
    app.put('/api/calendars/:id/:dayId', day.put);

    var user = App.route('user');
    app.get('/api/user', user.getCurrent);

    var sessionRoutes = App.route('sessionRoutes');
    app.get('/sign_out', sessionRoutes.destroy);
};