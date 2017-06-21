var lplImg = 'http://shp.qpic.cn/lolwebvideo/201501/e9397014f3587fb2c489f8e1f2cad7c8/0';
var lckImg = 'http://shp.qpic.cn/lolwebvideo/201501/719a6a51532d6e926c1ea9e054904356/0';
var actName = 'lpl.qq.com.m';
var shareConfig = {
	'84' : {
		title : 'LPL官网',
		desc : 'LPL官网',
		img : lplImg,
		actName : actName
	},
	'85' : {
		title : '正在直播：@TeamNameA@ @TeamScoreA@ VS @TeamScoreB@ @TeamNameB@ @GameType@ ',
		desc : 'LPL官网',
		img : lplImg,
		actName : actName
	},
	'86' : {
		title : '@VideoTitle@',
		desc : '@VideoTitle@',
		img : lplImg,
		actName : actName
	},
	'87' : {
		title : 'LPL精彩赛程',
		desc : 'LPL精彩赛程',
		img : lplImg,
		actName : actName
	},
	'88' : {
		title : '@VideoTitle@',
		desc : '@VideoTitle@',
		img : lplImg,
		actName : actName
	},
	'89' : {
		title : '@NewsTitle@',
		desc : '@NewsTitle@',
		img : lplImg,
		actName : actName
	},
	'90' : {
		title : '参与LPL竞猜，赢取丰厚奖品',
		desc : '参与LPL竞猜，赢取丰厚奖品',
		img : lplImg,
		actName : actName
	},
	'91' : {
		title : 'LPL战队那家强？一看便知 ',
		desc : 'LPL战队那家强？一看便知 ',
		img : lplImg,
		actName : actName
	},
	'92' : {
		title : '谁是LPL最强选手？一看便知',
		desc : '谁是LPL最强选手？一看便知',
		img : lplImg,
		actName : actName
	},
	'93' : {
		title : '@Ticket@门票火热售卖中',
		desc : '@Ticket@门票火热售卖中',
		img : lplImg,
		actName : actName
	},
	'95' : {
		title : 'LCK战队那家强？一看便知 ',
		desc : 'LCK战队那家强？一看便知 ',
		img : lckImg,
		actName : actName
	}
}

var initShare = function(cateId, option) {
	var shareObj = getShareConfigObj(cateId);
	if (option) {
		for ( var i in option) {
			switch (i) {
				case 'title':
					shareObj.title = option.title;
					break;
				case 'desc':
					shareObj.desc = option.desc;
					break;
				case 'img':
					shareObj.img = option.img;
					break;
				case 'TeamNameA':
					shareObj.title = shareObj.title.replace('@TeamNameA@', option.TeamNameA);
					shareObj.desc = shareObj.desc.replace('@TeamNameA@', option.TeamNameA);
					break;
				case 'TeamNameB':
					shareObj.title = shareObj.title.replace('@TeamNameB@', option.TeamNameB);
					shareObj.desc = shareObj.desc.replace('@TeamNameB@', option.TeamNameB);
					break;
				case 'TeamScoreA':
					shareObj.title = shareObj.title.replace('@TeamScoreA@', option.TeamScoreA);
					shareObj.desc = shareObj.desc.replace('@TeamScoreA@', option.TeamScoreA);
					break;
				case 'TeamScoreB':
					shareObj.title = shareObj.title.replace('@TeamScoreB@', option.TeamScoreB);
					shareObj.desc = shareObj.desc.replace('@TeamScoreB@', option.TeamScoreB);
					break;
				case 'TeamNameB':
					shareObj.title = shareObj.title.replace('@TeamNameB@', option.TeamNameB);
					shareObj.desc = shareObj.desc.replace('@TeamNameB@', option.TeamNameB);
					break;
				case 'GameType':
					shareObj.title = shareObj.title.replace('@GameType@', option.GameType);
					shareObj.desc = shareObj.desc.replace('@GameType@', option.GameType);
					break;
				case 'GameMode':
					shareObj.title = shareObj.title.replace('@GameMode@', option.GameMode);
					shareObj.desc = shareObj.desc.replace('@GameMode@', option.GameMode);
					break;
				case 'VideoTitle':
					shareObj.title = shareObj.title.replace('@VideoTitle@', option.VideoTitle);
					shareObj.desc = shareObj.desc.replace('@VideoTitle@', option.VideoTitle);
					break;
				case 'NewsTitle':
					shareObj.title = shareObj.title.replace('@NewsTitle@', option.NewsTitle);
					shareObj.desc = shareObj.desc.replace('@NewsTitle@', option.NewsTitle);
					break;
				case 'Ticket':
					shareObj.title = shareObj.title.replace('@Ticket@', option.Ticket);
					shareObj.desc = shareObj.desc.replace('@Ticket@', option.Ticket);
					break;
			}
		}
	}

	init_ZMApp({
		'title' : shareObj.title,
		'summery' : shareObj.desc,
		'img' : shareObj.img,
		'url' : location.href,
		'act' : shareObj.actName
	// 点击流命名，用于统计分享量，专题一般采用目录名称如a20151029demo
	});
}

var getShareConfigObj = function(cateId) {
	var config = MobileShareConfigInfo.msg;
	if ('undefined' == typeof (MobileShareConfigInfo['msg'][cateId])) {
		return shareConfig[cateId];
	}
	var list = MobileShareConfigInfo['msg'][cateId];
	var today = new Date().getTime();
	for ( var i = 0; i < list.length; i++) {
		var obj = list[i];
		var objConfig = obj.Title.split('#');
		if (objConfig.length != 4) {
			continue;
		}
		var startDateTime = new Date(objConfig[2].replace(new RegExp('-', 'g'), '/')).getTime();
		var endDateTime = new Date(objConfig[3].replace(new RegExp('-', 'g'), '/')).getTime();
		if (today >= startDateTime && today <= endDateTime) {
			var shareObj = shareConfig[cateId];
			shareObj.title = objConfig[0];
			shareObj.desc = objConfig[1];
			if (obj.sImg) {
				shareObj.img = obj.sImg;
			}
			return shareObj;
		}
	}
	return shareConfig[cateId];
}
/*  |xGv00|421efd95bf09b75ead5c379d07ff5ac9 */