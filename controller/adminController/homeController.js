const users = require("../../model/userSchema");
const bcrypt = require('bcrypt');

const homeGet = async (req, res) => {
  try {
    // user search 
    const userSearch = req.query.search || '';    
    const userDetails = await users.find({username: {$regex: userSearch, $options: 'i'}});

    if (userDetails.length === 0) {
      req.flash('invalidAlertMessage', 'No user registration details is available!');
    }

    res.render('./admin/home', { title: 'ADMIN HOME', favicon: '/public/assets/admin.svg', logAlertMessage: req.flash('logAlertMessage'), invalidAlertMessage: req.flash('invalidAlertMessage'), userDetails});
  } catch (err) {
    console.log(`Error on home get request. ${err}`);
  }
};

const editUserGet = async (req, res) => {
  try {
    const userID = req.params.id;
    const userData = await users.findById(userID);

    res.render('./admin/editUser', {title: 'EDIT USER', favicon: '/public/assets/admin.svg', invalidAlertMessage: req.flash('invalidAlertMessage'), userData});
  } catch (err) {
    console.log(`Error on edit user get request. ${err}`);
  }
};

const editUserPost = async (req, res) => {
  try {
    const usernameRegex = /^(?!.*\s\s)[A-Za-z]+(?:\s[A-Za-z]+)*$/;

    if (!usernameRegex.test(req.body.editName) || req.body.editName.length > 20 || req.body.editName.length < 3) {
      const userID = req.params.id;

      req.flash('invalidAlertMessage', 'Username Must be within min[3] - max[20] Characters. Should Contain Only [A-Z] and [a-z]!');
      res.redirect(`/admin/edit-user/${userID}`);
    } else {
      const userID = req.params.id;
      const updateStatus = await users.findByIdAndUpdate(userID, {username: req.body.editName});
  
      if (!updateStatus) {
        req.flash('invalidAlertMessage', 'User data not updated. Please try again!');
        res.redirect('/admin/home');
      }
  
      req.flash('invalidAlertMessage', 'User data updated!');
      res.redirect('/admin/home');
    }
  } catch (err) {
    console.log(`Error on edit user post request. ${err}`);
  }
};

const addUserGet = (req, res) => {
  try {
    res.render('./admin/addUser', {title: 'ADD USER', favicon: '/public/assets/admin.svg', invalidAlertMessage: req.flash('invalidAlertMessage')});
  } catch (err) {
    console.log(`Error on add user get request. ${err}`);
  }
};

const addUserPost = async (req, res) => {
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
      res.redirect('/admin/add-user');
    } else if (!usernameRegex.test(req.body.username) || req.body.username.length > 20 || req.body.username.length < 3) {
      req.flash('invalidAlertMessage', 'Username Must be within min[3] - max[20] Characters. Should Contain Only [A-Z] and [a-z]!');
      res.redirect('/admin/add-user');
    } else if (emailExist) {
      req.flash('invalidAlertMessage', 'Email Already Exists!');
      res.redirect('/admin/add-user');
    } else if (!emailRegex.test(req.body.email)) {
      req.flash('invalidAlertMessage', 'Enter a Valid Email!');
      res.redirect('/admin/add-user');
    } else if (!passwordRegex.test(req.body.password || req.body.password.length > 64 || req.body.username.length < 8)) {
      req.flash('invalidAlertMessage', 'Password Must be within min[8] - max[64] Characters. Should Contain At Least One - [A-Z], [a-z], [0-9] and a Special Character!');
      res.redirect('/admin/add-user');
    } else if (req.body.password !== req.body.confirmPassword) {
      req.flash('invalidAlertMessage', 'Password Mismatch!');
      res.redirect('/admin/add-user');        
    } else {
      await users.insertMany(userCredential);  

      req.flash('invalidAlertMessage', 'User Registration is successful!');
      res.redirect('/admin/home');
    }    
  } catch (err) {
    console.log(`Error on add user post request. ${err}`);
  }
};

const deleteUserGet = async (req, res) => {
  try {
    const userID = req.params.id;
    const deleteStatus = await users.findByIdAndDelete(userID);

    if (!deleteStatus) {
      req.flash('invalidAlertMessage', 'User data cannot delete at the moment. Please try again!');
      res.redirect('/admin/home');
    } else {
      req.flash('invalidAlertMessage', 'User deleted!');
      res.redirect('/admin/home');
    }
  } catch (err) {
    console.log(`Error on delete user get request. ${err}`);
  }
};

module.exports = {
  homeGet,
  editUserGet,
  editUserPost,
  deleteUserGet,
  addUserGet,
  addUserPost
};