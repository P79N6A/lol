var cimi= {
    init: function(){
        /*导航对应高亮*/
//        var navIndex= cimi.getUrlParam('navOn');
//        $('#comm_nav li').eq(navIndex).addClass('on').siblings('li').removeClass('on');
        var navIndex= milo.request('navOn');
        if(navIndex && milo.isNumberString(navIndex)){        	
        	$('#comm_nav li').eq(navIndex).addClass('on').siblings('li').removeClass('on');
        }
        /*订阅*/
        $('.toSubscribe').click(function(){

            $(this).find('.btn_subscribe').addClass('btn_subscribed').removeClass('btn_subscribe').find('span.btn-state-txt').text('已订阅')
        });
        /*分享*/
        var isCover = false;
        $('.com-top .spr-btn_share').click(function(){
            var cover = document.createElement('div');
            cover.id = 'coverGrey';
            var $cover= $(cover);
            var $body = $('body');
            $cover.width($body.width()).height($body.height()).css({'background':'url(//ossweb-img.qq.com/images/lpl/m/web201704/share-tip.png) no-repeat rgba(0, 0, 0, 0.7) 0.6rem 0.4rem','transform': 'translateZ(0)','background-size':'80%','position':'fixed','left':'0','top':'0','z-index':99999999});
            $body.append($cover);
            isCover = true;

            $cover.one('click',function(){
                $(this).remove();
            });
        });
    },
    /*页面切换*/
    toggleBox:function($hide,$show,isFade){
        if(isFade){
            $($hide).fadeOut(300);
            $($show).fadeIn(300);
        }else{
            $($hide).hide();
            $($show).show();
        }
    },
    /*tab切换*/
    tabSwitch:function(id){
        var $target = $('#'+id);
        $target.find('.hd > ul >li').click(function(){
            $(this).addClass('on').siblings('li').removeClass('on');
            var target_index=$(this).index();
            $target.find('.tab-panel').each(function(i){
                if(i==target_index){$(this).show();}else{$(this).hide();}
            })
        });
    },
    /*腾讯视频*/
    CMPlayer:function(e){
        var video = new tvp.VideoInfo();
        video.setVid(e.vid);
        var player = new tvp.Player();
        player.create({
            width: e.width,
            height: e.height,
            video: video,
            modId: e.modId,
            pic: e.pic,        //视频封面地址
            vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf",  //精简皮肤
            autoplay: e.autoplay   //是否自动播放
        });
    },
    /**
     * 获取url地址的参数
     * @param name 参数名
     * e.g. 当前地址http://www.cimidesign.com?param=abc, 执行cimi.getUrlParam('param')返回'abc'
     */
    getUrlParam: function(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r!=null) return unescape(r[2]); return null; //返回参数值
    }
};
cimi.init();
/*登陆*/
milo.ready(function() {
	parent.need("biz.login",function(LoginManager){
		LoginManager.init();
		if ( LoginManager.isLogin()) {
			$("#login_nickname_span").html( LoginManager.getNickName());
			$('.m-login').show();
	    }else {
	    	$('.m-login').hide();
	    	$('#ptLogoutBtn').click(function(){
				$('.m-login').hide();
			})
	    }
		
	})
})

/**
 * 视频播放
 * @param vId 视频vid
 * @param boxId 播放视频盒子id
 * @param isAuto 是否自动播放视频
 */
function videoPlay(vId,boxId,isAuto,pic){
    var width_video= $('#'+boxId).width();
    var height_video= $('#'+boxId).height();
    cimi.CMPlayer({
        vid: vId,
        modId: boxId,
        width: width_video,
        height: height_video,
        autoplay:isAuto,
        pic:pic
    });
}
/**
 * 直播播放
 * @param channelId 频道id
 * @param boxId 播放视频盒子id
 * @param isAuto 是否自动播放视频
 */
function liveVideo(channelId,boxId,isAuto){
    var video = new tvp.VideoInfo();
    var width_video= $('#'+boxId).width();
    var height_video= $('#'+boxId).height();
    video.setChannelId(channelId);
    var player = new tvp.Player();
    player.create({
        width: width_video,
        height: height_video,
        type: 1,
        video: video,
        modId: boxId,
        autoplay: isAuto
    });
}/*  |xGv00|f4532f0196254b4f379841d730fe4ad5 */