package com.hxl.structure.action;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import com.hxl.util.PropertyPlaceholder;
import com.hxl.util.ResultUtil;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;


/**
 * 图片处理控制
 */
@Controller
public class PictureController {
	
	@RequestMapping(value="/pic/upload", produces = MediaType.APPLICATION_JSON_VALUE + ";charset=utf-8")
	@ResponseBody
	public ResultUtil uploadFile(MultipartFile file, HttpServletRequest req){
		if(file==null){
			return ResultUtil.error("文件不能为空！");
		}
		String fileSub=file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")).toLowerCase();
		if(".jpg".equals(fileSub) ||".jpeg".equals(fileSub) || ".png".equals(fileSub) || ".gif".equals(fileSub)){
			Random d=new Random();
			String img = UUID.randomUUID().toString().replace("-", "")+""+d.nextInt(10000)+""+fileSub;
			try {
//				uploadFile.transferTo(new File(req.getServletContext().getRealPath("WEB-INF/upload"),img));
				file.transferTo(new File((String) PropertyPlaceholder.getProperty("upfile.path"),img));
			} catch (IllegalStateException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			Map<String,String> map=new HashMap<>();
			map.put("src",(String) PropertyPlaceholder.getProperty("upfile.code")+img);
			return ResultUtil.ok(map);
		}else{
			return ResultUtil.error("文件格式不支持,请重新选择！");
		}
	}
	@RequestMapping(value="/pic/upload1", produces = MediaType.APPLICATION_JSON_VALUE + ";charset=utf-8")
	@ResponseBody
	public ResultUtil uploadFile1(MultipartFile uploadFile,HttpServletRequest req){
		if(uploadFile==null){
			return ResultUtil.error("文件不能为空！");
		}
		String fileSub=uploadFile.getOriginalFilename().substring(uploadFile.getOriginalFilename().lastIndexOf("."));
		if(".jpg".equals(fileSub) || ".png".equals(fileSub) || ".gif".equals(fileSub)){
			Random d=new Random();
			String img = UUID.randomUUID().toString().replace("-", "")+""+d.nextInt(10000)+""+fileSub;
			try {
//				uploadFile.transferTo(new File(req.getServletContext().getRealPath("WEB-INF/upload"),img));
				uploadFile.transferTo(new File((String) PropertyPlaceholder.getProperty("upfile.path"),img));
			} catch (IllegalStateException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			Map<String,String> map=new HashMap<>();
			map.put("src",(String) PropertyPlaceholder.getProperty("upfile.code")+img);
			return ResultUtil.ok(map);
		}else{
			return ResultUtil.error("文件格式不支持！");
		}
	}
}
