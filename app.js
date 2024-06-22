require('dotenv').config();
const express = require('express');
const app = express();
const path = require('node:path');
const {v4: uuidv4} = require('uuid');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const connectMongoDB = require('./config/mongoDB');
const nocache = require('nocache');
const flash = require('connect-flash');
const userRouter = require('./router/userRouter');
const adminRouter = require('./router/adminRouter');

// setting the port number on which the app will be running.
const port = process.env.PORT || 5000;

// connecting to mongo database.
connectMongoDB();

// module for flash alert messages.
app.use(flash());

// nocache middleware is used to instruct client to not cache server responses.
app.use(nocache());

// for static file serving.
app.use('/public', express.static(path.join(__dirname, './public'))); 
app.use('/public/assets', express.static(path.join(__dirname, './public/assets'))); 
app.use('/bootstrap/dist/css', express.static(path.join(__dirname, './node_modules/bootstrap/dist/css'))); 
app.use('/bootstrap/dist/js', express.static(path.join(__dirname, './node_modules/bootstrap/dist/js'))); 

// for parsing incoming requests.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// session middleware is created.
app.use(session({
  secret: uuidv4(),
  resave: true,
  saveUninitialized: false
}));
  
// configures layouts.
app.use(expressLayouts);
app.set('layout', './layouts/layout');

// configures template engine.
app.set('view engine', 'ejs');

// middlewares for handling routes in router modules.
app.use('/user', userRouter);
app.use('/admin', adminRouter);   

// deals with main route.
app.get('/', (req, res) => {
  res.redirect('/user/login');
});

// deals with non-specified routes.
app.get('*', (req, res) => {
  res.render('pageNotFound', {title: 'Page not found', favicon: '/public/assets/404.svg'});
});

// setting the app to listen on requests.
app.listen(port, (err) => {
  if (err) {
    console.log(`Error connecting server. ${err}`);
  } else {
    console.log(`Server is running on http://127.0.0.1:${port}/user/login`);
  }
});