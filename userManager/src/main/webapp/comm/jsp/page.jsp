<%@ page language="java" pageEncoding="UTF-8"%>
<div class="page">
	<div class="page-info">
		共有<span class="page_ctn">0</span>条记录，每页显示
		<span class="page_limit">15</span>条记录，当前第<span class="curr_page">1/10</span>页
	</div>
	<div class="page">
		<a class="layui-btn layui-btn-small" name="first" onclick="layers.jumpPage(-2, this);">首页</a>
		<a class="layui-btn layui-btn-small" name="prev" onclick="layers.jumpPage(-1, this);">上一页</a>
		<a class="layui-btn layui-btn-small" name="next" onclick="layers.jumpPage(1, this);">下一页</a>
		<a class="layui-btn layui-btn-small" name="last" onclick="layers.jumpPage(2, this);">尾页</a>
	</div>
	<input type="hidden" name="start" value="0"/>
	<input type="hidden" name="results" value="0"/>
	<div class="page-data" style="display: none;"></div>
</div>