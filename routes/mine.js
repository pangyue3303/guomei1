/* 
* @Author: liwenqi
* @Date:   2019-08-16 17:01:56
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-17 15:23:21
*/

'use strict';
var express = require('express');
var query = require('../utils/dbHelper.js');
var httpResult = require('../config');

var router = express.Router();
router.post('/name',function(req, res, next){
    var name = req.token.name;
    var sql = 'SELECT * FROM `dt_user` WHERE `name` = ?;';
    res.myPromise = query(sql, [name])
        .then(results => httpResult.success(results));
    next();
})
//获取订单
router.post('/findorder', function(req, res, next){
    var name = req.token.name;
    var sql = 'SELECT * FROM `v_allorders` WHERE `userName` = ?;';
    res.myPromise = query(sql, [name])
        .then(results => httpResult.success(results));
    next();
});


router.post('/exit', function(req, res, next){
    
    res.send(httpResult.success());

})

module.exports = router; 