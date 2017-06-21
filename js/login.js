var d=document;
/*l=function(u,y){
    var s=d.createElement(y);
    if(y=="script"){s.src=u;s.type="text/javascript";s.setAttribute("charset","gb2312");}
    else{s.href=u;s.rel="stylesheet";s.type="text/css";}
    d.getElementsByTagName("head")[0].appendChild(s);
};
l('css/login.css', 'link');*/

var m = d.createElement('div');
m.className = 'm-login';
m.style.display = 'none';
// m.id = 'comm_nav';
m.innerHTML = ' <div id="unlogin" >\
    <a href="javascript:;" id="ptLoginBtn">¡¾µÇÂ¼¡¿</a>\
</div>\
<div id="logined" style="display:none;">\
    <span class="spr-smicon_user"></span>\
    <span id="login_nickname_span">jinva</span>\
	<span id="userinfo" style="display:none;">jinva</span>\
    <a href="javascript:;"  id="ptLogoutBtn">¡¾×¢Ïú¡¿</a>\
</div>';
d.body.insertBefore(m, d.body.children[0]);
/*  |xGv00|1182f7573e70c6ecd8b778784f0f4da6 */