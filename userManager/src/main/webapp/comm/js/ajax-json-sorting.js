/**
 * 数据分页js
 * 注: 不能与 ajax-vo-sorting.js 同时使用
 * 
 * 依赖文件 : /comm/js/tools.js
 */

/*定义 ajax 异步排序对象 */
var ajaxDoSort = {
	//数据排序
	doSort : function(callback) {
		$("#listTitle").children().each(function() {
			$(this).click(function() {
				if(this.name){
					$(".sortimg").remove();
					if ($("#listDatas").children().length > 1) {
						var td = $(this);
						var sortType = td.attr("sortType"); 
						if (sortType == "asc") {
							td.find(".sortimg").remove();
							td.attr("sortType", "desc").append('<img style="width:8px;height:11px;" class="sortimg" src="'+Utils.getRootPath()+'/root/images/desc.gif">');
						} else {
							td.find(".sortimg").remove();
							td.attr("sortType", "asc").append('<img style="width:8px;height:11px;" class="sortimg" src="'+Utils.getRootPath()+'/root/images/asc.gif">');
							sortType = "desc";
						}
						var url = $("#PageForm").attr("action");
						var colname = td.attr("name").toString().toUpperCase();
						ajaxDoSort.dataSort(url, colname, sortType, callback);
					}
				}
			});
		});
	},
	
	/**
	 * ajax排序操作
	 * @param {Object} url 访问服务器的url
	 * @param {Object} columnsName 对应的数据库列的名称
	 * @param {Object} sortType 排序方式 asc 或 desc
	 * @param {function} callback 封装后台返回的json格式数据后条用callback回调函数进行处理
	 */
	dataSort : function(url, columnsName, sortType ,callback){
		
		//添加锁屏动作. 
		Messages.openLoadingDiv();//tools.js
		
		var currPage = $("#currPage").val();  
		var jsonPara = [];
		var normalPara=[];
		jsonPara.push("{");
			$("#PageForm input[type='hidden']").each(function(){
				jsonPara.push('"'+ $.trim((this.name)) +'":"'+ $.trim((this.value)) +'",');
				normalPara.push($.trim((this.name)) +'='+ $.trim((this.value)) +'&');
			});
			jsonPara.push('"sortColumnName":"'+columnsName+'",');
			jsonPara.push('"sortType":"'+sortType.toString().toUpperCase()+'",');
			jsonPara.push('"indexNo":"'+currPage+'"'); 
		jsonPara.push("}");
		
		var paras = normalPara.join("");
			paras += "jsonParams=" + jsonPara.join(""); 
		$.ajax({
			type : 'POST',
			url : url,
			cache : false,
			data : paras, 
			complete : function(res) {
				//条用tools.js包中的函数
				if(res.responseText){
					var json = eval("("+res.responseText+")");
					ajaxDoPaging.reflash(json);
					$("#listDatas").empty().html(formationData(json));
					//关闭锁屏
			 		Messages.closeLoadingDiv();//tools.js
				}else{ 
					var rootPath = Utils.getRootPath();
					alert("当前操作可能出现以下异常:\n 1.登陆失效.请重新登陆\n 2.无效数据,请联系系统管理员");
					window.close();
					window.parent.location.href=rootPath+"/system/usersAction!toLogin.action";
				} 
			}
		});
	},
	
	/**
	 * 刷新翻页表单中的数据
	 * @param {Object} json 后台返回的json格式格式数据(后台返回的必须是翻页对象的JSON格式数据)
	 */
	reflash : function(json){
		$("#lbl_totalRecords").html(json==null ? 0 : json.count);
		$("#lbl_currPage").html(json ==null ? 1 : json.indexNo);
		$("#lbl_totalPage").html(json ==null ? 0 : json.pageTotal); 
		$("#lbl_pageSize").html(json == null ? 0 : json.pageSize);  
		$("#totalRecords").val(json == null ? 0 : json.count);
		$("#currPage").val(json == null ? 1 : json.indexNo);
		$("#totalPage").val(json == null ? 0 : json.pageTotal);
		
	  	if(json!= null && json.dataMap.length>0 && json.pageTotal > 1){
	  		if(parseInt(json.indexNo) == parseInt(json.pageTotal)){
	  			$("#next").attr("disabled",true);
				$("#last").attr("disabled",true);
			}else{
				$("#next").attr("disabled",false);
				$("#last").attr("disabled",false);
				$("#goto").attr("disabled",false);
			}
	  	}else{
	  		$("#first").attr("disabled",true);
	  		$("#up").attr("disabled",true);
	  		$("#next").attr("disabled",true);
			$("#last").attr("disabled",true);
			$("#goto").attr("disabled",true);
	  	}
	}
};