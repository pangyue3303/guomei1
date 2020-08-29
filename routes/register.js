/* 
* @Author: liwenqi
* @Date:   2019-08-16 21:01:26
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-17 15:17:46
*/

'use strict';
var express = require('express');
var query = require('../utils/dbHelper.js');
var httpResult = require('../config');

var router = express.Router();
router.post('/insert',function(req, res, next){
    var{ name, tel, pwd } = req.body;
    var sql = 'INSERT `dt_user`(`name`,`phone`,`pwd`) VALUES(?,?,?);';
    res.myPromise = query(sql,[name, tel, pwd])
        .then(results => {if(results.affectedRows === 1) { return httpResult.success()}
                        else{  return httpResult.failure(null ,'添加失败' )}
    });
    next();
});



module.exports = router; 