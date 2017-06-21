var d = document;
l=function(u,y){
    var s=d.createElement(y);
    if(y=="script"){s.src=u;s.type="text/javascript";s.setAttribute("charset","gb2312");}
    else{s.href=u;s.rel="stylesheet";s.type="text/css";}
    d.getElementsByTagName("head")[0].appendChild(s);
};
l('http://apps.game.qq.com/CommArticle/app/reg/gdate.php', 'script');

var BeiJingTime = null;
//用load方法可以引用加载后的js
window.onload= function(){
    var nowTime = parseInt(get_unix_time(json_curdate));
    updateTime();
    setInterval(updateTime,1000);
    function updateTime(){
        nowTime += 1;
        var newDate = new Date(nowTime*1000);
        var h = newDate.getHours(); h = h < 10 ? '0'+h : h;
        var m = newDate.getMinutes(); m = m < 10 ? '0'+m : m;
        var s = newDate.getSeconds(); s = s < 10 ? '0'+s : s;
        BeiJingTime = h+':'+m;                       //此处获取时分
    }
    function get_unix_time(dateStr) {
        var newstr = dateStr.replace(/-/g,'/');
        var date =  new Date(newstr);
        var time_str = date.getTime().toString()/1000;
        return time_str;
    }
};
/*  |xGv00|7f80a7a796288fe101fbaae7cc5f0fb2 */