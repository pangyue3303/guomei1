/* 
* @Author: liwenqi
* @Date:   2019-08-03 08:47:44
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-22 13:48:07
*/

'use strict';

var title = location.search.slice(1).split('&')[0].split('=')[1];
$('.header-center').text(decodeURI(title));  //decodeURI对编码的东西进行解码（传的是文字进行解码）
var cid = location.search.slice(1).split('&')[1].split('=')[1];
var orderCol = 'price';
var orderDir = 'ASC';
var isLoading = false;
var hasMore = true;
var count = 6;
var scroll = null;
var threshold = 50;
var wantLoadMore = false;

function getData(start) {

       isLoading = true;
       $('p.info').text('加载中');
       return http({ method:'post',url:'/product/list',
            data:{
               cid: cid,
               start: start,
               count: count,
               orderCol: orderCol,
               orderDir: orderDir
            }
        }).then(function(data){
              setTimeout(function() {
                     isLoading = false;
                    $('p.info').text(data.length<count ? '已到达底部' :'上拉加载更多');
                    if(data.length < count) hasMore = false;
                   
                }, 500);
              return data;
        });
}

function showData(data){
   data.forEach(function(item) {
         $(`
            <li>
              <a href='/detail/index.html?id=${item.id}'>
                <img src='${ item.avatar }' alt='${ item.name }'/>
                <div class='clearfix'>
                 <h2>${ item.name }</h2>
                 <span class='type'>${ item.type }</span>
                  <span class='size'>${ item.size }</span>
                 <span >产品类型</span>
                 <span>屏幕尺寸</span>
                 <P class='text-price'>￥ ${ item.price }.00</P>
                 <P>${ item.remark }人评论</P>
                 </div>
              </a>
            </li>
          `).appendTo('.content ul');
    });
   initOrRefershScroll()
}

function initOrRefershScroll() {
    imagesLoaded($('.list-wrapper')[0],function() {
      setTimeout( function() {
        if(scroll) scroll.refresh();
        else{
          scroll = new IScroll($('.list-wrapper')[0],{
                click:true,
                probeType:2
        }); 
        var top = $('.order-wrapper').offset().top;
        scroll.on('scroll', function() {

          if(Math.abs(this.y) <= top && $('.order').hasClass('fix'))
            console.log("dd");
            $('.order').appendTo('.order-wrapper').removeClass('fix');
          if(Math.abs(this.y) >= top && !$('.order').hasClass('fix'))
            $('.order').appendTo('body').removeClass('fix');
          if(hasMore && !isLoading){
            if(this.y<0 && this.maxScrollY - this.y > threshold ) {
               $('p.info').text('放手立即加载');
               wantLoadMore=true;
            }else { 
                $('p.info').text('上拉加载'); 
                wantLoadMore=false; 
              }
          }
      });
       scroll.on('scrollEnd', function() {
                if(wantLoadMore) {
                   $('p.info').text('加载中'); 
                    setTimeout(function(){
                    getData($('.content li').length).then(showData);
                    wantLoadMore=false;

                  },1000)
                
              }
            });
     }
    },20);
  });
      
};

getData(0).then(showData);
$('.order li').click(function() {
  if($(this).hasClass('active')){
    orderDir = orderDir ==='ASC' ? 'DESC' : 'ASC';
    $(this).toggleClass('asc').toggleClass('desc').attr('data-order-dir',orderDir );
  }else{
    orderCol = $(this).attr("data-order-col");
    $(this).addClass('active').siblings().removeClass('active');
  }
  $('.content ul').empty();
  hasMore = true;
  getData(0).then(showData);
});
