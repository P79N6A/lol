var FBrowser = new Object();
FBrowser.isIE = ((navigator.userAgent.indexOf('MSIE') == -1) ? false : true);
FBrowser.isIE7 = ((FBrowser.isIE && window.XMLHttpRequest) ? true : false);
FBrowser.isIE6 = ((FBrowser.isIE && !window.XMLHttpRequest && window.ActiveXObject) ? true : false);
FBrowser.isFirefox = ((navigator.userAgent.indexOf('Firefox') == -1) ? false : true);
FBrowser.isOpera = ((navigator.userAgent.indexOf('Opera') == -1) ? false : true);
function FloadJS(url, sucfn, failfn) {
	var h = document.getElementsByTagName('HEAD').item(0);
	var js = document.createElement("script");
	js.type = "text/javascript";
	js.onerror = function() {
		if ('function' == typeof (failfn)) {
			var ret = failfn();
			return ret;
		}
	};
	if (FBrowser.isIE) {
		js.onreadystatechange = function() {
			if (this.readyState.toLowerCase() != "complete" && this.readyState.toLowerCase() != "loaded")
				return;
			if (this.$funExeced != true && 'function' == typeof (sucfn)) {
				this.$funExeced = true;
				h.removeChild(js);
				var ret = sucfn();
				return ret;
			}
			;
		}
	} else {
		js.onload = function() {
			if ('function' == typeof (sucfn)) {
				var ret = sucfn();
				h.removeChild(js);
				return ret;
			}
		}
	}
	js.src = url;
	h.appendChild(js);
}

var iframesrcStr = '';
var getQTLiveUrl = function(qth) {
	if (iframesrcStr != '') {
		return;
	}
	var url = 'http://liveaccess.qt.qq.com/get_video_url_v2?module=' + qth + '&videotype=m3u8';

	var successFun = function() {
		var channellist = QT_LIVE_URL.channellist;
		for ( var i = 0; i < channellist.length; i++) {
			if (channellist[i]['bitrate'] == '512') {
				var channel = channellist[i];
			}
		}
		if (typeof (channel) == 'undefined') {
			var channel = channellist[0];
		}
		var url = channel['urllist'].split(';');
		var index = parseInt(url.length * Math.random());
		var urlstr = url[index];
		console.log(urlstr);
		iframesrcStr = urlstr;
		$("#live_video").html('<video id="tenvideo_video_player_0" poster="' + defaultImg + '" controls="controls" width="100%" height="100%" x-webkit-airplay="true" webkit-playsinline="" playsinline="true" preload="none" src="' + urlstr + '"></video>')
		return urlstr;
	}
	var faileFun = function() {
		alert('暂无直播');
		return '';
	}
	var urlStr = FloadJS(url, successFun, faileFun);
}
//getQTLiveUrl(764502578);

var txtLiveUrl = '';
var defaultImg = 'http://ossweb-img.qq.com/images/lpl/m/web201704/default.png';
function matchLive(qth, wordLiveUrl) {
	// 解决移动端不能播放的问题（ios没有flash插件）
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
	var iframesrc = '';
	if (isiOS || isAndroid) {
		// iframesrc = 'http://qt.qq.com/zhibo/mobile.html?tag=' + qth
		getQTLiveUrl(qth);
		/*if (iframesrcStr == '') {
			setTimeout(function(qth, wordLiveUrl) {
				matchLive(qth, wordLiveUrl)
			}, 500)
		}
		iframesrc = iframesrcStr*/
		console.log(iframesrc);
	} else {
		iframesrc = 'http://qt.qq.com/zhibo/index.html?tag=' + qth + '&ADTAG=zhibo.inner.lolweb.match2&usebarrage=1'
		$("#live_video").html('<video id="tenvideo_video_player_0" poster="' + defaultImg + '" controls="controls" width="100%" height="100%" x-webkit-airplay="true" webkit-playsinline="" playsinline="true" preload="none" src="' + iframesrc + '"></video>')
	}
	// $("#live_video").html('<iframe id="ifrVideo" frameborder="0"
	// scrolling="no" width="100%" height="100%" src="' + iframesrc +
	// '"></iframe>')
	// 文字直播
	if (wordLiveUrl && wordLiveUrl != '') {
		txtLiveUrl = wordLiveUrl
		var sHtml = '<iframe src="' + txtLiveUrl + '" frameborder="0" width="100%" height="100%" allowtransparency="true" frameborder="0"></iframe>';
		$("#txtLiveBox").html(sHtml);
		setInterval(function() {
			var sHtml = '<iframe src="' + txtLiveUrl + '" frameborder="0" width="100%" height="100%" allowtransparency="true" frameborder="0"></iframe>';
			$("#txtLiveBox").html(sHtml);
		}, 60000);
	}
};

var PUBLIC_FUNCTION = {
	cookieSec : 60 * 60 * 24 * 7,
	dDinYueUrl : "http://apps.game.qq.com/lol/match/apis/searchVideoSubscibe.php",
	dPinLunUrl : "http://apps.game.qq.com/lol/act/a20140627video/getCommentPublic.php?p2=NP_CommentId",
	dLiveMatchList : {
		bMatchLPLId : 49,
		bMatchLSPLId : 50,
		bMatchMSILId : 59,
		bMatchLCKLId : 52,
		bMatchDEId : 70
	},
	dLiveMatchObj : {
		50 : {
			tagid : '1076403327',
			chatid : '3239927'
		},
		52 : {
			tagid : '899617728',
			chatid : '77406728'
		},
	},

	getLiveMatchObj : function(bMatchId) {
		if ('undefined' == typeof (LiveBMatchList)) {
			return false;
		}
		var self = PUBLIC_FUNCTION;
		var liveMatchLIst = LiveBMatchList.msg;
		var length = Object.getOwnPropertyNames(self.dLiveMatchList);
		for ( var i in self.dLiveMatchList) {
			if (!$.isEmptyObject(liveMatchLIst[self.dLiveMatchList[i]]) && liveMatchLIst[self.dLiveMatchList[i]] != "") {
				if (bMatchId) {
					if (bMatchId == liveMatchLIst[self.dLiveMatchList[i]][0]['bMatchId']) {
						return liveMatchLIst[self.dLiveMatchList[i]];
					}
				} else {
					return liveMatchLIst[self.dLiveMatchList[i]];
				}
			}
		}
		return false
	},

	setDefaultImg : function(gameId) {
		switch (gameId) {
			case '49':
				defaultImg = 'http://ossweb-img.qq.com/images/lpl/m/web201704/default.png';
				break;
			case '59':
				defaultImg = 'http://ossweb-img.qq.com/images/lpl/m/web201704/MSIdefault.png';
				break;
			case '50':
				defaultImg = 'http://ossweb-img.qq.com/images/lpl/m/web201704/lspldefault.png';
				break;
			case '70':
				defaultImg = 'http://ossweb-img.qq.com/images/lpl/m/web201704/DEdefault.jpg';
				break;
			default:
				defaultImg = 'http://ossweb-img.qq.com/images/lpl/m/web201704/DEdefault.jpg';
				break;
		}
	},

	// 加载评论
	// InitComment : function(id, type) {
	// var self = PUBLIC_FUNCTION;
	// var goUrl = self.dPinLunUrl + '&p0=' + id + '&p1=' + type;
	// $.ajax({
	// type : 'GET',
	// url : goUrl,
	// dataType : 'script',
	// xhrFields : {
	// withCredentials : true
	// },
	// success : function() {
	// if (commentObj.status == 0) {
	// var commentId = commentObj.msg;
	// $("#comment_div").html('');
	// GetComment(commentId, 'comment_div', 'app');
	// return;
	// }
	// $("#comment_div").html('');
	// }
	// })
	// },

	// 视频订阅
	DinYue : function(qtMatchId) {
		need([ "biz.login" ], function(LoginManager) {
			LoginManager.checkLogin(function() {
				var self = PUBLIC_FUNCTION;
				var goUrl = self.dDinYueUrl + "?type=1&r1=retObj&elements_id=" + qtMatchId;
				$.ajax({
					type : 'GET',
					url : goUrl,
					dataType : 'script',
					xhrFields : {
						withCredentials : true
					},
					success : function() {
						if (retObj.status == 0) {
							alert("预约成功");
							$("#dinyue_" + qtMatchId).html("取消预约");
							$("#dinyue_" + qtMatchId).parent().removeClass('btn_subscribe').addClass('btn_subscribed');
							$("#dinyue_" + qtMatchId).attr('href', 'javascript:PUBLIC_FUNCTION.CancelDinYue(' + qtMatchId + ');');
							milo.cookie.set(cookieKey, true, self.cookieSec);
						} else {
							if (retObj.msg == "Already Subscribed") {
								alert("您已经预约过这场赛事");
								$("#dinyue_" + qtMatchId).html("取消预约");
								$("#dinyue_" + qtMatchId).parent().removeClass('btn_subscribe').addClass('btn_subscribed');
								$("#dinyue_a_" + qtMatchId).attr('href', 'javascript:PUBLIC_FUNCTION.CancelDinYue(' + qtMatchId + ');');
							} else {
								alert(retObj.msg);
							}
						}
					}
				})
			}, function() {
				LoginManager.login();
			});
		});
	},

	// 取消视频订阅
	CancelDinYue : function(qtMatchId) {
		need([ "biz.login" ], function(LoginManager) {
			LoginManager.checkLogin(function() {
				var self = PUBLIC_FUNCTION;
				var goUrl = self.dDinYueUrl + "?type=2&r1=retObj&elements_id=" + qtMatchId;
				$.ajax({
					type : 'GET',
					url : goUrl,
					dataType : 'script',
					xhrFields : {
						withCredentials : true
					},
					success : function() {
						if (retObj.status == 0) {
							alert("取消预约成功");
							$("#dinyue_" + qtMatchId).html("预约直播");
							$("#dinyue_" + qtMatchId).parent().removeClass('btn_subscribed').addClass('btn_subscribe');
							$("#dinyue_a_" + qtMatchId).attr('href', 'javascript:PUBLIC_FUNCTION.DinYue(' + qtMatchId + ');');
						} else {
							alert(retObj.msg);
						}
					}
				})
			}, function() {
				LoginManager.login();
			});
		});
	},

	CheckDinYue : function(qtMatchIdArr) {
		need([ "biz.login" ], function(LoginManager) {
			LoginManager.checkLogin(function() {
				var self = PUBLIC_FUNCTION;
				var qtMatchIdList = qtMatchIdArr.length + '|' + qtMatchIdArr.join('|') + '|';
				var goUrl = self.dDinYueUrl + "?type=3&r1=retObj&list=" + qtMatchIdList;
				$.ajax({
					type : 'GET',
					url : goUrl,
					dataType : 'script',
					xhrFields : {
						withCredentials : true
					},
					success : function() {
						if (retObj.status == 0) {
							var dyList = retObj.msg;
							for ( var i in dyList) {
								var detail = dyList[i];
								if (detail['isSubscribe'] == '1') {
									$("#dinyue_" + i).html("取消预约");
									$("#dinyue_" + i).parent().removeClass('btn_subscribe').addClass('btn_subscribed');
									$("#dinyue_a_" + i).attr('href', 'javascript:PUBLIC_FUNCTION.CancelDinYue(' + i + ');');
								}
							}
						} else {
							alert(retObj.msg);
						}
					}
				})
			});
		});
	},

	// 格式化时间
	ReloadPubdate : function(string) {
		var re = /^(\d{2,4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
		if (re.test(string)) {
			var t = string.match(re);
			var d = new Date(t[1], t[2] - 1, t[3], t[4], t[5], t[6]);
			var c = new Date();
			var s = (c.getTime() - d.getTime()) / 1000;
			var m = Math.floor(s / 60);
			var h = Math.floor(s / 3600);
			var d = Math.floor(s / 86400);
			var n = Math.floor(s / (86400 * 30));
			var y = Math.floor(s / (86400 * 365));
			if (y > 0)
				return y + "年以前";
			if (n > 0)
				return n + "个月以前";
			if (d > 0)
				return d + "天以前";
			if (h > 0)
				return h + "小时以前";
			if (m > 0)
				return m + "分钟以前";
		}
		return "刚刚";
	},

	// date 转 str
	LinuxTimeToDate : function(day) {
		var Year = 0;
		var Month = 0;
		var Day = 0;
		var CurrentDate = "";
		// 初始化时间
		// Year= day.getYear();//有火狐下2008年显示108的bug
		Year = day.getFullYear();// ie火狐下都可以
		Month = day.getMonth() + 1;
		Day = day.getDate();
		Hour = day.getHours();
		Minute = day.getMinutes();
		Second = day.getSeconds();
		CurrentDate += Year + "-";
		if (Month >= 10) {
			CurrentDate += Month + "-";
		} else {
			CurrentDate += "0" + Month + "-";
		}
		if (Day >= 10) {
			CurrentDate += Day;
		} else {
			CurrentDate += "0" + Day;
		}
		if (Hour >= 10) {
			CurrentDate += " " + Hour;
		} else {
			CurrentDate += " 0" + Hour;
		}
		if (Minute >= 10) {
			CurrentDate += ":" + Minute;
		} else {
			CurrentDate += ":0" + Minute;
		}
		if (Second >= 10) {
			CurrentDate += ":" + Second;
		} else {
			CurrentDate += ":0" + Second;
		}
		return CurrentDate;
	},

	Strtotime : function(text, now) {

		var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;
		if (!text) {
			return fail;
		}
		text = text.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ').replace(/[\t\r\n]/g, '').toLowerCase();
		match = text.match(/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);
		if (match && match[2] === match[4]) {
			if (match[1] > 1901) {
				switch (match[2]) {
					case '-': { // YYYY-M-D
						if (match[3] > 12 || match[5] > 31) {
							return fail;
						}

						return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
					case '.': { // YYYY.M.D is not parsed by strtotime()
						return fail;
					}
					case '/': { // YYYY/M/D
						if (match[3] > 12 || match[5] > 31) {
							return fail;
						}

						return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
				}
			} else if (match[5] > 1901) {
				switch (match[2]) {
					case '-': { // D-M-YYYY
						if (match[3] > 12 || match[1] > 31) {
							return fail;
						}

						return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
					case '.': { // D.M.YYYY
						if (match[3] > 12 || match[1] > 31) {
							return fail;
						}

						return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
					case '/': { // M/D/YYYY
						if (match[1] > 12 || match[3] > 31) {
							return fail;
						}

						return new Date(match[5], parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
				}
			} else {
				switch (match[2]) {
					case '-': { // YY-M-D
						if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
							return fail;
						}

						year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
						return new Date(year, parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
					case '.': { // D.M.YY or H.MM.SS
						if (match[5] >= 70) { // D.M.YY
							if (match[3] > 12 || match[1] > 31) {
								return fail;
							}

							return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
						}
						if (match[5] < 60 && !match[6]) { // H.MM.SS
							if (match[1] > 23 || match[3] > 59) {
								return fail;
							}

							today = new Date();
							return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
						}

						return fail; // invalid format, cannot be parsed
					}
					case '/': { // M/D/YY
						if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
							return fail;
						}

						year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
						return new Date(year, parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
					}
					case ':': { // HH:MM:SS
						if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
							return fail;
						}

						today = new Date();
						return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
					}
				}
			}
		}

		// other formats and "now" should be parsed by Date.parse()
		if (text === 'now') {
			return now === null || isNaN(now) ? new Date().getTime() / 1000 | 0 : now | 0;
		}
		if (!isNaN(parsed = Date.parse(text))) {
			return parsed / 1000 | 0;
		}

		date = now ? new Date(now * 1000) : new Date();
		days = {
			'sun' : 0,
			'mon' : 1,
			'tue' : 2,
			'wed' : 3,
			'thu' : 4,
			'fri' : 5,
			'sat' : 6
		};
		ranges = {
			'yea' : 'FullYear',
			'mon' : 'Month',
			'day' : 'Date',
			'hou' : 'Hours',
			'min' : 'Minutes',
			'sec' : 'Seconds'
		};

		function lastNext(type, range, modifier) {
			var diff, day = days[range];

			if (typeof day !== 'undefined') {
				diff = day - date.getDay();

				if (diff === 0) {
					diff = 7 * modifier;
				} else if (diff > 0 && type === 'last') {
					diff -= 7;
				} else if (diff < 0 && type === 'next') {
					diff += 7;
				}

				date.setDate(date.getDate() + diff);
			}
		}

		function process(val) {
			var splt = val.split(' '), // Todo: Reconcile this with regex using
			// \s, taking into account browser
			// issues with split and regexes
			type = splt[0], range = splt[1].substring(0, 3), typeIsNumber = /\d+/.test(type), ago = splt[2] === 'ago', num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

			if (typeIsNumber) {
				num *= parseInt(type, 10);
			}

			if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
				return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
			}

			if (range === 'wee') {
				return date.setDate(date.getDate() + (num * 7));
			}

			if (type === 'next' || type === 'last') {
				lastNext(type, range, num);
			} else if (!typeIsNumber) {
				return false;
			}

			return true;
		}

		times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' + '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' + '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
		regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

		match = text.match(new RegExp(regex, 'gi'));
		if (!match) {
			return fail;
		}
		for (i = 0, len = match.length; i < len; i++) {
			if (!process(match[i])) {
				return fail;
			}
		}
		return (date.getTime() / 1000);
	}
}

var CallFunction = function(m, a, param, control, Noload) {
	need("biz.login", function(LoginManager) {
		var LoginFunc = function() {
			var goUrl = "http://apps.game.qq.com/lol/a20170106Yumi/" + control + ".php?module=" + m + "&action=" + a + "&" + param + "&rid=" + Math.random();
			$.getScript(goUrl, function() {
				if (typeof (window["J_" + control]) != "undefined" && window["J_" + control] != null) {
					var iRet = parseInt(window["J_" + control]["iRet"], 10);
					if (iRet == 0) {
						var ParamArray = m.split("_").concat(a.split("_"));
						for ( var i = 0; i < ParamArray.length; i++) {
							if (ParamArray[i] == "")
								continue;
							if (typeof (window["J_" + control][ParamArray[i]]) != "undefined" && window["J_" + control][ParamArray[i]] != null)
								if (typeof (window[ParamArray[i]]) == "function")
									window[ParamArray[i]](window["J_" + control][ParamArray[i]]);
						}
					} else {
						showSysInfo(window["J_" + control]["sMsg"]);
					}
				}
			});
		};
		LoginManager.checkLogin(LoginFunc, UnloginFunc);
	});
};

var UnloginFunc = function() {
	need("biz.login", function(LoginManager) {
		LoginManager.login();
	});
};

var CheckLOLer = function(vData) {
	var iRet = parseInt(vData["iRet"], 10);
	if (iRet == 0) {
		if (vFactoryType == 'damai') {
			location.href = vJumpLink + vData["list"]["vOpenId"] + "&timenum=" + vData["list"]["timenum"] + "&sig=" + vData["list"]["sig"];
		} else if (vFactoryType == 'weipiao' || vFactoryType == 'weisai') {
			location.href = vJumpLink + vData["list"]["lUin"] + "&timenum=" + vData["list"]["timenum"] + "&sig=" + vData["list"]["sig"];
		}
	} else {
		showSysInfo(vData["sMsg"]);
	}
};

var GetGameTypeList = [ '默认', '春季赛常规赛', '', '', '', '春季赛季后赛', '春季赛升降级赛', '夏季赛常规赛', '夏季赛季后赛', '夏季赛升降级赛', '胜者A组', '败者A组', '胜者B组', '败者B组', '胜者C组', '败者C组', '胜者D组', '败者D组', '淘汰赛', '小组赛', '广州赛区', '上海赛区', '武汉赛区', '长沙赛区', '北京赛区', '赛区对抗赛', '1V1淘汰赛', '娱乐赛', '入围赛' ];
var GameModeList = [ '默认', 'BO1', 'BO2', 'BO3', 'BO5', '射手模式', '刺客模式', '克隆大作战', '双人共玩', '魄罗王大战' ];/*  |xGv00|9b25dc9f5f9ac63533551be0833a2e95 */