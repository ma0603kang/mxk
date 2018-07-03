package com.hxl.util;

import java.sql.Connection;
import java.sql.SQLException;

import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * @Title:
 * @Description:Spring获取beana工具类
 * @Author:Rose
 * @Since:2018年3月15日
 * @Version:1.1.0
 */
@Component
public class SpringHelper implements ApplicationContextAware {

	private static ApplicationContext applicationContext;
	private static Connection connection;

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * org.springframework.context.ApplicationContextAware#setApplicationContext
	 * (org.springframework.context.ApplicationContext)
	 */

	public static ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		this.applicationContext = applicationContext;
	}

	/**
	 * @return
	 * @Description:获取新的连接对象
	 */

	public static Connection getConn() {
		BasicDataSource basicDataSource = (BasicDataSource) applicationContext
				.getBean("dataSource");
		try {
			connection = basicDataSource.getConnection();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return connection;
	}
	
			/**
	        * @param key
	        * @return
	        * @Description:获取spring容器中定义bean
	        */
	    
	public static Object getObject(String key){
		Object obj = null;
		if(!StringUtils.isNullOrEmpty(key)){
			obj = applicationContext.getBean(key);
		}
		return obj;
	}
	
	/**
	 * @param key
	 * @return
	 * @Description:获取spring容器中定义bean
	 */
	
	public static Object getObjectByType(Class key){
		Object obj = null;
		if(!StringUtils.isNullOrEmpty(key)){
			obj = applicationContext.getBean(key);
		}
		return obj;
	}
	

}
