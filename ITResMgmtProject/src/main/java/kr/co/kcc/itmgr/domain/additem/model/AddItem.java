package kr.co.kcc.itmgr.domain.additem.model;

import java.sql.Timestamp;

import lombok.Data;

@Data
public class AddItem {
	private int addItemSn;
	private String addItemName;
	private String addItemDesc;
	private char useYN;
	private Timestamp createDate;
	private String createrId;
	private Timestamp updateDate;
	private String updaterId;
	
	private String searchText;
}
