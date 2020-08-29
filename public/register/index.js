/* 
* @Author: liwenqi
* @Date:   2019-08-16 19:26:41
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-16 21:13:15
*/

'use strict';
$('i.check').click(function(){
    $(this).toggleClass('checked');
})

$('button.btn-aggre').click(function(){
    
    var name = $('input.name').val();
    var tel = $('input.phone').val();
    var pwd = $('input.pwd').val();
    if($('i.check').hasClass('checked')){
        http({method:'post',url:'/register/insert', data:{name:name, tel:tel, pwd:pwd}})
            .then(function(){
                window.location.href='/user/index.html';
            })

    }
})