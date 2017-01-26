var request = require('supertest');
var assert = require('assert');
var app = require('../index');
var agent = request.agent(app);
var User = require('../lib/mongo').User;
var sha1 = require('sha1');
var should = require('should');

var testName1 = "testNamePost";
var testName2 = "testName2";
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
  //登出
  // after(function (done) {
  //   agent.get('/signout')
  //     .end(function (err, res) {
  //       if (err)return done(err);
  //       done();
  //     })
  // });
  //删除测试用户
  after(function (done) {
    User.remove({name: {$in: [testName1, testName2]}})
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
      .field({title: "测试文章标题20170126", content: "测试文章内容"})
      .expect(200)
      .end(function (err, res) {
        postID = JSON.parse(res.text)._id;
        if (err)return done(err);
        assert(res.text.match(/author/));
        done();
      })
  });
  it('用户文章', function (done) {
      agent.get('/posts')
        .query({author: testName1})
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          var r = JSON.parse(res.text);
          if (err)return done(err);
          assert(r.posts[0].title.match(/测试文章标题20170126/));
          done();
        })
    }
  );
  //请求单独一篇文章
  describe('请求单独一篇文章', function () {
    it('该文章不存在', function (done) {
      agent.get('/posts/' + postID + "1212")
        .end(function (err, res) {
          if (err)return done(err);
          assert(res.text.match(/该文章不存在/));
          done();
        })
    });
    it('获取文章成功', function (done) {
      agent.get('/posts/' + postID)
        .end(function (err, res) {
          var r = JSON.parse(res.text);
          if (err)return done(err);
          assert(r.post.title.match(/测试文章标题20170126/));
          done();
        })
    })
  });
/*  describe('根据ID获取文章', function () {
    it('该文章不存在', function (done) {
      agent.get('/posts/edit/' + postID + "1")
        .end(function (err, res) {
          if (err)return done(err);
          assert(res.text.match(/该文章不存在/));
          done();
        })
    });
    it('权限不足', function (done) {
      User.create({
        name: testName2,
        password: sha1('123456'),
        avatar: '',
        gender: 'x',
        bio: '简介'
      }).exec().then(function () {
        agent.get('/signout')
          .end(function (err, res) {
            if (err)return done(err);
            agent.post('/signin')
              .type('form')
              .field({name: testName2, password: "123456"})
              .end(function (err, res) {
                if (err)return done(err);
                agent.get('/posts/edit/' + postID)
                  .end(function (err, res) {
                    if (err)return done(err);
                    assert(res.text.match(/权限不足/));
                    done();
                  });
                done();
              });
            done();
          });
        done()
      }).catch(done);
    });
  })*/

});
