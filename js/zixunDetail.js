var NEWS = {
	dNewsId : 0, // 资讯ID
	dNewsInfo : {}, // 资讯详情
	dNewsUrl : "http://apps.game.qq.com/lol/match/apis/searchNewsInfo.php",

	Init : function() {
		var self = NEWS;
		// 获取newsID参数
		var newsId = milo.request('nid');
		if (newsId && milo.isNumberString(newsId)) {
			self.dNewsId = newsId;
			self.InitNewsInfo(); // 拉取资讯信息
		}
	},

	InitNewsInfo : function() {
		var self = NEWS;
		var goUrl = self.dNewsUrl + "?p7=" + self.dNewsId + "&r1=retObj";
		$.ajax({
			type : 'GET',
			url : goUrl,
			dataType : 'script',
			success : function() {
				if (retObj.status == 0) {
					if( retObj.msg.result[0]['sUrl']){
						if (retObj.msg.result[0]['sUrl'].indexOf('http://lpl.qq.com/es/news_detail.shtml') < 0) {							
							window.location.href=retObj.msg.result[0]['sUrl']
							return 
						}
					}
					self.dNewsInfo = retObj.msg.result[0];
					self.FillNewsInfo();// 资讯详情
					//PUBLIC_FUNCTION.InitComment(self.dNewsId, 'LOL_MATCH_NEWS'); // 加载评论
				} else {
					alert(MatchListObj.msg);
				}
			}
		})
	},

	FillNewsInfo : function() {
		var self = NEWS;
		var newsInfo = self.dNewsInfo;
		
		var shareObj = {
				/*title : newsInfo.Title,
				desc : newsInfo.Title,*/
				NewsTitle : newsInfo.Title
			}
			initShare('89', shareObj);
	    
		var author = $.parseJSON(newsInfo.Author);
		var tmp = '';
		for ( var x in author) {
			tmp += author[x] + ',';
		}
		tmp = tmp.substr(0, tmp.length - 1);
		$("#authorname").html(tmp);
		$("#subtitle").html(newsInfo.Title);
		$("#newstime").html(newsInfo.indexDate);
		$("#newscontent").html(newsInfo.Contents);
        
		var $pIframe = $('.page-zixundetail .zxdetail_content p iframe');
        var $divIframe = $('.page-zixundetail .zxdetail_content div iframe');

        var $wIframe = $pIframe.width();
        $pIframe.height(($wIframe * 9)/16);
        $divIframe.height(($wIframe * 9)/16);
	}
}/*  |xGv00|5587aafe2dea7e22864aa9bb0d057bb5 */