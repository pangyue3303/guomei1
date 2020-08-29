/* 
* @Author: liwenqi
* @Date:   2019-08-16 15:27:49
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-17 15:23:29
*/

'use strict';

http({method:'post',url:'/mine/name'})
    .then(function(data) {
       
       $('p.user-name').text(data[0].name)
    })

$('span.exit').click(function(){
    http({method:'post', url:'/mine/exit'})
        .then(function(){
                sessionStorage.removeItem('token');
                window.location.href='/home/index.html';
        });
})