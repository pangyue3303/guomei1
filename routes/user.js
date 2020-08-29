/* 
* @Author: liwenqi
* @Date:   2019-07-31 19:45:52
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-13 11:15:40
*/

'use strict';
var express = require('express');
var query = require('../utils/dbHelper.js');
var httpResult = require('../config');
var Token = require('../utils/token.js');
var router = express.Router();
//用户名密码登录
router.post('/pwd', function(req, res, next) {
    var name = req.body.name;
    var pwd = req.body.pwd;
    var sql = 'SELECT `phone` FROM `dt_user` WHERE `name` = ? AND `pwd` =?;';
    res.myPromise=query(sql, [name, pwd])
        .then(results=> {
            if(results[0]){
                 return httpResult.success(Token.generate({name}));
                         // req.session.phone = results[0].phone;  
            }else { return httpResult.failure( null, '用户名或密码错误')};
        });
    next();
});
//获取验证码
router.post('/getcode', function(req, res, next) {
    var code = '000000' + Math.floor(Math.random()*1000000).toString();//取整转化成字符串
    code = code.substr(-6);//截取六位验证码
    req.session.code= code;//将code存入session
    res.myPromise = Promise.resolve(httpResult.success(code));
    next();
});
//手机登录
router.post('/phone', function(req, res, next) {
    var phone = req.body.phone;
    var code = req.body.code;
    if(req.session.code !==code){
        res.send({status: 199, data:null, message:'验证码输入错误'});
        return;
    }
    var sql = 'SELECT `name` FROM `dt_user` WHERE `phone` = ?;';
    res.myPromise=query(sql, [phone])
        .then(results=> {
             if(results[0]){
                 return httpResult.success(Token.generate({name:results[0].name}));
                         // req.session.phone = results[0].phone;  
            }else { return httpResult.failure( null, '手机号未注册')};
        });
    next();
});
module.exports = router; 