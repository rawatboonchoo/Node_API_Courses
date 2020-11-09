const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passort = require('passport')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const blogsRouter = require('./routes/blogs');

//middlewares
const errorHandler = require('./middlewares/errorHandler');
const passwortjwt = require('./middlewares/passport_jwt')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//user passwort and init
app.use(passort.initialize())

app.use('/', indexRouter);
app.use('/api/users', usersRouter); //localhost:3000/api/users
app.use('/api/blogs',passwortjwt.isLogin, blogsRouter); //localhost:3000/api/blogs

app.use(errorHandler);

module.exports = app;
