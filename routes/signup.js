var express = require('express');
var router = express.Router();

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
// router.get('/', checkNotLogin, function(req, res, next) {
//   res.send('data');
// });

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
  res.set('Content-Type', 'text/plain');
  res.end('注册成功');
});

module.exports = router;