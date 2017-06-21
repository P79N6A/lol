document.domain = 'qq.com';
var registerCoralEvent = {
	ownStyle : 'http://lpl.qq.com/m/css/niuping.css',
	loginEvent : function() {
		parent.need("biz.login", function(LoginManager) {
			LoginManager.login();
		});
	},
	publicLogined : function(uin, nick, headUrl) {
		document.getElementById('commentIframe').contentWindow.publicLogined(uin, nick, headUrl);
	},
	publicLogout : function() {
		document.getElementById('commentIframe').contentWindow.publicLogout();
	}
};

// 获取牛评
function GetComment(iComment, ElementId, source) {
	cmt_id = iComment;
	CreateCommentIframe(ElementId, source);
}

function CreateCommentIframe(ElementId, source) {
	var iframe = document.createElement('iframe');
	iframe.id = 'commentIframe';
	iframe.border = 0;
	iframe.scrolling = 'no';
	iframe.style.border = 'none';
	iframe.frameBorder = "no";
	iframe.width = '100%';
	iframe.height = '100%';
	bindIframeOnloadEvent(iframe, function() {
		if (source == 'app') {
			QueryLoginUserInfoAPP();
		} else {
			QueryLoginUserInfo();
		}
		$('#commentIframe').contents().find('#top_reply').find('span').eq(1).hide();
		$('#commentIframe').contents().find('.change').hide();
		$('#commentIframe').contents().find('.np-nav-tab').hide();
	});
	iframe.src = 'http://www.qq.com/coral/coralBeta3/coralMainDom3.0.htm';
	document.getElementById(ElementId).appendChild(iframe);
	setTimeout(function() {
		document.getElementById(ElementId).style.display = 'block';
	}, 1000);
};

// 获取牛评内头像等信息
function QueryLoginUserInfo() {
	need("biz.login", function(LoginManager) {
		LoginManager.checkLogin(function() {
			var nickName = '';
			var userFace = '';
			LoginManager.getNickName(function(loginInfo) {
				if (loginInfo.isLogin) {
					nickName = loginInfo.nickName;
					LoginManager.getUserFace(function(data) {
						userFace = data.userFace;
						registerCoralEvent.publicLogined(LoginManager.getUserUin(), nickName, userFace);
					});
				}
			});
		});
	});
}

// 获取APP牛评内头像等信息
function QueryLoginUserInfoAPP() {
	need("biz.login", function(LoginManager) {
		LoginManager.checkLogin(function() {
			milo.loader.loadScript("http://ptlogin2.qq.com/getface?appid=21000501&imgtype=3&encrytype=0&devtype=0&keytpye=0&uin=" + LoginManager.getUserUin(), function() {
			});
		});
	});
}
var pt = {
	setHeader : function(pObj) {
		need("biz.login", function(LoginManager) {
			LoginManager.checkLogin(function() {
				var uin = LoginManager.getUserUin();
				var nick = LoginManager.getNickName();
				var src = pObj[uin];
				registerCoralEvent.publicLogined(uin, nick, src);
			}, function() {
			});
		});
	}
};

// IFRAME绑定后事件
function bindIframeOnloadEvent(el, onload) {
	if (el.attachEvent) {
		el.attachEvent("onload", onload);
	} else {
		el.onload = onload;
	}
};
// 获取IFRAME元素
function getIframeWindow(el) {
	return el.contentWindow || el.contentDocument.parentWindow;
};/*  |xGv00|50295b1974e67d413c392f7640cf13c5 */