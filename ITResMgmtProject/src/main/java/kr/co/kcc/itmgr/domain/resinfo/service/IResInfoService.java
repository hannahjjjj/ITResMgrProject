package kr.co.kcc.itmgr.domain.resinfo.service;

import java.util.List;

import kr.co.kcc.itmgr.domain.commoncode.model.CommonCodeDetail;
import kr.co.kcc.itmgr.domain.installplace.model.InstallPlace;
import kr.co.kcc.itmgr.domain.resclass.model.ResClass;
import kr.co.kcc.itmgr.domain.resinfo.model.ResInfo;

public interface IResInfoService {
	List<ResInfo> selectAllResInfo(int page);
	int countOfResInfo();//자원갯수
	
	List<ResInfo> searchResInfoByResClass();
	List<ResInfo> searchResInfo(ResInfo resInfo); //검색결과조회
	
	List<ResClass> selectAllResClass(); //자원분류리스트 조회
	
	void insertResInfo(ResInfo resInfo); //자원입력
	
	List<CommonCodeDetail> selectResStatusCode(String codeGroupId); //자원상태코드 리스트 불러오기
	List<InstallPlace> selectResInstallPlace(); //자원설치장소 리스트 불러오기
	
	ResInfo selectResInfoDetail(String resName);
	
	List<ResInfo> selectMappingAddItem(String resClassId);
	
	void insertAddItemValueInResInfo(List<ResInfo> resInfo); //매핑된 부가항목 값 넣기
	List<ResInfo> selectAddItemValueInResInfo(String resSerialId);

}
