/* 
* @Author: liwenqi
* @Date:   2019-08-14 17:21:59
* @Last Modified by:   liwenqi
* @Last Modified time: 2019-08-22 13:58:40
*/

'use strict';
var addressList =[];//定义一个空数组
var region = { province:null, city:null, area:null, street:null };
var isAdd = true; //表示是不是新增状态
var id = 0; //记录当前的id
//获得街道
function getStreet(){
    var $ul = $('ul.dialog-list').empty();
    region.area.childs.forEach(function(item){
        $(`<li>${item.name}</li>`).appendTo('ul.dialog-list')
    });
    $ul.scrollTop(0).off('click').on('click',function(e) {
        if(e.target.tagName !== 'LI') return;
        region.street = region.area.childs.find(function(item){return item.name === $(e.target).text()});
        $('li.region>input').val(`${region.province.name} ${region.city.name} ${region.area.name} ${region.street.name}`)
        hideRegion()
       
    });

}
//获取地区
function getArea(){
    var $ul = $('ul.dialog-list').empty();
    region.city.childs.forEach(function(item){
        $(`<li>${item.name}</li>`).appendTo('ul.dialog-list')
    });
    $ul.scrollTop(0).off('click').on('click',function(e) {
        if(e.target.tagName !== 'LI') return;
        region.area = region.city.childs.find(function(item){return item.name === $(e.target).text()});
        $('p.cur').text(`${region.province.name} ${region.city.name} ${region.area.name} | 请选择`);
         getStreet();
       
    });

}
//获取城市
function getCity(){
    var $ul = $('ul.dialog-list').empty();
    region.province.childs.forEach(function(item){
        $(`<li>${item.name}</li>`).appendTo('ul.dialog-list')
    });
    $ul.scrollTop(0).off('click').on('click',function(e) {
        if(e.target.tagName !== 'LI') return;
        region.city = region.province.childs.find(function(item){return item.name === $(e.target).text()});
         $('p.cur').text(`${region.province.name} ${region.city.name} | 请选择`);
        getArea();

    });

}
//获取省分
function getProvince(){
    var $ul = $('ul.dialog-list').empty();
    regions.forEach(function(item){
        $(`<li>${item.name}</li>`).appendTo('ul.dialog-list')
    });
    $ul.scrollTop(0).off('click').on('click',function(e) {
        if(e.target.tagName !== 'LI') return;
        region.province = regions.find(function(item){return item.name === $(e.target).text()});
        $('p.cur').text(`${region.province.name} | 请选择`);
        getCity();

    });

}

//展示选择地区弹窗
function showRegion() {
    getProvince();
    $('.address-dialog>p').text('请选择');
    $('.address-dialog-wrapper').addClass('active');
    
}
//关闭选择弹窗
function hideRegion(){
     $('.address-dialog-wrapper').removeClass('active');
}
//进入编辑状态
function beginEdit(flag) {
    isAdd = flag;
    $('.header').addClass('edit');
    $('.content').toggleClass('hide');
    if(!isAdd) $('.header').addClass('update');
}
//退出编辑状态
function endEdit() {
    $('.header').removeClass('edit').removeClass('update');
    $('.content').toggleClass('hide');
    $('form')[0].reset();
    hideRegion();
}
//新增地址
function addAddress(){
    http({
        method:'post', 
        url:'/address/add',
        data:$('form').serialize(),
    }).then(function(id){
        var obj ={
            id:id,
            receiveName:$('.receive-name').val(),
            receiveTel:$('.receive-tel').val(),
            receiveAddress:$('.receive-address').val(),
            receiveAddressDetail:$('.receive-address-detail').val(),
            isDefault: 0
        };
        //将回来的id和获得的表单数据放到addressList里面
        addressList.push(obj);
        //将数据放到地址列表里面
        showaddressItem(obj);
        //退出编辑状态
        endEdit();
    });
}

//修改地址
function updateAddress(){
     http({
        method:'post', 
        url:'/address/update/' + id,
        data:$('form').serialize(),
    }).then(function(){
            var target = addressList.find(function(item){return item.id === id});

            target.receiveName=$('.receive-name').val();
            target.receiveTel=$('.receive-tel').val();
            target.receiveAddress=$('.receive-address').val();
            target.receiveAddressDetail=$('.receive-address-detail').val();
            var $li =$(`li[data-id=${id}]`);
            $li.find('.p-name').text(target.receiveName);
            $li.find('.p-tel').text(target.receiveTel);
            $li.find('.p-address').text(`${target.receiveAddress} ${target.receiveAddressDetail}`);
        //将回来的id和获得的表单数据放到addressList里面
        
        //将数据放到地址列表里面
        
        //退出编辑状态
        endEdit();
    });
}
//控制编辑状态下的后退按钮
$('a.exit-edit').click(function() {
   endEdit();
});

//加号在正常状态和表单状态之间切换
$('.btn-add').click(function(){
    beginEdit(true);
});
//给选择地址添加点击事件
$('li.region').click(function() {
    showRegion();
});
//给选择地址的叉号添加事件
$('i.remove-wrapper').click(function(){
    hideRegion()
});
//新加地址
$('button.btn-save').click(function() {
    if(isAdd) addAddress();
        else updateAddress();
})


//展示数据
function showaddressItem(item) {
    $(`
        <li data-id=${item.id}>
            <div>
                <p class='p-name'>${item.receiveName}</p>
                <p class='p-phone'>${item.receiveTel}</p>
            </div>
            <p class='p-address'>${item.receiveAddress}${item.receiveAddressDetail}</p>
            <div>
                <a class='btn-default ${item.isDefault ? "default" : ""}'>
                </a>
                <i class='btn-update'>编辑</i>
            </div>
        </li>
    `).appendTo('ul.address-list');
}

//拼接列表
function showaddressList(item){
    item.forEach(function(item){
        showaddressItem(item)
    });
}
//展示列表
http({
    method:'post',
    url:'/address/list'
}).then(function(data){
    addressList=data;
    showaddressList(data);
    
    
});

//编辑更新数据
$('ul.address-list').click(function(e){
    if($(e.target).hasClass('btn-update')){
        id = parseInt($(e.target).closest('li').attr('data-id'));
        var target = addressList.find(function(item){return item.id === id});
        $('input.receive-name').val(target.receiveName);
        $('input.receive-tel').val(target.receiveTel);
        $('input.receive-address').val(target.receiveAddress);
        $('input.receive-address-detail').val(target.receiveAddressDetail);
        beginEdit(false);
    }
    if($(e.target).hasClass('btn-default')){
        if($(e.target).hasClass('default')) return;
        id = parseInt($(e.target).closest('li').attr('data-id'));
       
        http({method:'post', url:'/address/default', data:{id:id}})
            .then(function(){
                //维护addressList
                addressList.forEach(function(item) { 
                    item.isDefault = item.id === id ? 1 : 0;
                });
                $('.btn-default').removeClass('default');
                $(e.target).addClass('default');
            });
        
    }
});

//删除功能
$('button.btn-delete').click(function() {
    if(!confirm('确定删除？')) return;
    http({method:'post', url:'/address/delete',data:{id:id}})
        .then(function(){
            var i= addressList.findIndex(function(item){ return item.id === id});
           addressList.splice(i, 1);
           $(`li[data-id=${id}]`).remove();
           endEdit();
        });
})