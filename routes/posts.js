var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', checkLogin, function (req, res, next) {
  var author = req.query.author;
  // var author=req.session.user.name; //可查询登录的用户信息
  PostModel.getPosts(author)
    .then(function (posts) {
      res.type('json');
      res.status(200);
      res.send({
        "posts": posts
      });
    })
    .catch(next);
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  res.end('create 请用POST');
});

// POST /posts 发表一篇文章
router.post('/', checkLogin, function (req, res, next) {
  var author = req.session.user.name;
  var title = req.fields.title;
  var content = req.fields.content;

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    res.status(500).send('error').end();
    // return res.redirect('back');
  }

  var post = {
    author: author,
    title: title,
    content: content,
    pv: 0
  };

  PostModel.create(post)
    .then(function (result) {
      // 此 post 是插入 mongodb 后的值，包含 _id
      post = result.ops[0];
      res.set('Content-Type', 'text/plain');
      res.status(200).end('发表成功');
    })
    .catch(next);
});

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  var postId = req.params.postId;

  Promise.all([
    PostModel.getPostById(postId),// 获取文章信息
    CommentModel.getCommentsCount(postId),//获取该文章所有留言
    PostModel.incPv(postId)// pv 加 1
  ])
    .then(function (result) {
      var post = result[0];
      var comments = result[1];
      if (!post) {
        res.type('text');
        res.status(500);
        res.send('该文章不存在');
        return;
      }
      res.type('json');
      res.status(200);
      res.send({
        post: post,
        comments: comments
      });
    })
    .catch(next);
});

// GET /posts/edit/:postId 根据id获取文章
router.get('/edit/:postId', checkLogin, function (req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user.name;
  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        res.end('该文章不存在');
        return;
      }
      if (author !== post.author) {
        res.end('权限不足');
        return;
      }
      CommentModel.getComments(postId).then(function (comments) {
        res.type('json');
        res.status(200);
        res.send({
          post: post,
          comments: comments
        });
      }).catch(next)
    })
    .catch(next);
});

// POST /posts/edit/:postId 更新一篇文章
router.post('/edit/:postId', checkLogin, function (req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user.name;
  var title = req.fields.title;
  var content = req.fields.content;
  if (!postId || !author || !title || !content) {
    res.end("id or author or title or content ERROR");
    return;
  }
  PostModel.updatePostById(postId, author, {title: title, content: content})
    .then(function () {
      res.type('text');
      res.status(200);
      res.send('编辑文章成功');
    })
    .catch(next);
});

// GET /posts/remove/:postId 删除一篇文章
router.get('/remove/:postId', checkLogin, function (req, res, next) {
  var postId = req.params.postId;
  var author = req.session.user.name;
  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        res.end('该文章不存在');
        return;
      }
      if (author !== post.author) {
        res.end('权限不足');
        return;
      }
      //符合条件,可以删除
      PostModel.delPostById(postId, author)
        .then(function () {
          res.type('text');
          res.status(200);
          res.send('删除文章成功').end();
        })
        .catch(next);
    }).catch(next);

});

// POST /posts/comment/:postId创建一条留言
router.post('/comment/:postId', checkLogin, function (req, res, next) {
  var author = req.session.user.name;
  var postId = req.params.postId;
  var content = req.fields.content;
  PostModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        res.end('该文章不存在');
        return;
      }
      var comment = {
        author: author,
        postId: postId,
        content: content
      };
      CommentModel.create(comment)
        .then(function () {
          res.send("留言成功");
        })
        .catch(next)
    }).catch(next);

});

// GET /posts/comment/:postId/remove/:commentId 删除一条留言
router.get('/comment/:postId/remove/:commentId', checkLogin, function (req, res, next) {
  var commentId = req.params.commentId;
  var author = req.session.user._id;

  CommentModel.delCommentById(commentId, author)
    .then(function () {
      res.end('删除留言成功');
    })
});

module.exports = router;
