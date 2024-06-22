const checkSession = (req, res, next) => {
  try {
    if (req.session.admin) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (err) {
    console.log(`Error checking user session. ${err}`);
  }
};

module.exports = checkSession;