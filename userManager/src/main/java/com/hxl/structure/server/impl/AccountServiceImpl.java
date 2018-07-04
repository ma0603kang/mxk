package com.hxl.structure.server.impl;

import java.util.List;

import com.hxl.common.pojo.TbUsers;
import com.hxl.common.pojo.TbUsersExample;
import com.hxl.structure.mapper.TbUsersMapper;
import com.hxl.structure.server.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
@Service
public class AccountServiceImpl implements AccountService {
	
	@Autowired
	private TbUsersMapper tbUsersMapper;

	@Override
	public TbUsers selUserByCodeAndStatus(String eCode, String status) {
		TbUsersExample example=new TbUsersExample();
		TbUsersExample.Criteria criteria = example.createCriteria();
		criteria.andECodeEqualTo(eCode);
		criteria.andStatusEqualTo(status);
		List<TbUsers> users = tbUsersMapper.selectByExample(example);
		if(users!=null&&users.size()>0){
			return users.get(0);
		}
		return null;
	}

	@Override
	public void updUserStatus(TbUsers user) {
		tbUsersMapper.updateByPrimaryKey(user);
	}

}
