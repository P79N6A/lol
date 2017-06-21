var COLLECTION = {
	bGameId : 49,
	bMatchId : 0,// 大场ID
	dNewsInfo : {}, // 资讯详情
	dMatchInfo : {}, // 大场详情
	dNewsUrl : "http://apps.game.qq.com/lol/match/apis/searchNewsInfo.php",
	dTeamSupportUrl : "http://apps.game.qq.com/lol/match/apis/searchTeamSupport.php",
	dBMatchUrl : "http://apps.game.qq.com//lol/match/apis/searchBMatchInfo.php",
	dMsg001 : "支持成功",
	dTeamList : {},
	bTeamAId : 0,
	bTeamBId : 0,
	bInitShare : false,

	Init : function() {
		var self = COLLECTION;
		// 获取newsID参数
		var matchId = milo.request('bid');
		if (matchId && milo.isNumberString(matchId)) {
			self.bMatchId = matchId;
			self.dTeamList = TeamList.msg;
			self.InitConnectionInfo(); // 拉取视频集锦
			self.SearchBMatchInfo(); // 查询大场信息
		}
	},

	SearchBMatchInfo : function() {
		var self = COLLECTION;
		if (self.bMatchId) {
			var goUrl = self.dBMatchUrl + "?p0=" + self.bMatchId + "&r1=retMatchObj";
			$.ajax({
				type : 'GET',
				url : goUrl,
				dataType : 'script',
				success : function() {
					if (retMatchObj.status == 0) {
						var data = retMatchObj.msg.result[0];
						self.dMatchInfo = data;
						self.bTeamAId = data.TeamA;
						self.bTeamBId = data.TeamB;
						$('.s-team-name').eq(0).html(self.dTeamList[self.bTeamAId]['TeamName']);
						$('.s-team-name').eq(1).html(self.dTeamList[self.bTeamBId]['TeamName']);
						// 拉取战队支持数据
						self.FillSupportInfo();
					}
				}
			})
		}
	},

	InitConnectionInfo : function() {
		var self = COLLECTION;
		var goUrl = self.dNewsUrl + "?p2=14&p6=" + self.bMatchId + "&r1=retObj&p8=2";
		$.ajax({
			type : 'GET',
			url : goUrl,
			dataType : 'script',
			success : function() {
				if (retObj.status == 0) {
					var data = retObj.msg.result;
					var hasWfz = false;
					var wfz = {};
					var jcsp = {};
					var qchg = {};
					for ( var i in data) {
						var newsInfo = data[i];
						switch (newsInfo.sCateId) {
							case '80':
								wfz[i] = newsInfo;
								break;
							case '20':
								qchg[i] = newsInfo;
								break;
							default:
								jcsp[i] = newsInfo;
								break;
						}
					}
					var sHtml = '';
					if (!$.isEmptyObject(wfz)) {
						hasWfz = true;
						sHtml += self.FillVideoList(wfz);
					}
					if (qchg) {
						sHtml += self.FillVideoList(qchg);
					}
					$('.tab-panel-2 .news-box').html(sHtml);
					if (jcsp) {
						sHtml = self.FillVideoList(jcsp);
					}
					$('.tab-panel-1 .news-box').html(sHtml);
					if($('.tab-panel-2 .news-box a').length>=1){
						$('.tab-panel-2 .news-box a').eq(0).trigger('click');
					}else if($('.tab-panel-1 .news-box a').length >1){
						$('.tab-panel-1 .news-box a').eq(0).trigger('click');
					}
				} else {
					alert(retObj.msg);
				}
			}
		})
	},

	PlayVideo : function(data) {
		var self = COLLECTION;
		$('#title').html(data.Title);
		var videoInfo = $.parseJSON(data.sExt1);
		if (data.sImg) {
			videoPlay(videoInfo.sVID, "video_item", false, data.sImg);
		} else {
			videoPlay(videoInfo.sVID, "video_item", false, videoInfo.sImg);
		}
	},

	PlayVideoClick : function(title, vid, pic) {
		var self = COLLECTION;
		if (!self.bInitShare) {
			self.bInitShare = true;
			var shareObj = {
				/*title : title,
				desc : title,*/
				VideoTitle : title,
				img : pic
			}
			initShare('86', shareObj);
		}
		$('#title').html(title);
		videoPlay(vid, "video_item", false, pic);
	},

	FillVideoList : function(list) {
		htmlStr = '';
		for ( var i in list) {
			var news = list[i];
			var videoInfo = $.parseJSON(news.sExt1);
			var sImg = videoInfo.sImg.replace('_228_128/', '_496_280/');
			var min = Math.floor(+videoInfo.iTime / 60);
			var sec = +videoInfo.iTime % 60;
			htmlStr += '<a href="javascript:COLLECTION.PlayVideoClick(\'' + news.Title + '\',\'' + videoInfo.sVID + '\',\'' + sImg + '\');" class="news-item">';
			htmlStr += '<div class="new-item-left">';
			htmlStr += '<p class="news-title"><span>' + news.Title + '</span></p>';
			htmlStr += '<p class="sub-txt-2"><span class="spr-smicon_playnum"></span><span>播放量:</span><span class="play-num">' + videoInfo.iTime + '</span>&nbsp;&nbsp;<span>' + PUBLIC_FUNCTION.ReloadPubdate(news.indexDate) + '</span></p>';
			htmlStr += '</div>';
			htmlStr += '<div class="new-item-right"><span class="video-box news-pics fitSize video-state"><img src="' + sImg + '" alt=""><i class="video-duration">' + min + ':' + sec + '</i></span></div>';

			htmlStr += '</a>';
		}
		return htmlStr;
	},

	FillSupportInfo : function() {
		var self = COLLECTION;
		var goUrl = self.dTeamSupportUrl + '?r1=TeamSupportList&act=query&p0=1&p1=' + self.bGameId + '&p2=' + self.bMatchId;
		$.ajax({
			type : 'GET',
			url : goUrl,
			dataType : 'script',
			success : function() {
				if (TeamSupportList.status == 0) {
					var data = TeamSupportList.msg;
					var team_a = 0;
					var team_b = 0;
					for ( var x in data) {
						if (data[x].iItem == self.bTeamAId) {
							team_a = +data[x].iNum;
						} else if (data[x].iItem == self.bTeamBId) {
							team_b = +data[x].iNum;
						}
					}
					var tmp = team_a / (team_a + team_b) * 100;
					var percent = +tmp.toFixed(1);
					var percent_b = (100 - percent).toFixed(1);
					$("#supportTeam1").html(team_a);
					$("#teamA_support").html(team_a);
					$("#supportTeam2").html(team_b);
					$("#teamB_support").html(team_b);
					$(".blue-part-percent").eq(0).html(percent + '%');
					$(".blue-part").css('width', percent + '%');
					$(".blue-part-percent").eq(1).html(percent_b + '%');
				}
				$('#team-support').show();
			}
		});
	},

	// 战队支持
	TeamSupport : function(id) {
		need([ "biz.login" ], function(LoginManager) {
			LoginManager.checkLogin(function() {
				var self = COLLECTION;
				var teamId = 0;
				if (id == 'A') {
					teamId = self.bTeamAId;
				} else {
					teamId = self.bTeamBId;
				}
				// 待定的战队，不能进行投票
				if (+teamId == 85) {
					alert("请等待战队确认之后再进行投票支持");
					return;
				}
				var goUrl = self.dTeamSupportUrl + '?r1=TeamSupport&act=add&p0=1&p1=' + self.bGameId + '&p2=' + self.bMatchId + '&p3=' + teamId;
				$.ajax({
					type : 'GET',
					url : goUrl,
					dataType : 'script',
					xhrFields : {
						withCredentials : true
					},
					success : function() {
						if (TeamSupport.status == 0) {
							alert(self.dMsg001);
							var num = +$("#team" + id + "_support").html() + 1;
							$("#team" + id + "_support").html(num);
						} else {
							alert(TeamSupport.msg);
						}
					}
				});
			}, function() {
				LoginManager.login();
			});
		});
	}
}/*  |xGv00|da0f909a89cff30141ba4769c1c871ed */