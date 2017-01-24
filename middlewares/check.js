module.exports = {
  checkLogin: function (req, res, next) {
    if (!req.session.user) {
      res.set('Content-Type', 'text/plain');
      res.end('checkLogin - 未登录');
      // return res.redirect('/signin');
      console.log('未登录');
      return;
    }
    next();
  },
  checkNotLogin: function (req, res, next) {
    if (req.session.user) {
      // res.set('Content-Type', 'text/plain');
      // res.end('checkNotLogin - 已登录');
      // return res.redirect('back');
      console.log('已登录');
      res.set('Content-Type', 'text/plain');
      res.end('已登录');
      return;
    }
    next();
  }
};
