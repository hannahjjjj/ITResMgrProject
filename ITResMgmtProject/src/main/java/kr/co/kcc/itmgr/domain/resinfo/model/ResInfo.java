package kr.co.kcc.itmgr.domain.resinfo.model;

import java.sql.Timestamp;
import java.util.List;

import lombok.Data;

@Data
public class ResInfo {
	
	private String resSerialId;
	private String resClassId;
	private String resName;
	private String resSn;
	private String mgmtId;
	private String resStatusCode;
	private String manufactureCompanyName;
	private String modelName;
	private String mgmtDeptName;
	private String managerName;
	private String introductionDate;
	private int introductionPrice;
	private String purchaseCompanyName;
	private String useYn;
	private String monitoringYn;
	private String rackInfo;
	private String expirationDate;
	private String addInfo;
	private Timestamp createDate;
	private String createrId;
	private Timestamp updateDate;
	private String updaterId;
	private int installPlaceSn;

	
	//추가컬럼
	private String resClassName;
	private int mappingNumberOfRes;
	
	private String topUpperResClassName;
	private String upperResClassName;
	private String installPlaceName;
	private int level;
	private String upperResClassId;
	
	private String installPlacePostno;
	private String installPlaceAddress;
	
	private String addItemSn;
	private String addItemName;
	private String resDetailValue;
	
	private String ip;
	private int ipSn;
	private String detailCodeName;
	private String ipTypeCode;
	
	private List<Integer> ipSnList;
	private List<String> ipTypeCodeList;
	
	private List<String> resSerialIdList;
	private List<String> resSerialIdList2;
	private List<String> addItemSnList;
	private List<String> resDetailValueList;
	
	//페이징
	private int totalPageBlock;
	private int totalPage;
	private int page;
	private int nowPageBlock;
	private int startPage;
	private int endPage;
	
	private String flag;
	
	
}
