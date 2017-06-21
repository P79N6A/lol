var VIDEO = {

	dNewsId : 0, // 资讯ID
	dNewsInfo : {}, // 资讯详情
	dNewsUrl : "http://apps.game.qq.com/lol/match/apis/searchNewsInfo.php",

	Init : function() {
		var self = VIDEO;
		// 获取newsID参数
		var newsId = milo.request('nid');
		if (newsId&&milo.isNumberString(newsId)) {
			self.dNewsId = newsId;
			self.InitNewsInfo(); // 拉取资讯信息
		}
	},

	InitNewsInfo : function() {
		var self = VIDEO;
		var goUrl = self.dNewsUrl + "?p7=" + self.dNewsId + "&r1=retObj";
		$.ajax({
			type : 'GET',
			url : goUrl,
			dataType : 'script',
			success : function() {
				if (retObj.status == 0) {
					self.dNewsInfo = retObj.msg.result[0];
					self.FillVideoInfo();// 视频详细
					self.PlayerVideo(); // 播放视频
					//PUBLIC_FUNCTION.InitComment(self.dNewsId, 'LOL_MATCH_NEWS'); // 加载评论
				} else {
					alert(retObj.msg);
				}
			}
		})
	},

	FillVideoInfo : function() {
		var self = VIDEO;

		var shareObj = {
			/*title : self.dNewsInfo.Title,
			desc : self.dNewsInfo.Title,*/
			VideoTitle : self.dNewsInfo.Title
		}
		initShare('88', shareObj);

		$('#title').html('正在播放 ' + self.dNewsInfo.Title);
	},

	PlayerVideo : function() {
		var self = VIDEO;
		var videoInfo = $.parseJSON(self.dNewsInfo.sExt1);
		var vid = videoInfo.sVID;
		var sImg = videoInfo.sImg.replace('_228_128/', '_496_280/');
		// var pic = self.dNewsInfo.sImg ? self.dNewsInfo.sImg : videoInfo.sImg;
		videoPlay(vid, "video_item", false, sImg);
	}
}
/*  |xGv00|ec8a56d55bd2d8078090b4172ed0cc16 */