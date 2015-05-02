function destroy(req,res) {
    req.logout();
    req.flash('notice', 'You have successfully signed out.');
    res.redirect('/');
}

exports.destroy = destroy;