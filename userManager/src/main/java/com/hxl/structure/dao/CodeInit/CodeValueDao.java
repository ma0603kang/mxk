package com.hxl.structure.dao.CodeInit;

import java.util.List;
import java.util.Map;

public interface CodeValueDao {
	/**
	 * @param map
	 * @return
	 * @Description:初始化码值列表
	 */
	List<Map<Object, Object>> initAllCodeValue();
	
}
