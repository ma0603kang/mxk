package com.hxl.util;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.TypeHandler;

public class MyBatisTypeHander implements TypeHandler<String> {

	public void setParameter(PreparedStatement pstmt, int index, String value,
			JdbcType jdbcType) throws SQLException {
		if (value == null && jdbcType == JdbcType.VARCHAR) {// 判断传入的参数值是否为null
			
			pstmt.setString(index, "");// 设置当前参数的值为空字符串
		}
		else if(value == null && jdbcType == JdbcType.NUMERIC){
			pstmt.setString(index, "0");// 设置当前参数的值为空字符串
		}
		else if(value == null && jdbcType == JdbcType.TIMESTAMP){
			pstmt.setString(index, "null");
		}
		else {
			pstmt.setString(index, value);// 如果不为null，则直接设置参数的值为value
		}

	}

	public String getResult(ResultSet rs, String columnName)
			throws SQLException {
		return null;

	}

	public String getResult(ResultSet rs, int columnIndex) throws SQLException {
		return null;

	}

	public String getResult(CallableStatement cs, int columnIndex)
			throws SQLException {
		return null;

	}

}
