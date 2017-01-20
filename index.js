var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');


app.use('/', indexRouter);
app.use('/users', userRouter);


//body-parser 引用方式
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(3000);