package com.hxl.util;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import net.sf.json.JSONObject;

/**
 * @Title:
 * @Description:Map工具类
 * @Author:Rose
 * @Since:2018年3月12日
 * @Version:1.1.0
 */

public class MapUtil {

	/**
	 * @param map
	 * @param obj
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 * @Description: Map转Bean
	 */

	public static void transMap2Bean(Map<String, Object> map, Object obj)
			throws InvocationTargetException, IllegalAccessException {
		if (map == null || obj == null) {
			return;
		}
		org.apache.commons.beanutils.BeanUtils.populate(obj, map);
	}

	/**
	 * @param map
	 * @param obj
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 * @Description:针对某些特殊返回对象增加Object Key的转换
	 */

	public static void transMap2BeanByObject(Map<Object, Object> map,
			Object obj)
					throws InvocationTargetException, IllegalAccessException {
		if (map == null || obj == null) {
			return;
		}
		org.apache.commons.beanutils.BeanUtils.populate(obj, map);
	}

	/**
	 * @param type
	 * @param map
	 * @throws Exception
	 * @Description: Map数据转换成javaBean 目前支持单层。
	 */

	public static Object convert(Class type, Map map) throws Exception {
		BeanInfo beanInfo = Introspector.getBeanInfo(type); // 获取类属性
		Object obj = type.newInstance(); // 创建 JavaBean 对象

		// 给 JavaBean 对象的属性赋值
		PropertyDescriptor[] propertyDescriptors = beanInfo
				.getPropertyDescriptors();
		for (int i = 0; i < propertyDescriptors.length; i++) {
			PropertyDescriptor descriptor = propertyDescriptors[i];
			String propertyName = descriptor.getName();

			if (map.containsKey(propertyName)) {

				Object value = map.get(propertyName).toString();

				Object[] args = new Object[1];
				args[0] = value;

				descriptor.getWriteMethod().invoke(obj, args);
			}
		}
		return obj;
	}

	/**
	 * @param list
	 * @return
	 * @Description:页面初始化时初始化码值到application中工具类
	 */
	public static String covertMaptoJson(
			List<Map<Object, Object>> list) {
		// 原始数据Map。
		Map<Object, Object> map2 = null;
		// 新容器。
		Map<Object, List<Map<Object, Object>>> map3 = new ConcurrentHashMap<Object, List<Map<Object, Object>>>();

		for (int i = 0; i < list.size(); i++) {
			map2 = (Map<Object, Object>) list.get(i);
			try {
				// 当前Map中存在同类型码值。
				if (map3.containsKey(map2.get("typecode"))) {
					map3.get(map2.get("typecode")).add(map2);
				} else { 
				// 当前容器中不存在同类型码值。
					List<Map<Object, Object>> list3 = new ArrayList<Map<Object, Object>>();
					list3.add(map2);
					map3.put((String) map2.get("typecode"), list3);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return JsonUtils.fromartObjectToJSON(map3);

	}
	
			/**
	        * @param list
	        * @return
	        * @Description:转换二维数据到树形结构
	        */
	    
	public static JSONObject convertListMaptoTreeJson(List<Map<Object, Object>> list){

		// 原始数据Map。
		Map<Object, Object> map2 = null;
		// 新容器。List<Map<Object, Object>>
		Map<String, Object> map3 = new ConcurrentHashMap<String, Object>();
		//1.数据分组
		for (int i = 0; i < list.size(); i++) {
			map2 = (Map<Object, Object>) list.get(i);
			try {
				// 当前Map中存在同类型码值。
				if (map3.containsKey(map2.get("TYPECODE"))) {
					((List)map3.get(map2.get("TYPECODE"))).add(map2);
				} else { 
				// 当前容器中国不存在同类型码值。
					List<Map<Object, Object>> list3 = new ArrayList<Map<Object, Object>>();
					list3.add(map2);
					map3.put((String) map2.get("TYPECODE"), list3);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		//2.循环分组之后的数据
		Set key = map3.entrySet();
		Iterator it = key.iterator();
		List<Object> list5 = new ArrayList<Object>();
		while(it.hasNext()){
			Entry  entry  = (Entry) it.next();
			//获取每一组数据的key
			String key2 = (String) entry.getKey();
			//根据Key获取每一组数据
			List<Map<Object,Object>> list2 = (List<Map<Object, Object>>) entry.getValue();
			Map<String,Object> unit = new HashMap<String,Object>(); //单元数据
			unit.put("TYPECODE", list2.get(0).get("TYPECODE"));
			unit.put("children", list2);
			list5.add(unit);
		}
		
		Map<Object,Object> map6 = new HashMap<Object,Object>();
		map6.put("Rows", list5);
		
		JSONObject jSONObject = new JSONObject();
		jSONObject.put("Rows", list5);
		return jSONObject;
	}

	/**
	 * 
    * @param list 服务信息
    * @param list 服务下的日志信息
    * @return
    * @Description:
	 */
	public static JSONObject convertMapListtoTreeJson(List<Map<Object, Object>> serviceListMap,Map<String,List<Map<Object, Object>>> logList){
		List<Object> list = new ArrayList<Object>();
		List<Object> servicelogList;
		Map<String, Object> unit;
		for (int j = 0; j < serviceListMap.size(); j++) {
			String tralsLogFlag = serviceListMap.get(j).get("tralsLogFlag")+"";
			servicelogList = new ArrayList<Object>();
			Object serviceName = serviceListMap.get(j).get("serviceName");
			Map<String, String> map = null;
			unit = new HashMap<String, Object>();
			unit.put("serviceName", serviceName);
			unit.put("servicesOrginIP",serviceListMap.get(j).get("servicesOrginIP"));
			unit.put("serviceSource", serviceListMap.get(j).get("serviceSource"));
			unit.put("serviceTarget", serviceListMap.get(j).get("serviceTarget"));
			unit.put("sendCount", serviceListMap.get(j).get("sendCount"));
			unit.put("tralsLogFlag", serviceListMap.get(j).get("tralsLogFlag"));
			if (null != logList.get(tralsLogFlag)){
				for (int i = 0; i < logList.get(tralsLogFlag).size() + 1; i++) {
					if (i == 0) {
						map = new HashMap<String, String>();
						map.put("serviceName", "服务名称");
						map.put("servicesOrginIP", "时间");
						map.put("serviceSource", "请求数据");
						map.put("serviceTarget", "耗时");
						map.put("sendCount", "执行结果");

					} else {
						map = new HashMap<String, String>();
						//请求时间
						String transDate = logList.get(tralsLogFlag).get(i - 1).get("transDate").toString();
						//返回时间
						String servicesOrginReturnDate = "";
						if (logList.get(tralsLogFlag).get(i - 1).get("servicesOrginReturnDate") == null) {
							SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
							servicesOrginReturnDate = sdf.format(new Date());
						} else {
							//返回时间
							servicesOrginReturnDate = logList.get(tralsLogFlag).get(i - 1).get("servicesOrginReturnDate").toString();
						}

						map.put("serviceName", serviceName + "");
						map.put("servicesOrginIP", transDate);
						map.put("serviceSource", logList.get(tralsLogFlag).get(i - 1).get("serviceOrginInputPath") + "");
						//计算两个日期的耗时
						long millisecond = getMillisecond(transDate, servicesOrginReturnDate);

						map.put("serviceTarget", millisecond + "");
						map.put("sendCount", logList.get(tralsLogFlag).get(i - 1).get("transResult").toString());
					}
					servicelogList.add(map);
					unit.put("children", servicelogList);
				}
			}
			list.add(unit);
		}
			JSONObject jSONObject = new JSONObject();
			jSONObject.put("Rows", list);
			return jSONObject;
		
	}
	
	/**
	 * 获取两个日期间的毫秒数
	        * @return
	        * @Description:
	 */
	public static long getMillisecond(String startDate,String endDate){
		
		
		//计算耗时
		long between;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
			Date begin = sdf.parse(startDate);
			Date end = sdf.parse(endDate);
			between = (end.getTime() - begin.getTime() );
			return between;
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		return 0;
		
	}

}
