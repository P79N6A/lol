var CONTEST = {
	teamList : {}, // ����ս����Ϣ
	scoreInfo : {},
	gameType : {
		'49' : 'LPL',
		'50' : 'LSPL',
		'52' : 'LCK',
		'59' : 'MSI',
		'70' : '�������Ǳ�'
	},

	Init : function() {
		var self = CONTEST;
		self.teamList = TeamList.msg;
		self.teamList['25']['TeamLogo'] = 'http://ossweb-img.qq.com/images/lpl/m/web201704/TSM1.png';

		// ��ʼ��LPLս��ʤ������
		self.InitScoreInfo();
		// ��ʼ����������
		self.initMoreContest();
	},

	InitScoreInfo : function() {
		var self = CONTEST;
		var lplTeamScoreInfo = GroupTeamScores['msg']['5']['score'];
		for ( var group in lplTeamScoreInfo) {
			for ( var teamIndex in lplTeamScoreInfo[group]) {
				var teamInfo = lplTeamScoreInfo[group][teamIndex];
				self.scoreInfo[teamInfo['TeamId']] = teamInfo;
			}
		}
		// ��Ӵ�����Ϣ
		self.scoreInfo['85'] = {
			GameId : 49,
			TeamName : '����',
			Value1 : 0,
			Value3 : 0
		};
	},

	initMoreContest : function() {
		var self = CONTEST;
		self.FillMatchHtml(MobileAllBMatchInfo['msg']);
		
		/*var url = 'http://apps.game.qq.com/lol/match/apis/searchBMatchInfo.php?p1=49&pagesize=1&r1=retPageInfo';
		$.ajax({
			type : 'GET',
			url : url,
			dataType : 'script',
			success : function() {
				if (retPageInfo.status == 0) {
					var pageSize = retPageInfo.msg.total;
					var goUrl = 'http://apps.game.qq.com/lol/match/apis/searchBMatchInfo.php?p1=49&pagesize=' + pageSize + '&r1=MatchListObj';
					$.ajax({
						type : 'GET',
						url : goUrl,
						dataType : 'script',
						success : function() {
							var list = MatchListObj.msg.result;
							var data = {};
							for ( var i in list) {
								var match = list[i];
								var dateArr = match.MatchDate.split(" ");
								if (!data[dateArr[0]]) {
									data[dateArr[0]] = {};
								}
								data[dateArr[0]][match['bMatchId']] = match;
							}
							self.FillMatchHtml(data);
						}
					})
				} else {
					alert(MatchListObj.msg);
				}
			}
		})*/
	},

	FillMatchHtml : function(data) {
		var self = CONTEST;
		var sHtml = '';
		var yesterday = GetDateStr(-1);
		var today = GetDateStr(0);
		var tomorrow = GetDateStr(+1);
		var qtMatchArr = [];
		for ( var x in data) {
			var list = data[x];
			var dateDesc = '';
			var todayFlag = '';
			switch (x) {
				case yesterday:
					dateDesc = '����';
					break;
				case today:
					dateDesc = '����';
					todayFlag = 'today';
					break;
				case tomorrow:
					dateDesc = '����';
					break;
			}
			sHtml += '<p class="sort-time ' + todayFlag + '"><span>' + x + '</span>&nbsp;&nbsp;<span>' + dateDesc + '</span></p>';
			console.log(x);
			for ( var y in list) {
				var match = list[y];
				console.log(match.TeamA);
				var btnClass = '';
				var btnDesc = '';
				switch (match.MatchStatus) {
					case '1':
						if (match.iQTMatchId && match.iQTMatchId != 0) {
							sHtml += '<a href="javascript:PUBLIC_FUNCTION.DinYue(' + match.iQTMatchId + ');;"  id="dinyue_a_' + match.iQTMatchId + '"  class="u-contest clearfix toSubscribe" ontouchend="pgvSendClick({hottag:\'m.moreContests.btn.subscribe\'});">';
							btnClass = 'btn_subscribe';
							btnDesc = '���ı���';
							qtMatchArr.push(match.iQTMatchId);
						} else {
							sHtml += '<a href="javascript:;" class="u-contest clearfix toSubscribe" ontouchend="pgvSendClick({hottag:\'m.moreContests.btn.subscribe\'});">';
							btnClass = 'btn_subscribe';
							btnDesc = '�����ڴ�';
						}
						// ����δ��ʼ
						break;
					case '2':
						sHtml += '<a href="liveRoom.htm?bid='+ match.bMatchId +'" class="u-contest clearfix" ontouchend="pgvSendClick({hottag:\'m.moreContests.btn.watchlive\'});">';
						btnClass = 'btn_seeLive';
						btnDesc = 'ֱ����';
						// ����ֱ����
						break;
					case '3':
						btnClass = 'btn_seeAll';
						btnDesc = '�ۿ�����';
						sHtml += '<a href="videoCollection.htm?bid=' + match.bMatchId + '" class="u-contest clearfix" ontouchend="pgvSendClick({hottag:\'m.moreContests.btn.view\'});">';
						// �����ѽ���
						break;
				}
				var gameName = self.gameType[match.GameId]? self.gameType[match.GameId]:'';
				var winPrecentA = '';
				var winPrecentB = '';
				if(match.GameId == '49'){
					winPrecentA = (self.scoreInfo[match['TeamA']] ? self.scoreInfo[match['TeamA']]['Value1'] : 0) + 'ʤ - ' + (self.scoreInfo[match['TeamA']] ? self.scoreInfo[match['TeamA']]['Value3'] : 0) + '��';
					winPrecentB =  (self.scoreInfo[match['TeamB']] ? self.scoreInfo[match['TeamB']]['Value1'] : 0) + 'ʤ - ' + (self.scoreInfo[match['TeamB']] ? self.scoreInfo[match['TeamB']]['Value3'] : 0) + '��';
				}
				sHtml += '<div class="c-side fl"><div class="team-txt"><p class="team-name">' + self.teamList[match.TeamA]['TeamName'] + '</p><p>' + winPrecentA + '</p></div><div class="team-icon"><img src="' + self.teamList[match.TeamA]['TeamLogo'] + '" alt=""></div></div>';
				if (match.MatchStatus == '1') {
					sHtml += '<div class="c-center"><p class="team-week"><span>'+gameName+'</span>&nbsp;&nbsp;<span>' + match.GameProcName + '</span></p><p class="live-time"><span>' + match.MatchDate.split(" ")[1].substr(0, 5) + '</span><span>&nbsp;&nbsp;ֱ��</span></p><p><span class="child-ib state-btn-comm btn_subscribe"><span class="btn-state-txt" ' + (match.iQTMatchId && match.iQTMatchId != 0 ? 'id="dinyue_' + match.iQTMatchId + '"' : '') + '>' + btnDesc
							+ '</span><span class="btn-state-icon"></span></span></p></div>';
				} else {
					sHtml += '<div class="c-center"><p class="team-week"><span>'+gameName+'</span>&nbsp;&nbsp;<span>' + match.GameProcName + '</span></p><p class="score-versus"><span>' + match.ScoreA + '</span><span>-</span><span>' + match.ScoreB + '</span></p>';
					sHtml += '<p><span class="child-ib state-btn-comm ' + btnClass + '"><span class="btn-state-txt">' + btnDesc + '</span><span class="btn-state-icon"></span></span></p></div>';
				}
				sHtml += ' <div class="c-side fr"><div class="team-txt"><p class="team-name">' + self.teamList[match.TeamB]['TeamName'] + '</p><p>' + winPrecentB + '</p></div><div class="team-icon"><img src="' + self.teamList[match.TeamB]['TeamLogo'] + '" alt=""></div></div>';
				sHtml += '</a>';
			}
		}
		$('#matchList').html(sHtml);
		var objTr = $("#matchList p.today");
		var topNum = 0;
		if (objTr.length > 0) {
			var obj = $(objTr[0]).prev().prev();
			topNum = +topNum + obj[0].offsetTop;
		} else {
			var obj = $(GetShowObj()).prev().prev();
			topNum = +topNum + obj[0].offsetTop;
		}
		window.scrollTo(0, topNum);

		if (qtMatchArr.length > 0) {
			PUBLIC_FUNCTION.CheckDinYue(qtMatchArr);
		}
	}
}

function GetShowObj() {
	var objList = $('#matchList .sort-time');
	var today = new Date().getTime();
	for ( var i = 0; i < objList.length; i++) {
		var date = $(objList[i]).find('span').eq(0).html();
		var dateObj = new Date(date.replace(new RegExp('-', 'g'), '/') + ' 00:00:00');
		if (dateObj.getTime() >= today) {
			return objList[i];
		}
	}
	return objList[objList.length - 1];
}

function GetDateStr(AddDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount);// ��ȡAddDayCount��������
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1;// ��ȡ��ǰ�·ݵ�����
	m = m.toString();
	if (m.length == 1) {
		m = '0' + m;
	}
	var d = dd.getDate();
	d = d.toString();
	if (d.length == 1) {
		d = '0' + d;
	}
	return y + "-" + m + "-" + d;
}/*  |xGv00|c58a83a640552282d79344c35892878e */