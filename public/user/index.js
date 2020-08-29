/* 
* @Author: liwenqi
* @Date:   2019-08-10 10:11:51
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-17 14:05:26
*/

'use strict';
$('.content-input>span').click(function(){
    if($(this).hasClass('active')) return;
    $(this).addClass('active').siblings().removeClass('active');
    $('.login-form').toggle();
});
//用户名密码登录

$('.btn-login-pwd').click(function(){
    http({method:'post',
        url:'/user/pwd',
        data:{name: $('input.username').val(), pwd:$('input.userpwd').val()}
    }).then(function(token){
		// console.log('aa');
        sessionStorage.setItem('token', token );
        window.history.back();
        alert('登录成功');
        var url = document.referrer; //可以判断他是从哪个页面跳转过来的
        var arr=['register'];
        var i = url.indexOf(arr[0]);
        if(i !==-1) {
            window.location.href='/home/index.html';
        }

    });
   /* $.ajax({
        method:'post',
        url:'/user/pwd',
        
        data:{name: $('input.username').val(), pwd:$('input.userpwd').val()},
        success: function(result){
            if(result.status ===200 ){
                alert('登录成功');
                sessionStorage.setItem('token', result.data );
                window.history.back();
            }else alert(result.message)
        }
    });*/
});
//手机号登录
$('.btn-login-phone').click(function(){
    http({method:'post',url:'/user/phone',
         data:{phone: $('input.userphone').val(), code:$('input.code').val()}
     }).then(function(token){
            sessionStorage.setItem('token', token );
            window.history.back();
            alert('登录成功');
            var url = document.referrer; //可以判断他是从哪个页面跳转过来的
            var arr=['register'];
            var i = url.indexOf(arr[0]);
            if(i !==-1) {
                window.location.href='/home/index.html';
        }
     });
   /* $.ajax({
        method:'post',
        url:'/user/phone',
         data:{phone: $('input.userphone').val(), code:$('input.code').val()},
        success: function(result){
            if(result.status ===200 ){
                alert('登录成功');
                sessionStorage.setItem('token', result.data );
                window.history.back();
            }else alert(result.message)
        }
    });*/
});

//获取验证码
$('.btn-code').click(function(){
    $.ajax({
        method:'post',
        url:'/user/getcode',
        success: function(result){
            if(result.status ===200 ){
                $('.btn-code').text(result.data);
            }else alert(result.message)
        }
    });
});