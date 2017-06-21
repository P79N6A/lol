var roomid = 94961178;
var game_id = 2103041;

// �����ҳ�ʼ��
qtp.LiveRoom.init({
	game_id : game_id,
	roomid : roomid,
	type : "pclive",// pclive/personal
	chatMsgCallback : function(obj) {// ������Ϣ
		var box = $("#chatList");
		var sHtml = '<li class="chat-item"><p><span class="chat-title"><span>' + obj.nick + '</span><em>˵��</em></span><i class="chat-detail">' + obj.formatStr + '</i></p></li>';
		box.append(sHtml);
		var chat = $("#chatMain");
		var lis = $("#chatList li");
		chat.scrollTop(chat[0].scrollHeight);
		if (lis.length > 100) {
			if (navigator.userAgent.indexOf('MSIE') >= 0) {
				lis[0].removeNode(true);
			} else {
				lis[0].remove();
			}
		}
	},
	freeGiftMsgCallback : function(obj) {// ���������Ϣ
		console.log(obj);
	},
	chargeGiftMsgCallback : function(obj) {// ����������Ϣ
		console.log(obj);
	},
	viprankMsgCallback : function(obj) {// ���а�����Ϣ
		console.log(obj);
	},
	operMgrMsgCallback : function(obj) {// �������Ա�����Ϣ��for pclive��
		console.log(obj);
	},
	kickMsgCallback : function(obj) {// ���߳�������Ϣ
		console.log(obj);
	},
	videoMsgCallback : function(obj) {// �л�ֱ����Ϣ
		// obj:{ustatus}
		console.log(obj);
	},
	broadcastCallback : function(obj) {// ���й㲥�ϼ�������errorCallback��
		// obj.type
	},
	errorCallback : function(obj) {// �����Ҵ�����Ϣ����������������Ϊ֪ͨ��Ϣ��ʾ��
		// obj:{errno,msg}
		console.log(obj);
	}
});

var LIVE = {
	dLPLId : 49,
	bGameId : 0,
	dTeamSupportUrl : "http://apps.game.qq.com/lol/match/apis/searchTeamSupport.php",
	bTeamAId : '',
	bTeamBId : '',
	dMsg001 : "֧�ֳɹ�",
	bLivingMatch : {},
	bRoomId : '94961178',
	bLiveId : '764502578',
	bMatchId : 0,

	Init : function() {
		var self = LIVE;
		var liveMatchLIst = LiveBMatchList.msg;
		var bmatchId = cimi.getUrlParam('bid');
bmatchId=2055;
		if (bmatchId) {
			var liveMatchObj = PUBLIC_FUNCTION.getLiveMatchObj(bmatchId);
			if(!liveMatchObj){
				self.ShowUnLiveView(bmatchId);
			}else{
				self.bLivingMatch = liveMatchObj[0];
				PUBLIC_FUNCTION.setDefaultImg(self.bLivingMatch.GameId);
				self.bGameId = self.dLPLId;
				self.bTeamAId = self.bLivingMatch.TeamA;
				self.bTeamBId = self.bLivingMatch.TeamB;
				self.InitLivingInfo(); // ��ʼ��ֱ����Ϣ
			}
		}
	},

	InitLivingInfo : function() {
		var self = LIVE;
		var bMatchInfo = self.bLivingMatch;
		var liveMatchType = GetGameTypeList[bMatchInfo.GameTypeId] + ' ' + GameModeList[bMatchInfo.GameMode];
		var livingTitle = '����ֱ����' + bMatchInfo.GameName + ' ' + liveMatchType + ' ' + bMatchInfo.bMatchName;

		var shareOp = {
			/*'title' : livingTitle,
			'desc' : livingTitle,*/
			'TeamNameA' : bMatchInfo.TeamNameA,
			'TeamNameB' : bMatchInfo.TeamNameB,
			'TeamScoreA' : bMatchInfo.ScoreA,
			'TeamScoreB' : bMatchInfo.ScoreB,
			'GameType' : GetGameTypeList[bMatchInfo.GameTypeId]
		}
		initShare('85', shareOp);

		$('.video-tit').html(livingTitle);
		$('.s-team-name').eq(0).html(bMatchInfo.TeamNameA);
		$('.s-team-name').eq(1).html(bMatchInfo.TeamNameB);
		$('#supprot-a').click(function() {
			LPL_Guess.DoVote(bMatchInfo.TeamA);
		})
		$('#supprot-b').click(function() {
			LPL_Guess.DoVote(bMatchInfo.TeamB);
		})
		LPL_Guess.init(bMatchInfo);

		var wordLiveUrl = bMatchInfo.Chat2;
		matchLive(self.bLiveId, wordLiveUrl);
	},

	ShowUnLiveView : function(bmatchId) {
		window.location.href = "http://lpl.qq.com/m/videoCollection.htm?bid=" + bmatchId;
	}

}/*  |xGv00|119c60ab7c38d60f00b9b97dad13e792 */