var lplImg = 'http://shp.qpic.cn/lolwebvideo/201501/e9397014f3587fb2c489f8e1f2cad7c8/0';
var lckImg = 'http://shp.qpic.cn/lolwebvideo/201501/719a6a51532d6e926c1ea9e054904356/0';
var actName = 'lpl.qq.com.m';
var shareConfig = {
	'84' : {
		title : 'LPL����',
		desc : 'LPL����',
		img : lplImg,
		actName : actName
	},
	'85' : {
		title : '����ֱ����@TeamNameA@ @TeamScoreA@ VS @TeamScoreB@ @TeamNameB@ @GameType@ ',
		desc : 'LPL����',
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
		title : 'LPL��������',
		desc : 'LPL��������',
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
		title : '����LPL���£�Ӯȡ���Ʒ',
		desc : '����LPL���£�Ӯȡ���Ʒ',
		img : lplImg,
		actName : actName
	},
	'91' : {
		title : 'LPLս���Ǽ�ǿ��һ����֪ ',
		desc : 'LPLս���Ǽ�ǿ��һ����֪ ',
		img : lplImg,
		actName : actName
	},
	'92' : {
		title : '˭��LPL��ǿѡ�֣�һ����֪',
		desc : '˭��LPL��ǿѡ�֣�һ����֪',
		img : lplImg,
		actName : actName
	},
	'93' : {
		title : '@Ticket@��Ʊ����������',
		desc : '@Ticket@��Ʊ����������',
		img : lplImg,
		actName : actName
	},
	'95' : {
		title : 'LCKս���Ǽ�ǿ��һ����֪ ',
		desc : 'LCKս���Ǽ�ǿ��һ����֪ ',
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
	// ���������������ͳ�Ʒ�������ר��һ�����Ŀ¼������a20151029demo
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