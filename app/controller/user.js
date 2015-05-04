var User = require('../model/user');

exports.getCurrent = function (req, res) {
    if(!req.isAuthenticated()){
        res.sendStatus(401);
    }
    res.send({calendars:req.user.calendars});
};
