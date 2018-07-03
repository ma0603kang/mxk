/**
 * 数据分页js
 * 注: 不能与 ajax-vo-paging.js 同时使用
 * 
 * 依赖文件 : /comm/js/tools.js
 */

function _ajaxDoPaging() {
	/**
	 * 初始化参数到top
	 */
	this.initParaToTop = function(search, paras, json) {
		var topPageInfo = Utils.getTopWin().pageInfo;
		if(topPageInfo) {
			var topPara = {};
			topPara.searArr = []; //查询条件封装
			if($('#' + search.pageForm + ' input[name=is_init]').val() == 1) {
				topPara.indexNo = json.indexNo;
			}
			//text
			this.getFormInfo(search.searchForm, ':text', topPara.searArr);
			//select
			this.getFormInfo(search.searchForm, ':selected', topPara.searArr);
			//checkbox
			this.getFormInfo(search.searchForm, ':checked', topPara.searArr);
			//radio
			this.getFormInfo(search.searchForm, ':radio :checked', topPara.searArr);
			//textarea
			this.getFormInfo(search.searchForm, 'textarea', topPara.searArr);
			//设置参数到topPara
			topPageInfo.setPageInfo($("#" + search.pageForm).attr("action"), topPara);
			//alert(1);
		}
	};
	
	/**
	 * 获取表单基本信息
	 * @param {} domId
	 * @param {} type
	 * @return {}
	 */
	this.getFormInfo = function(domId, sel, arr) {
		$('#'+domId + " " + sel).each(function(){
			if(this.name && $.trim($(this).val()) != '') {
				var _tmp = {};
				_tmp._val = $.trim($(this).val());
				_tmp._type = this.type;
				_tmp._name = this.name;
				arr.push(_tmp);
			}
		});
	};
	
	/**
	 * 初始化查询参数到查询表单
	 * @return {}
	 */
	this.initParaToSearch = function(searchInfo) {
		var search = this.getDefaultConfig();
	    if(searchInfo) {
	    	search = searchInfo;
	    }
		var topPara = Utils.getTopWin().pageInfo.getPageInfo($("#" + search.pageForm).attr("action"));
		if(topPara) {
			$.each(topPara.searArr, function(k, v) {
				var _tmp = $('#' + search.searchForm + ' [type='+v._type+'][name='+v._name+']');
				if(v._type == 'text' || v._type == 'select' || v._type == 'textarea') {
					_tmp.val(v._val);
				} else if(v._type == 'checkbox' || v._type == 'radio') {
					_tmp.attr('checked', true);
				}
			});
		}
	};
	
	/**
	 * 获取默认的配置
	 * @return {}
	 */
	this.getDefaultConfig = function() {
		//分页默认配置
		var search = {
			searchForm : 'searchForm',	//查询表单
			listDatas : 'listDatas',	//查询结果列表
			pageForm : 'pageForm',		//分页Form
			listTitle: 'listTitle',				//表头
			formationData: formationData		//回调函数
		};
		return search;
	};
	
	/**
	 * 点击翻页按钮时执行事件
	 * @param {Object} btnId 相应按钮的id属性值
	 * @return {TypeName} 
	 */
	this.jumpPage = function(btnId, obj) {
		var search = this.getDefaultConfig();
		var config = $(obj).parents('form').find('input[name=config]').val();
		if(config) {
			search = eval('('+config+')');
		}
		
		var indexNo = parseInt($("#"+search.pageForm+" input[name=INDEX_NO]").val());
		var totalPage = parseInt($("#"+search.pageForm+" input[name=totalPage]").val());
		
		var op = btnId;
		if($(obj).hasClass('act') && op == "first") {//点击首页 
			this.excute(1, true, true, false, false, search);
		}
		if($(obj).hasClass('act') && op == "next") { //点击下一页 
			if (indexNo + 1 == totalPage) { //当前页是最后一页时
				this.excute(totalPage, false, false, true, true, search);
			} else {
				this.excute((indexNo + 1), false, false, null, null, search);
			}
		}
		if($(obj).hasClass('act') && op == "up") {//点击上一页
			if ((indexNo - 1) <= 1) {
				this.excute(1, true, true, false, false, search);
			} else {
				this.excute((indexNo - 1), null, null, false, false, search);
			}
		}
		if($(obj).hasClass('act') && op == "last") {//点击尾页 
			this.excute(totalPage, false, false, true, true, search);
		}
		if($(obj).hasClass('act') && op == "goto") {//点击跳转到某一页
			var rex = /^[-\+]?\d+$/; //正则表达式判断是否是整数.
			var toPage = $.trim($('#' + search.pageForm).find('input[name=toPage]').val());
			
			if(toPage==""){
				alert("请输入跳转的页数且必须是正整数.");
				return;
			}
			if (!rex.test(toPage)) {
				alert("跳转的页数必须是整数.");
				return;
			}
			if (parseInt(toPage) < 1) {
				alert("跳转的页数必须是整数且大于0.");
				return;
			}//当调转页码小于1时 
			if (parseInt(toPage) > totalPage) {
				alert("跳转的页数必须是整数且最大页数为" + totalPage);
				return;
			}//当调转的页码大于总页数时 
			if (parseInt(toPage) == 1) {//当跳转到首页时
				this.excute(1, true, true, false, false, search);
			} else if (parseInt(toPage) == totalPage) { //当跳转到尾页时 
				this.excute(totalPage, false, false, true, true, search);
			} else {//否则按钮的状态全部可用.
				this.excute(toPage, false, false, false, false, search);
			}
		}
	};
	
	/**(私有)
	 * 改变翻页按钮的状态.
	 * @param {Object} isFirst 首页按钮是否可用
	 * @param {Object} isUp 上一页按钮是否可用
	 * @param {Object} isNext 下一页按钮是否可用
	 * @param {Object} isLast 尾页按钮是否可用
	 */
	this.enablePageBtn = function(isFirst, isUp, isNext, isLast, search) {
		var pageForm = $('#' + search.pageForm);
		if(isFirst) {
			this.setPageFormBtnDis('first', pageForm);
		} else {
			this.setPageFormBtnAct('first', pageForm);
		}
		if(isUp) {
			this.setPageFormBtnDis('up', pageForm);
		} else {
			this.setPageFormBtnAct('up', pageForm);
		}
		if(isNext) {
			this.setPageFormBtnDis('next', pageForm);
		} else {
			this.setPageFormBtnAct('next', pageForm);
		}
		if(isLast) {
			this.setPageFormBtnDis('last', pageForm);
		} else {
			this.setPageFormBtnAct('last', pageForm);
		}
	};
	
	/**
	 * 启用翻页.
	 * @param {Object} toPage 将要跳转到指定的页.
	 * @param {Object} isFirst 首页按钮是否可用
	 * @param {Object} isUp 上一页按钮是否可用
	 * @param {Object} isNext 下一页按钮是否可用
	 * @param {Object} isLast 尾页按钮是否可用
	 */
	this.excute = function (toPage, isFirst, isUp, isNext, isLast, search){
		//ajax 执行送数据到后台
		if(toPage > 0) {
			$("#"+search.pageForm+" input[name=INDEX_NO]").val(toPage>0?toPage:1);
			var paras = jsonUtils.form2Json(search.pageForm);
			//查询分页信息
			this.ajaxPagePost(search, paras);
		}
		$("#"+search.pageForm+" label[class=indexNo]").html(toPage>0?toPage:1);
		//改变按钮状态
		this.enablePageBtn(isFirst, isUp, isNext, isLast, search);
	};
	
	/**
	 * 刷新翻页表单中的数据,及翻页按钮的状态
	 * @param {Object} json 后台返回的json格式格式数据(后台返回的必须是翻页对象的JSON格式数据)
	 */
	this.reflash = function (search, json) {
		var pageForm = $('#' + search.pageForm);
		pageForm.find('span[class=totalRecord]').html(json ? json.totalRecord : 0);
		pageForm.find('label[class=indexNo]').html(json ? json.indexNo : 0);
		pageForm.find('label[class=totalPage]').html(json ? json.totalPage : 0);
		pageForm.find('input[name=INDEX_NO]').val(json ? json.indexNo : 1);
		pageForm.find('input[name=totalPage]').val(json ? json.totalPage : 0);
		
	  	if(json && json.dataMap && json.dataMap.length > 0 && json.totalPage > 1){
	  		if(parseInt(json.indexNo) == 1) {	//首页
	  			//禁用首页和上一页
				this.setPageFormBtnDis('first', pageForm);
	  			this.setPageFormBtnDis('up', pageForm);
	  			this.setPageFormBtnAct('next', pageForm);
				this.setPageFormBtnAct('last', pageForm);
				this.setPageFormBtnAct('goto', pageForm);
	  		} else if(parseInt(json.indexNo) == parseInt(json.totalPage)) { //尾页
	  			//如果当前页等于总页数时,禁用下一页和尾页按钮
	  			this.setPageFormBtnAct('first', pageForm);
				this.setPageFormBtnAct('up', pageForm);
	  			this.setPageFormBtnDis('next', pageForm);
	  			this.setPageFormBtnDis('last', pageForm);
			} else {
				//中间情况
				this.setPageFormBtnAct('first', pageForm);
				this.setPageFormBtnAct('up', pageForm);
				this.setPageFormBtnAct('next', pageForm);
				this.setPageFormBtnAct('last', pageForm);
				this.setPageFormBtnAct('goto', pageForm);
			}
	  	 } else {
	  	 	//改变按钮状态
			this.enablePageBtn(true, true, true, true, search);
	  		this.setPageFormBtnDis('goto', pageForm);
	  	}
	};
	
	/**
	 * 初始化查询条件到隐藏域
	 * @param {} search
	 */
	this.initConditions = function(search) {
		var conditions = []; 
		var input = $("#"+search.searchForm+" input[type='text']");
			this.buildCondition(input, conditions);
		var hidden = $("#"+search.searchForm+" input[type='hidden']"); 
			this.buildCondition(hidden, conditions); 
		var checkbox = $("#"+search.searchForm+" input[type='checkbox']:checked");
			this.buildCondition(checkbox, conditions);
		var radio = $("#"+search.searchForm+" input[type='radio']:checked"); 
			this.buildCondition(radio, conditions);
		var select = $("#"+search.searchForm+" select"); 
			this.buildCondition(select, conditions);
		var textarea = $("#"+search.searchForm+" textarea"); 
			this.buildCondition(textarea, conditions);
		//增加是否首次查询
		conditions.push('<input name="is_init" type="hidden" value="'+
						$('#'+search.pageForm + ' input[name=is_init]').val()+'"/>');
		var pageInfo = Utils.getTopWin().pageInfo;
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
		}
		$("#" + search.pageForm + ' span[name=pageConditions]').html(conditions.join(""));
	};
	
	/**
	 *ajax分页请求
	 * @param {} search
	 * @param {} callback
	 */
	this.ajaxPagePost = function(search, paras) {
		var url = $("#" + search.pageForm).attr("action");
		//添加排序条件
		var sortInfo = this.getSortColumnInfo(search);
		if(sortInfo.sortType) {
			//如果有排序
			paras = paras.substr(0, paras.length -1) +
					',"sortColumnName":"' + sortInfo.sortColumnName + 
					'","sortType":"' + sortInfo.sortType + '"}';
		}
		//异步请求
		UrlUtils.ajaxRequest(url, "jsonParams=" + paras + "", function(json) {
			if(json) {
				var listDatas = $("#" + search.listDatas);
				if(json == null  || (json.dataMap).length<=0) {
					listDatas.html(
							'<tr>' +
								'<td align="center" colspan="'+(listDatas.parent().find('thead th').length)+'" >' +
									'<span class="empty">没有查询到符合条件的数据</span>' +
								'</td>' +
							'</tr>');
					return;
				}
				//初始化查询参数到Top
				this.initParaToTop(search, paras, json);
				//刷新分页按钮
				this.reflash(search,json);
				//些数据到dataTable
				listDatas.html(search.formationData(json));
				//添加表格样式
				this.buildTableStyle(search.listDatas);
			}
		});
	};
	
   /**
    * 创建表格样式默认:list_table
    * @param {} tableClass
    * @param {} callback
    */
   this.buildTableStyle = function(listDatas, callback) {
   	 $('#' + listDatas).parent().each(function() {
   	 	var self = $(this);
   	 	//设置斑马线
		self.find('tbody tr:even').addClass('even');
		//选中颜色
		self.find('tbody tr').click(function() {
			$(this).addClass('list_line').siblings().each(function() {
				$(this).removeClass('list_line');
			});
		})/*.hover(		//鼠标划过
			function() {
				if(!$(this).hasClass('tr_ck')) {
					$(this).addClass('tr_hover');
				}
			}, 
			function() {
				if($(this).hasClass('tr_hover')) {
					$(this).removeClass('tr_hover');
				}
			}
		)*/;
   	 });
   	 if(callback) {
   	 	callback(tc);
   	 }
   };
	
   /**
	  * 创建隐含条件.
	  * 主要是记住当天查询条件,当翻页时也按当前条件进行分页.
	  * @param {Object} dom DOM对象元素.
	  * @param {Object} conditions 条件数组
	  * @memberOf {TypeName} 
	  * @return {TypeName} 返回组装好的条件COM元素
	*/
	this.buildCondition = function(dom, conditions){
		if(dom){
			dom.each(function (){
				if($.trim(this.value)){
					conditions.push('<input name="'+this.name+'" type="hidden" value="'+this.value+'"/>'); 
				}
			});
		}
	};
	
	/**
	 * 设置分页按钮有效性
	 * @param {} btn
	 * @param {} pageForm
	 * @param {} flag
	 */
	this.setPageFormBtnDis = function(btName, pageForm) {
		pageForm.find('a[name='+btName+']').removeClass('act').addClass('dis');
	};
	
	/**
	 * 设置分页按钮有效性
	 * @param {} btn
	 * @param {} pageForm
	 * @param {} flag
	 */
	this.setPageFormBtnAct = function(btName, pageForm) {
		pageForm.find('a[name='+btName+']').removeClass('dis').addClass('act');
	};
	
	/**
	 * ajax排序操作
	 * @param {Object} url 访问服务器的url
	 * @param {Object} columnsName 对应的数据库列的名称
	 * @param {Object} sortType 排序方式 asc 或 desc
	 * @param {function} callback 封装后台返回的json格式数据后条用callback回调函数进行处理
	 */
	this.dataSort = function(search, columnsName, sortType){
		//获取当前第X页
		var paras = jsonUtils.form2Json(search.pageForm);  
		//异步请求后台数据
		this.ajaxPagePost(search, paras);
	};
	
	/**
	 * 下拉框动态显示页数
	 * @param {} obj
	 */
	this.pageSizeOnChage = function(obj) {
		var search = this.getDefaultConfig();
		var config = $(obj).parents('form').find('input[name=config]').val();
		if(config) {
			search = eval('('+config+')');
		}
		this.initConditions(search);
		var paras = jsonUtils.form2Json(search.pageForm); 
		//移除排序图标
		$(".sortimg").remove();
		//后台请求数据
		this.ajaxPagePost(search, paras);
	};
	
	//回车跳转(私有)
	this.onEnterJumpPage = function() {
		
	};
	
	/**(私有)
	 * 获取排序字段名称,类型
	 * @param {} search
	 * @return {} sortColumnName, sortType
	 */
	this.getSortColumnInfo = function(search) {
		var sortInfo = {};
		var img = $("#" + search.listTitle).find('img[class=sortimg]');
		if(img.length == 1) {
			var td = img.parent();
			sortInfo.sortColumnName = td.attr("name").toString().toUpperCase();
			sortInfo.sortType = td.attr("sortType");
		}
		return sortInfo;
	};
};

var adp = new _ajaxDoPaging();

/*定义 ajax 异步翻页对象*/
ajaxDoPaging = {
	/**(公共)
	 * 初始化列表数据
	 */
	initData : function(searchInfo) {
		var search = adp.getDefaultConfig();
	    if(searchInfo) {
	    	search = searchInfo;
	    }
		//移除排序图标
		$(".sortimg").remove();
		//是否初始化数据
	    $('#'+search.pageForm+' input[name=is_init]').val(1);
		//初始化查询条件到隐藏域
	    adp.initConditions(search);
		//获取查询条件
		var paras = jsonUtils.form2Json(search.pageForm);
		//分页请求
		this.ajaxPagePost(search, paras);
	},
	
	/**
	 * 查询列表数据
	 * @param {} json
	 * @param {} k
	 * @return {}
	 */
	searchData : function(searchInfo) {
		var search = adp.getDefaultConfig();
	    if(searchInfo) {
	    	search = searchInfo;
	    }
		//移除排序图标
		$(".sortimg").remove();
		//查询需从第一页开始查询
		Utils.getTopWin().pageInfo.getPageInfo($("#" + search.pageForm).attr("action")).indexNo = 1;
		//初始化查询条件到隐藏域
		adp.initConditions(search);
		var paras = jsonUtils.form2Json(search.pageForm); 
		//分页请求
		this.ajaxPagePost(search, paras);
	},
	
	/**
	 * 查询列表数据
	 * @param {} json
	 * @param {} k
	 * @return {}
	 */
	refreshData : function(searchInfo) {
		var search = adp.getDefaultConfig();
	    if(searchInfo) {
	    	search = searchInfo;
	    }
		//移除排序图标
		$(".sortimg").remove();
		//初始化查询条件到隐藏域
		adp.initConditions(search);
		var paras = jsonUtils.form2Json(search.pageForm); 
		//分页请求
		this.ajaxPagePost(search, paras);
	},
	
	/**(公共)
	 * 获取当前序号
	 * @param {} dataMap 分页对象
	 * @param {} k 当前Key
	 */
	getRowNum : function(json, k) {
		return (json.indexNo - 1) * json.pageSize + (k + 1);
	},
	
   /**(公共)
	 * 导出Excel
	 * @param {} actionUrl
	 * @param {} 导出按钮
	 * @param {} 查询信息
	 */
	export2Excel : function(actionUrl, obj, searchInfo){
		var search = adp.getDefaultConfig();
		if(searchInfo) {
			search = searchInfo;
		}
	    var domId = search.searchForm; 
		var paras = jsonUtils.form2Json(domId);  
		$("#"+domId).append("<textarea id='temp_json_parameter' name='jsonParams' style='display: none;'>"+paras+"</textarea>");
		$("#"+domId).attr("action",actionUrl);
		$("#"+domId)[0].submit();
		$("#temp_json_parameter").remove();
	},
	
	//数据排序(公共)
	doSort : function(searchInfo) {
		//默认配置
		var search = adp.getDefaultConfig();
		if(searchInfo) {
			search = searchInfo;
		}
		$("#" + search.listTitle).children().each(function() {
			$(this).click(function() {
				var td = $(this);
				if(td.attr('name')){
					$("#" + search.listTitle + "img[class=sortimg]").remove();
					if ($("#" + search.listDatas).children().length > 1) {
						var sortType = td.attr("sortType"); 
						td.parent().find(".sortimg").remove();
						if (sortType == "asc") {
							td.attr("sortType", "desc").append('<img style="width:8px;height:11px;" class="sortimg" src="'+Utils.getRootPath()+'/root/images/other/desc.gif">');
							sortType = "asc";
						} else {
							td.attr("sortType", "asc").append('<img style="width:8px;height:11px;" class="sortimg" src="'+Utils.getRootPath()+'/root/images/other/asc.gif">');
							sortType = "desc";
						}
						var colname = td.attr("name").toString().toLowerCase();
						//ajax获取排序数据
						adp.dataSort(search, colname, sortType);
					}
				}
			});
		});
	},
	
	/**
	 * 表格复选框全选
	 * 唐志 2015年7月16日 15:21:25
	 * @param {Object} obj
	 * @memberOf {TypeName} 
	 */
	checkall: function (obj, callback){
	   $(obj).parents('table:first').find('input[type=checkbox]').attr('checked', $(obj).prop('checked'));
	   if(callback) {
		   callback(obj);
	   }
	},
	
	/**
	 * 双击表格选中
	 * @param id
	 */
	clickLine: function(id) {
		var listData = 'listDatas';
		if(id) {
			listData = id;
		}
		adp.buildTableStyle(listData);
	}
};