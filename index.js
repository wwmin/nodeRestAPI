var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//body-parser 引用方式
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', function (req, res) {
  res.send('hello , express');
});

app.get('/users/:name', function (req, res) {
  res.send('hello, ' + req.params.name);
});

app.get('/:url', function (req, res) {
  console.log(JSON.stringify(req.body));
  res.send(`你访问了:${req.params.url}`);
});
app.listen(3000);