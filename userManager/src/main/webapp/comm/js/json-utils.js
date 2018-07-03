(function($) {
	var me = {};
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
	
	function toJson(domId){
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
	window.jsonUtils = me;
})(jQuery);