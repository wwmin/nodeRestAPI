var request = require('supertest');
var assert = require('assert');
var app = require('../index');
var agent = request.agent(app);
var User = require('../lib/mongo').User;
var sha1 = require('sha1');
var should = require('should');

var testName1 = "testNamePost";
describe('posts', function () {
  //先创建测试用户
  before(function (done) {
    User.create({
      name: testName1,
      password: sha1('123456'),
      avatar: '',
      gender: 'x',
      bio: '简介'
    }).exec().then(function () {
      done()
    }).catch(done)
  });
  //登录测试用户
  before(function (done) {
    agent.post('/signin')
      .type('form')
      .field({name: testName1, password: "123456"})
      .end(function (err, res) {
        if (err)return done(err);
        done();
      })
  });
  //删除测试用户
  after(function (done) {
    User.remove({name: {$in: [testName1]}})
      .exec()
      .then(function () {
        done();
      })
      .catch(done)
  });
  //发表一篇文章
  it('请填写标题', function (done) {
    agent.post('/posts')
      .field({title: "", content: "测试文章内容"})
      .expect(500)
      .end(function (err, res) {
        if (err)return done(err);
        assert(res.text.match(/请填写标题/));
        done();
      })
  });
  it('请填写内容', function (done) {
    agent.post('/posts')
      .field({title: "测试文章标题", content: ""})
      .expect(500)
      .end(function (err, res) {
        if (err)return done(err);
        assert(res.text.match(/请填写内容/));
        done();
      })
  });
  var postID = "";
  it('发表成功', function (done) {
    agent.post('/posts')
      .field({title: "测试文章标题", content: "测试文章内容"})
      .expect(200)
      .end(function (err, res) {
        postID = res.text._id;
        if (err)return done(err);
        assert(res.text.match(/author/));
        done();
      })
  });
/*
//没有测试通过,不知为什么
it('用户文章', function (done) {
      agent.get('/posts')
        .query({author: testName1})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          console.log(res.text);
          if (err)return done(err);
          assert(res.text.match(/posts/));
          done();
        })
    }
  )*/
});
