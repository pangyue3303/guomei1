/* 
* @Author: liwenqi
* @Date:   2019-08-01 20:00:26
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-13 11:07:09
*/

'use strict';
var express = require('express');
var query = require('../utils/dbHelper.js');
var httpResult = require('../config');

var router = express.Router();
router.get('/list/:fid',function(req, res, next) {
    var fid = parseInt(req.params.fid);
    var sql = 'SELECT * FROM `dt_category` WHERE `fid` = ?;';
    res.myPromise = query(sql, [fid]).then(
        httpResult.success );
    next();
});


module.exports = router; 