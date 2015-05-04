module.exports = function (app, fbCallbackUrl, fbAppId, fbAppSecret, sessionCookieSecret) {
    var passport = require('passport'),
        FacebookStrategy = require('passport-facebook');
    var User = require('../model/user');
    var calendarRepo = require('../repos/calendarRepo');

    passport.use('facebook', new FacebookStrategy({
            clientID: fbAppId,
            clientSecret: fbAppSecret,
            callbackURL: fbCallbackUrl
        },

        // facebook will send back the tokens and profile
        function (access_token, refresh_token, profile, done) {
            // asynchronous
            process.nextTick(function () {
                // find the user in the database based on their email
                User.findOne({ 'facebookId': profile.id }, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        calendarRepo.create(function (calendar) {
                            // if there is no user found with that facebook id, create them
                            var newUser = new User({
                                facebookId: profile.id,
                                calendars: [{id:calendar._id,name:'First Calendar'}]
                            });

                            // save our user to the database
                            newUser.save(function (err) {
                                if (err)
                                    throw err;

                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        });
                    }
                });
            });
        }));


    passport.serializeUser(function (user, done) {
        done(null, user.facebookId);
    });
    passport.deserializeUser(function (id, done) {
        User.findOne({facebookId: id}, function (err, user) {
            done(err, user);
        })
    });

    app.use(require('cookie-parser')());
    app.use(require('express-session')({secret: sessionCookieSecret }));
    app.use(passport.initialize());
    app.use(passport.session());

// route for facebook authentication and login
// different scopes while logging in
    app.get('/login/facebook', passport.authenticate('facebook'));

// handle the callback after facebook has authenticated the user
    app.get('/login/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/private-calendars/',
            failureRedirect: '/'
        })
    );
};