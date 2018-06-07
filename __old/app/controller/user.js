var User = require('../model/user');

/**
 * Handle requests for the current user
 *
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
exports.getCurrent = function (req, res) {
    if(!req.isAuthenticated()){
        res.status(401).send({error:'notAuthenticated'});
	return;
    }
    res.send({calendars:req.user.calendars});
};
