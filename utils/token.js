/* 
* @Author: liwenqi
* @Date:   2019-08-13 10:20:17
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-13 10:28:50
*/

'use strict';
var jwt = require('jsonwebtoken');
var httpResult = require('../config');

var secret = 'abc';
var Token ={
    generate: payload => jwt.sign(payload, secret, {expiresIn:60*60}),
    check:(req, res, next)=>{
        jwt.verify(req.get('Authorization'), 'abc', function(err, decoded){
            if(err) {res.send(httpResult.untoken());return;}
            req.token = decoded;
            next();
        });
    }
};


module.exports = Token;