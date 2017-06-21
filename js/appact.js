var G_TimeArr = ['2017/04/29 16:05:00','2017/04/29 16:10:00','2017/04/29 16:15:00','2017/04/29 16:30:00','2017/04/29 17:00:00','2017/04/29 17:30:00','2017/04/29 18:00:00','2017/04/29 18:30:00','2017/04/29 19:00:00'];//准点掉落的时间
//var G_TimeArr = ['2017/04/28 19:30:00','2017/04/28 19:32:00','2017/04/28 19:34:00','2017/04/28 19:36:00','2017/04/28 19:38:00','2017/04/28 19:40:00','2017/04/28 19:42:00','2017/04/28 19:44:00','2017/04/28 19:46:00'];//准点掉落的时间
var G_DO = ['361496','361497','361498','361499','361500','361501','362251','362252','362253'];
var G_PrizeStatus = 0;//观赛一分钟宝箱领取状态  1-已领取
var G_TPrizeStatus = [0,0,0,0,0,0,0,0,0];//准点掉落领取状态
var G_CurrPackage = 0;

// 登录
milo.ready(function() {
	need([ "biz.login" ], function(LoginManager) {
		LoginManager.checkLogin(function() {
			//检查是否绑定大区
			amsInit(110514, 361012);
			//查询hold资格1   前五个
			amsSubmit(110514,362360);
			
			//填写个人信息
			milo.addEvent(g('fillPersonInfo_361010'),'click',function(){	
				LoginManager.submitLogin(function(){
					amsCfg_361010.sData = { iShow: 1 };
					amsSubmit(110514,361010);
				});
			});
		}, function() {
			$('#one_minute_prize_btn').unbind("click");
			$("#one_minute_prize_btn").click(function(){
				showSysMsg("请先登陆！");
				return;
		    });
			
			$('#time_prize_btn').unbind("click");
			$("#time_prize_btn").click(function(){
				showSysMsg("请先登陆！");
				return;
		    });
			// 未登录,弹登录框
			LoginManager.login({"sData":{"pt_no_onekey":1}});
		});
	});
});

//初始化页面
function InitPage(){
	var timeTmp = [];
	//定时五秒钟检查宝箱更新状态
	CheckTime();
	
	//观赛一分钟宝箱初始化
	//已经领取过
	if(G_PrizeStatus==1){
		$('#one_minute_prize_btn').unbind("click");
		$("#one_minute_prize_btn").click(function(){
			showSysMsg("你已经领取过观赛大礼");
			return;
	    });
		$("#time_down").html("已领取");
		$("#one_minute_prize_class").attr("class","comm-size u-treasure gray");
		$("#one_minute_prize").show();
	}else{
		$('#one_minute_prize_btn').unbind("click");
		$("#one_minute_prize_btn").click(function(){
			//showSysMsg("敬请期待");  996
			showSysMsg("活动已结束！");
			return;
	    });
		$("#one_minute_prize_class").attr("class","comm-size u-treasure");
		$("#one_minute_prize").show();
		$("#time_down").hide();
//		//定时一分钟   996
//		var time = 60;
//		  (function() {
//		      if (time > 1) {
//		          time--;
//		          $("#time_down").html("00:"+time);
//		          setTimeout(arguments.callee, 1000);
//		      } else {
//		    	    $("#time_down").hide();
//		    	  
//		    	    $('#one_minute_prize_btn').unbind("click");
//					$("#one_minute_prize_btn").click(function(){
//						DoOneMinuteDraw();
//						return;
//				    });
//					$("#one_minute_prize_class").attr("class","comm-size u-treasure shake");
//		      }
//		  })();
	}
	
	//准点掉落宝箱初始化
	//获取服务器时间
	var time1 = Date.parse(new Date(G_TimeArr[0]))/1000;
	var time9 = Date.parse(new Date(G_TimeArr[8]))/1000;
	var sTime = 0;
	var eTime = 0;
	var d = milo.getSeverDateTime().getTime()/1000;//当前日期搓
	//【未开始】
	if(d<time1){
		$('#time_prize_btn').unbind("click");
		$("#time_prize_btn").click(function(){
			showSysMsg("敬请期待！"+timeTmp[1].substr(0,5)+"开启");
			return;
	    });
		var timeTmp = G_TimeArr[0].split(" ");
		$("#time_prize_desc").html(timeTmp[1].substr(0,5));
		$("#time_prize_desc_2").html("开启");
		$("#time_prize").show();
		return;
	}
	//【已结束】
	if(d>=time9){
		G_CurrPackage = 8;
		if(G_TPrizeStatus[8]==1){
			$('#time_prize_btn').unbind("click");
			$("#time_prize_btn").click(function(){
				showSysMsg("你已经领取过奖励！");
				return;
		    });
			$("#time_prize_class").attr("class","comm-size u-treasure gray");
		}else{
			$('#time_prize_btn').unbind("click");
			$("#time_prize_btn").click(function(){
				//DoRraw(G_DO[8]);  996
				showSysMsg("活动已结束！");
				return;
		    });
			//$("#time_prize_class").attr("class","comm-size u-treasure shake");  996
			$("#time_prize_class").attr("class","comm-size u-treasure");
		}
		$("#time_prize_desc").html("最后");
		$("#time_prize_desc_2").html("一个");
		$("#time_prize").show();
		return;
	}
	//【处于掉落区间】
	for(var x in G_TimeArr){
		sTime = Date.parse(new Date(G_TimeArr[x]))/1000;
		eTime = Date.parse(new Date(G_TimeArr[+x+1]))/1000;
		if(d>=sTime && d<eTime){
			G_CurrPackage = +x;
			timeTmp = G_TimeArr[+x+1].split(" ");
			if(G_TPrizeStatus[x]==1){
				$('#time_prize_btn').unbind("click");
				$("#time_prize_btn").click(function(){
					showSysMsg("你已经领取过奖励，下一个宝箱将会在"+timeTmp[1].substr(0,5)+"到来！");
					return;
			    });
				$("#time_prize_class").attr("class","comm-size u-treasure");
			}else{
				$('#time_prize_btn').unbind("click");
				$("#time_prize_btn").click(function(){
					DoRraw(G_DO[x]);
					return;
			    });
				$("#time_prize_class").attr("class","comm-size u-treasure shake");
			}
			$("#time_prize_desc").html(timeTmp[1].substr(0,5));
			$("#time_prize_desc_2").html("开启");
			$("#time_prize").show();
			return;
		}
	}
}

//定时五秒钟检查宝箱更新状态
function CheckTime(){
	setInterval(function(){
		//判断当前处于哪个宝箱
		var time1 = Date.parse(new Date(G_TimeArr[0]))/1000;
		var time9 = Date.parse(new Date(G_TimeArr[8]))/1000;
		var sTime = 0;
		var eTime = 0;
		var d = milo.getSeverDateTime().getTime()/1000;//当前日期搓
		if(d<time1){
			G_CurrPackage = 0;
		}
		if(d>=time9){
			G_CurrPackage = 8;
		}
		for(var x in G_TimeArr){
			sTime = Date.parse(new Date(G_TimeArr[x]))/1000;
			eTime = Date.parse(new Date(G_TimeArr[+x+1]))/1000;
			if(d>=sTime && d<eTime){
				G_CurrPackage = +x;
			}
		}
		if(G_TPrizeStatus[G_CurrPackage]==1){
			G_CurrPackage = G_CurrPackage+1;
		}
		
		sTime = Date.parse(new Date(G_TimeArr[G_CurrPackage]))/1000;
		if(d>=sTime){
			if(G_TPrizeStatus[G_CurrPackage]==0){
				
//				if(G_CurrPackage==0){
//					var timeTmp = G_TimeArr[1].split(" ");
//					$("#time_prize_desc").html(timeTmp[1].substr(0,5));
//					$("#time_prize_desc_2").html("开启");
//				}
				$('#time_prize_btn').unbind("click");
				$("#time_prize_btn").click(function(){
					//DoRraw(G_DO[G_CurrPackage]);  996
					showSysMsg("活动已结束！");
					return;
			    });
				if(G_CurrPackage==8){
					$("#time_prize_desc").html("最后");
					$("#time_prize_desc_2").html("一个");
				}else{
					var timeTmp = G_TimeArr[G_CurrPackage+1].split(" ");
					$("#time_prize_desc").html(timeTmp[1].substr(0,5));
					$("#time_prize_desc_2").html("开启");
				}
				//$("#time_prize_class").attr("class","comm-size u-treasure shake");  996
				$("#time_prize_class").attr("class","comm-size u-treasure");
				$("#time_prize").show();
			}
		}
	},5000);

}

//观赛一分钟抽奖
function DoOneMinuteDraw(){
	amsSubmit(110514,361008);
	loadScript("http://apps.game.qq.com/lol/act/a2017LPLSpringFinal/query.php?p0=2",function(){});
}

//改变观赛一分钟的状态
function ChangeOneMinuteDrawStatus(){
	$('#one_minute_prize_btn').unbind("click");
	$("#one_minute_prize_btn").click(function(){
		showSysMsg("你已经领取过观赛大礼");
		return;
    });
	$("#time_down").html("已领取");
	$("#one_minute_prize_class").attr("class","comm-size u-treasure gray");
}

//准点掉落抽奖
function DoRraw(pid){
	amsSubmit(110514,pid);
	loadScript("http://apps.game.qq.com/lol/act/a2017LPLSpringFinal/query.php?p0=2",function(){});
}

//设置下一个礼包
function SetNextDraw(){
	G_TPrizeStatus[G_CurrPackage]=1;//设置当前为已领取状态
	//已经是最后一个
	if(G_CurrPackage==8){
		$('#time_prize_btn').unbind("click");
		$("#time_prize_btn").click(function(){
			showSysMsg("你已经领取过当前宝箱");
			return;
	    });
		$("#time_prize_class").attr("class","comm-size u-treasure gray");
		$("#time_prize_desc").html("最后");
		$("#time_prize_desc_2").html("一个");
		return;
	}
	G_CurrPackage = G_CurrPackage+1;
	var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
	$('#time_prize_btn').unbind("click");
	$("#time_prize_btn").click(function(){
		//DoRraw(G_DO[G_CurrPackage]);
		showSysMsg("敬请期待！"+timeTmp[1].substr(0,5)+"开启");
		return;
    });
	if(G_CurrPackage==8){
		$("#time_prize_desc").html("最后");
		$("#time_prize_desc_2").html("一个");
	}else{
		$("#time_prize_desc").html(timeTmp[1].substr(0,5));
		$("#time_prize_desc_2").html("开启");
	}
	//$("#time_prize_class").attr("class","comm-size u-treasure gray");
	$("#time_prize_class").attr("class","comm-size u-treasure");
}

//填写个人信息
function WritePersonalInfo(){
	document.getElementById("fillPersonInfo_361010").click();
}

//查询是否绑定的配置
amsCfg_361012={
    type : "query",
    success : function(bindedInfo){
        //已绑定时的扩展处理
    },
    failure : function(){
        //未绑定时的扩展处理
    }
};

//提交绑定的配置
amsCfg_361011={
    type : "comit",
    iQueryFlowID:361012,
    service:"lol" ,
	success : function(bindedInfo){
		//已绑定时的扩展处理
	},
	failure : function(){
		//未绑定时的扩展处理
	}
};

//查询hold资格1   前五个
amsCfg_362360 = {
	"iActivityId": 110514, //活动id	
	"iFlowId":    362360, //流程id
	"fFlowSubmitEnd": function(res){
		if(res['iRet']==0){
			G_PrizeStatus = res['sOutValue1'];
			G_TPrizeStatus[0] = res['sOutValue2'];
			G_TPrizeStatus[1] = res['sOutValue3'];
			G_TPrizeStatus[2] = res['sOutValue4'];
			G_TPrizeStatus[3] = res['sOutValue5'];
			//查询hold资格2  后五个
			amsSubmit(110514,362361);
		}
		return;
	},
	"fFlowSubmitFailed":function(){
		//查询hold资格2  后五个
		amsSubmit(110514,362361);
		//失败会走到这个函数
		//条件不满足，ame返回大于0是后走到这里
	}
};

//查询hold资格1   后五个
amsCfg_362361 = {
	"iActivityId": 110514, //活动id	
	"iFlowId":    362361, //流程id
	"fFlowSubmitEnd": function(res){
		if(res['iRet']==0){
			G_TPrizeStatus[4] = res['sOutValue1'];
			G_TPrizeStatus[5] = res['sOutValue2'];
			G_TPrizeStatus[6] = res['sOutValue3'];
			G_TPrizeStatus[7] = res['sOutValue4'];
			G_TPrizeStatus[8] = res['sOutValue5'];
			InitPage();//初始化页面
		}
		return;
	},
	"fFlowSubmitFailed":function(){
		InitPage();//初始化页面
		//失败会走到这个函数
		//条件不满足，ame返回大于0是后走到这里
	}
};

// 个人获奖记录初始化
amsCfg_362372 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'iLotteryFlowId' : '362372', //  查询获奖轮播的流程号
	'activityId' : '172874', // 模块实例号
	'contentId' : 'getGiftContent_362372', //容器ID
	'templateId' : 'getGiftTemplate_362372', //模板ID
	'contentPageId' : 'getGiftPageContent_362372',	//分页容器ID
	
	'pageSize' : 5 //默认是10条
	//'showContentId' : 'showMyGiftContent_362372' //弹出层ID
};

/**
 * 显示系统消息
 */
function showSysMsg(msg){
	closeDialog();
	$('#t_msg').html(msg);
	TGDialogS('sys_dia');
}

/**
 * 显示系统消息（带确认按钮）
 */
function showSysMsg_confirm(msg){
	closeDialog();
	cimi.dialog.close();
	$('#t_msg_2').html(msg);
	TGDialogS('waiting_pop_2');
}

//弹窗
function TGDialogS(e){
    need("biz.dialog",function(Dialog){
        Dialog.show({
            id:e,
            bgcolor:'#000', //弹出“遮罩”的颜色，格式为"#FF6600"，可修改，默认为"#fff"
            opacity:80      //弹出“遮罩”的透明度，格式为｛10-100｝，可选
        });
    });
}

function closeDialog(){
    need("biz.dialog",function(Dialog){
        Dialog.hide();
    });
}

function in_array(value, array) {
	for ( var x in array) {
		if (value == array[x])
			return true;
	}
	return false;
}

// 抽奖         观赛一分钟宝箱
amsCfg_361008 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
	
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		ChangeOneMinuteDrawStatus();
		//获得绿钻8.5折扣券
		if(callbackObj.iPackageId=='578246'){
			TGDialogS('pop4');
			return;
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='578245'){
			TGDialogS('pop5');
			return;
		}
		showSysMsg(callbackObj.sMsg);
		
	}
};

// 抽奖      16:05:00
amsCfg_361496 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
	
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='579894'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
		
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='579893'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// 抽奖        16:10:00
amsCfg_361497 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
	
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='579994'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
		
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='579993'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// 抽奖           16:15:00
amsCfg_361498 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='580008'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
	
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='580007'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// 抽奖        16:30:00
amsCfg_361499 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='580032'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
	
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='580031'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// 抽奖     17:00:00
amsCfg_361500 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='580075'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
	
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='580074'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// 抽奖      17:30:00
amsCfg_361501 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
	
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='580086'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
		
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='580085'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// 抽奖       18:00:00
amsCfg_362251 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='580095'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
	
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='580094'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// 抽奖       18:30:00
amsCfg_362252 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='580104'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
	
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		//获得彩蛋
		if(callbackObj.iPackageId=='580103'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// 抽奖     19:00:00
amsCfg_362253 = {
	'iAMSActivityId' : '110514', // AMS活动号
	'activityId' : '172874', // 模块实例号
	'onBeginGetGiftEvent' : function(){
		return 0; // 抽奖前事件，返回0表示成功
	},
	'onGetGiftFailureEvent' : function(callbackObj){// 抽奖失败事件
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// 抽奖成功事件
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//谢谢参与
		SetNextDraw();
		if(callbackObj.iPackageId=='580113'){
			if(G_CurrPackage==8){
				showSysMsg("很遗憾没有中奖，当前宝箱已经是最后一个宝箱！");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("很遗憾没有中奖，下一个宝箱将在"+timeTmp[1].substr(0,5)+"到来！");
			}
			return;
		}
		
		//1：实物
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0：虚拟游戏物品
			 * 1：实际物品，需要填写个人收货信息
			 * 2：cdkey
			 */
			showSysMsg("恭喜您获得了 " + callbackObj.sPackageName + " ! 请您准确填写个人信息，官方将有工作人员联系您。"+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">'+'<input type="button" value="填写个人信息" onclick="WritePersonalInfo();">');
			return;
		}
		//2：cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// 新的处理
			if(callbackObj.sPackageCDkey){
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageCDkey + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}else{
				showSysMsg('您获得的cdkey为：' + callbackObj.sPackageOtherInfo + '<input type="button" value="复制" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'复制成功。\');">');
				return;
			}
			
		}
		
		//获得彩蛋
		if(callbackObj.iPackageId=='580112'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

amsCfg_361010 = {
	'iActivityId' : '110514', // AMS活动号
	'iFlowId' : '361010', // 流程号
	'_everyRead' : true,
	'success': function(res) {
		if(typeof res.jData == "object") { //返回已经提交的数据，填充页面
			need(["biz.provincecityselector", "biz.dialog", "util.form"],function(pcs, Dialog, FormManager){
				
				//closeDialog();
				TGDialogS("personInfoContent_361010");
//				Dialog.show({
//
//					id: 'personInfoContent_361010'
//
//				});
				g('personInfoContentBtn_361010').onclick = function(){
					var fillData = FormManager.getAllInputValue('personInfoContent_361010');
					for(var i in fillData) {
						var _val = fillData[i];
						switch(i) {
							case 'sName': {
								if(!_val){alert("姓名不能为空"); return;}
								if(milo.getByteLength(_val) > 30){alert("姓名长度不能超过30个字节。"); return;}
								break;
							}
							case 'sGender':{
								if(!_val){alert("性别必须选择"); return;}
								break;
							}
							case 'sIdentity':{
								if(!_val){alert("身份证号码不能为空"); return;}
								if(!milo.isIDCard(_val)){alert("身份证号码有误。"); return;}
								break;
							}
							case 'sMobile':{
								if(!_val){alert("手机号码不能为空"); return;}
								if(isNaN(_val) || _val.indexOf('.') >= 0){alert("手机号码必须为数字。"); return;}
								if(_val.length > 11){alert("手机号码不得超过11位。"); return;}
								break;
							}
							case 'sAddress':{
								if(!_val){alert("详细地址不能为空"); return;}
								if(milo.getByteLength(_val) > 100){alert("详细地址不能超过100个字节。"); return;}
								break;
							}
							case 'sPostCode':{
								if(!_val){alert("邮政编码不能为空"); return;}
								if(milo.getByteLength(_val) > 8){alert("邮政编码不能超过8个字节。"); return;}
								if(isNaN(_val) || _val.indexOf('.') >= 0){alert("邮政编码必须为数字。"); return;}
								break;
							}
							case 'sProvince':{
								if(!_val){alert("请选择省份"); return;}
								break;
							}
							case 'sCity':{
								if(!_val){alert("请选择城市"); return;}
								break;
							}
							default : {}	
						}
					}
					amsCfg_361010.sData = fillData;
					amsSubmit(110514,361010);
				}
				g("colseLayer_361010").onclick = function(){
					Dialog.hide();
				}
				if(g("province_"+361010).innerHTML != '') {
					g("province_"+361010).innerHTML = '';
				}
				if(g("city_"+361010).innerHTML != '') {
					g("city_"+361010).innerHTML = '';
				}
				pcs.show({
					provinceId : "province_"+361010,
					cityId : "city_"+361010
				});
				if(res.jData.sProvince != undefined) {
					g('province_361010').value = res.jData.sProvince;
				}
				g('province_361010').onchange();
				if(res.jData.sCity != undefined){
					g('city_361010').value = res.jData.sCity;
				}
				
				delete res.jData.sProvince;
				delete res.jData.sCity;
				FormManager.setAllInputValue (res.jData, 'personInfoContent_361010');
			
				if(typeof res.jData.arrPackageInfo != 'undefined' && res.jData.arrPackageInfo.length > 0) {
					document.getElementById('tr_package_361010').style.display = '';
					var package_id = document.getElementById('package_361010');
					for(var i=0; i<res.jData.arrPackageInfo.length; ++i) {	
						var iPackageId = res.jData.arrPackageInfo[i].iPackageId;
						var sPackageName = res.jData.arrPackageInfo[i].sPackageName;
						package_id.options[i] = new Option(sPackageName, iPackageId + '|' + sPackageName);
					}
				}
			});
			
		} else {
			showSysMsg(res.sMsg);	
		}
	}
};/*  |xGv00|960aeda45e85d5754a9af600fdb36a8b */