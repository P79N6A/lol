var G_TimeArr = ['2017/04/29 16:05:00','2017/04/29 16:10:00','2017/04/29 16:15:00','2017/04/29 16:30:00','2017/04/29 17:00:00','2017/04/29 17:30:00','2017/04/29 18:00:00','2017/04/29 18:30:00','2017/04/29 19:00:00'];//׼������ʱ��
//var G_TimeArr = ['2017/04/28 19:30:00','2017/04/28 19:32:00','2017/04/28 19:34:00','2017/04/28 19:36:00','2017/04/28 19:38:00','2017/04/28 19:40:00','2017/04/28 19:42:00','2017/04/28 19:44:00','2017/04/28 19:46:00'];//׼������ʱ��
var G_DO = ['361496','361497','361498','361499','361500','361501','362251','362252','362253'];
var G_PrizeStatus = 0;//����һ���ӱ�����ȡ״̬  1-����ȡ
var G_TPrizeStatus = [0,0,0,0,0,0,0,0,0];//׼�������ȡ״̬
var G_CurrPackage = 0;

// ��¼
milo.ready(function() {
	need([ "biz.login" ], function(LoginManager) {
		LoginManager.checkLogin(function() {
			//����Ƿ�󶨴���
			amsInit(110514, 361012);
			//��ѯhold�ʸ�1   ǰ���
			amsSubmit(110514,362360);
			
			//��д������Ϣ
			milo.addEvent(g('fillPersonInfo_361010'),'click',function(){	
				LoginManager.submitLogin(function(){
					amsCfg_361010.sData = { iShow: 1 };
					amsSubmit(110514,361010);
				});
			});
		}, function() {
			$('#one_minute_prize_btn').unbind("click");
			$("#one_minute_prize_btn").click(function(){
				showSysMsg("���ȵ�½��");
				return;
		    });
			
			$('#time_prize_btn').unbind("click");
			$("#time_prize_btn").click(function(){
				showSysMsg("���ȵ�½��");
				return;
		    });
			// δ��¼,����¼��
			LoginManager.login({"sData":{"pt_no_onekey":1}});
		});
	});
});

//��ʼ��ҳ��
function InitPage(){
	var timeTmp = [];
	//��ʱ�����Ӽ�鱦�����״̬
	CheckTime();
	
	//����һ���ӱ����ʼ��
	//�Ѿ���ȡ��
	if(G_PrizeStatus==1){
		$('#one_minute_prize_btn').unbind("click");
		$("#one_minute_prize_btn").click(function(){
			showSysMsg("���Ѿ���ȡ����������");
			return;
	    });
		$("#time_down").html("����ȡ");
		$("#one_minute_prize_class").attr("class","comm-size u-treasure gray");
		$("#one_minute_prize").show();
	}else{
		$('#one_minute_prize_btn').unbind("click");
		$("#one_minute_prize_btn").click(function(){
			//showSysMsg("�����ڴ�");  996
			showSysMsg("��ѽ�����");
			return;
	    });
		$("#one_minute_prize_class").attr("class","comm-size u-treasure");
		$("#one_minute_prize").show();
		$("#time_down").hide();
//		//��ʱһ����   996
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
	
	//׼����䱦���ʼ��
	//��ȡ������ʱ��
	var time1 = Date.parse(new Date(G_TimeArr[0]))/1000;
	var time9 = Date.parse(new Date(G_TimeArr[8]))/1000;
	var sTime = 0;
	var eTime = 0;
	var d = milo.getSeverDateTime().getTime()/1000;//��ǰ���ڴ�
	//��δ��ʼ��
	if(d<time1){
		$('#time_prize_btn').unbind("click");
		$("#time_prize_btn").click(function(){
			showSysMsg("�����ڴ���"+timeTmp[1].substr(0,5)+"����");
			return;
	    });
		var timeTmp = G_TimeArr[0].split(" ");
		$("#time_prize_desc").html(timeTmp[1].substr(0,5));
		$("#time_prize_desc_2").html("����");
		$("#time_prize").show();
		return;
	}
	//���ѽ�����
	if(d>=time9){
		G_CurrPackage = 8;
		if(G_TPrizeStatus[8]==1){
			$('#time_prize_btn').unbind("click");
			$("#time_prize_btn").click(function(){
				showSysMsg("���Ѿ���ȡ��������");
				return;
		    });
			$("#time_prize_class").attr("class","comm-size u-treasure gray");
		}else{
			$('#time_prize_btn').unbind("click");
			$("#time_prize_btn").click(function(){
				//DoRraw(G_DO[8]);  996
				showSysMsg("��ѽ�����");
				return;
		    });
			//$("#time_prize_class").attr("class","comm-size u-treasure shake");  996
			$("#time_prize_class").attr("class","comm-size u-treasure");
		}
		$("#time_prize_desc").html("���");
		$("#time_prize_desc_2").html("һ��");
		$("#time_prize").show();
		return;
	}
	//�����ڵ������䡿
	for(var x in G_TimeArr){
		sTime = Date.parse(new Date(G_TimeArr[x]))/1000;
		eTime = Date.parse(new Date(G_TimeArr[+x+1]))/1000;
		if(d>=sTime && d<eTime){
			G_CurrPackage = +x;
			timeTmp = G_TimeArr[+x+1].split(" ");
			if(G_TPrizeStatus[x]==1){
				$('#time_prize_btn').unbind("click");
				$("#time_prize_btn").click(function(){
					showSysMsg("���Ѿ���ȡ����������һ�����佫����"+timeTmp[1].substr(0,5)+"������");
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
			$("#time_prize_desc_2").html("����");
			$("#time_prize").show();
			return;
		}
	}
}

//��ʱ�����Ӽ�鱦�����״̬
function CheckTime(){
	setInterval(function(){
		//�жϵ�ǰ�����ĸ�����
		var time1 = Date.parse(new Date(G_TimeArr[0]))/1000;
		var time9 = Date.parse(new Date(G_TimeArr[8]))/1000;
		var sTime = 0;
		var eTime = 0;
		var d = milo.getSeverDateTime().getTime()/1000;//��ǰ���ڴ�
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
//					$("#time_prize_desc_2").html("����");
//				}
				$('#time_prize_btn').unbind("click");
				$("#time_prize_btn").click(function(){
					//DoRraw(G_DO[G_CurrPackage]);  996
					showSysMsg("��ѽ�����");
					return;
			    });
				if(G_CurrPackage==8){
					$("#time_prize_desc").html("���");
					$("#time_prize_desc_2").html("һ��");
				}else{
					var timeTmp = G_TimeArr[G_CurrPackage+1].split(" ");
					$("#time_prize_desc").html(timeTmp[1].substr(0,5));
					$("#time_prize_desc_2").html("����");
				}
				//$("#time_prize_class").attr("class","comm-size u-treasure shake");  996
				$("#time_prize_class").attr("class","comm-size u-treasure");
				$("#time_prize").show();
			}
		}
	},5000);

}

//����һ���ӳ齱
function DoOneMinuteDraw(){
	amsSubmit(110514,361008);
	loadScript("http://apps.game.qq.com/lol/act/a2017LPLSpringFinal/query.php?p0=2",function(){});
}

//�ı����һ���ӵ�״̬
function ChangeOneMinuteDrawStatus(){
	$('#one_minute_prize_btn').unbind("click");
	$("#one_minute_prize_btn").click(function(){
		showSysMsg("���Ѿ���ȡ����������");
		return;
    });
	$("#time_down").html("����ȡ");
	$("#one_minute_prize_class").attr("class","comm-size u-treasure gray");
}

//׼�����齱
function DoRraw(pid){
	amsSubmit(110514,pid);
	loadScript("http://apps.game.qq.com/lol/act/a2017LPLSpringFinal/query.php?p0=2",function(){});
}

//������һ�����
function SetNextDraw(){
	G_TPrizeStatus[G_CurrPackage]=1;//���õ�ǰΪ����ȡ״̬
	//�Ѿ������һ��
	if(G_CurrPackage==8){
		$('#time_prize_btn').unbind("click");
		$("#time_prize_btn").click(function(){
			showSysMsg("���Ѿ���ȡ����ǰ����");
			return;
	    });
		$("#time_prize_class").attr("class","comm-size u-treasure gray");
		$("#time_prize_desc").html("���");
		$("#time_prize_desc_2").html("һ��");
		return;
	}
	G_CurrPackage = G_CurrPackage+1;
	var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
	$('#time_prize_btn').unbind("click");
	$("#time_prize_btn").click(function(){
		//DoRraw(G_DO[G_CurrPackage]);
		showSysMsg("�����ڴ���"+timeTmp[1].substr(0,5)+"����");
		return;
    });
	if(G_CurrPackage==8){
		$("#time_prize_desc").html("���");
		$("#time_prize_desc_2").html("һ��");
	}else{
		$("#time_prize_desc").html(timeTmp[1].substr(0,5));
		$("#time_prize_desc_2").html("����");
	}
	//$("#time_prize_class").attr("class","comm-size u-treasure gray");
	$("#time_prize_class").attr("class","comm-size u-treasure");
}

//��д������Ϣ
function WritePersonalInfo(){
	document.getElementById("fillPersonInfo_361010").click();
}

//��ѯ�Ƿ�󶨵�����
amsCfg_361012={
    type : "query",
    success : function(bindedInfo){
        //�Ѱ�ʱ����չ����
    },
    failure : function(){
        //δ��ʱ����չ����
    }
};

//�ύ�󶨵�����
amsCfg_361011={
    type : "comit",
    iQueryFlowID:361012,
    service:"lol" ,
	success : function(bindedInfo){
		//�Ѱ�ʱ����չ����
	},
	failure : function(){
		//δ��ʱ����չ����
	}
};

//��ѯhold�ʸ�1   ǰ���
amsCfg_362360 = {
	"iActivityId": 110514, //�id	
	"iFlowId":    362360, //����id
	"fFlowSubmitEnd": function(res){
		if(res['iRet']==0){
			G_PrizeStatus = res['sOutValue1'];
			G_TPrizeStatus[0] = res['sOutValue2'];
			G_TPrizeStatus[1] = res['sOutValue3'];
			G_TPrizeStatus[2] = res['sOutValue4'];
			G_TPrizeStatus[3] = res['sOutValue5'];
			//��ѯhold�ʸ�2  �����
			amsSubmit(110514,362361);
		}
		return;
	},
	"fFlowSubmitFailed":function(){
		//��ѯhold�ʸ�2  �����
		amsSubmit(110514,362361);
		//ʧ�ܻ��ߵ��������
		//���������㣬ame���ش���0�Ǻ��ߵ�����
	}
};

//��ѯhold�ʸ�1   �����
amsCfg_362361 = {
	"iActivityId": 110514, //�id	
	"iFlowId":    362361, //����id
	"fFlowSubmitEnd": function(res){
		if(res['iRet']==0){
			G_TPrizeStatus[4] = res['sOutValue1'];
			G_TPrizeStatus[5] = res['sOutValue2'];
			G_TPrizeStatus[6] = res['sOutValue3'];
			G_TPrizeStatus[7] = res['sOutValue4'];
			G_TPrizeStatus[8] = res['sOutValue5'];
			InitPage();//��ʼ��ҳ��
		}
		return;
	},
	"fFlowSubmitFailed":function(){
		InitPage();//��ʼ��ҳ��
		//ʧ�ܻ��ߵ��������
		//���������㣬ame���ش���0�Ǻ��ߵ�����
	}
};

// ���˻񽱼�¼��ʼ��
amsCfg_362372 = {
	'iAMSActivityId' : '110514', // AMS���
	'iLotteryFlowId' : '362372', //  ��ѯ���ֲ������̺�
	'activityId' : '172874', // ģ��ʵ����
	'contentId' : 'getGiftContent_362372', //����ID
	'templateId' : 'getGiftTemplate_362372', //ģ��ID
	'contentPageId' : 'getGiftPageContent_362372',	//��ҳ����ID
	
	'pageSize' : 5 //Ĭ����10��
	//'showContentId' : 'showMyGiftContent_362372' //������ID
};

/**
 * ��ʾϵͳ��Ϣ
 */
function showSysMsg(msg){
	closeDialog();
	$('#t_msg').html(msg);
	TGDialogS('sys_dia');
}

/**
 * ��ʾϵͳ��Ϣ����ȷ�ϰ�ť��
 */
function showSysMsg_confirm(msg){
	closeDialog();
	cimi.dialog.close();
	$('#t_msg_2').html(msg);
	TGDialogS('waiting_pop_2');
}

//����
function TGDialogS(e){
    need("biz.dialog",function(Dialog){
        Dialog.show({
            id:e,
            bgcolor:'#000', //���������֡�����ɫ����ʽΪ"#FF6600"�����޸ģ�Ĭ��Ϊ"#fff"
            opacity:80      //���������֡���͸���ȣ���ʽΪ��10-100������ѡ
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

// �齱         ����һ���ӱ���
amsCfg_361008 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
	
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		ChangeOneMinuteDrawStatus();
		//�������8.5�ۿ�ȯ
		if(callbackObj.iPackageId=='578246'){
			TGDialogS('pop4');
			return;
		}
		//��òʵ�
		if(callbackObj.iPackageId=='578245'){
			TGDialogS('pop5');
			return;
		}
		showSysMsg(callbackObj.sMsg);
		
	}
};

// �齱      16:05:00
amsCfg_361496 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
	
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='579894'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
		
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		//��òʵ�
		if(callbackObj.iPackageId=='579893'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// �齱        16:10:00
amsCfg_361497 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
	
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='579994'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
		
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		//��òʵ�
		if(callbackObj.iPackageId=='579993'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// �齱           16:15:00
amsCfg_361498 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='580008'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
	
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		//��òʵ�
		if(callbackObj.iPackageId=='580007'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// �齱        16:30:00
amsCfg_361499 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='580032'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
	
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		//��òʵ�
		if(callbackObj.iPackageId=='580031'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// �齱     17:00:00
amsCfg_361500 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='580075'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
	
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		//��òʵ�
		if(callbackObj.iPackageId=='580074'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// �齱      17:30:00
amsCfg_361501 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
	
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='580086'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
		
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		//��òʵ�
		if(callbackObj.iPackageId=='580085'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// �齱       18:00:00
amsCfg_362251 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='580095'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
	
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		//��òʵ�
		if(callbackObj.iPackageId=='580094'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// �齱       18:30:00
amsCfg_362252 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='580104'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
	
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		//��òʵ�
		if(callbackObj.iPackageId=='580103'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

// �齱     19:00:00
amsCfg_362253 = {
	'iAMSActivityId' : '110514', // AMS���
	'activityId' : '172874', // ģ��ʵ����
	'onBeginGetGiftEvent' : function(){
		return 0; // �齱ǰ�¼�������0��ʾ�ɹ�
	},
	'onGetGiftFailureEvent' : function(callbackObj){// �齱ʧ���¼�
		showSysMsg(callbackObj.sMsg);
	},
	'onGetGiftSuccessEvent' : function(callbackObj){// �齱�ɹ��¼�
		var packageLen = callbackObj.iPackageId ? callbackObj.iPackageId.split(',') : '';
		if(packageLen && packageLen.length > 1){
			showSysMsg(callbackObj.sMsg);
			return;
		}
		
		//лл����
		SetNextDraw();
		if(callbackObj.iPackageId=='580113'){
			if(G_CurrPackage==8){
				showSysMsg("���ź�û���н�����ǰ�����Ѿ������һ�����䣡");
			}else{
				var timeTmp = G_TimeArr[G_CurrPackage].split(" ");
				showSysMsg("���ź�û���н�����һ�����佫��"+timeTmp[1].substr(0,5)+"������");
			}
			return;
		}
		
		//1��ʵ��
		if((callbackObj.sPackageOtherInfo && callbackObj.sPackageOtherInfo == "RealGood") || callbackObj.sPackageRealFlag == 1){
			/*
			 * 0��������Ϸ��Ʒ
			 * 1��ʵ����Ʒ����Ҫ��д�����ջ���Ϣ
			 * 2��cdkey
			 */
			showSysMsg("��ϲ������� " + callbackObj.sPackageName + " ! ����׼ȷ��д������Ϣ���ٷ����й�����Ա��ϵ����"+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">'+'<input type="button" value="��д������Ϣ" onclick="WritePersonalInfo();">');
			return;
		}
		//2��cdkey
		if(callbackObj.sPackageOtherInfo || callbackObj.sPackageCDkey){
			// �µĴ���
			if(callbackObj.sPackageCDkey){
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageCDkey + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageCDkey+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}else{
				showSysMsg('����õ�cdkeyΪ��' + callbackObj.sPackageOtherInfo + '<input type="button" value="����" onclick="ExplorerManager.clipDataToBoard(\''+callbackObj.sPackageOtherInfo+'\'); showSysMsg(\'���Ƴɹ���\');">');
				return;
			}
			
		}
		
		//��òʵ�
		if(callbackObj.iPackageId=='580112'){
			TGDialogS('pop5');
			return;
		}
		
		showSysMsg(callbackObj.sMsg);
	}
};

amsCfg_361010 = {
	'iActivityId' : '110514', // AMS���
	'iFlowId' : '361010', // ���̺�
	'_everyRead' : true,
	'success': function(res) {
		if(typeof res.jData == "object") { //�����Ѿ��ύ�����ݣ����ҳ��
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
								if(!_val){alert("��������Ϊ��"); return;}
								if(milo.getByteLength(_val) > 30){alert("�������Ȳ��ܳ���30���ֽڡ�"); return;}
								break;
							}
							case 'sGender':{
								if(!_val){alert("�Ա����ѡ��"); return;}
								break;
							}
							case 'sIdentity':{
								if(!_val){alert("���֤���벻��Ϊ��"); return;}
								if(!milo.isIDCard(_val)){alert("���֤��������"); return;}
								break;
							}
							case 'sMobile':{
								if(!_val){alert("�ֻ����벻��Ϊ��"); return;}
								if(isNaN(_val) || _val.indexOf('.') >= 0){alert("�ֻ��������Ϊ���֡�"); return;}
								if(_val.length > 11){alert("�ֻ����벻�ó���11λ��"); return;}
								break;
							}
							case 'sAddress':{
								if(!_val){alert("��ϸ��ַ����Ϊ��"); return;}
								if(milo.getByteLength(_val) > 100){alert("��ϸ��ַ���ܳ���100���ֽڡ�"); return;}
								break;
							}
							case 'sPostCode':{
								if(!_val){alert("�������벻��Ϊ��"); return;}
								if(milo.getByteLength(_val) > 8){alert("�������벻�ܳ���8���ֽڡ�"); return;}
								if(isNaN(_val) || _val.indexOf('.') >= 0){alert("�����������Ϊ���֡�"); return;}
								break;
							}
							case 'sProvince':{
								if(!_val){alert("��ѡ��ʡ��"); return;}
								break;
							}
							case 'sCity':{
								if(!_val){alert("��ѡ�����"); return;}
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