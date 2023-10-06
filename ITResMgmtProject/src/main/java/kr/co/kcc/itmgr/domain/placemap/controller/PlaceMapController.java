package kr.co.kcc.itmgr.domain.placemap.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.kcc.itmgr.domain.installplace.model.InstallPlace;
import kr.co.kcc.itmgr.domain.installplace.service.IInstallPlaceService;
import kr.co.kcc.itmgr.domain.placemap.service.IPlaceMapService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PlaceMapController {
	
	private final IInstallPlaceService installPlaceService;
	private final IPlaceMapService placeMapService;
	
	/*
	 * @Author: [윤준성]
	 * @API No.4-1. 지역별 설치 장소 현황
	 * @Info: 상세 주소 수정
	 */
	@GetMapping("/placemap")
	public String selectPlaceMap(Model model) {
		List<InstallPlace> installPlace = installPlaceService.selectAllPlace();
		model.addAttribute("place", installPlace);
		return "/place/placemap";
	}
	
	/*
	 * @Author: [윤준성]
	 * @API No.4-2. 특정 설치 장소 [비동기]
	 * @Info: 상세 주소 수정
	 */
	@PostMapping("/map/detail")
	public ResponseEntity<InstallPlace> selectInstallPlaceByName(@RequestBody Map<String, String> requestBody) {
	    String placeName = requestBody.get("placeName");
	    List<InstallPlace> places = installPlaceService.selectInstallPlaceByName(placeName);

	    if (places != null && !places.isEmpty()) {
	        InstallPlace place = places.get(0);
	        log.info("body: " + placeName);
	        log.info("place: " + place);
	        return ResponseEntity.ok().body(place);
	    } else {
	        // 만약 검색 결과가 없을 경우에 대한 처리를 추가할 수 있습니다.
	        // 예를 들어, 404 Not Found 상태 코드를 반환하거나 다른 적절한 응답을 보낼 수 있습니다.
	        return ResponseEntity.notFound().build();
	    }
	}
	
	/*
	 * @Author: [윤준성]
	 * @API No.4-3. 설치 장소 전체 조회
	 * @Info: 설치 장소 전체 조회
	 */
	@GetMapping("/place")
    public ResponseEntity<List<InstallPlace>> selectPlaceList() {
        List<InstallPlace> placeList = installPlaceService.selectAllPlace();

        // stream을 사용하여 각 InstallPlace 객체에 getDoName 메서드 적용
        List<InstallPlace> place = placeList.stream()
                .map(placeMapService::getDoName) // 각 객체에 getDoName 메서드 적용
                .collect(Collectors.toList());

        log.info("place: " + place);
        return ResponseEntity.ok().body(place);
    }
}