const users = require('../../model/userSchema');
const bcrypt = require('bcrypt');
let alertMessage = '';

const loginGet = async (req, res) => {
  try {
    if (req.session.user || (req.session.user && req.path === '/')) {          
      res.redirect('/user/home');
    } else {
      // requests from '/user' redirected to '/user/login'.
      if (req.path === '/') {          
        res.redirect('/user/login');        
      } else {
        const logoutAlertMessage = alertMessage;
        alertMessage = '';

        res.render('./user/login', {title: 'USER LOGIN', favicon: '/public/assets/user.svg', logAlertMessage: req.flash('logAlertMessage'), invalidAlertMessage: req.flash('invalidAlertMessage'), loginAgainMessage: req.flash('loginAgainMessage'), logoutAlertMessage});
      }
    }    
  } catch (err) {
    console.log(`Error on login get request. ${err}`);
  }
};

const loginPost = async (req, res) => {
  try {
    const userCredential = await users.findOne({email: req.body.email});
    
    if (!userCredential) {
      req.flash('invalidAlertMessage', 'Invalid Email!');
      res.redirect('/user/login');
    } else {
      if (await bcrypt.compare(req.body.password, userCredential.password)) {
        req.session.user = req.body.email;        
        
        req.flash('logAlertMessage', {color: 'alert-green', message: 'Login Successful!'});
        res.redirect('/user/home');
      } else {
        req.flash('invalidAlertMessage', 'Invalid Password!');
        res.redirect('/user/login');
      }
    }
  } catch (err) {
    console.log(`Error on login post request. ${err}`);
  }
};

const signupGet = async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect('/user/home');
    } else {      
      res.render('./user/signup', {title: 'USER SIGNUP', favicon: '/public/assets/user.svg', invalidAlertMessage: req.flash('invalidAlertMessage')});
    }
  } catch (err) {
    console.log(`Error on signup get request. ${err}`);
  }
};

const signupPost = async (req, res) => {
  try {
    const userCredential = {
      username: req.body.username,
      email: req.body.email,
      // password is hashed using a cost factor of 10.
      password: await bcrypt.hash(req.body.password, 10)
    };

    const usernameRegex = /^(?!.*\s\s)[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailExist = await users.findOne({email: req.body.email});    

    if (req.body.password === '' || req.body.confirmPassword === '' || req.body.email === '' || req.body.username === '') {
      req.flash('invalidAlertMessage', 'All Fields are Required!');
      res.redirect('/user/signup');
    } else if (!usernameRegex.test(req.body.username) || req.body.username.length > 20 || req.body.username.length < 3) {
      req.flash('invalidAlertMessage', 'Username Must be within min[3] - max[20] Characters. Should Contain Only [A-Z] and [a-z]!');
      res.redirect('/user/signup');
    } else if (emailExist) {
      req.flash('invalidAlertMessage', 'Email Already Exists!');
      res.redirect('/user/signup');
    } else if (!emailRegex.test(req.body.email)) {
      req.flash('invalidAlertMessage', 'Enter a Valid Email!');
      res.redirect('/user/signup');
    } else if (!passwordRegex.test(req.body.password || req.body.password.length > 64 || req.body.username.length < 8)) {
      req.flash('invalidAlertMessage', 'Password Must be within min[8] - max[64] Characters. Should Contain At Least One - [A-Z], [a-z], [0-9] and a Special Character!');
      res.redirect('/user/signup');
    } else if (req.body.password !== req.body.confirmPassword) {
      req.flash('invalidAlertMessage', 'Password Mismatch!');
      res.redirect('/user/signup');        
    } else {
      await users.insertMany(userCredential); 

      req.flash('logAlertMessage', {color: 'alert-green', message: 'Signup Successful!'});
      req.flash('loginAgainMessage', 'Please Login Again!');
      res.redirect('/user/login');
    }    
  } catch (err) {
    console.log(`Error on signup post request. ${err}`);
  }
};

const logoutGet = (req, res) => {
  try {    
    req.session.destroy((err) => {
      if (err) {
        console.log(`Error on destroying session. ${err}`);
      } else {
        alertMessage = {color: 'alert-red', message: 'Logout Successful!'};

        res.redirect('/user/login');        
      }
    });
  } catch (err) {
    console.log(`Error on logout get request. ${err}`);
  }
};

module.exports = {
  loginGet,
  loginPost,
  signupGet,
  signupPost,
  logoutGet
};