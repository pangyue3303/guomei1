
/* 
* @Author: liwenqi
* @Date:   2019-07-31 20:34:17
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-13 15:20:41
*/

'use strict';

getData(0).then(data =>{
    showMainList(data);
    toggleId(data[0].id, data[0].avatar);
	
});
function getData(fid) {     //请求数据
    return http({ method:'get', url:'/category/list/' + fid});
      
}

function toggleId(id, avatar){
    $('.avatar').attr('src', avatar);
    getData(id).then(showSubList);
}

function showMainList(data) { //渲染一级列表
    data.forEach(function(item, i) {
        $(`
            <li class='${i === 0 ? "active" : ""}'><span>${ item.name }</span></li>
        `)
        .click(function() {
            if($(this).hasClass('active')) return;
            $(this).addClass('active').siblings().removeClass('active');
            toggleId(item.id, item.avatar);
        })
         .appendTo('.content-left ul');
    });
}

function showSubList(data) {
  $('.content-right ul').empty();
  data.forEach(function(item) {
   /* $(`<a href='#' class='stitle'>${item.title}</a>`).appendTo('.content-right ');*/
    $(`
         
        <li class='clearfix'>
            <a href='#' class='stitle'>${item.title}</a>
            <a href='/list/index.html?name=${ item.name }&cid=${item.id}' class='pic'>
              <img src='${item.avatar}'/>
              <p>${item.name}</p>
            </a>
        </li>
        
    `).appendTo('.content-right ul ');
  });
  
}