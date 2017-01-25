var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

/* 返回值类型
 res.type('.html');              // => 'text/html'
 res.type('html');               // => 'text/html'
 res.type('json');               // => 'application/json'
 res.type('application/json');   // => 'application/json'
 res.type('png');                // => image/png:
 */
// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  // 清空 session 中用户信息
  req.session.user = null;
  res.type('text');
  res.status(200);
  res.end('signout - 登出成功');
});

module.exports = router;
