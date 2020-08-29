/* 
* @Author: liwenqi
* @Date:   2019-08-09 08:31:47
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-10 10:09:53
*/

'use strict';
var arr =['home', 'category', 'like', 'cart', 'mine'];
var i = arr.findIndex(function(item) {
    return parent.location.href.indexOf(item) !==-1 //父层窗口是在哪个窗口
});
$('.nav>a').eq(i).addClass('active');//判断当前其在哪个窗口加上class

$('.nav>a').click(function(e){
    e.preventDefault();  //阻止超链接跳转（不要执行默认事件）
    window.parent.location.href = this.href;//让其在当前页面跳转到另一页面
});