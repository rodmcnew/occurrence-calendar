//exports.form = function (req, res) {
//    res.render('user/create');
//};

var User = require('../model/user');

exports.getCurrent = function (req, res) {
    if(!req.isAuthenticated()){
        res.send(401);
    }
    res.send({calendars:req.user.calendars});
};