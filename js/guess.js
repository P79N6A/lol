var LPL_Guess = {
	dSupportURI : 'http://apps.game.qq.com/lol/act/a20150904matchVote/voteIDIP.php',
	dGuessURI : 'http://apps.game.qq.com/lol/act/a20160417guess/Guess.php',
	// dLiveStatus :
	// 'http://admin.lol.ied.com/m/tmp/match/LOL_MATCH2_SGAME_LIVE_MATCHID_LIST.js',
	dLiveStatus : 'http://lol.qq.com/cms/match2/data/LOL_MATCH2_SGAME_LIVE_MATCHID_LIST.js?r=' + Math.random(),
	dAreaID : 0,
	dSGameId : 30,
	dTeamA : 0,
	dTeamB : 0,
	dTeamNameA : '',
	dTeamNameB : '',
	dTeamALogo : '',
	dTeamBLogo : '',
	dActive_type : 0,
	dCompetition_Question1_ButtonId : 0,
	dCompetition_Question2_ButtonId : 0,
	dEntertainment_Question1_ButtonId : 0,
	dEntertainment_Question_ID : 0,
	dCompetition_answer_list : null,
	dEntertainment_answer_list : null,
	dCookieKey : 'LPL_Guess_',
	dCookieTime : 86400,
	dUin : 0,
	dLiveFlag : false,
	init : function(match) {
		var self = LPL_Guess;
		var submiturl = 'http://lol.qq.com/cms/data/match/LOL_MATCH_' + match.bMatchId + '.js?r=' + Math.random();
		loadScript(submiturl, function() {
			self.dTeamA = match.TeamA;
			self.dTeamB = match.TeamB;
			self.dTeamNameA = match.TeamNameA;
			self.dTeamNameB = match.TeamNameB;
			self.dTeamALogo = TeamList.msg[match.TeamA].TeamLogo;
			self.dTeamBLogo = TeamList.msg[match.TeamB].TeamLogo;
			self.SupportInfo();
			self.dActive_type = 3;
		});
	},

	SupportInfo : function() {
		var self = LPL_Guess;
		loadScript('http://apps.game.qq.com/lol/act/a20150904matchVote/voteIDIP.php?type=1&client_type=3&r1=CheckObj', function() {
			if (CheckObj.status == 0) {
				if (CheckObj.msg.status == 1) {
					$('.support_line_control').width(CheckObj.msg.supports1 + '%');
					$('#supports1Width').html(CheckObj.msg.supports1 + '%');
					$('#teamA_support').html(CheckObj.msg.supports1 + '%');
					$('#supports2Width').html(CheckObj.msg.supports2 + '%');
					$('#TeamALogo').attr('src', self.dTeamALogo).show();
					$('#TeamBLogo').attr('src', self.dTeamBLogo).show();
					$('.lpl_support_box').removeClass("none");
					$(".adapt").css({
						height : parseInt($(".ovht").height()) - 55 + "px"
					});
					$('#video_top').removeClass("nogus");
					$(".seeking-left .tit-box").removeClass("pt30");
				} else {
					$('.lpl_support_box').addClass("none");
				}
			} else {
				$('.lpl_support_box').addClass("none");
			}
		});
	},

	DoVote : function(team) {
		var self = LPL_Guess;
		need("biz.login", function(LoginManager) {
			LoginManager.checkLogin(function() {
				loadScript('http://apps.game.qq.com/lol/act/a20150904matchVote/voteIDIP.php?type=2&client_type=3&support=' + team + '&r1=voteObj', function() {
					if (voteObj.status == 0) {
						alert('支持成功！');
						self.SupportInfo();
					} else {
						alert(voteObj.msg);
					}
				});
			}, function() {
				LoginManager.login();
			});
		});
	},

	LoadGuessInfo : function() {
		var self = LPL_Guess;
		var submiturl = self.dGuessURI + '?client_Type=3&action=check&r1=checkObj&r=' + Math.random();
		loadScript(submiturl, function() {
			if (checkObj.status == 0) {
				var data = null;
				var all_activity_info_list = checkObj.msg.all_activity_info_list;
				for ( var x in all_activity_info_list) {
					for ( var y in all_activity_info_list[x]) {
						if (all_activity_info_list[x][y]['active_type'] == self.dActive_type) {
							data = all_activity_info_list[x][0];
						}
					}
				}
				if (data) {
					self.dCompetition_answer_list = checkObj.msg.competition_answer_list;
					self.dEntertainment_answer_list = checkObj.msg.entertainment_answer_list;
					self.dMatchId = data.match_id;
					self.PushQuestion(data);
				}
			} else {
				if (self.dLiveFlag) {
					$('.guess3').show();
					$('.guess1').hide();
					$('.guess2').hide();
					$('.lpl_guess_wrap').removeClass("none").show();
				} else {
					// $('.lpl_guess_wrap').removeClass("none").show();
					// $('.guess3').show();
				}
			}
		});
	},

	PushQuestion : function(data) {
		var self = LPL_Guess;
		if (self.dActive_type == 2) {
			var data = data.competition_quiz_info[0][0];
			$('#sponsor').html(data.sponsor_information);
			$('#guessTeamA').html(data.question_list[0][0].button_list[0][0].button_title);
			$('#guessTeamB').html(data.question_list[0][0].button_list[1][0].button_title);
			if (self.dCompetition_answer_list) {
				for ( var x in self.dCompetition_answer_list) {
					for ( var y in self.dCompetition_answer_list[x]) {
						$('#Question' + self.dCompetition_answer_list[x][y]['question_id'] + '_Button_' + self.dCompetition_answer_list[x][y]['button_id']).addClass('selected');
					}
				}
				$('.guess2 .lpl_guess_confirm').attr('href', 'javascript:;').css('background', '#999').html('已选择');
			} else {
				$('.guess2 .lpl_guess_confirm').attr('href', 'javascript:LPL_Guess.DoAnswer()').css('background', '#fe4021').html('确认选择');
			}
			$('.guess2').show();
			$('.lpl_guess_wrap').removeClass("none").show();
			$('.guess1').hide();
			$('.guess3').hide();
		} else {
			var data = data.entertainment_quiz_info[0][0];
			$('#sponsor').html(data.sponsor_information);
			var question = data.question_list[0][0];
			$('.guess1 .lpl_guess_ques span').html(question.question_title);
			self.dEntertainment_Question_ID = question.question_id;
			var html = '';
			for ( var x in question.button_list) {
				for ( var y in question.button_list[x]) {
					html += '<li id="Question1_Button_' + (+x + 1) + '" onclick="LPL_Guess.dEntertainment_Question1_ButtonId=' + (+x + 1) + ';"><span class="lpl_guess_e">' + LPL_Guess.CheckABCD(+x + 1) + '</span><span>' + question.button_list[x][y]['button_title'] + '</span></li>';
				}
			}
			$('.guess1 .lpl_guess_list').html(html);
			if (self.dEntertainment_answer_list) {
				for ( var x in self.dEntertainment_answer_list) {
					for ( var y in self.dEntertainment_answer_list[x]) {
						$('#Question1_Button_' + self.dEntertainment_answer_list[x][y]['button_id']).addClass('selected');
					}
				}
				$('.guess1 .lpl_guess_confirm').attr('href', 'javascript:;').css('background', '#999').html('已选择');
			} else {
				$(".guess1 .lpl_guess_list li").click(function() {
					$(this).addClass('selected').siblings().removeClass('selected');
				});
				$('.guess1 .lpl_guess_confirm').attr('href', 'javascript:LPL_Guess.DoAnswer()').css('background', '#fe4021').html('确认选择');
			}
			$('.guess1').show();
			$('.lpl_guess_wrap').removeClass("none").show();
			$('.guess2').hide();
			$('.guess3').hide();
		}
	},

	DoAnswer : function() {
		var self = LPL_Guess;
		need("biz.login", function(LoginManager) {
			LoginManager.checkLogin(function() {
				if (self.dActive_type == 2) {
					if (self.dCompetition_Question1_ButtonId == 0 || self.dCompetition_Question2_ButtonId == 0) {
						alert('亲爱的召唤师，请先选择您的答案！');
						return;
					}
					self.BindArea('1,' + self.dCompetition_Question1_ButtonId + '|2,' + self.dCompetition_Question2_ButtonId);
				} else {
					if (self.dEntertainment_Question1_ButtonId == 0) {
						alert('亲爱的召唤师，请先选择您的答案！');
						return;
					}
					self.BindArea('' + self.dEntertainment_Question_ID + ',' + self.dEntertainment_Question1_ButtonId);
				}
			}, function() {
				LoginManager.login();
			});
		});
	},

	BindArea : function(Answer) {
		var self = LPL_Guess;
		var cookieKey = self.dCookieKey + self.dUin;
		var cookieValue = milo.cookie.get(cookieKey);
		if (cookieValue && Answer) {
			self.dAreaID = cookieValue;
			var submiturl = self.dGuessURI + '?matchId=' + self.dMatchId + '&areaId=' + self.dAreaID + '&active_type=' + self.dActive_type + '&answer_list=' + Answer + '&client_Type=3&action=vote&r1=voteObj&r=' + Math.random();
			loadScript(submiturl, function() {
				if (voteObj.status == 0) {
					alert('亲爱的召唤师，恭喜您成功参与答题！');
					self.LoadGuessInfo();
				} else {
					alert(VoteObj.msg);
				}
			});
		} else {
			need([ "biz.roleselector", "util.object" ], function(RoleSelector, jo) {
				RoleSelector.init({
					'gameId' : 'lol',
					'submitEvent' : function(roleObject) {
						self.dAreaID = roleObject.submitData['areaid'];
						var cookieKey = self.dCookieKey + roleObject.submitData['roleid'];
						milo.cookie.set(cookieKey, self.dAreaID, self.dCookieTime, "lol.qq.com", "/", false);
						if (Answer) {
							var submiturl = self.dGuessURI + '?matchId=' + self.dMatchId + '&areaId=' + self.dAreaID + '&active_type=' + self.dActive_type + '&answer_list=' + Answer + '&client_Type=3&action=vote&r1=voteObj&r=' + Math.random();
							loadScript(submiturl, function() {
								if (voteObj.status == 0) {
									alert('亲爱的召唤师，恭喜您成功参与答题！');
									self.LoadGuessInfo();
								} else {
									alert(VoteObj.msg);
								}
							});
						}
					}
				});
				RoleSelector.show();
			});
		}
	},

	CheckABCD : function(str) {
		switch (+str) {
			case 1:
				return 'A';
			case 2:
				return 'B';
			case 3:
				return 'C';
			case 4:
				return 'D';
		}
	}
};/*  |xGv00|e2fb70d0b0a8e5ab1799f01b0be2b141 */