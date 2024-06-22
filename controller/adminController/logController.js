let alertMessage = '';

const loginGet = (req, res) => {
  try {
    if (req.session.admin) {
      res.redirect('/admin/home');
    } else {
      if (req.path === '/') {
        res.redirect('/admin/home');
      } else {
        const logAlertMessage = alertMessage;
        alertMessage = '';

        res.render('./admin/login', { title: "ADMIN LOGIN", favicon: '/public/assets/admin.svg', invalidAlertMessage: req.flash('invalidAlertMessage'), logAlertMessage});
      }
    }
  } catch (err) {
    console.log(`Error on login get request. ${err}`);
  }
};

const loginPost = (req, res) => {
  try {
    if (req.body.email === process.env.ADMIN_EMAIL && req.body.password === process.env.ADMIN_PASSWORD) {
      req.session.admin = req.body.email;

      req.flash('logAlertMessage', {color: 'alert-green', message: 'Login Successful!'});
      res.redirect('/admin/home');
    } else {
      req.flash('invalidAlertMessage', 'Invalid Email or Password!');
      res.redirect('/admin/login');
    }
  } catch (err) {
    console.log(`Error on login post request. ${err}`);
  }
}

const logoutGet = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(`Error during session destroy. ${err}`);
      } else {
        alertMessage = {color: 'alert-red', message: 'Logout Successful!'};

        res.redirect('/admin/login');
      }
    });
  } catch (err) {
    console.log(`Error on logout get request. ${err}`);
  }
};

module.exports = {
  loginGet,
  loginPost,
  logoutGet
};