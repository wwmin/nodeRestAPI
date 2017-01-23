var assert = require('assert');
var request = require('supertest');
var fs = require('fs');
var rewire = require('rewire');
var lib = require('./add');
var should = require('should');
// describe('test name', function () {
//   it('1+1 should be equal to 2', function (done) {
//     assert.equal(-1, [1, 2, 3].indexOf(4));
//   });
// });
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});
describe('module', function () {
  describe('limit', function () {
    it('limit should success', function () {
      lib.limit(10).should.be.equal(10);
    });
  });
});
describe('async', function () {
  this.timeout(10000);//修改mocha默认超时2秒的限制
  it('async', function (done) {
    lib.async(function (result) {
      done();
    });
  });
});
describe('should', function () {
  describe('#Primise', function () {
    it('should.reject', function () {
      (new Promise(function (resolve, reject) {
        reject(new Error('wrong'));
      })).should.be.rejectedWith('wrong');
    });
    it('should.fulfilled', function () {
      (new Promise(function (resolve, reject) {
        resolve({username: 'jc', age: 10, gender: 'male'})
      })).should.be.fulfilled().then(function (it) {
        it.should.have.property('username', 'jc');
      })
    })
  })
});

//简单mock
describe('getContent', function () {
  var _readFile;
  before(function () {
    _readFile = fs.readFile;
    fs.readFile = function (filename, encoding, callback) {
      process.nextTick(function () {
        callback(new Error("mock readFile error"));
      });
    };
  });
  after(function () {
    //用完之后记得还原，否则影响其他case
    fs.readFile = _readFile;
  })
});

describe('add', function () {
  //测试私有方法 通过rewire导出方法
  it('add should return 2', function () {
    var libAdd = rewire('./add.js');
    var add = libAdd.__get__('add');
    add(1, 1).should.be.equal(2);
  });
});
