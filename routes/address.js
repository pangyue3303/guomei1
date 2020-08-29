/* 
* @Author: liwenqi
* @Date:   2019-08-15 14:31:25
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-15 19:41:58
*/
'use strict';
var express = require('express');
var query = require('../utils/dbHelper.js');
var httpResult = require('../config');
var Token = require('../utils/token.js');
var router = express.Router();
//新增数据
router.post('/add',function(req, res, next){
    var name = req.token.name;
    var {receiveName, receiveTel, receiveAddress, receiveAddressDetail}=req.body;
    var sql = 'INSERT `dt_address`(`name`,`receiveName`,`receiveTel`,`receiveAddress`,`receiveAddressDetail`,`isDefault`) VALUES(?,?,?,?,?,0);';
    res.myPromise = query(sql, [name, receiveName, receiveTel, receiveAddress, receiveAddressDetail])
        .then(results=> httpResult.success(results.insertId)); //插入数据关注insertId
    next();
});
//展现数据
router.post('/list',function(req, res, next){
    var name = req.token.name;
    var sql='SELECT * FROM `dt_address` WHERE `name` = ?;';
    res.myPromise=query(sql, [name])
        .then(results=>httpResult.success(results));
    next();
});
//修改数据
router.post('/update/:id',function(req, res, next){
    var {receiveName, receiveTel, receiveAddress, receiveAddressDetail}=req.body;
    var id=parseInt(req.params.id);
    var sql = 'UPDATE `dt_address` SET `receiveName` = ?,`receiveTel` = ?,`receiveAddress` = ?, `receiveAddressDetail` = ? WHERE `id` = ?;';
    res.myPromise = query(sql,[receiveName, receiveTel, receiveAddress, receiveAddressDetail, id])
        .then(results=>{
            if(results.affectedRows ===1) return httpResult.success();
            else return httpResult.failure(null,'修改失败');
        })
        next();
});
//删除数据
router.post('/delete', function(req, res, next){
    var id=parseInt(req.body.id);
    
    var sql = 'DELETE  FROM `dt_address` WHERE `id` = ?;';
    res.myPromise=query(sql,[id])
       .then(results=>{
            if(results.affectedRows ===1) return httpResult.success();
            else return httpResult.failure(null,'删除失败');
        })
        next();
});

//改变默认值
router.post('/default',function(req, res, next){
    var id = parseInt(req.body.id);
    var name = req.token.name;
    var sql = 'CALL P_setDefaultAddress(?,?);';
    res.myPromise = query(sql, [id, name])
        .then(results=>httpResult.success());
    next();
});
module.exports = router; 
