const checkSession = (req, res, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/user/login');
    }
  } catch (err) {
    console.log(`Error checking user session. ${err}`);
  }
};

module.exports = checkSession;