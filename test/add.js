var fs = require('fs');
function add(a, b) {
  return a + b;
}
function limit(num) {
  if (num < 0)return 0;
  return num;
}
function async(callback) {
  setTimeout(function () {
    callback(10);
  }, 10);
}
function getContent(filename, callback) {
  fs.readFileSync(filename,'utf-8',callback);
}

module.exports = {
  limit,
  async,
  getContent
};
