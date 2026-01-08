// Checks if user is authenticated
function checkAuthentication(req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    // res.sendStatus(401);

    // Redirect to login page if user isn't authenticated
    res.redirect("/login");
  }
}

module.exports = checkAuthentication;
