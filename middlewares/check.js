module.exports = {
  checkLogin: function (req, res, next) {
    if (!req.session.user) {
      return res.send('未登录');
      // return res.redirect('/signin');
    }
    next();
  },
  checkNotLogin: function (req, res, next) {
    if (req.session.user) {
      return res.send('已登录');
      // return res.redirect('back');
    }
    next();
  }
};
