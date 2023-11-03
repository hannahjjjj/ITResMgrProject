package kr.co.kcc.itmgr.domain.resinfo.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.kcc.itmgr.domain.commoncode.model.CommonCodeDetail;
import kr.co.kcc.itmgr.domain.installplace.model.InstallPlace;
import kr.co.kcc.itmgr.domain.ipinfo.model.IpInfo;
import kr.co.kcc.itmgr.domain.resclass.controller.ResClassController;
import kr.co.kcc.itmgr.domain.resclass.model.ResClass;
import kr.co.kcc.itmgr.domain.resinfo.model.ResInfo;
import kr.co.kcc.itmgr.domain.resinfo.service.IResInfoService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ResInfoController {

	private final IResInfoService resInfoService;
	static final Logger logger = LoggerFactory.getLogger(ResClassController.class);

	@GetMapping("/resinfo")
	public String selectAllResInfo(Model model) {
		int page = 1;
		ResInfo resInfo =new ResInfo();
		List<ResInfo> selectAllResInfo = resInfoService.selectAllResInfo(page,resInfo);
		Map<String, Object> resInfoMap = new HashMap<String, Object>();
		
		int countOfResList = resInfoService.countOfResInfo(resInfo);
		int totalPage = 0;
		if(countOfResList > 0) {
			totalPage= (int)Math.ceil(countOfResList/10.0);
		}
		int totalPageBlock = (int)(Math.ceil(totalPage/10.0));
		int nowPageBlock = (int) Math.ceil(page/5.0);
		int startPage = (nowPageBlock-1)*5 + 1;
		int endPage = 0;
		if(totalPage > nowPageBlock*5) {
			endPage = nowPageBlock*5;
		}else {
			endPage = totalPage;
		}
		
		Map<String,Object> page2 = new HashMap<String, Object>();
		
		page2.put("totalPageCount", totalPage);
		page2.put("nowPage", page);
		page2.put("totalPageBlock", totalPageBlock);
		page2.put("nowPageCount", nowPageBlock);
		page2.put("startPage", startPage);
		page2.put("endPage", endPage);
		
		resInfoMap.put("selectAllResInfo",selectAllResInfo);
		resInfoMap.put("page",page2);
		model.addAttribute("selectAllResInfo", selectAllResInfo);
		model.addAttribute("totalPageCount", totalPage);
		model.addAttribute("page2", page2);

		List<ResInfo> searchResInfoByResClass = resInfoService.searchResInfoByResClass();
		model.addAttribute("search", searchResInfoByResClass);

		List<CommonCodeDetail> selectResStatusCode = resInfoService.selectResStatusCode("RES000");
		model.addAttribute("selectResStatusCode", selectResStatusCode);


		List<ResClass> resClassList = resInfoService.selectAllResClass();
		Map<String, Map<String, Map<String, String>>> resClassMap = new HashMap<String, Map<String, Map<String, String>>>();

		// 데이터를 반복하면서 맵에 추가
		
		for (ResClass r : resClassList) {
			if (r.getUpperResClassName() == null) {
				resClassMap.put(r.getResClassName(), null);
			}	
		}
		for (String key: resClassMap.keySet()) {
			Map<String, Map<String, String>> map2 = new HashMap<String, Map<String,String>>();
		    for (ResClass r : resClassList) {
		        if (key.equals(r.getResClassName())) {
		        		map2.put(r.getResClassName2(), null);
		            }
		    }
		    if(!map2.isEmpty()) {
		    for(String key2 : map2.keySet()) {
		    	Map<String, String> map3 = new HashMap<>();
		    	for(ResClass r2 : resClassList) {
			    	if(key2.equals(r2.getResClassName()) && key.equals(r2.getUpperResClassName())) {
			    			map3.put(r2.getResClassName2(), r2.getResClassId());
			    	}
			    	map2.put(key2, map3);
			    }
		    }
		}
		    resClassMap.put(key, map2);
		}
		model.addAttribute("resClassMap", resClassMap);
		return "resinfo/resinfo";
	}
	
	@GetMapping("/resinfopagination")
	@ResponseBody
	public Map<String,Object> selectResinfoPagination(ResInfo resInfo){
		List<ResInfo> selectAllResInfo = resInfoService.selectAllResInfo(resInfo.getPage(),resInfo);
		Map<String, Object> resInfoMap = new HashMap<String, Object>();
		
		int countOfResList = resInfoService.countOfResInfo(resInfo);
		int totalPage = 0;
		if(countOfResList > 0) {
			totalPage= (int)Math.ceil(countOfResList/10.0);
		}
		int totalPageBlock = (int)(Math.ceil(totalPage/5.0));
		int nowPageBlock = (int) Math.ceil(resInfo.getPage()/5.0);
		int startPage = (nowPageBlock-1)*5 + 1;
		int endPage = 0;
		if(totalPage > nowPageBlock*5) {
			endPage = nowPageBlock*5;
		}else {
			endPage = totalPage;
		}
		
		Map<String,Object> page2 = new HashMap<String, Object>();
		
		page2.put("totalPageCount", totalPage);
		page2.put("currentPage", resInfo.getPage());
		page2.put("totalPageBlock", totalPageBlock);
		page2.put("nowPageCount", nowPageBlock);
		page2.put("startPage", startPage);
		page2.put("endPage", endPage);
		
		resInfoMap.put("selectAllResInfo",selectAllResInfo);
		resInfoMap.put("page",page2);
		return resInfoMap;
	}
	
	@PostMapping("/resinfo/update")
	@ResponseBody
	public void updateResInfo(@RequestBody ResInfo resInfo) {
		String resClass = resInfo.getResClassId();
		try {
			resInfoService.updateResInfo(resInfo);
			System.out.println("아아악1"+resClass);
			String resSerialId = resInfo.getResSerialId();
			int count = resInfoService.CountOfAddItemValueInResInfo(resSerialId);
			try {
				// 새로운 IP 주소 목록
				List<Integer> newIpSnList = resInfo.getIpSnList();
				List<String> ipTypeCodeList = resInfo.getIpTypeCodeList(); // IP 유형 목록\

				// 기존 IP 주소 목록을 데이터베이스에서 가져오는 코드
				List<Integer> existingIpSnList = resInfoService.existingIpSnList(resSerialId);

				// 중복되지 않는 IP 주소 필터링
				List<Integer> uniqueIpSnList = newIpSnList.stream()
				    .filter(ip -> !existingIpSnList.contains(ip))
				    .collect(Collectors.toList());

				logger.info("유니크키:" + uniqueIpSnList);

				// 중복되지 않는 IP 주소 업데이트 또는 필요한 작업 수행
				if(!(existingIpSnList.size()==0)) {
					List<String> resSerials = resInfo.getResSerialIdList2();
				for (int i = 0; i < uniqueIpSnList.size(); i++) {
				    int ipSn = uniqueIpSnList.get(i);
				    String ipTypeCode = ipTypeCodeList.get(i); // 해당 IP의 유형
				    String resSerialId2 = resSerials.get(i);
				    resInfoService.updateIpInResInfo(Collections.singletonList(resSerialId2), Collections.singletonList(ipSn), Collections.singletonList(ipTypeCode));
				}
				}else if(existingIpSnList.size()==0){
					resInfoService.insertIpInResInfo(resInfo.getResSerialIdList2(), resInfo.getIpSnList(), resInfo.getIpTypeCodeList());
				}
				try {
					if(!(existingIpSnList.size()==0)&& !resInfo.getResClassId().equals(resClass) && count >1) {
						resInfoService.deleteAddItemValueInResInfo(resSerialId);
						resInfoService.insertAddItemValueInResInfo(resInfo.getResSerialIdList(), resInfo.getAddItemSnList(), resInfo.getResDetailValueList());
					}if(!(existingIpSnList.size()==0 && count>1)){
						resInfoService.deleteAddItemValueInResInfo(resSerialId);
						resInfoService.insertAddItemValueInResInfo(resInfo.getResSerialIdList(), resInfo.getAddItemSnList(), resInfo.getResDetailValueList());
					}if(existingIpSnList.size()==0) {
						System.out.println(resInfo.getResSerialIdList().size());
						resInfoService.insertAddItemValueInResInfo(resInfo.getResSerialIdList(), resInfo.getAddItemSnList(), resInfo.getResDetailValueList());						
					}
				}catch(Exception e){
					System.out.println("예외가 발생했습니다: " + e.toString());
					e.getMessage();
				}
			}catch(Exception e) {
				e.getMessage();
				System.out.println("예외가 발생했습니다: " + e.toString());
			}
		}catch(Exception e) {
			e.getMessage();
		}
	}
	
	@PostMapping("/resinfo/ipdelete")
	@ResponseBody
	public void deleteIpMapping(int ipSn) {
		resInfoService.deleteIpInResInfo(ipSn);
	}
	
	
	@GetMapping("/resinfo/iplist")
	@ResponseBody
	public Map<String, Object> selectAllIpInfoList(int page){
		Map<String, Object> ipListMap = new HashMap<String, Object>();
		List<IpInfo> selectAllIpInfoList =  resInfoService.selectAllIpInfoList(page);
		int ipListCount = resInfoService.CountOfIpList();
		int totalPage=0;
		if(ipListCount>0) {
			totalPage=(int)Math.ceil(ipListCount/10.0);
		}
		int totalPageBlock = (int)(Math.ceil(totalPage/10.0));
		int nowPageBlock = (int)Math.ceil(page/5.0);
		int startPage = (nowPageBlock-1)*10+1;
		int endPage=0;
		if(totalPage > nowPageBlock* 10) {
			endPage = nowPageBlock*10;
		}else {
			endPage = totalPage;
		}
		Map<String,Object> page2 = new HashMap<String, Object>();
		page2.put("totalPageCount", totalPage);
		page2.put("nowPage", page);
		page2.put("totalPageBlock", totalPageBlock);
		page2.put("nowPageCount", nowPageBlock);
		page2.put("startPage", startPage);
		page2.put("endPage", endPage);
		
		ipListMap.put("selectAllIpInfoList",selectAllIpInfoList);
		ipListMap.put("page", page2);
		return ipListMap;
	}
	
	@GetMapping("/resinfo/additem")
	@ResponseBody
	public List<ResInfo> selectMappingAddItem(@RequestParam("resClassId") String resClassId){
		List<ResInfo> selectMappingAddItem = resInfoService.selectMappingAddItem(resClassId);
		return selectMappingAddItem;
	}
	
	@GetMapping("/resinfo/ip")
	@ResponseBody
	public List<ResInfo> selectIpInResInfo(@RequestParam("resSerialId") String resSerialId){
		List<ResInfo> selectIpInResInfo = resInfoService.selectIpInResInfo(resSerialId);
		return selectIpInResInfo;
	}
	
	@GetMapping("/resinfo/installplace")
	@ResponseBody
	public Map<String, Object> selectResInstallPlace(int page){
		Map<String, Object> installPlaceMap = new HashMap<String, Object>();
		List<InstallPlace> selectResInstallPlace = resInfoService.selectResInstallPlace(page);
	logger.info("durl"+selectResInstallPlace);
		int installPalceCount = resInfoService.countOfInstallPlace();
		int totalPage=0;
		if(installPalceCount>0) {
			totalPage=(int)Math.ceil(installPalceCount/10.0);
		}
		int totalPageBlock = (int)(Math.ceil(totalPage/10.0));
		int nowPageBlock = (int)Math.ceil(page/5.0);
		int startPage = (nowPageBlock-1)*10+1;
		int endPage=0;
		if(totalPage > nowPageBlock* 10) {
			endPage = nowPageBlock*10;
		}else {
			endPage = totalPage;
		}
		Map<String,Object> page2 = new HashMap<String, Object>();
		page2.put("totalPageCount", totalPage);
		page2.put("nowPage", page);
		page2.put("totalPageBlock", totalPageBlock);
		page2.put("nowPageCount", nowPageBlock);
		page2.put("startPage", startPage);
		page2.put("endPage", endPage);
		
		installPlaceMap.put("selectResInstallPlace",selectResInstallPlace);
		installPlaceMap.put("page", page2);
		return installPlaceMap;
	}
	
	
	@GetMapping("/resinfo/additemvalue")
	@ResponseBody
	public List<ResInfo> selectAddItemValueInResInfo(String resSerialId){
		List<ResInfo> selectAddItemValueInResInfo = resInfoService.selectAddItemValueInResInfo(resSerialId);
		return selectAddItemValueInResInfo;
	}
	
	@GetMapping("/resinfo/ipmapping")
	@ResponseBody
	public List<ResInfo> selectIpMappingInResInfo(String resSerialId){
		List<ResInfo> selectIpMappingInResInfo = resInfoService.selectIpMappingInResInfo(resSerialId);
		return selectIpMappingInResInfo;
	}


	@GetMapping("/resinfo/search")
	@ResponseBody
	public Map<String,Object> searchResInfo(ResInfo resInfo) {
		List<ResInfo> searchResInfo = resInfoService.searchResInfo(resInfo);
		Map<String, Object> resInfoMap = new HashMap<String, Object>();
		
		int countOfResList = resInfoService.countOfResInfo(resInfo);
		int totalPage = 0;
		if(countOfResList > 0) {
			totalPage= (int)Math.ceil(countOfResList/10.0);
		}
		int totalPageBlock = (int)(Math.ceil(totalPage/5.0));
		int nowPageBlock = (int) Math.ceil(1/5.0);
		int startPage = (nowPageBlock-1)*5 + 1;
		int endPage = 0;
		if(totalPage > nowPageBlock*5) {
			endPage = nowPageBlock*5;
		}else {
			endPage = totalPage;
		}
		
		Map<String,Object> page2 = new HashMap<String, Object>();
		
		page2.put("totalPageCount", totalPage);
		page2.put("currentPage", 1);
		page2.put("totalPageBlock", totalPageBlock);
		page2.put("nowPageCount", nowPageBlock);
		page2.put("startPage", startPage);
		page2.put("endPage", endPage);
		
		resInfoMap.put("selectAllResInfo",searchResInfo);
		resInfoMap.put("page",page2);
		return resInfoMap;
	}

	@PostMapping("/resinfo/insert")
	@ResponseBody
	public void insertResInfo(@RequestBody ResInfo resInfo) {
        resInfoService.insertResInfo(resInfo);
        resInfoService.insertAddItemValueInResInfo(resInfo.getResSerialIdList(), resInfo.getAddItemSnList(), resInfo.getResDetailValueList());
        resInfoService.insertIpInResInfo(resInfo.getResSerialIdList2(), resInfo.getIpSnList(), resInfo.getIpTypeCodeList());
	}


	@GetMapping("/resinfo/detail")
	@ResponseBody
	public ResInfo selectResInfoDetail(@RequestParam("resName")String resName) {
		ResInfo selectResInfoDetail  = resInfoService.selectResInfoDetail(resName);
		return selectResInfoDetail;
	}
}
