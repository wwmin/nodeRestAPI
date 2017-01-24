var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('signin 需要用post方法');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  var name = req.fields.name;
  var password = req.fields.password;

  UserModel.getUserByName(name)
    .then(function (user) {
      if (!user) {
        res.type('text');
        res.status(500);
        res.end('用户不存在');
        return;
      }
      // 检查密码是否匹配
      if (sha1(password) !== user.password) {
        res.type('text');
        res.status(500);
        res.end('用户名或密码错误');
        return;
      }
      // 用户信息写入 session
      delete user.password;
      req.session.user = user;
      // 跳转到主页
      res.type('text');
      res.status(200);
      res.end('登录成功');
    })
    .catch(next);
});

module.exports = router;