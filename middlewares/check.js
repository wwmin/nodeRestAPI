module.exports = {
  checkLogin: function (req, res, next) {
    if (!req.session.user) {
      res.set('Content-Type', 'text/plain');
      res.end('checkLogin - 未登录');
      // return res.redirect('/signin');
      return;
    }
    next();
  },
  checkNotLogin: function (req, res, next) {
    if (req.session.user) {
      // res.set('Content-Type', 'text/plain');
      // res.end('checkNotLogin - 已登录');
      // return res.redirect('back');
      res.set('Content-Type', 'text/plain');
      res.end('已登录');
      return;
    }
    next();
  }
};
