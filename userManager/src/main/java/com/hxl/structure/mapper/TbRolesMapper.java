package com.hxl.structure.mapper;

import java.util.List;

import com.hxl.common.pojo.TbRoles;
import com.hxl.common.pojo.TbRolesExample;
import org.apache.ibatis.annotations.Param;

public interface TbRolesMapper {
    int countByExample(TbRolesExample example);

    int deleteByExample(TbRolesExample example);

    int deleteByPrimaryKey(Long roleId);

    int insert(TbRoles record);

    int insertSelective(TbRoles record);

    List<TbRoles> selectByExample(TbRolesExample example);

    TbRoles selectByPrimaryKey(Long roleId);

    int updateByExampleSelective(@Param("record") TbRoles record, @Param("example") TbRolesExample example);

    int updateByExample(@Param("record") TbRoles record, @Param("example") TbRolesExample example);

    int updateByPrimaryKeySelective(TbRoles record);

    int updateByPrimaryKey(TbRoles record);
}