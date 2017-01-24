# node rest API 练习
:date:: 2017/01/20

[![Build Status](https://travis-ci.org/wwmin/nodeRestAPI.svg?branch=master)](https://travis-ci.org/wwmin/nodeRestAPI)
[![npm version](https://badge.fury.io/js/faker.svg)](http://badge.fury.io/js/faker)
[![npm version](https://badge.fury.io/gh/wwmin%2FnodeRestAPI.svg)](http://badge.fury.io/js/faker)

访问地址：https://github.com/wwmin/nodeRestAPI

## Intro
- 使用express4 MongoDB构建纯后台nodejs服务

## Questions
- 欢迎 PR

## 配置
###### 安装依赖
对应模块的用处：
* express: web 框架
* express-session: session 中间件
* connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
* connect-flash: 页面通知提示的中间件，基于 session 实现
* ejs: 模板
* express-formidable: 接收表单及文件的上传中间件
* config-lite: 读取配置文件
* marked: markdown 解析
* moment: 时间格式化
* mongolass: mongodb 驱动
* objectid-to-timestamp: 根据 ObjectId 生成时间戳
* sha1: sha1 加密，用于密码加密
* winston: 日志
* express-winston: 基于 winston 的用于 express 的日志中间件

######## 全局依赖
//运行supervisor --harmony index启动程序 保存代码后重启程序
//supervisor 会监听当前目录下 node 和 js 后缀的文件，当这些文件发生改动时，supervisor 会自动重启程序。
1. supervisor --harmony index

####### 项目目录结构说明
- models: 存放操作数据库的文件
- public: 存放静态文件，如图片等
- routes: 存放路由文件
- index.js: 程序主文件
- package.json: 存储项目名、描述、作者、依赖等等信息

###### 基于https://github.com/nswbmw/N-blog

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016-2017 wwmin