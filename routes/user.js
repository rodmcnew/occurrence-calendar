exports.form = function (req, res) {
    res.render('user/create');
};

var User = App.model('user');

exports.create = function (req, res) {
    var user = new User({email:req.body.email,password:req.body.password});
    user.save(function(err){
        if(err){
            res.status(422).send('invalid'); //@TODO handle this
        }else{
            res.status(200).send('account created');
        }
    })
};