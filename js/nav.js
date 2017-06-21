var d=document;
/*l=function(u,y){
 var s=d.createElement(y);
 if(y=="script"){s.src=u;s.type="text/javascript";s.setAttribute("charset","gb2312");}
 else{s.href=u;s.rel="stylesheet";s.type="text/css";}
 d.getElementsByTagName("head")[0].appendChild(s);
 };
 l('css/nav.css', 'link');*/

var m = d.createElement('div');
m.className = 'g-nav';
m.id = 'comm_nav';
m.innerHTML = '<ul class="clearfix">\
    <li class="on">\
    <a href="index.htm?navOn=0">\
    <span class="nav-item spr-nav_1"></span>\
    <span>赛事</span>\
    </a>\
    </li>\
    <li>\
    <a href="guessing.htm?navOn=1">\
    <span class="nav-item spr-nav_2"></span>\
    <span>竞猜</span>\
    </a>\
    </li>\
    <li>\
    <a href="data.htm?navOn=2">\
    <span class="nav-item spr-nav_3"></span>\
    <span>数据</span>\
    </a>\
    </li>\
    <li>\
    <a href="booking.htm?navOn=3">\
    <span class="nav-item spr-nav_4"></span>\
    <span>售票</span>\
    </a>\
    </li>\
    </ul>';
d.body.insertBefore(m, d.body.children[0]);/*  |xGv00|1435666d9a16ca07a0543781ebbb9419 */