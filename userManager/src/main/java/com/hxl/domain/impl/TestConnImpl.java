package com.hxl.domain.impl;

import com.hxl.domain.api.TestConn;

public class TestConnImpl implements TestConn {
    /**
     * 心跳
     * @param str
     * @return String
     */
    @Override
    public String testHear(String str) {
        System.out.println("接收到请求数据::"+str);
        return "SUCCESS";
    }
}
