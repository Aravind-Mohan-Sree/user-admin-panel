const users = require('../../model/userSchema');

const homeGet = async (req, res) => {
  try {
    const userFound = await users.findOne({email: req.session.user});

    if (userFound) {
      res.render('./user/home', {title: 'USER HOME', favicon: '/public/assets/user.svg', username: req.flash('username'), logAlertMessage: req.flash('logAlertMessage'), username: userFound.username});
    } else {
      req.session.destroy((err) => {
        if (err) {
          console.log(`Error on destroying session. ${err}`);
        } else {
          res.redirect('/user/login');        
        }
      });
    }
  } catch (err) {
    console.log(`Error on home get request. ${err}`);
  }
};

module.exports = {
  homeGet
};