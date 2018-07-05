package com.hxl;

import com.hxl.util.JsonUtils;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Test {

    public static void main(String[] args) {
        Map<Object,Object> map = new ConcurrentHashMap<>();
        map.put("1",2);
        String str = JsonUtils.fromartObjectToJSON(map);
        System.out.println(str);
    }
}
