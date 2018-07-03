package com.hxl.util;

import java.math.BigDecimal;
import java.util.Date;
import java.util.UUID;

/**
 * 字符串处理工具类
 * 
 * @author xingyakai
 * @since JDK1.6
 * @history 2016-07-28 xingyakai create
 */
public class StringUtils {

	/**
	 * 判断字符串是否有中文
	 * 
	 * @param str
	 * @return
	 */
	public static boolean hasChinese(String str) {
		if (str == null) {
			return false;
		}
		if (str.getBytes().length != str.length()) {
			return true;
		}
		return false; 
	}

	/**
	 * 判断字符是否为 null 或 空字符串
	 * 
	 * @param str
	 * @return if "str" is null or empty then return true else return false
	 */
	public static boolean isNullOrEmpty(Object obj) {
		return (obj == null || obj.toString().trim().length() == 0);
	}
	
	public static String to_String(Object obj) {
		if(StringUtils.isNullOrEmpty(obj)) {
			return "";
		}
		return obj.toString();
	}
	
	/**
	 * 功能描述：人民币转成大写
	 * 
	 * @param str
	 *            数字字符串
	 * @return String 人民币转换成大写后的字符串
	 */
	public static String hangeToBig(String str) {
		double value;
		try {
			value = Double.parseDouble(str.trim());
		} catch (Exception e) {
			return null;
		}
		char[] hunit = { '拾', '佰', '仟' }; // 段内位置表示
		char[] vunit = { '万', '亿' }; // 段名表示
		char[] digit = { '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖' }; // 数字表示
		long midVal = (long) (value * 100); // 转化成整形
		String valStr = String.valueOf(midVal); // 转化成字符串

		String head = valStr.substring(0, valStr.length() - 2); // 取整数部分
		String rail = valStr.substring(valStr.length() - 2); // 取小数部分

		String prefix = ""; // 整数部分转化的结果
		String suffix = ""; // 小数部分转化的结果
		// 处理小数点后面的数
		if (rail.equals("00")) { // 如果小数部分为0
			suffix = "整";
		} else {
			suffix = digit[rail.charAt(0) - '0'] + "角"
					+ digit[rail.charAt(1) - '0'] + "分"; // 否则把角分转化出来
		}
		// 处理小数点前面的数
		char[] chDig = head.toCharArray(); // 把整数部分转化成字符数组
		char zero = '0'; // 标志'0'表示出现过0
		byte zeroSerNum = 0; // 连续出现0的次数
		for (int i = 0; i < chDig.length; i++) { // 循环处理每个数字
			int idx = (chDig.length - i - 1) % 4; // 取段内位置
			int vidx = (chDig.length - i - 1) / 4; // 取段位置
			if (chDig[i] == '0') { // 如果当前字符是0
				zeroSerNum++; // 连续0次数递增
				if (zero == '0') { // 标志
					zero = digit[0];
				} else if (idx == 0 && vidx > 0 && zeroSerNum < 4) {
					prefix += vunit[vidx - 1];
					zero = '0';
				}
				continue;
			}
			zeroSerNum = 0; // 连续0次数清零
			if (zero != '0') { // 如果标志不为0,则加上,例如万,亿什么的
				prefix += zero;
				zero = '0';
			}
			prefix += digit[chDig[i] - '0']; // 转化该数字表示
			if (idx > 0)
				prefix += hunit[idx - 1];
			if (idx == 0 && vidx > 0) {
				prefix += vunit[vidx - 1]; // 段结束位置应该加上段名如万,亿
			}
		}

		if (prefix.length() > 0)
			prefix += '圆'; // 如果整数部分存在,则有圆的字样
		return prefix + suffix; // 返回正确表示
	}

	/**
	 * 判断字符是否为 null 或 空字符串
	 * 
	 * @param str
	 * @return str
	 */
	public static String NullOrEmpty(String str) {
		String res = "";
		try {
			if (str == null){
				return "";
			}else{
				str = str.trim();
				res = new String(str.getBytes("ISO-8859-1"),"UTF-8"); 
			}
		} catch(Exception e){
			e.printStackTrace();
		}
		return res;
	}
	
	/**
	 * 对象输出处理
	 */
	public static String objToStr(Object obj) {
		if(obj == null) {
			return "";
		}
		if(obj instanceof Date) {
			return null;
		} else if(obj instanceof String) {
			return StringUtils.to_String(obj);
		} else if(obj instanceof BigDecimal) {
			return StringUtils.to_String(obj);
		}
		return StringUtils.to_String(obj);
	}
	
	/**
	 * 字符串转Date
	 * @param obj
	 * @return
	 */
	public static Date objToDate(Object obj) {
		if(obj == null) {
			return null;
		}
		if(obj instanceof String) {
			
		}
		
		return null;
	}
	
	/**
	 * 对象转数字类型
	 * @param obj
	 * @return
	 */
	public static Integer objToInt(Object obj) {
		String res = StringUtils.objToStr(obj);
		if(StringUtils.isNullOrEmpty(res)) {
			return null;
		}
		return Integer.parseInt(res);
	}
	
	/**
	 * 获取UUID
	 * @return
	 */
	public static String getUUID() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
	
	/**
	 * 有效，无效 转换
	 * @param obj
	 * @return
	 */
	public static String getRecordDesc(Object obj) {
		if(StringUtils.isNullOrEmpty(obj)) {
			return "";
		}
		int record = objToInt(obj);
		if(record == 0) {
			return "无效";
		}
		return "有效";
	}
	
	public static void main(String[] args) {
		//System.out.println(StringUtils.objToStr(new Date()));
		
		//System.out.println(StringUtils.objToStr("-------------"));
	}
}
