package kr.co.kcc.itmgr.domain.home.model;

import lombok.Data;

@Data
public class SearchCondition {
	private String midResClass;
	private String bottomResClass;
	private char monitoringYn;
	private String resName;
}
