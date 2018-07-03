/**
  项目JS主入口
**/
(function($, window) {
	
	var me = {};
	var options = {
	    number : {reg : /^[0-9]+$/, str : '只允许输入数字'},//只能是正整数
	    decimal : {reg : /^[-]{0,1}(\d+)[\.]+(\d+)$/ , str : '格式不正确'},
	    english : {reg : /^[A-Za-z]+$/, str : '必须为英文字母'}, //大小写英文字母
	    upper_english : {reg : /^[A-Z]+$/, str : '必须为大写英文字母'},
	    lower_english : {reg : /^[a-z]+$/, str : '必须为小写英文字母'},
	    email : {reg : /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, str : '格式不正确'},
	    chinese : {reg : /[\u4E00-\u9FA5\uf900-\ufa2d]/ig, str : '必须含有中文'},
	    url : {reg : /^[a-zA-z]+:\/\/[^s]*/, str : 'URL格式不正确'},
	    phone : {reg :/^((0\d{2,3}-\d{7,8})|(1[358479]\d{9}))$/ , str : '格式不正确'}, //电话号码
	    ip : {reg : /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/ , str : '格式不正确'},//IP地址
	    //money : {reg : /^[0-9]+[\.][0-9]{0,6}$/ , str : '金额格式不正确'},
	    money4 : {reg : /^(([1-9]\d{0,9})|0)(\.\d{0,4})?$/ , str : '格式不正确,只允许输入数字加4位小数'},
	    money6 : {reg : /^(([1-9]\d{0,9})|0)(\.\d{0,6})?$/ , str : '格式不正确,只允许输入数字加6位小数'},
	    money3 : {reg : /^(([1-9]\d{0,9})|0)(\.\d{0,3})?$/ , str : '格式不正确,只允许输入数字加3位小数'},
	    money2 : {reg : /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/ , str : '格式不正确,只允许输入数字加2位小数'},
	    number_letter : {reg : /^[0-9a-zA-Z\_]+$/ , str : '只允许输入英文字母、数字、_'},
	    zip_code : {reg : /^[a-zA-Z0-9 ]{3,12}$/ , str : '邮政编码格式不正确'},
	    account : {reg : /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/ , str : '账号名不合法，允许5-16字符，字母下划线和数字'},
	    pwd : {reg : /^[a-zA-Z0-9_]+$/ , str : '密码不合法，字母下划线和数字'},
	    card : {reg : /^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?$/ , str : '格式不正确'}
	};
	
	var limit = 15;
	
	//封装tips方法
	var tips = function(layer, text, follow) {
		layer.tips(text, follow, {
		  tips: [2, '#3595CC'],
		  time: 4000,
		  tipsMore: true
		});
	};
	
	//封装open方法
	var open = function(layer, config) {
		var _title = '信息';
		if(config.title) {
			_title = config.title;
		}
		layer.open({
			type:2,
			area: [config.width+'px', config.height+'px'],
			fixed: false,
			title:_title,
			shade:_shade,
			content: config.url,
			closeBtn: 1
		});
	};
	
	/**
	 * @param msg
	 * 遮罩层
	 */
	me.load = function() {
		var len= arguments.length;
		var args = arguments;
		var msg = '数据正在加载&nbsp;，&nbsp;请稍后';
		if(len == 1) {
			msg = args[0];
		}
		if($('div[class=load-body]').length == 0) {
			$('body').append('<div class="load-body"></div>'+
							 '<div class="load-ctn">'+
								'<i class="load-icon"></i>'+
								'<span class="load-msg">'+msg+'</span>'+
							 '</div>');
		};
		$('div[class=load-body]').show();
		$('div[class=load-ctn]').show();
	};
	
	//关闭遮罩层
	me.close = function() {
		$('div[class=load-body]').hide();
		$('div[class=load-ctn]').hide();
	};
	
	/**
	 * 数据交互
	 * @param url
	 * @param json
	 * @param callback
	 */
	me.ajax = function() {
		var len= arguments.length;
		var args = arguments;
		var data = null, callback = null;
		if(len == 3) {
			data = args[1];
			callback = args[2];
		} else if(len == 2) {
			callback = args[1];
		}
		me.load();
		var config = {
			type:'POST',
			url : args[0],
			success: function(data, textStatus) {
				if(callback) {
					if(data.success) {
						callback(data);
					} else {
						me.alert(data.msg, function() {
							if(data.dataMap.login != null && !data.dataMap.login) {
								window.parent.location.href = me.getRootPath();
							}
						});
					}
				}
				me.close();
			}
		};
		if(data) {
			config.data = 'data='+data;
		}
		$.ajax(config);
	};
	
	/**
	 * alert 方法
	 * @param text
	 * @param callback
	 */
	me.alert = function(text, callback) {
		layui.use(['layer'], function() {
			var layer = layui.layer;
			layer.alert(text.toString(), {
					title: "系统提示",
					cancel: function(index) {
						if(callback) {
							callback(index);
						}
					}
				},
				function(index) {
					if(callback) {
						callback(index);
					}
					layer.close(index);
			});
		});
	};
	
	/**
	 * 打开窗口
	 * @param url
	 * @param width
	 * @param height
	 * @param title
	 */
	me.openModel = function(url, width, height, title) {
		layui.use(['layer'], function() {
			open(layui.layer, {
				url:url,
				width:width,
				height:height,
				title:title,
				model:true
			});
		});
	};
	
	/**
	 * 打开窗口
	 * @param url
	 * @param width
	 * @param height
	 * @param title
	 */
	me.open = function(url, width, height, title) {
		layui.use(['layer'], function() {
			open(layui.layer, {
				url:url,
				width:width,
				height:height,
				title:title,
				model:false
			});
		});
	};
	
	/**
	 * tips
	 * @param text
	 * @param follow
	 */
	me.tips = function(text, follow) {
		layui.use(['layer'], function() {
			tips(layui.layer, text, follow);
		});
	};
	
	/**
	 * 如果选择“是”执行回调
	 * @param text
	 * @param callback
	 */
	me.confirm = function(text, callback) {
		layui.use(['layer'], function() {
			layer.confirm(text.toString(), {icon:3, title: "系统提示"}, function(index) {
				if(callback) {
					callback();
				}
				layer.close(index);
			});
		});
	};
	
	/**
	 * args[0] : url
	 * args[1] : data
	 * 页面跳转
	 */
	me.href = function() {
		var len= arguments.length;
		var args = arguments;
		var url = args[0];
		if(url.indexOf('?') == 1) {
			me.alert("方法调用错误.");
			return false;
		}
		me.load();
		if(len == 2) {
			url += '?data='+args[1];
		}
		window.location.href = url;
		me.close();
	};
	
	/**
	 * 获取弹出框索引
	 * @returns
	 */
	me.getFrameIndex = function() {
		return parent.layer.getFrameIndex(window.name);
	};
	
	/**
	 * 对表单的渲染
	 */
	me.form = function(callback) {
		layui.use(['layer', 'form','laydate'], function() {
			var form = layui.form();
			if(callback) {
				callback(form);
			}
		});
	};
	
	/**
	 * args[0]:select,checkbox,radio
	 * 动态渲染
	 */
	me.render = function() {
		var len= arguments.length;
		var args = arguments;
		layui.use('form', function() {
			layui.use(['form'], function() {
				var form = layui.form();
				if(len == 0) {
					form.render();
				}
				if(len == 1) {
					form.render(args[0]);
				}
			});
		});
	};
	
	/**
	 * 检查表单
	 * @param formId
	 * @returns {Boolean}
	 */
	me.checkForm = function(formId, callback) {
		layui.use(['layer'], function() {
			layer.closeAll('tips');
			var formChind = $("#" + formId + " :input[type!=button]");
			var testResult = true;
			formChind.each(function(i) {
			  var child = formChind.eq(i);
			  var value = child.val();
			  var type = child.attr("type");
			  if (type == "select-one") {
			  if (!child.attr('empty') || child.attr('empty') == 'yes') {
			      return;
			  }
			  if (child.val() == "" || child.val() == "-1") {
			      tips(layer, DataFormUtils.getCue(child,"1",""), child);
			          child.focus();
			          testResult = false;
			          return false;
			      }
			  } else {
			      var cue = '';
				  //第一步先判断非空
				  if (child.attr('empty') && child.attr('empty') != 'yes' && value == '') {
				      if (child.attr('scue')) {
				          cue = child.attr('scue');
				      } else {
				          //没有指定提示信息,用左边的单元格内容作为提示信息
				          cue = $.trim(child.parent().prev().html().replace('：', '').replace(':', '').replace('*', ''));
				      }
				      tips(layer, "[" + cue + "]不允许输入空值！", child);
				      child.focus();
				      testResult = false;
				      return false;
				  }
				  //检查内容长度
				  if(child.attr('maxtxt') && DataFormUtils.getTextLength(value) > parseInt(child.attr('maxtxt'))) {
				      if (child.attr('scue')) {
				          cue = child.attr('scue');
				      } else {
				          //没有指定提示信息,用左边的单元格内容作为提示信息
				          cue = $.trim(child.parent().prev().html().replace('：', '').replace(':', '').replace('*', ''));
				      }
				      tips(layer, "[" + cue + "]不能超过"+ child.attr('maxtxt') + "个字符!", child);
				      child.focus();
				      testResult = false;
				      return false;
				  }
				  //检查金额长度
				  if(child.attr('maxnum')) {
				      var _maxnum = DataFormUtils.getMaxNum(child.attr('maxnum'));
				      if(parseFloat(value) > _maxnum) {
				          if (child.attr('scue')) {
				              cue = child.attr('scue');
				          } else {
				              //没有指定提示信息,用左边的单元格内容作为提示信息
				              cue = $.trim(child.parent().prev().html().replace('：', '').replace(':', '').replace('*', ''));
				          }
				          tips(layer, "[" + cue + "]数字超过精度范围!", child);
				          child.focus();
				          testResult = false;
				          return false;
				      }
				  }
				  //然后正则校验数据准确性
				  if(child.attr('validate')) {
				      var type = child.attr('validate');
				      if (options[type]) {
				          var val = options[type]['reg'];
				          if (!val.test(value)) {
				          	//if(child.attr('empty') && child.attr('empty') != 'yes'){
				          		if(value != ''){
				          			tips(layer, DataFormUtils.getCue(child,"2",type), child);
				                    child.focus();
				                    testResult = false;
				                    return false;
				          		}
				              //}               
				          }
				          testResult = false;
				          return true;
				      } else {
				      	  tips(layer, '[' + cue + ']输入的正则表达式不存在', child);
				                  child.focus();
				                  testResult = false;
				                  return false;
				              }
				          }
			     }
			});
			if(testResult) {
				callback();
			}
		});
	};
	
	/**
	 * 获取默认配置
	 */
	var getDefaultConfig = function() {
		//分页默认配置
		var search = {
			searchForm : 'search-form',	//查询表单
			dataBody : 'data-body',	//查询结果列表
			pageForm : 'page-form',		//分页Form
			dataTitle: 'data-title',				//表头
			formatData: formatData		//回调函数
		};
		return search;
	};
	
	/**
	 * 初始化查询条件到隐藏域
	 * @param {} search
	 */
	var initConditions = function(config) {
		var conditions = []; 
		var input = $("#"+config.searchForm+" input[type=text]");
			buildCondition(input, conditions);
		var hidden = $("#"+config.searchForm+" input[type=hidden]"); 
			buildCondition(hidden, conditions); 
		var checkbox = $("#"+config.searchForm+" input[type=checkbox]:checked");
			buildCondition(checkbox, conditions);
		var radio = $("#"+config.searchForm+" input[type=radio]:checked"); 
			buildCondition(radio, conditions);
		var select = $("#"+config.searchForm+" select"); 
			buildCondition(select, conditions);
		var textarea = $("#"+config.searchForm+" textarea"); 
			buildCondition(textarea, conditions);
		//增加是否首次查询
		//conditions.push('<input name="is_init" type="hidden" value="'+
		//				$('#'+config.pageForm + ' input[name=is_init]').val()+'"/>');
		/*var pageInfo = Utils.getTopWin().pageInfo;
		if(pageInfo) {
			//初始化分页信息
			var topPageInfo = pageInfo.getPageInfo($("#" + search.pageForm).attr("action"));
			if(topPageInfo) {
				if(topPageInfo.indexNo) {
					conditions.push('<input name="INDEX_NO" type="hidden" value="'+ topPageInfo.indexNo+'" />');
				} else {
					conditions.push('<input name="INDEX_NO" type="hidden" value="1" />');
				}
				if(topPageInfo.totalPage) {
					conditions.push('<input name="totalPage" type="hidden" value="'+ topPageInfo.totalPage+'" />');
				} else {
					conditions.push('<input type="hidden" name="totalPage" value="0" />');
				}
			} else {
				conditions.push('<input name="INDEX_NO" type="hidden" value="1" />');
				conditions.push('<input type="hidden" name="totalPage" value="0" />');
			}
		} else {
			conditions.push('<input name="INDEX_NO" type="hidden" value="1" />');
			conditions.push('<input type="hidden" name="totalPage" value="0" />');
		}*/
		$("#" + config.pageForm + ' div[class=page-data]').html(conditions.join(''));
	};
	
	var buildCondition = function(dom, conditions){
		if(dom){
			dom.each(function (){
				if($.trim(this.value)){
					conditions.push('<input name="'+this.name+'" type="hidden" value="'+this.value+'"/>'); 
				}
			});
		}
	};
	
	var ajaxPagePost = function(config) {
		var url = $("#" + config.pageForm).attr("action");
		//添加排序条件
		var sortInfo = getSortColumnInfo(config);
		var paras = me.form2Json(config.pageForm);
		if(sortInfo.sortType) {
			//如果有排序
			paras = paras.substr(0, paras.length -1) +
					',"sortColumnName":"' + sortInfo.sortColumnName + 
					'","sortType":"' + sortInfo.sortType + '"}';
		}
		//异步请求
		me.ajax(url, paras, function(data) {
			if(data && data.success) {
				//刷新分页参数
				reflash(config, data.dataMap);
				var dataBody = $("#" + config.dataBody);
				if(data.dataMap == null  || data.dataMap.results == 0) {
					dataBody.html(
							'<tr>' +
								'<td align="center" colspan="'+(dataBody.parent().find('thead th').length)+'" >' +
									'<span style="color:#FF5722;">没有查询到符合条件的数据</span>' +
								'</td>' +
							'</tr>');
					return;
				}
				//初始化查询参数到Top
				//this.initParaToTop(search, paras, json);
				//些数据到dataTable
				dataBody.html(config.formatData(data.dataMap));
				me.render();
			}
		});
	};
	
	/**
	 * 设置分页按钮有效性
	 * @param {} btn
	 * @param {} pageForm
	 * @param {} flag
	 */
	var setPageFormBtnDis = function(btName, pageForm) {
		pageForm.find('a[name='+btName+']').addClass('layui-btn-disabled');
	};
	
	/**
	 * 设置分页按钮有效性
	 * @param {} btn
	 * @param {} pageForm
	 * @param {} flag
	 */
	var setPageFormBtnAct = function(btName, pageForm) {
		pageForm.find('a[name='+btName+']').removeClass('layui-btn-disabled');
	};
	
	/**
	 * 计算分页结果
	 * @param data
	 * @returns
	 */
	var getPageCtn = function(results) {
		var pageCtn = parseInt((results / limit));
		pageCtn = results % limit == 0 ?  pageCtn: pageCtn + 1;
		return pageCtn;
	};
	
	//刷新分页数字和按钮
	var reflash = function(config, data) {
		var pageForm = $('#' + config.pageForm);
		var start = pageForm.find('input[name=start]').val();
		var indexNo = start / limit + 1;
		var pageCtn = getPageCtn(data.results);
		if(pageCtn == 0) {
			indexNo = 0;
		}
		pageForm.find('span[class=curr_page]').html(indexNo +'/'+pageCtn);
		pageForm.find('span[class=page_ctn]').html(data.results);
		pageForm.find('input[name=results]').val(data.results);
		
  		if(indexNo == 1) {//首页
  			//禁用首页和上一页
			setPageFormBtnDis('first', pageForm);
  			setPageFormBtnDis('prev', pageForm);
  			setPageFormBtnAct('next', pageForm);
			setPageFormBtnAct('last', pageForm);
  		} else if(indexNo == pageCtn) { //尾页
  			//如果当前页等于总页数时,禁用下一页和尾页按钮
  			setPageFormBtnAct('first', pageForm);
			setPageFormBtnAct('prev', pageForm);
  			setPageFormBtnDis('next', pageForm);
  			setPageFormBtnDis('last', pageForm);
		} else {
			//中间情况
			setPageFormBtnAct('first', pageForm);
			setPageFormBtnAct('prev', pageForm);
			setPageFormBtnAct('next', pageForm);
			setPageFormBtnAct('last', pageForm);
		}
	};
	
	var getSortColumnInfo = function(search) {
		var sortInfo = {};
		var img = $("#" + search.listTitle).find('img[class=sortimg]');
		if(img.length == 1) {
			var td = img.parent();
			sortInfo.sortColumnName = td.attr("name").toString().toUpperCase();
			sortInfo.sortType = td.attr("sortType");
		}
		return sortInfo;
	};
	
	/**
	 * 初始化列表数据
	 */
	me.initData = function(config) {
		var _config = getDefaultConfig();
	    if(config) {
	    	_config = config;
	    }
		//移除排序图标
		$(".sortimg").remove();
		//初始化查询条件到隐藏域
	    initConditions(_config);
	    //初始化排序
	    
		//初始化分页
		$('#' + _config.pageForm).find('input[name=start]').val(0);
		//对所有查询表单监听回车事件
		var searchForm = $('#' + _config.searchForm);
		//第一个文本框聚焦
		searchForm.find('input[type=text]:first').focus();
		searchForm.find('input[type=text]').keyup(function(e) {
			if(e.keyCode == 13) {
				initConditions(_config);
				ajaxPagePost(_config);
			}
		});
		//分页请求
		ajaxPagePost(_config);
	};
	
	/**
	 * 分页跳转
	 */
	me.jumpPage = function(btnId, btn) {
		if($(btn).hasClass('layui-btn-disabled')) {
			return false;
		}
		//var config = $(obj).parents('form').find('input[name=config]').val();
		/*if(config) {
			search = eval('('+config+')');
		}*/
		var config = getDefaultConfig();
		var pageForm = $('#' + config.pageForm);
		var start = parseInt(pageForm.find('input[name=start]').val());
		var indexNo = start / limit;
		var results = pageForm.find('input[name=results]').val();
		var pageCtn = getPageCtn(results);
		
		if(btnId == -2) {//点击首页 
			excute(0, true, true, false, false, config);
		}
		if(btnId == -1) {//点击上一页
			if (indexNo <= 1) {
				excute(0, true, true, false, false, config);
			} else {
				excute((indexNo - 1), null, null, false, false, config);
			}
		}
		if(btnId == 1) { //点击下一页 
			if (indexNo + 1 == pageCtn) { //当前页是最后一页时
				excute(pageCtn - 1, false, false, true, true, config);
			} else {
				excute((indexNo + 1), false, false, null, null, config);
			}
		}
		if(btnId == 2) {//点击尾页 
			excute(pageCtn - 1, false, false, true, true, config);
		}
	};
	
	var excute = function (indexNo, isFirst, isPrev, isNext, isLast, config){
		//ajax 执行送数据到后台
		var pageForm = $('#' + config.pageForm);
		if(indexNo > -1) {
			pageForm.find('input[name=start]').val(indexNo * limit);
			//查询分页信息
			ajaxPagePost(config);
		}
		//改变按钮状态
		if(isFirst) {
			setPageFormBtnDis('first', pageForm);
		} else {
			setPageFormBtnAct('first', pageForm);
		}
		if(isPrev) {
			setPageFormBtnDis('prev', pageForm);
		} else {
			setPageFormBtnAct('prev', pageForm);
		}
		if(isNext) {
			setPageFormBtnDis('next', pageForm);
		} else {
			setPageFormBtnAct('next', pageForm);
		}
		if(isLast) {
			setPageFormBtnDis('last', pageForm);
		} else {
			setPageFormBtnAct('last', pageForm);
		}
	};
	
	/**
	 * 查询列表数据
	 * @param {} json
	 * @param {} k
	 * @return {}
	 */
	me.searchData = function(config) {
		var _config = getDefaultConfig();
	    if(config) {
	    	_config = config;
	    }
		//移除排序图标
		$(".sortimg").remove();
		//查询需从第一页开始查询
		//Utils.getTopWin().pageInfo.getPageInfo($("#" + search.pageForm).attr("action")).indexNo = 1;
		//初始化查询条件到隐藏域
		initConditions(config);
		var paras = me.form2Json(config.pageForm); 
		//分页请求
		ajaxPagePost(config);
	};
	
	/**
	 * 查询列表数据
	 * @param {} json
	 * @param {} k
	 * @return {}
	 */
	me.refreshData = function(searchInfo) {
		var search = getDefaultConfig();
	    if(searchInfo) {
	    	search = searchInfo;
	    }
		//移除排序图标
		$(".sortimg").remove();
		//初始化查询条件到隐藏域
		initConditions(search);
		var paras = me.form2Json(search.pageForm); 
		//分页请求
		ajaxPagePost(search);
	};
	
	/**(公共)
	 * 获取当前序号
	 * @param {} dataMap 分页对象
	 * @param {} k 当前Key
	 */
	me.getRowNum = function() {
		var len= arguments.length;
		if(len == 0) {
			return 0;
		}
		var args = arguments;
		var start = 0;
		if(len == 1) {
			start = $('#'+getDefaultConfig().pageForm + ' input[name=start]').val();
		}
		if(len == 2) {
			start = $('#'+args[1].pageForm + ' input[name=start]').val();
		}
		return parseInt(start) + args[0] + 1;
	};
	
	var toJson = function(domId){
		var json = '';
		var result = [];
		//input text
		$('#'+domId+' :text').each(function(){
			if(this.name){
				result.push('"'+this.name+'":"'+($.trim(this.value))+'",');
			}
		});
		
		//input hidden
		$('#'+domId+' input[type=hidden]').each(function(){
			if(this.name){
				result.push('"'+this.name+'":"'+($.trim(this.value))+'",');
			}
		});
		
		//input text
		$('#'+domId+' :password').each(function(){
			if(this.name){
				result.push('"'+this.name+'":"'+$.trim(this.value)+'",');
			}
		});
		
		//checkbox
	 	var chknames='';
	 	$('#'+domId+' input[type=checkbox]:checked').each(function(){
	  		if(this.name){
	   			if(chknames.toUpperCase().indexOf(this.name.toUpperCase())>=0){
	     			var reg=new RegExp('"'+this.name+'":'+'"(.+?)",','i');
	     			json=json.replace(reg,'"'+this.name+'":'+'"$1,'+this.value+'",');
    			}else{
				    chknames+=this.name+',';
				    result.push('"'+this.name+'":"'+$.trim(this.value)+'",');
    			}
	  		}
	 	});
 
	 	//radio
 		var rdnames='';
 		$('#'+domId+' input[type=radio]:radio').each(function(){
  			if(this.name){
   				if(this.checked){
    				if(rdnames.toUpperCase().indexOf(this.name.toUpperCase())>=0){
     					var reg=new RegExp('"'+this.name+'":'+'"(.+?)",','i');
     					json=json.replace(reg,'"'+this.name+'":'+'"'+this.value+'",');
    				}else{
				     	rdnames+=this.name+',';
				     	result.push('"'+this.name+'":"'+$.trim(this.value)+'",');
    				}
   				}
  			}
 		});

 		//textArea
 		$('#'+domId+' textarea').each(function(){
	  		if(this.name){
	  			result.push('"'+this.name+'":"'+$.trim(this.value).replace(/\r\n/g,'\\r\\n')+'",');
	  		}
 		});
 		
 		//select
 		$('#'+domId+' select').each(function(){
  			if(this.name){
   				result.push('"'+this.name+'":"'+$.trim($(this).find('option:selected').val())+'",');
  			}
 		});
 		
		//result
		json=result.join("").replace(/,$/,''); 
		json = json.replace(/\&/g, "#＆#" );
		json = json.replace(/%/g, "#﹪#" );

		try{
			eval('xobj={'+json+'}');
		}catch(e){
			json="{}";
			alert("无效的JSON格式数据.\n详细信息:"+e);
			throw e;
		}
		return json;
	};
	
	/**
	 * @param {} domId
	 * @return {} 'a': 1
	 */
	me.form2json = function(domId) {
		return toJson(domId);
	};
	
	/**
	 * @param {} domId
	 * @return {} {'a': 1}
	 */
	me.form2Json = function(domId){ 
		return "{"+toJson(domId)+"}";
	};
	
	/*工具类*/
	me.getRootPath = function(){
		var strPath=window.document.location.pathname;
		var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
		return postPath; //返回项目根路径
	};
	
	me.back = function() {
		me.href(document.referrer);
	};
	
	window.layers = me;
})(jQuery, window);