<%--
  Created by IntelliJ IDEA.
  User: Rose
  Date: 2018/7/3 0003
  Time: 17:07
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>首页面</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>后台大布局</title>
    <link rel="stylesheet" href="${path}/comm/js/layui/css/layui.css">
    <script src="${path}/comm/js/layui/layui.js"></script>
    <script>
        layui.use('table', function() {
            var table = layui.table;

            //渲染
            table.render({
                elem: '#test'
                , height: 500
                , url: './demo1.json'
                //,size: 'sm'
                , page: {}
                , limit: 30
                , toolbar: '#toolbarDemo'
                , cols: [[
                    {type: 'checkbox', fixed: 'left'}
                    , {field: 'id', title: 'ID', width: 80, fixed: 'left', unresize: true, sort: true}
                    , {field: 'username', title: '用户名', width: 120, edit: 'text', templet: '#usernameTpl'}
                    , {field: 'email', title: '邮箱', width: 150}
                    , {field: 'sex', title: '性别', width: 80, edit: 'text', sort: true}
                    , {field: 'city', title: '城市', width: 100}
                    , {field: 'sign', title: '签名'}
                    , {field: 'experience', title: '积分', width: 80, sort: true}
                    , {field: 'ip', title: 'IP', width: 120}
                    , {field: 'logins', title: '登入次数', width: 100, sort: true}
                    , {field: 'joinTime', title: '加入时间', width: 120}
                    , {fixed: 'right', title: '操作', toolbar: '#barDemo', width: 150}
                ]]
            });
        });
    </script>
</head>
<body>

<div class="layui-btn-group">
    <button class="layui-btn" data-type="getCheckData">获取选中行数据</button>
    <button class="layui-btn" data-type="getCheckLength">获取选中数目</button>
    <button class="layui-btn" data-type="isAll">验证是否全选</button>
</div>

<table id="test" lay-filter="test"></table>

<script type="text/html" id="barDemo">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
</script>
<script type="text/html" id="toolbarDemo">
    <i class="layui-icon" data-type="add">&#xe654;</i>
    <i class="layui-icon" data-type="delete">&#xe640;</i>
</script>
</body>
</html>
