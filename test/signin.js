var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../index');
var User = require('../lib/mongo').User;
var UserModel = require('../models/users');
var sha1 = require('sha1');

var testName1 = "testName1";
describe('signin', function () {
  var agent = request.agent(app);
  describe('GET /signin', function () {
    it('signin 需要用post方法', function (done) {
      agent.get('/signin')
        .end(function (err, res) {
          if (err)return done(err);
          assert(res.text.match(/signin 需要用post方法/));
          done();
        })
    })
  });
  describe('POST /signin', function () {
    //每个测试实例前添加测试用户
    beforeEach(function (done) {
      User.create({
        name: testName1,
        password: sha1('123456'),
        avatar: '',
        gender: 'x',
        bio: '简介'
      }).exec()
        .then(function () {
          done()
        }).catch(done)
    });
    //先退出登录
    after(function (done) {
      agent.get('/signout')
        .end(function (err, res) {
          if (err)return done(err);
          //保证登出
          done();
        })
    });
    //删除测试用户
    afterEach(function (done) {
      User.remove({name: {$in: [testName1]}})
        .exec()
        .then(function () {
          done();
        })
        .catch(done)
    });
    it('用户不存在', function (done) {
      agent.post('/signin')
        .type('form')
        .field({name: "NOUSER", password: "123456"})
        .end(function (err, res) {
          if (err)return done(err);
          assert(res.text.match(/用户不存在/));
          done();
        })
    });
    it('用户名或密码错误', function (done) {
      agent.post('/signin')
        .type('form')
        .field({name: testName1, password: "aaaaaa"})
        .end(function (err, res) {
          if (err)return done(err);
          assert(res.text.match(/用户名或密码错误/));
          done();
        })
    });
    it('登录成功', function (done) {
      agent.post('/signin')
        .type('form')
        .field({name: testName1, password: "123456"})
        .end(function (err, res) {
          if (err)return done(err);
          assert(res.text.match(/登录成功/));
          done();
        })
    });
    //登出之前先登录
    before(function (done) {
      agent.post('/signin')
        .type('form')
        .field({name: testName1, password: "123456"})
        .end(function (err, res) {
          if (err)return done(err);
          done();
        })
    });
    it('GET /signout 登出成功', function (done) {
      agent.get('/signout')
        .end(function (err, res) {
          if (err)return done(err);
          assert(res.text.match(/登出成功/g));
          done();
        })
    })
  });
});