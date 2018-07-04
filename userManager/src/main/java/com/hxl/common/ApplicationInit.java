package com.hxl.common;

import com.hxl.structure.mapper.CodeValueDao;
import com.hxl.util.Constant;
import com.hxl.util.MapUtil;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.List;
import java.util.Map;

@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
@Component
public class ApplicationInit implements ServletContextListener,ApplicationContextAware {

	
			/**
	        *保存静态变量
	        */
	private static String gloabJson;
	/**
	 *
	 */
	@Autowired
	public CodeValueDao codeValueDao;

	/**
	 * 关闭服务器时，清空application数据
	 * @param evt
	 */
	public void contextDestroyed(ServletContextEvent evt) {
		ServletContext application = evt.getServletContext();
		application.removeAttribute(Constant.PATH);
		application.removeAttribute(Constant.DATA);
	}

	public void contextInitialized(ServletContextEvent evt) {
		ServletContext application = evt.getServletContext();
		application.setAttribute(Constant.PATH, application.getContextPath());
		application.setAttribute(Constant.DATA, gloabJson);
	}

	
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		//List<Map<Object, Object>> list = codeValueDao.initAllCodeValue();
		//gloabJson = MapUtil.covertMaptoJson(list);

		}
	
	

}
