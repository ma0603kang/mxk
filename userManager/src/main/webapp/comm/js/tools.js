/**
 * 系统工具js
 * 主要处理数据格式化
 * cteate date:2014-08-19
 * create by: xingyakai
 */
 
DataFormat = {
	/**
	 * 将null转换为空字符串;
	 */
	null2Empty:function(str){ 
		if(str==null){
			return "";
		}else{
			return str;
		}
	},

	/**
	 * 数字四舍五入计算
	 * @param {Object} Dight 数值
	 * @param {Object} How 保留小数位数
	 * @return {TypeName}
	 */
	forDight : function (Dight,How){ 
		Dight = Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);   
		return Dight;  
	},
	
	/**
	 * 数字转大写
	 * @param {Object} n
	 * @return {TypeName} 
	 */
	formatDX: function (n) {       
		if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
			return "数据非法";   
		}         
		var unit = "千百拾亿千百拾万千百拾元角分", str = "";   
		n += "00";       
		var p = n.indexOf('.');   
		if (p >= 0)          
			n = n.substring(0, p) + n.substr(p+1, 2);
			unit = unit.substr(unit.length - n.length);       
			for (var i=0; i < n.length; i++) {        
				str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);  
			}
			return str.replace(/零(千|百|拾|角)/g, "零")
					  .replace(/(零)+/g, "零")
					  .replace(/零(万|亿|元)/g, "$1")
					  .replace(/(亿)万|壹(拾)/g, "$1$2")
					  .replace(/^元零?|零分/g, "")
					  .replace(/元$/g, "元整");
	},
	
	/**
	 * 计算两个日期之间天数
	 * @param {字符串"-"分割} startDate
	 * @param {字符串"-"分割} endDate
	 */
	getDataLimitCount: function(startDate, endDate) {
		var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
    	var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
    	return Math.abs((startTime - endTime))/(1000*60*60*24);  
	}
};

Utils = {
	getRootPath : function(){
		var strPath=window.document.location.pathname;
		var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
		return postPath; //返回项目根路径
	} ,
	/**
	 * 判断对象是否是 空或不是对象
	 * @param {Object} obj
	 * @return {TypeName} 
	 */
	isEmptyObject: function(obj) {
		if(obj == null){
			return true; 
		}else{
			var name = null;
			for (name in obj ) {
				return false; 
			}
			return true; 
		} 
	},
	
	/**
	 * 判断对象是否是 空或不是对象
	 * @param {Object} obj
	 * @return {TypeName} 
	 */
	isNullOrEmpty: function( obj ) {
		if(obj && obj != null && $.trim(obj)!= ""){
			return false; 
		}else{
			return true;
		} 
	},
	
	//获取当前客户端时间
	getCurrDate : function(){
		var date = new Date();
		var y = date.getYear();
		var m = date.getMonth();
		var d = date.getDate();
		return y+'-'+(m+1)+'-'+d;
	},
	
	//获取top 窗口
	getTopWin : function() {
		var win = window.parent.parent;
		var top = {};
		$.each(win, function() {
			if(this.name == 'top_frame') {
				top = this;
				return false;
			}
		});
		return top;
	}
};

/**
 * 验证表单数据
 * @type 
 */
DataFormUtils = {
	
};

RequestUtils = {
	/**
	 * (公共)
	 * 同步请求后台
	 * @param {} url
	 * @return {}
	 */
	href: function(url) {
		Messages.openLoadingDiv();
		window.location.href = url;
	},
	
	/**
	 * (公共)
	 * 异步请求后台
	 * @param {} url
	 * @param {} params
	 * @param {} callback
	 */
	ajax_load: function(url, paras, callback) {
		Messages.openLoadingDiv();
		$.ajax({
			type : 'POST',
			url : url,
			cache : false,
			data : paras,
			success: function(res) {
				if(typeof res == 'object') {
					callback(res);
					Messages.closeLoadingDiv();
				} else {
					UrlUtils.checkLogin();
				}
			}
		});
	},
	
	/**
	 * (公共)
	 * 异步请求后台,不产生遮罩层
	 * @param {} url
	 * @param {} params
	 * @param {} callback
	 */
	ajax: function(url, paras, callback) {
		$.ajax({
			type : 'POST',
			url : url,
			cache : false,
			data : paras,
			success: function(res) {
				if(typeof res == 'object') {
					callback(res);
				} else {
					UrlUtils.checkLogin();
				}
			}
		});
	},
	
	/**
	 *Ajax检查Session是否过期
	 */
	checkLogin: function() {
		$.ajax({
			url: Utils.getRootPath() + '/system/LoginAction!checkUserLogin.action',
			type: 'POST',
			success: function(res) {
				if(!res.success) {
					alert('由于您长时间没有操作,系统自动退出, 请重新登录!');
					window.parent.location.reload();
				}
			}
		});
	}
};

/**
 * 页面处理Messages 消息js对象
 * 主要作用是 1:用户点击操作的同时屏蔽窗口,防止重复操作, 2: 当用户操作完成后提示操作结果信息
 * cteate date:2011-08-19
 * create by: qinqizhao
 */
Messages = {
	//消息结果类型
	RES_TYPE: {
		//成功
		SUCCESS : '1',	//成功(1)
		FAILURE : '-1', //失败(-1)
		WARN	: '0',  //警告(0)
		ERROR	: '-2', //错误(-2)
		ILLEGAL	: '-3'  //违法操作(-3)
	},
	
	/********************************************锁屏***************************************************/
	//打开
	openLoadingDiv : function(msg){ 
		if(!msg) {
			msg = '数据处理中...';
		}
		var strDiv ="<div class='loadDiv'>"+
						"<table align='center'>"+
							"<tr>"+
								"<td>"+
									"<img style='height:22px;width:22px' src='"+Utils.getRootPath()+"/root/images/other/loading4.gif'/>"+
								"</td>"+
								"<td style='font-size: 15px;'>"+msg + "</td>"+
							"</tr>"+
						"</table>"+
					"</div>";
		$("body").append("<div id=shadeDiv class='shadeDiv' style='height:"+$(document).height()+"px'></div>").append(strDiv);
	},
	
	closeLoadingDiv  : function(){ 
		$("div[class=shadeDiv]").remove();
		$("div[class=loadDiv]").remove(); 
	},
	
	showSuccessMsg : function(msg, id) {
		Messages.showMsg(Messages.RES_TYPE.SUCCESS, msg, id);
	},
	
	showFailureMsg : function(msg, id) {
		Messages.showMsg(Messages.RES_TYPE.FAILURE, msg, id);
	},
	
	showMsg : function(type, msg, id) {
		var msgId = 'msg';
		if(id) {
			msgId = id;
		}
		if(type == Messages.RES_TYPE.SUCCESS) {
			//成功
			Utils.getTopWin().showMsg(msg);
		} else {
			var msgDiv = $('#' + msgId);
			//失败
			if(msgDiv[0]) {
				msgDiv.html(msg);
			} else {
				alert(msg);
			}
		}
	},
	
	clearMsg : function(id) {
		var msgId = 'msg';
		if(id) {
			msgId = id;
		}
		$('#' + msgId).html('');
	},
};

NumberUtil = {
	/**
	 * 数据相加
	 * @param {Object} arg1,{Object} arg2
	 * @return return arg1+arg2; 
	 */
	accAdd:function (arg1, arg2){
        var r1, r2, m, c;
        try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
        try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if(arg1 == null){
        	return arg2;
        }
        if(arg2 == null){
        	return arg1;
        }
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            }
            else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
         }else {
            arg1 = Number(arg1.toString().replace(".", ""));
         	arg2 = Number(arg2.toString().replace(".", ""));
         }
         return (arg1 + arg2) / m;
 
	},

	/**
	 * 数据相减
	 * @param {Object} arg1,{Object} arg2
	 * @return return arg1-arg2; 
	 */
	accSub:function (arg1, arg2) {
         var r1, r2, m;
         try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
         try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
         c = Math.abs(r1 - r2);
         m = Math.pow(10, Math.max(r1, r2));
         if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            }
            else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
         }else {
            arg1 = Number(arg1.toString().replace(".", ""));
         	arg2 = Number(arg2.toString().replace(".", ""));
         }
         return (arg1 - arg2) / m;
     },
	
	/**
	 * 数据相乘
	 * @param {Object} arg1,{Object} arg2
	 * @return return arg1*arg2; 
	 */
	accMul:function (arg1, arg2, exponent) {
    	Number.prototype.toFixed  =   function ( exponent){ 
		     return parseInt( this*Math.pow(10 , exponent)  + 0.5 )/Math.pow(10,exponent);
		};
    	 
    	var m=0,s1=arg1.toString(),s2=arg2.toString(); 
    	
		try{m+=s1.split(".")[1].length;}catch(e){} 
		try{m+=s2.split(".")[1].length;}catch(e){} 
		
		r3 = Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
		
		if(r3 < 0){
			r3 = Math.abs(r3).toFixed(exponent);
			return -r3;
		}else{
			return r3.toFixed(exponent); 
		}
     },
     
     /**
	 * 数据相除
	 * @param {Object} arg1,{Object} arg2
	 * @return return arg1/arg2; 
	 */
	accDiv:function (arg1, arg2,exponent) {
    	Number.prototype.toFixed  =   function ( exponent){ 
		     return  parseInt(this*Math.pow(10,exponent)+0.5 )/Math.pow(10,exponent);
		};
    	 
        var t1=0,t2=0,r1,r2; 
        
		try{t1=arg1.toString().split(".")[1].length;}catch(e){} 
		try{t2=arg2.toString().split(".")[1].length;}catch(e){}
		
		with(Math){ 
			r1=Number(arg1.toString().replace(".","")); 
			r2=Number(arg2.toString().replace(".","")); 
			
			r3 = (r1/r2)*pow(10,t2-t1);
			
			if(r3 < 0){
				r3 = Math.abs(r3).toFixed(exponent);
				return -r3;
			}else{
				return r3.toFixed(exponent); 
			}
		} 
     }
};
