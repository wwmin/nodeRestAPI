var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');

//中间件思 与 next
app.use(function (req, res, next) {
  console.log('0' + Date.now());
  // next(new Error('我出错了...')); //到此就不会向下传递
  next();
});
app.use(function (req, res, next) {
  console.log('1');
  // res.status(200).end();
  next();
});

app.use('/', indexRouter);
app.use('/users', userRouter);


//body-parser 引用方式
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//错误处理
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('出错了.')
});
app.listen(3000);