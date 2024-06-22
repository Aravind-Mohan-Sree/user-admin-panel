const express = require('express');
const admin = express.Router();
const checkSession = require('../middleware/adminSession');
const logController = require('../controller/adminController/logController');
const homeController = require('../controller/adminController/homeController');

admin.get('/', logController.loginGet);
admin.get('/login', logController.loginGet);
admin.post('/login', logController.loginPost);
admin.get('/home', checkSession, homeController.homeGet);
admin.get('/edit-user/:id', checkSession, homeController.editUserGet);
admin.post('/edit-user/:id', checkSession, homeController.editUserPost);
admin.get('/delete-user/:id', homeController.deleteUserGet);
admin.get('/add-user', checkSession, homeController.addUserGet);
admin.post('/add-user', homeController.addUserPost);
admin.get('/logout', logController.logoutGet);

module.exports = admin;