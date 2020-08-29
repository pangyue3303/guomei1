/* 
* @Author: liwenqi
* @Date:   2019-08-13 17:09:34
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-16 11:46:30
*/

'use strict';
var  bannerScroll = null;
var timer = null;
//轮播图
initBannerScroll();
function initBannerScroll() {

    imagesLoaded($('.iscroll-wrapper')[0], function() {
        setTimeout(function() {
            bannerScroll = new IScroll($('.iscroll-wrapper')[0],{
            scrollY:false,
            scrollX:true,
            momentum: false,
            snap:true
        });
        bannerScroll.on('scrollStart', function () {
            clearTimeout(timer);
        });
        bannerScroll.on('scrollEnd', function () {
            var len = $('.iscroll-wrapper>ul>li').length;

            if(this.currentPage.pageX === 0){
                bannerScroll.disable();
                setTimeout(function() {
                    bannerScroll.goToPage(len - 2, 0, 0);
                    bannerScroll.enable();
                },10);  
            }
             if(this.currentPage.pageX === len-1){
                bannerScroll.disable();
                setTimeout(function() {
                    bannerScroll.goToPage(1, 0, 0);
                    bannerScroll.enable();
                },10);  
            }
            play();
        });
        bannerScroll.goToPage(1,0,0);
        play();
        },20)
    });
   
}


function play() {
    timer = setTimeout(function() {bannerScroll.next();},3000);
}


