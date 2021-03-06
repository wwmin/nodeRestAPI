var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.end('signup请用post');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  var name = req.fields.name;
  var gender = req.fields.gender;
  var bio = req.fields.bio;
  // var avatar = req.files.avatar.path.split(path.sep).pop();
  var files = req.files;
  var password = req.fields.password;
  var repassword = req.fields.repassword;
  var errorMsg = '';
  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      errorMsg = '名字请限制在 1-10 个字符';
      throw new Error(errorMsg);
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      errorMsg = '性别只能是 m、f 或 x';
      throw new Error(errorMsg);
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      errorMsg = '个人简介请限制在 1-30 个字符';
      throw new Error(errorMsg);
    }
    if (!files.avatar || !files.avatar.name) {
      errorMsg = '缺少头像';
      throw new Error(errorMsg);
    }
    if (password.length < 6) {
      errorMsg = '密码至少 6 个字符';
      throw new Error(errorMsg);
    }
    if (password !== repassword) {
      errorMsg = '两次输入密码不一致';
      throw new Error(errorMsg);
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    // fs.unlink(req.files.avatar.path);
    res.type('text');
    res.status(500);
    res.end(`注册失败：${errorMsg}`);
    // res.send(500,'注册失败')
    return;
  }
  //头像路径
  var avatar = req.files.avatar.path.split(path.sep).pop();
  // 明文密码加密
  password = sha1(password);

  // 待写入数据库的用户信息
  var user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  };
  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0];
      // 将用户信息存入 session
      delete user.password;
      req.session.user = user;
      // 跳转到首页
      res.status(200).type('text');
      res.end('注册成功');
    })
    .catch(function (e) {
      // 注册失败，异步删除上传的头像
      fs.unlink(req.files.avatar.path);
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('E11000 duplicate key')) {
        console.log('用户名已被占用');
        res.status(500).type('text');
        res.end('用户名已被占用');
        // return;
      }
      // next(e);
    });
});

module.exports = router;