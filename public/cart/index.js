/* 
* @Author: liwenqi
* @Date:   2019-08-09 15:31:47
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-19 08:28:34
*/

'use strict';
var cartList=[]//定义一个空数组
var isEdit = false; //判断用户是否在编辑状态
$('.edit-over').on('click', function() {
    //编辑和完成状态之间切换
    isEdit = !isEdit;
    $(this).text(isEdit ? '完成' : '编辑');
    $('.cart-footer').toggleClass('hidden');
    $('.cart-content>ul>li i.checkbox').toggle();
});

//发ajax请求购物车数据数据根据name
function getData(){
    return http({ method:'post',url:'/cart/productlist'});
    //如果成功的返回数据的都不用写then。
    /*return new Promise(function(resolve, reject){
        $.ajax({
           ,
            headers: {
            'Authorization': sessionStorage.getItem('token')
        },
        success:function(result) {
            if(result.status === 200){ //成功的话返回数据
                resolve(result.data)
            }else if(result.status === 401){
                window.location.href ='/user/index.html';
            }else alert(result.message);
            }
        });
    });*/
}
//展示购物车数据 给拼接的标记加点击事件要放在拼接的时候
function showData() {
    cartList.forEach(function(item){
        $(`
            <li data-id='${item.id}'>
                <i class='checkbox normal checked'></i>
                <i class='checkbox edit'></i>
                <div class='acopy'>
                    <a >
                        <img src="${item.avatar}" alt="${item.name}" />
                    </a>
                    <div class='cart-info'>
                        <a href='/detail/index.html?id=${item.pid}'>
                            <p>${item.name}</p>
                        </a>
                        <div class='cart-info-footer'>
                            <em>￥${item.price}</em>
                            <div class='count-wrapper'>
                                <span class="iconfont icon-decrease decrease ${item.count === 1 ? 'disable' : ''}"></span>
                                <span class="count">${item.count}</span>
                                <span class="iconfont icon-add add ${item.count === 5 ? 'disable' : ''} "></span>
                            </div>
                            <div class='remove'>
                                <span>移入收藏</span>
                                <span>删除</span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `).appendTo('.cart-content>ul');
    });
    //绑定点击事件选中和不选择
    $('.cart-content>ul>li i.checkbox').click(function() {
        $(this).toggleClass('checked'); //实现自身图片切换
        var id = parseInt($(this).parent().attr('data-id'));
        var target = cartList.find(function(item){
             return item.id === id;
        });
        target[isEdit? 'checked2' : 'checked1'] = $(this).hasClass('checked');
        console.log(target);
        footerData ();
    });
    
    //给加减添加点击事件
    $('.count-wrapper span.add').click(increase);
    $('.count-wrapper span.decrease').click(decrease);
      
}

//加点击事件
function increase() {
    if($(this).hasClass('disable')){ //进到这里面就不会加一
         var $p = $('<p class="alert"></p>').text('商品已达到上限。。').appendTo('body');
         setTimeout(function() {$p.remove();},1000);
         return;
    }
    if(isEdit) $('.edit-over').trigger('click')
    var id =parseInt($(this).closest('li').attr('data-id'));
     //在编辑状态点加加号跳转到normal状态模拟点击事件
    $('.isloading').toggle();
   
    
        http({ method:'get',url:'/cart/list/increase/' + id})
            .then(()=>{
                $('.isloading').toggle();
                $(this).prevAll('.decrease').removeClass('disable');
                 var target= cartList.find((item)=> {
                       return  item.id === id
                    })
                    target.count+=1;
                    $(this).prev().text(target.count);
                    if(target.count === 5) $(this).addClass('disable');
                    footerData ();
        });
    


}
//减点击事件
function decrease() {
    if($(this).hasClass('disable')){ //进到这里面就不会加一
         var $p = $('<p class="alert"></p>').text('商品已达到下线。。').appendTo('body');
         setTimeout(function() {$p.remove();},1000);
         return;
    }
    if(isEdit) $('.edit-over').trigger('click')  //在编辑状态点加加号跳转到normal状态
    var id =parseInt($(this).closest('li').attr('data-id'));
    $('.isloading').toggle();
    
        http({ method:'get',url:'/cart/list/decrease/' + id})
            .then(()=>{
                $('.isloading').toggle();
                $(this).nextAll('.add').removeClass('disable');
                var target= cartList.find((item)=> {
                       return  item.id === id
                    })
                target.count-=1;
                $(this).next().text(target.count);
                if(target.count === 1) $(this).addClass('disable');
                footerData ();
            });
       /* $.ajax({
            method:'get',
            url:'/cart/list/decrease/' + id,
            headers: {
            'Authorization': sessionStorage.getItem('token')
             },
            success: (result)=> {
                 $('.isloading').toggle();
                 $(this).nextAll('.add').removeClass('disable');
                if(result.status === 200){
                    var target= cartList.find((item)=> {
                       return  item.id === id
                    })
                    target.count-=1;
                    $(this).next().text(target.count);
                    if(target.count === 1) $(this).addClass('disable');
                    footerData ()
                }else if(result.status === 401){
                window.location.href ='/user/index.html';
                }else {alert(result.message)};
            }
        });*/
    


}
//页脚数据更新
function footerData () {
    if(cartList.length === 0){
        $('.edit-over').text('').off('click');
        $('.cart-footer').hide();
        $('.epmty-cart').toggle();
    }
    var totle = 0;
    var account = 0.00;
    var editTotle = 0;
    cartList.forEach(function(item){
        if(item.checked1){
            totle+=item.count;
            account+=item.count * item.price;
        }
         if(item.checked2){
            editTotle+=item.count;
        }
    });
    $('.account-wrapper em.account').text(account);
    $('.btn-settlement em.totle').text(totle > 0 ? `(${totle})` : '');//值和括号拼接
    $('.btn-delete em.totle').text(editTotle> 0 ?`(${editTotle})` : '');

    cartList.every(function(item){ return item.checked1}) ? 
        $('.cart-footer.normal i.checkbox').addClass('checked') :
        $('.cart-footer.normal i.checkbox').removeClass('checked');
    cartList.every(function(item){ return item.checked2}) ? 
        $('.cart-footer.edit i.checkbox').addClass('checked') :
        $('.cart-footer.edit i.checkbox').removeClass('checked');

}
//全选反选点击切换
$('.cart-footer>span.all').click(function() {
    $(this).find('i.checkbox').toggleClass('checked');
    var groupName = $(this).attr('data-group')
    var checkboxes = $('.cart-content>ul i.checkbox').filter(`.${groupName}`);
    var checked=  $(this).find('i.checkbox').hasClass('checked');
    if(checked){checkboxes.addClass('checked')}
        else{checkboxes.removeClass('checked')}
    cartList.forEach(function(item) {
        if(groupName === 'normal'){ 
           item.checked1=checked;
        }else {item.checked2=checked}
    });
    footerData ()
   
});

//点击结算
$('.btn-settlement').click(function() {
    var ids =[];
    var account = 0;
    cartList.forEach(function(item) {
        if(item.checked1){ ids.push(item.id) };
        account +=item.count * item.price;
    });
    if(ids.length === 0){
        var $p = $('<p class="alert"></p>').text('至少选择一件商品').appendTo('body');
         setTimeout(function() {$p.remove();},1000);
         return;
    }
    http({method:'post', url:'/cart/settlement',data:{
            ids:JSON.stringify(ids),
            account:account
        }
    }).then(function() {
        console.log(ids);
        ids.forEach(function(item) {//返回数据之后将选中要结算的和castlist比较
            var i =cartList.findIndex(function(item2){ return item2.id === item})
            
            cartList.splice(i, 1)  //如果不写就会是数据库改变后要刷新页面才会变化
            
            $(`.cart-content>ul>li[data-id = ${item}]`).remove(); //属性选择器
        });

        footerData ();
    });
    
});
//点击删除
$('.btn-delete').click(function(){
     var ids =[];
    
    cartList.forEach(function(item) {
        if(item.checked2){ ids.push(item.id) };
    });
     if(ids.length === 0){
        var $p = $('<p class="alert"></p>').text('至少选择一件商品').appendTo('body');
         setTimeout(function() {$p.remove();},1000);
         return;
    };
    http ({ method:'post',url:'/cart/delete',
        data:{
            ids:JSON.stringify(ids),
            }
        }).then(function() {
            ids.forEach(function(item) {//返回数据之后将选中要结算的和castlist比较
                    var i =cartList.findIndex(function(item2){return item2.id === item})
                    cartList.splice(i, 1);  
                    $(`.cart-content>ul>li[data-id = ${item}]`).remove(); //属性选择器
                });
                footerData ();
        });
    /* $.ajax({
        method:'post',
        url:'/cart/delete',
        data:{
            ids:JSON.stringify(ids),
            },
         headers: {
            'Authorization': sessionStorage.getItem('token')
            },
        success: function(result) {
            if(result.status === 200){
                ids.forEach(function(item) {//返回数据之后将选中要结算的和castlist比较
                    var i =cartList.findIndex(function(item2){item2.id === item})
                    cartList.splice(i, 1)  //如果不写就会是数据库改变后要刷新页面才会变化
                    $(`.cart-content>ul>li[data-id = ${item}]`).remove(); //属性选择器
                });
                footerData ();
            }else if(result.status === 401){
                window.location.href ='/user/index.html';
            }else{alert(result.message)}
        }
    });
*/
});
getData().then(function(data){ //这个data是result.data
    data.forEach(function(item){
        item.checked1 = true;  
        item.checked2 = false;
    });
    cartList=data;
    showData();
    footerData ()
})
