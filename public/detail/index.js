/* 
* @Author: liwenqi
* @Date:   2019-08-05 20:03:40
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-13 15:39:54
*/

'use strict';
var bannerScroll = null;
var timer = null;
var count = 1;
var id =location.search.slice(1).split('=')[1];
//获取数据
function getData(id) {
    return http({method:'get',url:'/product/model/' + id});
 
}
//展示数据
function showData(data) {
    $('.p-name').text( data.name );
    $('.p-price').text( data.price );
    $('.p-brief').text(data.brief);
    $('.shopping-dialog-header>img.avatar').attr('src', data.avatar);
    $('.shopping-dialog-header>em.price').text(`￥${data.price}`);
    var banner = data.bannerlmgs.split(",");
    $(`<li><img src='${banner[banner.length-1]}'/></li>`).appendTo('.content ul');
    banner.forEach(function(item) {
        $(`<li><img src='${item}'/></li>`).appendTo('.content ul');
    })
    $(`<li><img src='${banner[0]}'/></li>`).appendTo('.content ul');
    $('.content ul').css('width', `${banner.length +2}00%`);
    $('.banner-wrapper>span.indicator').text('1/' + banner.length);
    initBannerScroll()
}
function initBannerScroll() {  //scroll里面只能识别dom对象
    imagesLoaded($('.banner-wrapper')[0],function(){
        setTimeout(function() {
            bannerScroll = new IScroll($('.banner-wrapper')[0],{
                scrollY: false, //关闭纵向滚动
                scrollX: true,  //开启横向滚动
                momentum: false,  //关闭惯性滚动
                snap: true    //开启轮播图模式
            });
            bannerScroll.on('scrollStart',function() {
                clearTimeout(timer);  //用户用手触摸时停止自动播放
            });
             bannerScroll.on('scrollEnd', function() {
                var len =$('.banner-wrapper li').length;
                if(this.currentPage.pageX === 0){ //如果当前的图片的下标为0 
                    bannerScroll.disable();  //调整期间，不允许滚动
                    setTimeout(function() {
                        bannerScroll.goToPage(len - 2, 0, 0); //则让其迅速滚到倒数第二张
                        bannerScroll.enable();  //调整结束，允许滚动
                    },10);
                }
                if(this.currentPage.pageX === len-1){  //如果滚到最后一张
                    bannerScroll.disable();
                    setTimeout(function() {
                        bannerScroll.goToPage(1, 0, 0);  //让其迅速跳转到第二张
                        bannerScroll.enable();
                    },10);
                }
                var curPage = this.currentPage.pageX;  //获取当前滚动的下标
                if(curPage ===0) curPage=len-2;   //如果是第一张，则使其下标变成倒数第二张
                if(curPage === len-1) curPage=1;  //如果是最后，则使其下标变成第1张
                $('.banner-wrapper>span.indicator').text(`${curPage}/${len-2}`);
                play();
             });
             bannerScroll.goToPage(1,0,0); //初始让其在第二张
              play();
        },20);
    });
}
function play() {
    timer = setTimeout(function() { bannerScroll.next();},3000); //让其自动播放
}

getData(id).then(showData);
//like点击事件
$('.like>i').click(function() {
    $(this).toggleClass('active');
});

//给加添加点击事件
$('.count-wrapper>span.add').click(function(){
    if($(this).hasClass('disable')){ //进到这里面就不会加一
     var $p = $('<p class="alert"></p>').text('商品已达到上限。。').appendTo('body');
     setTimeout(function() {$p.remove();},1000);

    }else{
        count+=1;
        $('.count-wrapper>span.decrease').removeClass('disable');
        $('.count-wrapper>span.count').text(count);
        if(count === 5){$(this).addClass('disable')}
    }

});

//给减添加点击事件
$('.count-wrapper>span.decrease').click(function() {
    if($(this).hasClass('disable')){
        var $p= $('<p class="alert"></p>').text('商品已达到下限。。').appendTo('body');
        setTimeout(function() {$p.remove();},1000);
    }else {
        count -=  1;
        $('.count-wrapper>span.add').removeClass('disable');
        $('.count-wrapper>span.count').text(count);
        if(count === 1){$(this).addClass('disable')}
        
    }
});
//给button确定按钮添加事件
$('.btn-add-cart').click(function() {
    http({method:'post',
        url:'/cart/addproduct',
        data: {
            pid:id,
            count:count
        }
    }).then(function(data) {
        var message = '';
         if(data === ''){
                message ='商品添加成功';
                $('.shopping-dialog-wrapper').hide();
                $('.footer-l>a>span.cart>em').text(parseInt($('.footer-l>a>span.cart>em').text()) + count)
        } else message = data;
        var $p= $('<p class="alert"></p>').text(message).appendTo('body');
            setTimeout(function() {$p.remove();},1000);
    });
   
});
//获取购物车数量

$.ajax({
    method:'get',
    url: '/cart/getcount',
    headers: {
            'Authorization': sessionStorage.getItem('token')
        },
    success: function(result) {
        if(result.status === 200){
            $('.footer-l>a>span.cart>em').text(result.data);
        }else if(result.status === 401){
                 
            }else alert(result.message);
    }
});

