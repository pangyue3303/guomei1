/* 
* @Author: liwenqi
* @Date:   2019-08-09 10:10:17
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-15 19:45:43
*/

'use strict';
var express = require('express');
var query = require('../utils/dbHelper.js');
var httpResult = require('../config');

var router = express.Router();

//向购物车添加商品
router.post('/addproduct', function(req, res, next){
    var pid = parseInt(req.body.pid);
    var count = parseInt(req.body.count);
    var name = req.token.name;
    var sql = 'CALL p_addProductToCart(?,?,?,?);';
    res.myPromise = query(sql, [name, pid, count, new Date()])
        .then(results => { return httpResult.success(results[0][0].result);});
    next();
});

//获取购物车数量
router.get('/getcount', function(req, res, next) {
    var sql = 'SELECT sum(`count`) as count FROM `dt_cart` WHERE `name` = ?;';
    var name = req.token.name;
    res.myPromise = query(sql, [name])
            .then(results => { return httpResult.success(results[0].count || 0) });
    next();
});
//获取购物车信息
router.post('/productlist',  function(req, res, next){
    var name = req.token.name;
    var sql = 'CALL p_getCartInfo(?);';
    res.myPromise = query(sql, [name])
        .then(results =>  httpResult.success(results[0]));
    next();
})

//加数量
router.get('/list/increase/:id',  function(req, res, next){
    var id = parseInt(req.params.id);
    var sql = 'UPDATE `dt_cart` SET `count` = `count` + 1 WHERE `id` = ?;';
    res.myPromise = query(sql, [id])
        .then(results => {if(results.affectedRows === 1) { return httpResult.success()}
                        else{  return httpResult.failure(null ,'添加失败' )}
    });
    next();
});

//减数量
router.get('/list/decrease/:id', function(req, res, next){
    var id = parseInt(req.params.id);
    var sql = 'UPDATE `dt_cart` SET `count` = `count` - 1 WHERE `id` = ?;';
    res.myPromise = query(sql, [id])
        .then(results => {if(results.affectedRows === 1) { return httpResult.success()}
                        else{  return httpResult.failure(null ,'添加失败' )}
    });
    next();
});
//结算
router.post('/settlement', function(req, res, next) {
    var ids = JSON.parse(req.body.ids).join(',');
    var account = parseInt(req.body.account);
    var name = req.token.name;
    var sql = 'CALL p_settlement (?,?,?,?);';
    res.myPromise = query(sql, [ids, account, new Date(), name])
                    .then(results=>httpResult.success())
    next();
});
//删除
router.post('/delete', function(req, res, next) {
    var ids = JSON.parse(req.body.ids);
    var sql = 'DELETE FROM `dt_cart` WHERE `id` IN (?);';
    res.myPromise = query(sql, [ids])
                    .then(results=>{ if(results.affectedRows===ids.length){
                               return httpResult.success();
                    }else return httpResult.failure(null,'错误');
                });
    next();
})

module.exports = router; 