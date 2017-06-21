var TICKET = {
	dTid : 0,
	dTicketUrl : 'http://lpl.qq.com/web201612/data/LOLTicketTestInfo_#ticketid#.js',
	dTicketList : {},
	dTicketDetailList : {},
	dHasInitShare : false,
	firstFlag : true,
	Init : function() {
		var self = TICKET;
		self.dTicketList = AllTicketInfo;
	},

	InitTicketList : function() {
		var self = TICKET;
		var dTicketList = self.dTicketList;
		$('.m-booking-list').empty();

		var beginTimeArray = [];
		var endTimeArray = [];
		var length = dTicketList.length;
		var chooseBeginTime;
		var chooseEndTime;
		//ѭ�������洢������������
		for ( var i in dTicketList) {
			var ticket = dTicketList[i];
			if((i == length-2) || i == length-1){
				var tmpBeginTime = ticket.data.dtBeginTime;
				var tmpEndTime = ticket.data.dtEndTime;
				beginTimeArray.push(tmpBeginTime);
				endTimeArray.push(tmpEndTime);
			}
		}
		//����ʱ������
		if(beginTimeArray.length == 1){
			chooseBeginTime = beginTimeArray[0];
		}else{
			if(beginTimeArray[0] < beginTimeArray[1]){
				chooseBeginTime = beginTimeArray[0];
			}else{
				chooseBeginTime = beginTimeArray[1];
			}
		}
		if(endTimeArray.length == 1){
			chooseEndTime = endTimeArray[0];
		}else{
			if(endTimeArray[0] > endTimeArray[1]){
				chooseEndTime = endTimeArray[0];
			}else{
				chooseEndTime = endTimeArray[1];
			}
		}

		//ѭ��������ѯ
		for( var i = length-1; i>=0; i--){
			var ticket = dTicketList[i];
			var startDateTime;
			var endDateTime;
			//�����һ�Σ�ȡ����ʱ�䣬����ȡ�����ʱ��
			if(self.firstFlag){
				startDateTime = new Date(chooseBeginTime.replace(new RegExp('-', 'g'), '/')).getTime();
				endDateTime = new Date(chooseEndTime.replace(new RegExp('-', 'g'), '/')).getTime();
			}else{
				startDateTime = new Date($($('#startDatePicker span')[0]).attr('value').replace(new RegExp('-', 'g'), '/')).getTime();
				endDateTime = new Date($($('#endDatePicker span')[0]).attr('value').replace(new RegExp('-', 'g'), '/')).getTime();
			}

			var ticketStartTime = new Date(ticket.data.dtBeginTime.replace(new RegExp('-', 'g'), '/')).getTime();
			var ticketEndTime = new Date(ticket.data.dtEndTime.replace(new RegExp('-', 'g'), '/')).getTime();
			if (ticketStartTime > endDateTime || ticketEndTime < startDateTime) {
				continue;
			}
			self.FillTicketInfo(ticket);
		}
		if(self.firstFlag){
			self.firstFlag = false;

			var dateVal_begin = chooseBeginTime.split(" ")[0].split("-")[1] + "-" + chooseBeginTime.split(" ")[0].split("-")[2];
			var weekDay=new Array(7);
			weekDay[0]="����";
			weekDay[1]="��һ";
			weekDay[2]="�ܶ�";
			weekDay[3]="����";
			weekDay[4]="����";
			weekDay[5]="����";
			weekDay[6]="����";

			var dateHtml_begin = dateVal_begin + " "+weekDay[+self.newDate(chooseBeginTime).getDay()];

			var dateVal_end = chooseEndTime.split(" ")[0].split("-")[1] + "-" + chooseEndTime.split(" ")[0].split("-")[2];;
			var dateHtml_end = dateVal_end + " " + weekDay[+self.newDate(chooseEndTime).getDay()];
			//span��html����ʾ��MM-dd ��X����value������ʾ��2017-04-07��
			$("#startDatePicker").find('span').html(dateHtml_begin).attr('value', chooseBeginTime.split(" ")[0]);
			$("#endDatePicker").find('span').html(dateHtml_end).attr('value', chooseEndTime.split(" ")[0]);
		}
	},

	newDate : function (strdate) {
		var self = TICKET;
		var arr = strdate.split(/[- : \/]/);
		date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
		return date;
	},

	str2date : function(str) {
		var self = TICKET;
		//���⴦��û��ʱ�䲿�ֵ�����
		if (str.indexOf(':') < 0)
			str += ' 00:00:00';
		return new Date(str.replace(/-/g, '/') + ' +0800');
	},

	str2timestamp : function(str){
		var self = TICKET;
		var date = self.str2date(str);
		return Math.floor(date.getTime() / 1000);
	},

	FillTicketInfo : function(ticket) {
		var self = TICKET;
		var tid = ticket.iTicketId;
		var goUrl = self.dTicketUrl.replace('#ticketid#', tid);

		var el = $('<li style="display:none"></li>');
		el.appendTo($('.m-booking-list'));

		$.ajax({
			type : 'GET',
			url : goUrl,
			dataType : 'script',
			success : function() {
				var retObj = window['TicketInfo_' + tid];
				var ticket = retObj.data;
				var sGameInfo = self.GetSGameInfo(ticket.bGameId, ticket.sGameId);

				if (!self.dHasInitShare) {
					self.dHasInitShare = true;
					var shareTitle = sGameInfo['GameName'] + '��Ʊ����������';
					var shareObj = {
						Ticket: sGameInfo['GameName']
					}
					initShare('93', shareObj);
				}

				self.dTicketDetailList[ticket.iTicketId] = ticket;
				var today = new Date().getTime();
				var beginTime = new Date(ticket.dtBeginTime.replace(new RegExp('-', 'g'), '/')).getTime();
				var endTime = new Date(ticket.dtEndTime.replace(new RegExp('-', 'g'), '/')).getTime();

				var ticketObj = {};
				ticketObj.id = ticket.iTicketId;
				ticketObj.canBuy = 0;

				//ticketObj.date1 = self.GetDateStr(ticket.dtBeginTime, ticket.dtEndTime);
				ticketObj.img = sGameInfo.MapIMG;
				ticketObj.place = ticket.vVenueName;
				ticketObj.price1 = self.GetPrice(ticket.vTicketAreaContent) + 'Ԫ';
				if (endTime < today) {
					ticketObj.status = 3;
				} else if (beginTime > today) {
					ticketObj.status = 1;
				} else {
					ticketObj.status = 2;
				}
				ticketObj.time = ticket.dtBeginTime.split(' ')[0] + ' �� ' + ticket.dtEndTime.split(' ')[0];
				var _tmpTicketObj = $.parseJSON(ticket.vTicketAreaContent);

				var xArray = [];
				for ( var x in _tmpTicketObj) {
					xArray.push(x);
				}
				var _len = Math.max.apply(Math,xArray);
				var beginTicketTime = _tmpTicketObj[0]["vTicketBegin"];
				var endTicketTime = _tmpTicketObj[_len]["vTicketEnd"];
				if(!endTicketTime){
					ticketObj.date1 = beginTicketTime;
				}else{
					ticketObj.date1 = beginTicketTime + ' �� ' + endTicketTime;
				}

				ticketObj.title = ticket.vTitle;
				ticketObj.href = "nearTraffic.htm?tid=" + ticket.iTicketId;
				ticketObj.vLimitLevel = ticket.vLimitLevel;
				ticketObj.vJumpLink_H5 = ticket.vJumpLink_H5;
				ticketObj.vFactoryType = ticket.vFactoryType;
				var obj = ticketObj;
				var sHtml = '';
				var statusText = '';
				if (obj.status == 1) {
					statusText = 'δ����';
					obj.canBuy = 1;
				} else if (obj.status == 2) {
					statusText = '������';
					obj.canBuy = 1;
				} else {
					statusText = '�ѽ���';
					obj.canBuy = 0;
				}
				var btnText = '';

				if (obj.canBuy == 1) {
					btnText = '��������';
				} else if (obj.canBuy == 0) {
					btnText = '����ܰ';
				}
//                sHtml += '<li>\
//                            <img src='+obj.img+'>\
//                            <div class="m-info">\
//                                <h2>'+obj.title+'<span class="sell-status-'+obj.status+'">'+statusText+'</span></h2>\
//                                <p class="time">��Ʊʱ�� : <span>'+obj.time+'</span></p>\
//                                <p class="place"><span>'+obj.place+'</span></p>\
//                                <p class="division"></p>\
//                                <h4 class="price">'+obj.date1+':<em>'+obj.price1+'</em></h4>\
//                                <a href="'+obj.href+'" class="btn-detail" title="��������"></a>\
//                                <a href="javascript:'+(obj.canBuy == 1? "TICKET.BuyTicket(' + obj.id + ')" : "")+'"  class="btn-buy-'+obj.canBuy+'">'+btnText+'</a>\
//                            </div>\
//                        </li>';
				sHtml += '<li>'
					+ '<img src=' + obj.img + '>'
					+ '<div class="m-info">'
					+ '<h2>' + obj.title + '<span class="sell-status-' + obj.status + '">' + statusText + '</span></h2>'
					+ '<p class="time">��Ʊʱ�� : <span>' + obj.time + '</span></p>'
					+ '<p class="place"><span>' + obj.place + '</span></p>'
					+ '<p class="division"></p>'
					+ '<h4 class="price">' + obj.date1 + ':<em>' + obj.price1 + '</em></h4>'
					+ '<a href="' + obj.href + '" class="btn-detail" title="��������"></a>'
					+ '<a href="javascript:;"  class="BtnBuy btn-buy-' + obj.canBuy + '">' + btnText + '</a>'
					+ '</div>'
					+ '</li>';
				var el2 = $(sHtml);

				$('.BtnBuy', el2).click(function () {
					TICKET.BuyTicket(obj.id, obj.vLimitLevel, obj.vJumpLink_H5, obj.vFactoryType);
				});
				el.after(el2);
				el.remove();
			}
		})
	},

	GetDateStr : function(dtBeginTime, dtEndTime) {
		var filterZero = function(str) {
			return (str.charAt(0) == 0 ? str.charAt(1) : str);
		}
		var startDate = dtBeginTime.split(' ')[0].split('-');
		var endDate = dtEndTime.split(' ')[0].split('-');
		return filterZero(startDate[1]) + '��' + filterZero(startDate[2]) + '��  �� ' + filterZero(endDate[1]) + '��' + filterZero(endDate[2]) + '��';
	},

	GetSGameInfo : function(bGameId, sGameId) {
		var sGameList = GameList.msg.sGameList;
		if (typeof (sGameList[bGameId]) == 'undefined') {
			return '';
		}
		var sList = sGameList[bGameId];
		for ( var i = 0; i < sList.length; i++) {
			if (sList[i]['GameId'] == sGameId) {
				return sList[i];
			}
		}
		return '';
	},

	BuyTicket : function(id,vLimitLevel,vJumpLink_H5,vFactoryType) {
		var self = TICKET;
		if (!self.dTicketDetailList[id]) {
			return;
		}
		self.vJumpLink_H5 = vJumpLink_H5;
		self.vFactoryType = vFactoryType;
		need("biz.login", function(LoginManager) {
			LoginManager.checkLogin(function() {
				need([ "biz.roleselector" ], function(RoleSelector) {
					RoleSelector.init({
						'gameId' : 'lol',
						'isQueryRole' : true,
						'isShutdownSubmit' : false,
						'submitEvent' : function(roleObject) {
							if (roleObject.submitData["areaid"] == "" || roleObject.submitData["roleid"] == "") {
								alert("�Բ�������ѡ�����");
								return;
							}
							var _data = milo.unSerialize(query_role_result.data);
							if (parseInt(_data["summonerLevel"], 10) < vLimitLevel) {
								alert("�Բ������ĵȼ�����" + vLimitLevel + "��");
								return;
							}
							var areaid = roleObject.submitData["areaid"]

							var goUrl = "http://apps.game.qq.com/lol/a20170106Yumi/TicketCheckLOLer.php?module=&action=CheckLOLer&areaid="+areaid+"&iTicketId="+id + "&rid=" + Math.random();
							loadScript(goUrl, function () {
								if(+J_TicketCheckLOLer.CheckLOLer.iRet != 0) {
									alert(J_TicketCheckLOLer.CheckLOLer.sMsg);
									return;
								}else{
									self.showSysInfo2("��֤�ɹ�������Ϊ����ת��Ʊҳ�棬���Ժ�");
									if(self.vFactoryType == 'damai'){
										location.href = self.vJumpLink_H5 + J_TicketCheckLOLer.CheckLOLer["list"]["vOpenId"] + "&timenum=" + J_TicketCheckLOLer.CheckLOLer["list"]["timenum"] + "&sig=" + J_TicketCheckLOLer.CheckLOLer["list"]["sig"];
									}else if(self.vFactoryType == 'weipiao' || self.vFactoryType == 'weisai'){
										location.href = self.vJumpLink_H5 + J_TicketCheckLOLer.CheckLOLer["list"]["lUin"] + "&timestamp=" + J_TicketCheckLOLer.CheckLOLer["list"]["timenum"] + "&sig=" + J_TicketCheckLOLer.CheckLOLer["list"]["sig"];
									}
								}
							});

							//CallFunction("", "CheckLOLer", "areaid=" + roleObject.submitData["areaid"] + "&iTicketId=" + iTicketId, "TicketCheckLOLer", false);
						},
						'cancelEvent' : function() {
						},
						'openEvent' : function() {
						},
						'closeEvent' : function() {
						}
					});
					RoleSelector.show();
				});
			}, function() {
				LoginManager.login();
			})
		})
	},

	showSysInfo1 : function (sysMsg) {
		$("#sys_info1").html(sysMsg);
		TGDialogS('sys1');
	},

	showSysInfo2 : function (sysMsg) {
		$("#sys_info2").html(sysMsg);
		TGDialogS('sys2');
	},

	GetPrice : function(priceStr) {
		var priceObj = $.parseJSON(priceStr);

		var priceArray = [];
		for ( var x in priceObj) {
			if(!priceObj.hasOwnProperty(x))
				continue;
			var price;
			(price = +priceObj[x]['vTicketPrice1']) && priceArray.push(price);
			(price = +priceObj[x]['vTicketPrice2']) && priceArray.push(price);
			(price = +priceObj[x]['vTicketPrice3']) && priceArray.push(price);
			(price = +priceObj[x]['vTicketPrice4']) && priceArray.push(price);
		}
		var min = Math.min.apply(Math, priceArray);
		var max = Math.max.apply(Math, priceArray);
		return min + ' - ' + max;
	},

	InitFaq : function() {
		var self = TICKET;
		var tid = cimi.getUrlParam('tid');
		if (!tid) {
			tid = 1;
		}
		var goUrl = self.dTicketUrl.replace('#ticketid#', tid);
		$.ajax({
			type : 'GET',
			url : goUrl,
			dataType : 'script',
			success : function() {
				var retObj = window['TicketInfo_' + tid];
				var faq = $.parseJSON(retObj.data.vFAQContent);
				var html = "";
				for ( var x in faq) {
					html += '<div class="faq-item">';
					html += '<p class="u-question">' + faq[x]['vFAQDesc'] + '</p>';
					html += '<p class="u-answer">' + faq[x]['vFAQAns'] + '</p>';
					html += '</div>';
				}
				$('.faq-box').html(html);
			}
		})
	},

	InitTicketTrafficInfo : function() {
		var self = TICKET;
		var tid = cimi.getUrlParam('tid');
		if (tid) {
			var goUrl = self.dTicketUrl.replace('#ticketid#', tid);
			$.ajax({
				type : 'GET',
				url : goUrl,
				dataType : 'script',
				success : function() {
					var retObj = window['TicketInfo_' + tid];
					var ticket = retObj.data;
					$('#vVenueNameToo').html('�������� : ' + ticket.vVenueName);
					$('#vVenueAddress').html('���ݵ�ַ : ' + ticket.vVenueAddress);
					$('#vTraffic').html('�ܱ߽�ͨ : ' + ticket.vTraffic);
					$('#vVenueImg').attr('src', ticket.vVenueImg).attr('alt', ticket.vVenueName);
					$("#vGoodTips").html(ticket.vGoodTips);
				}
			})
		}
	},

	ConnectKF : function() {
		if (isWeiXin()) {
			window.location.href = 'https://awp.qq.com/act/a20160105service';
		} else if (isQQ()) {
			window.location.href = 'http://kf.qq.com/touch/bill/160310selfqa6361b385.html?scene_id=kf310&mp_sourceid=0.1.2&platform=15';
		} else {
			window.location.href = 'http://kf.qq.com/touch/bill/160310selfqa6361b385.html?scene_id=kf310&mp_sourceid=0.1.2&platform=15';
		}
	}
}

function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
};

function isQQ() {
	var chkRes = false;
	mqq.device.isMobileQQ(function(result) {
		chkRes = result;
	});
	return chkRes;
}/*  |xGv00|dc0098c61227503ed6228b17e62ae327 */