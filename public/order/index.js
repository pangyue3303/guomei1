/* 
* @Author: liwenqi
* @Date:   2019-08-17 09:24:49
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-17 15:09:43
*/

'use strict';
var orderList = null;
http({method:'post',url:'/mine/findorder'})
    .then(function(data){
        orderList=data;
    if(orderList.length === 0) {$('.no-order').addClass('show')}
        else {showOrderList(data); $('.no-order').removeClass('show')}
        
    })

function showOrderList(item){
    orderList=item;
    orderList.forEach(function(item){
        $(`
            <li>
                <img src="${item.productAvatar}" alt="" />
                <p>${item.productName}</p>
                <em>￥${item.price}</em>
                <i>*${item.count}</i>
                <span class='pay ${item.pay ? "apay" : ""}'></span>
            </li>
        `).appendTo('.order-content>ul')
   });
}
