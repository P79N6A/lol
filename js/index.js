var MATCH = {
	teamList : {},
	scoreInfo : {},
	dLPLId : 49,
	bGameId : 0,
	bLivingMatch : {},
	dLivingFlag : false,
	dQTReplayId : 764502578,
	dQTZBId : 764502578,
	dQTReplyUrl : 'http://qt.qq.com/php_cgi/qt_tv/php/varcache_get_lol_live_schedule_for_lol.php',
	dAllNewsList : {},
	dTeamNewsList : {},
	dOtherNewsList : {},
	dPage : 1,
	dPageSize : 10,
	dNewsIndex : [],
	dCtChannel : '25', // 长图类型
	dXtChannel : '24', // 小图类型
	dHasLoadAllNews : false,
	dIsLoading : false,

	Init : function() {
		var self = MATCH;
		self.teamList = TeamList.msg;
		self.teamList['25']['TeamLogo'] = 'http://ossweb-img.qq.com/images/lpl/m/web201704/TSM1.png';
		// 初始化LPL战队胜负数据
		self.InitScoreInfo();
		self.InitLive(); // 直播
		self.InitNewsInfo(); // 新闻
		self.InitBMatchList(); // 赛程
	},

	InitLive : function() {
		var self = MATCH;
		var liveMatchLIst = LiveBMatchList.msg;
		var liveMatchObj = PUBLIC_FUNCTION.getLiveMatchObj();
		if (!liveMatchObj) {
			self.dLivingFlag = false;
			$('#openStatus').html('展开回放');
			$('#closeStatus').html('收起回放');
			$('.enter-live').hide();
			self.InitReplyInfo();
		} else {
			self.dLivingFlag = true;
			self.bLivingMatch = liveMatchObj[0];
			PUBLIC_FUNCTION.setDefaultImg(self.bLivingMatch.GameId);
			var liveMatchType = GetGameTypeList[self.bLivingMatch.GameTypeId] + ' ' + GameModeList[self.bLivingMatch.GameMode];
			$('.enter-live').attr('href', 'liveRoom.htm?bid=' + self.bLivingMatch.bMatchId);
			$('.video-tit').html('正在直播：' + self.bLivingMatch.GameName + ' ' + self.bLivingMatch.bMatchName);
			$('#openStatus').html('展开直播');
			$('#closeStatus').html('收起直播');
			if (self.bLivingMatch.Video1 && self.bLivingMatch.Video1 != '0') {
				var tagId = self.bLivingMatch.Video1;
			} else if (typeof (PUBLIC_FUNCTION.dLiveMatchObj[self.bLivingMatch.GameId]) != 'undefined') {
				var tagId = PUBLIC_FUNCTION.dLiveMatchObj[self.bLivingMatch.GameId]['tagid'];
			} else {
				var tagId = self.dQTZBId;
			}
			$('#live-spread').attr('onclick', 'cimi.toggleBox(this,\'#live_box\',true);matchLive(\'' + tagId + '\',\'live_video\',false)');
			$('#live-spread').trigger('click');
		}
	},

	InitNewsInfo : function() {
		var self = MATCH;
		self.dAllNewsList = MobileFirPageNewsInfo.msg;
		self.dAllNewsList.sort(function(a, b) {
			var aTime = new Date(a.sIdxTime.replace(new RegExp('-', 'g'), '/')).getTime();
			var bTime = new Date(b.sIdxTime.replace(new RegExp('-', 'g'), '/')).getTime();
			return bTime - aTime;
		})
		if (self.dLivingFlag) {
			for ( var i in self.dAllNewsList) {
				if (self.dAllNewsList[i]['sDesc'].toLowerCase().indexOf(self.bLivingMatch.TeamNameA.toLowerCase()) >= 0 || self.dAllNewsList[i]['sDesc'].toLowerCase().indexOf(self.bLivingMatch.TeamNameB.toLowerCase()) >= 0) {
					self.dTeamNewsList[i] = self.dAllNewsList[i];
				} else {
					self.dOtherNewsList[i] = self.dAllNewsList[i];
				}
			}
			self.dNewsIndex = Object.getOwnPropertyNames(self.dTeamNewsList);
			var otherNews = Object.getOwnPropertyNames(self.dOtherNewsList);
			for ( var i in otherNews) {
				self.dNewsIndex.push(otherNews[i]);
			}
		} else {
			self.dOtherNewsList = self.dAllNewsList;
			self.dNewsIndex = Object.getOwnPropertyNames(self.dOtherNewsList);
		}
		self.NewsToPage();
	},

	NewsToPage : function() {
		var self = MATCH;
		var page = self.dPage;
		var pageSize = self.dPageSize;
		var startIndex = (page - 1) * pageSize; // 0
		var endIndex = startIndex + pageSize; // 10 0~9
		var max = self.dAllNewsList.length;
		if (startIndex >= max) {
			self.dHasLoadAllNews = true;
			return;
		}
		if (endIndex > max) {
			endIndex = max;
		}
		var list = [];
		for ( var i = startIndex; i < endIndex; i++) {
			var index = self.dNewsIndex[i];
			if (self.dOtherNewsList[index]) {
				list.push(self.dOtherNewsList[index]);
			} else {
				list.push(self.dTeamNewsList[index]);
			}
		}
		self.AppendNewsHtml(list);
		self.dIsLoading = false;
	},

	AppendNewsHtml : function(list) {
		var self = MATCH;
		for ( var i in list) {
			var newsInfo = list[i];
			var newsUrlObj = self.GetNewsObj(newsInfo.sUrl);
			if (newsUrlObj == false) {
				continue;
			}
			var htmlStr = '<a href="' + newsUrlObj.url + '" class="news-item">';
			var imgObj = $.parseJSON(newsInfo.sIMG);
			var newsChannelId = newsInfo.iChannelId.split(',');
			var img = self.GetChannelImg(imgObj, newsChannelId);
			if (self.GetNewsType(newsChannelId) == 'ct') {
				htmlStr += '<div class="video-box ' + newsUrlObj.className + '"><img src="' + img + '" alt=""><i class="video-duration"></i></div>';
				htmlStr += '<p class="news-title"><span>' + newsInfo.sTitle + '</span><span class="spr-smicon_hot"></span></p>';
				htmlStr += '<p class="sub-txt-1"><span></span>&nbsp;&nbsp;<span>' + newsInfo.sIdxTime + '</p>';
			} else {
				htmlStr += '<div class="new-item-left"><p class="news-title"><span>' + newsInfo.sTitle + '</span></p><p class="sub-txt-2"><span></span><span></span>&nbsp;&nbsp;<span>' + newsInfo.sIdxTime + '</span></p></div>'
				htmlStr += '<div class="new-item-right ' + newsUrlObj.className + '"><div class="news-pics"><img src="' + img + '" alt=""></div></div>'
			}
			htmlStr += '</a>';
			$('#news-box').append(htmlStr);
		}
	},

	GetNewsType : function(newsChannelId) {
		var self = MATCH;
		for ( var x in newsChannelId) {
			if (newsChannelId[x] == self.dCtChannel) {
				return 'ct';
			}
			if (newsChannelId[x] == self.dXtChannel) {
				return 'xt';
			}
		}
		return '';
	},

	GetNewsObj : function(sUrl) {
		var newObj = {};
		var urlArr = sUrl.split('nid=');
		if (urlArr.length >= 2) {
			newObj.id = urlArr[1];
		} else {
			newObj.className = '';
			newObj.url = sUrl;
			return newObj;
		}
		if (sUrl.indexOf('videoDetail') >= 0 || sUrl.indexOf('video_detail') >= 0) {
			newObj.className = 'video-state';
			newObj.url = 'videoDetail.htm?nid=' + newObj.id;
		} else if (sUrl.indexOf('zixunDetail') >= 0 || sUrl.indexOf('news_detail') >= 0) {
			newObj.className = '';
			newObj.url = 'zixunDetail.htm?nid=' + newObj.id;
		} else {
			return false;
		}
		return newObj;
	},

	GetChannelImg : function(imgObj, newsChannelId) {
		var self = MATCH;
		for ( var i = 0; i < newsChannelId.length; i++) {
			if ((newsChannelId[i] == self.dCtChannel || newsChannelId[i] == self.dXtChannel) && 'undefined' != typeof (imgObj[newsChannelId[i]])) {
				return imgObj[newsChannelId[i]];
			}
		}
		return '';
	},

	InitReplyInfo : function() {
		var self = MATCH;
		var goUrl = self.dQTReplyUrl + '?date=' + milo.toDateString();
		$.getJSON(goUrl, function(retObj) {
			if (retObj.code == 0) {
				var data = retObj.data;
				if (data.list.length <= 0) {
					$('#openStatus').html('暂无回放');
					$('#closeStatus').html('暂无回放');
					$('#live-spread').attr('onclick', '');
					return;
				}
				var list = data.list;
				var isQtReply = false;
				for ( var i in list) {
					var live = list[i];
					var starttime = PUBLIC_FUNCTION.Strtotime(live.begin_date);
					var endtime = PUBLIC_FUNCTION.Strtotime(live.end_date);
					var now = new Date().getTime() / 1000;
					if (now >= starttime && now <= endtime) {
						isQtReply = true;
						$('.video-tit').html('正在回放：' + live.name + (live.sub_title ? live.sub_title : ''));
						$('#live-spread').attr('onclick', 'cimi.toggleBox(this,\'#live_box\',true);matchLive(\'' + self.dQTReplayId + '\')');
					}
				}
				if (isQtReply == false) {
					$('.video-tit').html('正在回放：2016全明星精彩回放');
					$('#live-spread').attr('onclick', 'cimi.toggleBox(this,\'#live_box\',true);matchLive(\'' + self.dQTReplayId + '\')');
				}
				$('#live-spread').trigger('click');
			}
		});
	},

	InitScoreInfo : function() {
		var self = MATCH;
		var lplTeamScoreInfo = GroupTeamScores['msg']['5']['score'];
		for ( var group in lplTeamScoreInfo) {
			for ( var teamIndex in lplTeamScoreInfo[group]) {
				var teamInfo = lplTeamScoreInfo[group][teamIndex];
				self.scoreInfo[teamInfo['TeamId']] = teamInfo;
			}
		}
		// 添加待定信息
		self.scoreInfo['85'] = {
			GameId : 49,
			TeamName : '待定',
			Value1 : 0,
			Value3 : 0
		};
	},

	InitBMatchList : function() {
		var self = MATCH;
		var data = MobileFirstPageMatchInfo['msg'];
		data.sort(function(a, b) {
			var aTime = new Date(a.MatchDate.replace(new RegExp('-', 'g'), '/')).getTime();
			var bTime = new Date(b.MatchDate.replace(new RegExp('-', 'g'), '/')).getTime();
			return aTime - bTime;
		})
		if (self.dLivingFlag) {
			data.sort(function(a, b) {
				if (a.MatchStatus == '2' && '2' == b.MatchStatus) {
					var aTime = new Date(a.MatchDate.replace(new RegExp('-', 'g'), '/')).getTime();
					var bTime = new Date(b.MatchDate.replace(new RegExp('-', 'g'), '/')).getTime();
					return bTime - aTime;
				} else if(a.MatchStatus == '1' || '1' == b.MatchStatus){
					return -1;
				} else {
					return a.MatchStatus - b.MatchStatus;
				}
			})
		}
		self.FillMatchHtml(data);
	},

	FillMatchHtml : function(list) {
		var self = MATCH;
		var sHtml = '';
		var qtMatchArr = [];
		for ( var x in list) {
			var match = list[x];
			var btnClass = '';
			var btnDesc = '';
			switch (match.MatchStatus) {
				case '1':
					if (match.iQTMatchId && match.iQTMatchId != 0) {
						qtMatchArr.push(match.iQTMatchId);
						sHtml += '<a href="javascript:PUBLIC_FUNCTION.DinYue(' + match.iQTMatchId + ');" id="dinyue_a_' + match.iQTMatchId + '" class="u-contest clearfix toSubscribe" ontouchend="pgvSendClick({hottag:\'m.moreContests.btn.subscribe\'});">';
						btnDesc = '订阅比赛';
						btnClass = 'btn_subscribe';
					} else {
						sHtml += '<a href="javascript:;" class="u-contest clearfix toSubscribe" ontouchend="pgvSendClick({hottag:\'m.moreContests.btn.subscribe\'});">';
						btnDesc = '敬请期待';
						btnClass = 'btn_subscribe btn_subscribe_none';
					}
					// 赛程未开始
					break;
				case '2':
					sHtml += '<a href="liveRoom.htm?bid=' + match.bMatchId + '" class="u-contest clearfix" ontouchend="pgvSendClick({hottag:\'m.moreContests.btn.watchlive\'});">';
					btnClass = 'btn_seeLive';
					btnDesc = '直播中';
					// 赛程直播中
					break;
				case '3':
					btnClass = 'btn_seeAll';
					btnDesc = '观看集锦';
					sHtml += '<a href="videoCollection.htm?bid=' + match.bMatchId + '" class="u-contest clearfix" ontouchend="pgvSendClick({hottag:\'m.moreContests.btn.view\'});">';
					// 赛程已结束
					break;
			}
			var winPrecentA = '';
			var winPrecentB = '';
			if (match.GameId == '49') {
				winPrecentA = (self.scoreInfo[match['TeamA']] ? self.scoreInfo[match['TeamA']]['Value1'] : 0) + '胜 - ' + (self.scoreInfo[match['TeamA']] ? self.scoreInfo[match['TeamA']]['Value3'] : 0) + '负';
				winPrecentB = (self.scoreInfo[match['TeamB']] ? self.scoreInfo[match['TeamB']]['Value1'] : 0) + '胜 - ' + (self.scoreInfo[match['TeamB']] ? self.scoreInfo[match['TeamB']]['Value3'] : 0) + '负';
			}
			sHtml += '<div class="c-side fl"><div class="team-txt"><p class="team-name">' + self.teamList[match.TeamA]['TeamName'] + '</p><p>' + winPrecentA + '</p></div><div class="team-icon"><img src="' + self.teamList[match.TeamA]['TeamLogo'] + '" alt=""></div></div>';
			sHtml += '<div class="c-center"><p class="contest-time">' + match.MatchDate.split(" ")[0] + '</p>';
			if (match.MatchStatus == '1') {
				// 订阅比赛
				sHtml += ' <p class="live-time"><span>' + match.MatchDate.split(" ")[1].substr(0, 5) + '</span><span>&nbsp;&nbsp;直播</span></p>';
			} else {
				// 观看集锦
				sHtml += '<p class="score-versus"><span>' + match.ScoreA + '</span><span>-</span><span>' + match.ScoreB + '</span></p>';
			}
			sHtml += '<p><span class="child-ib state-btn-comm ' + btnClass + '"><span class="btn-state-txt" ' + (match.iQTMatchId && match.iQTMatchId != 0 ? 'id="dinyue_' + match.iQTMatchId + '"' : '') + '>' + btnDesc + '</span><span class="btn-state-icon"></span></span></p>';
			sHtml += '</div>';
			sHtml += '<div class="c-side fr"><div class="team-txt"><p class="team-name">' + self.teamList[match.TeamB]['TeamName'] + '</p><p>' + winPrecentB + '</p></div><div class="team-icon"><img src="' + self.teamList[match.TeamB]['TeamLogo'] + '" alt=""></div></div>';
			sHtml += '</a>';
		}
		sHtml += '<a href="moreContests.htm" class="btn-overview child-ib" ontouchend="pgvSendClick({hottag:\'m.index.btn.watchall\'});"><span>查看全部赛程</span><span class="spr-smicon_ck"></span></a>';
		$('#matchList').html(sHtml);
		if (qtMatchArr.length > 0) {
			PUBLIC_FUNCTION.CheckDinYue(qtMatchArr);
		}
	}
}/*  |xGv00|e8937b9f8cdd2f33d20c5d43aedae1b0 */