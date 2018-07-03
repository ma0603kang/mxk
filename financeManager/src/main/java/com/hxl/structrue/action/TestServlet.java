package com.hxl.structrue.action;

import com.hxl.domain.api.TestConn;
import com.hxl.util.SpringHelper;

import java.io.IOException;

@javax.servlet.annotation.WebServlet(name = "TestServlet",urlPatterns={"/TestServlet"})
public class TestServlet extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        System.out.println("已经进入到Servlet中");
    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        System.out.println("已经进入到Servlet中123");
        TestConn testConn =  (TestConn)SpringHelper.getObject("demoService");
        String ret_str = testConn.testHear("传入数据");
        System.out.println("服务方返回数据::"+ret_str);

    }
}
