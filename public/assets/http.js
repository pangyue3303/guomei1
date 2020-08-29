/* 
* @Author: liwenqi
* @Date:   2019-08-13 14:40:27
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-13 15:23:09
*/

'use strict';
//封装ajax
function http(options) {
    return new Promise(function(resolve, reject) {
        options.headers ={'Authorization': sessionStorage.getItem('token')};
        options.success = function(result) {
            if(result.message){alert(result.message)};
            switch(result.status){
                    case 200:
                        resolve (result.data);
                        break;
                    case 199:
                    case 500:
                        break;
                    case 401:
                        window.location.href='/user/index.html';
            }
        };
        $.ajax(options);
    });
}