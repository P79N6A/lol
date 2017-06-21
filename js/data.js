var DATA = {
	teamList : {}, // ����ս����Ϣ
	memberList : {},// ���ж�Ա��Ϣ
	iRankList : 3, // ѡ�����а�����չʾ����
	iGameId : 49,
	sGameType : '1,5',
	dPlayerUrl : 'http://apps.game.qq.com/lol/act/a20160519Match/Match.php?_a=personalrank&iPage=1',
	dTeamScoreBar : [ 5, 51 ],// ���ְ�tab���ֱ��ӦLPL/LCKһ������id
	init : function() {
		var self = DATA;
		self.teamList = TeamList.msg;
		self.memberList = MemberList.msg;

		// ���ػ��ְ�����
		self.initScoreData();
		// ���ػ�ɱ������
		self.initKillData();
	},

	/* ������ְ����� */
	initScoreData : function() {
		var self = DATA;
		if (GroupTeamScores.status != 0) {
			return;
		}
		var groupTeamScore = GroupTeamScores.msg;
		for ( var x in self.dTeamScoreBar) {
			var gameId = self.dTeamScoreBar[x];
			for ( var y in groupTeamScore) {
				if (y == gameId) {
					var _tmp = new Array();
					for ( var j in groupTeamScore[y]['group']) {
						var groupName = groupTeamScore[y]['group'][j]['Group'];
						var scoreList = groupTeamScore[y]['score'][groupName];
						var _tmpGroupName = (groupName == '0' ? 'A' : groupName);
						var _tmpDataList = new Array();
						for ( var i in scoreList) {
							var score = scoreList[i];
							var socreObj = {
								rank : +i + 1,
								img : self.teamList[score['TeamId']]['TeamLogo'],
								team : score['TeamName'],
								win : score['Value1'],
								lose : score['Value3'],
								points : score['Score'],
							}
							_tmpDataList.push(socreObj);
						}
						var _obj = {
							group : _tmpGroupName,
							list : _tmpDataList
						}
						_tmp.push(_obj);
					}
					_tmp.sort(function(a, b) {
						return a.group > b.group;
					})
					leagueData.push(_tmp);
				}
			}
		}
	},

	/* ���ػ�ɱ������ */
	initKillData : function() {
		var self = DATA;
		var url = self.dPlayerUrl + '&sRet=KillList&iGameId=' + self.iGameId + '&sGameType=' + self.sGameType;
		$.ajax({
			type : 'GET',
			url : url,
			dataType : 'script',
			success : function() {
				if (KillList_RES.ret_code == 0) {
					var killList = KillList_RES.msg.data;
					var limit = killList.length > self.iRankList ? self.iRankList : killList.length;
					var list = new Array();
					for ( var i = 0; i < limit; i++) {
						var playerInfo = killList[i];
						var _obj = {
							rank : i + 1,
							img : self.memberList[playerInfo['iMemberId']]['UserIcon'],
							name : playerInfo['sMemberName'],
							team : self.teamList[playerInfo['iTeamId']]['TeamName'],
							times : +playerInfo['iKill']
						}
						list.push(_obj);
					}
					var killObj = {
						rankName : '��ɱ��',
						title : '��ɱ��',
						list : list
					}
					playerData.push(killObj);

					// ��������������
					self.initAssistData();
				} else {
					alert(KillList_RES.msg);
				}
			}
		})
	},

	/* �������������� */
	initAssistData : function() {
		var self = DATA;
		var url = self.dPlayerUrl + '&sRet=AssistList&iGameId=' + self.iGameId + '&sGameType=' + self.sGameType + '&iType=1';
		$.ajax({
			type : 'GET',
			url : url,
			dataType : 'script',
			success : function() {
				if (AssistList_RES.ret_code == 0) {
					var assistList = AssistList_RES.msg.data;
					var limit = assistList.length > self.iRankList ? self.iRankList : assistList.length;
					var list = new Array();
					for ( var i = 0; i < limit; i++) {
						var playerInfo = assistList[i];
						var _obj = {
							rank : i + 1,
							img : self.memberList[playerInfo['iMemberId']]['UserIcon'],
							name : playerInfo['sMemberName'],
							team : self.teamList[playerInfo['iTeamId']]['TeamName'],
							times : +playerInfo['iAssists']
						}
						list.push(_obj);
					}
					var assitObj = {
						rankName : '������',
						title : '������',
						list : list
					}
					playerData.push(assitObj);

					// ����MVP������
					self.initMvpData();
				} else {
					alert(AssistList_RES.msg);
				}
			}
		});
	},

	/* ����MVP������ */
	initMvpData : function() {
		var self = DATA;
		var list =  [
		                {rank: 1, img: self.memberList['35']['UserIcon'], name: 'Doinb', team: 'QG', times: '69.54'},
		                {rank: 2, img: self.memberList['14']['UserIcon'], name: 'Uzi', team: 'RNG', times: '68.66'},
		                {rank: 3, img: self.memberList['5']['UserIcon'], name: 'Meiko', team: 'EDG', times: '67.94'}
		            ]
		var mvpObj = {
				rankName : 'ս����',
				title : '�ۺ�����',
				list : list
			}
			playerData.push(mvpObj);
			// ҳ�����
			dataPageJs.init();
			
			
		/*var url = self.dPlayerUrl + '&sRet=MVPList&iGameId=' + self.iGameId + '&sGameType=' + self.sGameType + '&iType=9';
		$.ajax({
			type : 'GET',
			url : url,
			dataType : 'script',
			success : function() {
				if (MVPList_RES.ret_code == 0) {
					var mvpList = MVPList_RES.msg.data;
					var limit = mvpList.length > self.iRankList ? self.iRankList : mvpList.length;
					var list = new Array();
					for ( var i = 0; i < limit; i++) {
						var playerInfo = mvpList[i];
						var _obj = {
							rank : i + 1,
							img : self.memberList[playerInfo['iMemberId']]['UserIcon'],
							name : playerInfo['sMemberName'],
							team : self.teamList[playerInfo['iTeamId']]['TeamName'],
							times : +playerInfo['iMVPFrequency']
						}
						list.push(_obj);
					}
					var mvpObj = {
						rankName : 'MVP��',
						title : 'MVP��',
						list : list
					}
					playerData.push(mvpObj);
					// ҳ�����
					dataPageJs.init();
				} else {
					alert(MVPList_RES.msg);
				}
			}
		})*/
	}
}/*  |xGv00|8dc83e2d3baa70feff25351921e48ddd */