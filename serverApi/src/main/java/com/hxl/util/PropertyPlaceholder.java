        package com.hxl.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;


        /**
        *@Title:
        *@Description:获取公共属性配置
        *@Author:Rose
        *@Since:2018年5月14日
        *@Version:1.1.0
        */
    
public class PropertyPlaceholder extends PropertyPlaceholderConfigurer  {
	
	private static Map<String,String> propertyMap;

    @Override
    protected void processProperties(ConfigurableListableBeanFactory beanFactoryToProcess, Properties props) throws BeansException {
        super.processProperties(beanFactoryToProcess, props);
        propertyMap = new HashMap<String, String>();
        for (Object key : props.keySet()) {
            String keyStr = key.toString();
            String value = props.getProperty(keyStr);
            propertyMap.put(keyStr, value);
        }
    }

    public static Object getProperty(String name) {
        return propertyMap.get(name);
    }
}

    