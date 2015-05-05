var User = require('../model/user');

exports.getCurrent = function (req, res) {
    if(!req.isAuthenticated()){
        res.status(401).send({error:'notAuthenticated'});
	return;
    }
    res.send({calendars:req.user.calendars});
};
