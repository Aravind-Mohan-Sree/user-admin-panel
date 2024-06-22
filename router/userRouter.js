const express = require('express');
const logController = require('../controller/userController/logController');
const homeController = require('../controller/userController/homeController');
const checkSession = require('../middleware/userSession');
const user = express.Router();

user.get('/', logController.loginGet);
user.get('/login', logController.loginGet);
user.post('/login', logController.loginPost);
user.get('/signup', logController.signupGet);
user.post('/signup', logController.signupPost);
user.get('/home', checkSession, homeController.homeGet);
user.get('/logout', logController.logoutGet);

module.exports = user;
