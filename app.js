const path = require('path');
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const tasksRouter = require('./routers/tasks')
const uploadRouter = require('./routers/uploads')
const registrationRouter = require('./routers/registrationRoutes');
const loginRouter = require('./routers/loginRoutes')
const passport = require('passport')
require('./controllers/authController')(passport);
const app = express();
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: "50mb",extended:true, parameterLimit:50000}));
app.use((req, res, next) => {
    // Set CORS headers so that the React SPA is able to communicate with this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
    next();
});
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/tasks', tasksRouter);
app.use('/upload', uploadRouter);
app.use('/auth', registrationRouter);
app.use('/auth', loginRouter);


module.exports = app;