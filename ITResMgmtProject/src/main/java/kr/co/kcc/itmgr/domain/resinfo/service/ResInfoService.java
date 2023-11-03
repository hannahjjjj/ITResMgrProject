package kr.co.kcc.itmgr.domain.resinfo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.kcc.itmgr.domain.commoncode.model.CommonCodeDetail;
import kr.co.kcc.itmgr.domain.installplace.model.InstallPlace;
import kr.co.kcc.itmgr.domain.ipinfo.model.IpInfo;
import kr.co.kcc.itmgr.domain.resclass.model.ResClass;
import kr.co.kcc.itmgr.domain.resclass.model.ResClassDTO;
import kr.co.kcc.itmgr.domain.resinfo.dao.IResInfoRepository;
import kr.co.kcc.itmgr.domain.resinfo.model.ResInfo;
import kr.co.kcc.itmgr.domain.resinfo.model.ResInfoDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResInfoService implements IResInfoService {
	
	private final IResInfoRepository resInfoRepository;
	
	@Override
	public List<ResInfo> selectAllResInfo(int page,ResInfo resInfo) {
		Map<String,Object> map = new HashMap<String,Object>();
		int start = (page-1)*10+1;
		map.put("start", start);
		map.put("end", start+9);
		map.put("resInfo", resInfo);
		return resInfoRepository.selectAllResInfo(map);
	}

	@Override
	public List<ResInfo> searchResInfoByResClass() {
		return resInfoRepository.searchResInfoByResClass();
	}

	@Override
	public List<ResInfo> searchResInfo(ResInfo resInfo) {
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("start", 1);
		map.put("end", 10);
		map.put("resInfo", resInfo);
		return resInfoRepository.selectAllResInfo(map);
	}

	@Override
	public void insertResInfo(ResInfo resInfo) {
		resInfoRepository.insertResInfo(resInfo);
		
	}

	@Override
	public List<CommonCodeDetail> selectResStatusCode(String codeGroupId) {
		return resInfoRepository.selectResStatusCode(codeGroupId);
	}

	@Override
	public List<InstallPlace> selectResInstallPlace(int page) {
		int start = (page-1)*10+1;
		return resInfoRepository.selectResInstallPlace(start,start+9);
	}

	@Override
	public List<ResClass> selectAllResClass() {
		return resInfoRepository.selectAllResClass();
	}

	@Override
	public ResInfo selectResInfoDetail(String resName) {
		return resInfoRepository.selectResInfoDetail(resName);
	}

	@Override
	public List<ResInfo> selectMappingAddItem(String resClassId) {
		return resInfoRepository.selectMappingAddItem(resClassId);
	}

	@Override
	public int countOfResInfo(ResInfo resInfo) {
		return resInfoRepository.countOfResInfo(resInfo);
	}

	@Override
	@Transactional
	public void insertAddItemValueInResInfo(List<String> resSerialIdList, List<String> addItemSnList, List<String> resDetailValueList) {
		for(int i=0; i<resSerialIdList.size(); i++) {
			resInfoRepository.insertAddItemValueInResInfo(resSerialIdList.get(i), addItemSnList.get(i), resDetailValueList.get(i));
		}
	}

	@Override
	public List<ResInfo> selectAddItemValueInResInfo(String resSerialId) {
		return resInfoRepository.selectAddItemValueInResInfo(resSerialId);
	}

	@Override
	@Transactional
	public void updateResInfo(ResInfo resInfo) {
		resInfoRepository.updateResInfo(resInfo);
	}

	@Override
	public void deleteAddItemValueInResInfo(String resSerialId) {
		resInfoRepository.deleteAddItemValueInResInfo(resSerialId);
	}

	@Override
	public int CountOfAddItemValueInResInfo(String resSerialId) {
		return resInfoRepository.CountOfAddItemValueInResInfo(resSerialId);
	}

	@Override
	public int countOfInstallPlace() {
		return resInfoRepository.countOfInstallPlace();
	}

	@Override
	public List<ResInfo> selectIpInResInfo(String resSerialId) {
		return resInfoRepository.selectIpInResInfo(resSerialId);
	}

	@Override
	@Transactional
	public void insertIpInResInfo(List<String> resSerialIdList2, List<Integer> ipSnList, List<String> ipTypeCodeList) {
		for(int i=0; i<resSerialIdList2.size(); i++) {
			resInfoRepository.insertIpInResInfo(resSerialIdList2.get(i), ipSnList.get(i), ipTypeCodeList.get(i));
		}
	}

	@Override
	public List<IpInfo> selectAllIpInfoList(int page) {
		int start = (page-1)*10+1;
		return resInfoRepository.selectAllIpInfoList(start, start+9);
	}

	@Override
	public int CountOfIpList() {
		return resInfoRepository.CountOfIpList();
	}

	@Override
	public List<ResInfo> setFlagResInfoList(List<ResInfo> resInfoList) {
		return resInfoList.stream()
				.map(r -> {
					r.setFlag("S");
					return r;
				})
				.collect(Collectors.toList());
	}

	/*
	 *  부가항목, 자원분류 Flag 생성
	 *  제너릭 타입으로 ResClassDTO 인터페이스를 상속 / setFlag를 사용하기 위해
	 */
	@Override
	public <T extends ResInfoDTO> List<T> setFlag(List<T> code) {
		return code.stream()
				.map(r -> {
					r.setFlag("S");
					return r;
				})
				.collect(Collectors.toList());
	}

	@Override
	public void deleteIpInResInfo(int ipSn) {
		resInfoRepository.deleteIpInResInfo(ipSn);
	}

	@Override
	public List<ResInfo> selectIpMappingInResInfo(String resSerialId) {
		return resInfoRepository.selectIpMappingInResInfo(resSerialId);
	}

	@Override
	public List<Integer> existingIpSnList(String resSerialId) {
		return resInfoRepository.existingIpSnList(resSerialId);
	}
	@Override
	@Transactional
	public void updateIpInResInfo(List<String> resSerialIdList2, List<Integer> ipSnList, List<String> ipTypeCodeList) {
		for(int i=0; i<resSerialIdList2.size(); i++) {
			resInfoRepository.updateIpInResInfo(resSerialIdList2.get(i), ipSnList.get(i), ipTypeCodeList.get(i));
		}
	}

}