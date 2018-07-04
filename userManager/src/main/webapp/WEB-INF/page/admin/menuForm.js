var $;
var $form;
var form;
layui.config({
	base : "js/"
}).use(['form','layer','jquery','laydate'],function(){
	var layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,laydate = layui.laydate;
		$ = layui.jquery;
		form = layui.form;
		
		$("#title").blur(function(){
			var title=$("#title").val();
			if(title==''){
				title="-1"
			}
			$.ajax({
	            type: "get",
	            url: ctx+"/sys/checkMenuTitle/"+$("#title").val(),
	            success:function(data){
	            	if(data.code!=0){
	            		top.layer.msg(data.msg);
	            		$("#title").val("");
	            		$("#title").focus();
	            	}
	            }
	        });
		});
		

 	form.on("submit(menuForm)",function(data){
 		//弹出loading
 		var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
 		var msg;
 		$.ajax({
    		type: "post",
            url: ctx+"/sys/menuForm",
            data:data.field,
			dataType:"json",
			success:function(d){
		        msg=d.msg;
			}
        });
 		setTimeout(function(){
 			top.layer.close(index);
 			top.layer.msg(msg);
 			layer.closeAll("iframe");
 			//刷新父页面
	 		parent.location.reload();
        },2000);
 		return false;
 	})
	
})