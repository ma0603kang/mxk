package com.hxl.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/** 
 * JSON 格式数据处理工具类
 * @author Rose
 * @since JDK1.6
 */

public class JsonUtils {

	/**
	 * 把JSONObject对象转成java Map
	 * 
	 * @return
	 */
	public static Map<String , Object> getMap4JSON(JSONObject jsonObj) {
		Map<String , Object> map = new HashMap<String , Object>();
		Iterator<?> keys = jsonObj.keys();
		String key;
		Object value;
		while (keys.hasNext()) {
			key = (String) keys.next();
			value = jsonObj.get(key);
			map.put(key, value);
		}
		return map;
	}

	
	/**
	 * 得到Java 对象(将json转为实体对象)
	 * 
	 * @param beanClass
	 * @return
	 */
	public static Object getObject4JSON(Class<?> beanClass ,JSONObject jsonObj ) {
		Object obj = JSONObject.toBean(jsonObj, beanClass);
		return obj;
	}

	/**
	 * 得到java 对象列表
	 * 
	 * @param beanClass
	 * @return
	 */
	public static List<Object> getList4JSON(Class<?> beanClass,JSONObject jsonArray,JSONObject jsonObj) {
		List<Object> list = new ArrayList<Object>();
		Object obj;
		for (int i = 0; i < jsonArray.size(); i++) {
			obj = JSONObject.toBean(jsonObj, beanClass);
			list.add(obj);
		}
		return list;
	}
	
	/**
	 * 得到java 对象列表
	 * 
	 * @param beanClass
	 * @return
	 */
	public static List<Map<String,Object>> getListFormJson(List<JSONObject> jsonArrayList) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		for(int i=0; i<jsonArrayList.size();i++){
			JSONObject jsonArray = jsonArrayList.get(i); 
			list.add(getMap4JSON(jsonArray)); 
		}
		return list;
	}
	
	/**
	 * 将数据转换为JSON格式的数据.
	 */
	public static String fromartObjectToJSON(Object obj){
		if(obj==null || obj.toString().trim().equals("")){
			return "";
		}
		return JSONObject.fromObject(obj).toString(); 
	}
	
	public static Object[] getArrayByJsonArray(Object jsonArray) {
		if((StringUtils.isNullOrEmpty(jsonArray))) {
			return null;
		}
		if(!(jsonArray instanceof JSONArray)) {
			Object[] tmp = new Object[1];
			tmp[0] = jsonArray;
			return tmp;
		}
		return ((JSONArray)jsonArray).toArray();
	}
	
	public static Map<String, Object> generateMap(HttpServletRequest request) {
		String json =  request.getParameter("data");
		if(StringUtils.isNullOrEmpty(json)) {
			return new HashMap<String, Object>();
		}
		return JsonUtils.generateMapFromJson(json);
	}
	
	public static Map<String,Object> generateMapFromJson(String jsonData){
		Map<String,Object> map = new HashMap<String,Object>();; 
		if(!StringUtils.isNullOrEmpty(jsonData)){
			//将前天输入的json字符串格式转换为Map
			JSONObject  jasonObject = null;
			try{
				jsonData = jsonData.replace("#＆#", "&"); 
				jsonData = jsonData.replace("#﹪#", "%");
				jasonObject = JSONObject.fromObject(jsonData);
			}catch(Exception e){
				System.err.println("*************** 无效的JSON格式数据. ****************");
				e.printStackTrace();
			}
			//将jasonObject转换为Map
			map = JsonUtils.getMap4JSON(jasonObject); 
		}
		return map;
	}
	
	/*public static void main(String args[]) {
		JSONArray jsonArray = new JSONArray();
		jsonArray.add("1");
		jsonArray.add("2");
		jsonArray.add("3");
		System.out.println(getArrayByJsonArray(jsonArray));
	}*/
}
