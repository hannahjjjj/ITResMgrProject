$(document).ready(function () {
	// 페이징
	$(".ip-pagination").on("click", ".ip-page-link-val", function(){
		var page = $(this).val();
		var searchType = $(".ip-search-type").val();
		if(searchType === ""){
			searchType = "ALL";
		}
		
		$.ajax({
			method: "GET",
			url: "ip/" + page,
			data: {
				searchType : searchType
			},
			success: function(response){
				console.log(response);
				if(response.code === 400){
					alert(`${response.message}`);
				}
				updateIpInfo(response.data.ipInfo);
				//ipPaging(response.data.ipPaging);
			},
			error: function(xhr, status, err){
				console.log(err);
			}
		});
	});
	
	$(".res-pagination").on("click", ".res-page-link-val", function(){
		var page = $(this).val();
		var ipSn = $(".detail-ip-sn").val();
		
		const apiUrl = "/ip/resinfo/" + page
		$.ajax({
			method: "GET",
			url: apiUrl,
			data: {
				ipSn : ipSn
			},
			success: function(response){
				console.log(response);
			},
			error: function(xhr, status, err){
				console.log(err);
			}
		})
	})
	
	// 검색
	$(".search-btn").on("click", function(){
	    var keyword = $(".ip-address-search-input").val();

		$.ajax({
			method: "GET",
			url: "/search/ip",
			data: {
				keyword: keyword
			},
			success: function(response){
				console.log(response);
				if(response.code === 4001){
					noResultIpInfo();
					//noMappingResInfo();
					//ipInfopaging
					return ;
				}
				updateIpInfo(response.data.ipInfo);
				$(".ip-search-type").val(keyword);
				ipPaging(response.data.ipPaging);
			},
			error: function(xhr, status, err){
				console.log(err);
			}
		})
	});
	
	// 신규
	$(".ip-new-btn").on("click", function(){
		$(".detail-ip").val("");
		$(".detail-ip").text("");
		$(".detail-ip-desc").val("");
		$(".detail-ip-desc").text("");
		resetHiddenIpSn();
		noMappingResInfo();
	})
	
	// 삭제
	$(".ip-delete-btn").on("click", function(){
		const apiUrl = "/delete/ip";
		var selectedRows = $("input[name='ip-checkbox']:checked").closest("tr");
		var deleteIpSnList = [];
		var ipSn = $("input[name='ip-checkbox']:checked").val();
		console.log("ipSN: " + ipSn);
		if (selectedRows.length === 0) {
			alert("삭제할 행을 선택하세요.");
			return;
		}
		selectedRows.each(function(){
			var ipSn = $(this).find("input[type='checkbox']").val();
			deleteIpSnList.push(ipSn);
		})
		$.ajax({
			method:"POST",
			url: apiUrl,
			data: JSON.stringify(ipSn),
			contentType: "application/json",
			success: function(response){
				console.log(response);
				updateIpInfo(response.data.ipInfo);
				ipPaging(response.data.ipPaging);
			},
			error: function(xhr, status, err){
				console.log(err);
			}
		})
	});
	
	function resetHiddenIpSn(){
		$(".detail-origin-ip-sn").val("0");
	}
	
	// IP 저장
	$(".ip-save-btn").on("click", function(){
		const apiUrl = "/save/ip";
		var originIpSn = $(".detail-origin-ip-sn").val();
		if(originIpSn === null || originIpSn === ""){
			originIpSn = 0;
		}
		
		$.ajax({
			method: "POST",
			url: apiUrl,
			data: $("#ip-info-form").serialize(),
			success: function(response){
				console.log(response);
				if(response.code !== 200){
					alert(`${response.message}`);
					return;
				}
				alert(`${response.message}`);
				
				if(response.data.ipSn !== undefined){
					$(".detail-origin-ip-sn").val(response.data.ipSn);
				}
				
				$(".ip-search-type").val("");
				updateIpInfo(response.data.ipInfo);
				ipPaging(response.data.ipPaging);
			},
			error: function(xhr, status, err){
				console.log(err);
			}
		})
	});
	
	// IP 상세 조회 시 상세와 자원 테이블 업데이트
	$(".ip-table-body").on("click", ".ip-detail-btn", function(){
    	var ipSn = $(this).data("ip-sn");
		/*var checkbox = $(this).closest("tr").find(".ip-checkbox");

	    if (checkbox) {
	        checkbox.prop("checked", true);
	    }*/
		$(".detail-origin-ip-sn").val(ipSn);

		var ipSearchType = $(".detail-ip-sn").val(ipSn);
		$.ajax({
			method: "GET",
			url: "/ip/detail/" + ipSn,
			success: function(response){
				console.log(response);
				if(response.code === 400){
					alert(`${response.message}`);
					$(".res-ip-sn").val("");
					return;
				}
				if(response.code === 5001){
					alert(`${response.message}`);
					updateIpDetail(response.data.ipInfo);
					noMappingResInfo();
					return;
				}
				$(".res-ip-sn").val(ipSn);
				updateIpDetail(response.data.ipInfo)
				updateResInfo(response.data.resInfo);
				resPaging(response.data.resPaging);
			},
			error: function(xhr, status, err){
				console.log(err);
			}
		})
	});
	
	$(".ip-table-body").on("click", ".ip-checkbox", function(){
        var currentCheckbox = this;
        
        // 다른 체크박스들을 반복하여 선택을 해제
        $('.ip-checkbox').each(function() {
            if (this !== currentCheckbox) {
                $(this).prop('checked', false);
            }
        });
	})

	// 검색 결과가 없을 경우
	function noResultIpInfo(){
		$(".ip-search-type").val("");
		$(".ip-table-body").empty();
		const result = "<tr>" + "<td colspan='7' style='text-align:center; font-weight: bold;'>" + "검색 결과가 없습니다." + "</td>" + "</tr>";
		$(".ip-table-body").append(result);
	}
	
	// IP 정보 업데이트
	function updateIpInfo(ip){
		$(".ip-table-body").empty();
		
		for(var i = 0; i < ip.length; i++){
			var newRow = $("<tr>");
			var ipCheckBox = $("<td>").addClass("ip-check").append($("<input>").attr({
				type: "checkbox",
				value: ip[i].ipSn,
				class: "ip-checkbox",
				name: "ip-checkbox"
			}));
			var ipText = $("<td>").addClass("ip").text(ip[i].ip);
			var ipDesc;
			var ipDetailCodeName;
			if(ip[i].ipDesc === null){
				ipDesc = $("<td>").addClass("ip-desc").text("-");
			}else{
				ipDesc = $("<td>").addClass("ip-desc").text(ip[i].ipDesc);
			}
			if(ip[i].detailCodeName === null){
				ipDetailCodeName = $("<td>").addClass("ip-detail-code-name").text("-");
			}else{
				ipDetailCodeName = $("<td>").addClass("ip-detail-code-name").text(ip[i].detailCodeName);
			}
			var ipDetail = $("<td>").addClass("ip-detail").append($("<input>").attr({
				type: "button",
				"data-ip-sn": ip[i].ipSn,
				class: "btn btn-primary ip-detail-btn",
				value: "상세"
			}));
			
			newRow.append(ipCheckBox);
			newRow.append(ipText);
			newRow.append(ipDesc);
			newRow.append(ipDetailCodeName);
			newRow.append(ipDetail);
			$(".ip-table-body").append(newRow);
		}
	}
	
	// IP 페이징
	function ipPaging(paging) {
	    var pagination = $(".ip-pagination");
	    
	    pagination.empty();
		if(paging.endPage === 0){
			return;
		}
	    
	    pagination.append(`<li class='page-item'><button class='page-link ip-prev-page-link' value="${paging.startPage - 1}" aria-label='Previous'>&laquo;</button></li>`);
	    
	    for (var pageNum = paging.startPage; pageNum <= paging.endPage; pageNum++) {
	        pagination.append(`<li class='page-item'><button class='page-link ip-page-link-val' value=${pageNum}>${pageNum}</button></li>`);
	    }
	    
	    pagination.append(`<li class='page-item'><button class='page-link ip-next-page-link' value="${paging.endPage + 1}" aria-label='Next'>&raquo;</button></li>`);

	    // 이전 페이지가 없는 경우 이전 버튼 비활성화
	    if (paging.startPage === 1 || $(".ip-prev-page-link").val() === 0) {
	        pagination.find(".prev-page-link").prop("disabled", true);
	    }
	    
	    // 다음 페이지가 없는 경우 다음 버튼 비활성화
	    if (paging.endPage === paging.totalPageCount) {
	        pagination.find(".ip-next-page-link").prop("disabled", true);
	    }
	}
	
	// 자원 페이징
	function resPaging(paging) {
	    var pagination = $(".res-pagination");
	    
	    pagination.empty();
		if(paging.endPage === 0){
			return;
		}
	    
	    pagination.append(`<li class='page-item'><button class='page-link res-prev-page-link' value="${paging.startPage - 1}" aria-label='Previous'>&laquo;</button></li>`);
	    
	    for (var pageNum = paging.startPage; pageNum <= paging.endPage; pageNum++) {
	        pagination.append(`<li class='page-item'><button class='page-link res-page-link-val' value=${pageNum}>${pageNum}</button></li>`);
	    }
	    
	    pagination.append(`<li class='page-item'><button class='page-link res-next-page-link' value="${paging.endPage + 1}" aria-label='Next'>&raquo;</button></li>`);

	    // 이전 페이지가 없는 경우 이전 버튼 비활성화
	    if (paging.startPage === 1 || $(".res-prev-page-link").val() === 0) {
	        pagination.find(".res-prev-page-link").prop("disabled", true);
	    }
	    
	    // 다음 페이지가 없는 경우 다음 버튼 비활성화
	    if (paging.endPage === paging.totalPageCount) {
	        pagination.find(".res-next-page-link").prop("disabled", true);
	    }
	}
	
	// IP 상세조회 업데이트
	function updateIpDetail(ipInfo){
		var ip = ipInfo.ip;
		var ipDetailCode = ipInfo.detailCode;
		var ipDesc = ipInfo.ipDesc;
		
		$(".detail-ip").val(ip);
		$(".detail-ip-type").val(ipDetailCode);
		
		$(".detail-ip-desc").text(ipDesc);
		$(".detail-ip-desc").val(ipDesc);
	}
	
	
	// 매핑된 자원이 없는 경우
	function noMappingResInfo(){
		$(".res-info-table-body").empty();
		const result = "<tr>" + "<td colspan='7' style='text-align:center; font-weight: bold;'>" + "매핑된 자원이 없습니다." + "</td>" + "</tr>";
		$(".res-info-table-body").append(result);
		
		$(".res-ip-sn").val("");
	}
	
	// 자원 테이블 업데이트
	function updateResInfo(resInfo){
		var resInfoTableBody = $(".res-info-table-body");
		resInfoTableBody.empty();
		
		for(var i=0; i<resInfo.length; i++){
			var newRow = $("<tr>");
			var resName = $("<td>").addClass("res-name").text(resInfo[i].resName);
			var resStatusCodeName = $("<td>").addClass("res-status-code-name").text(resInfo[i].resStatusCodeName);
			var rackInfo = $("<td>").addClass("rack-info").text(resInfo[i].rackInfo);
			var resClassName = $("<td>").addClass("res-class-name").text(resInfo[i].resClassName);
			var installPlaceName = $("<td>").addClass("place-name").text(resInfo[i].installPlaceName);
			var detailAddress = $("<td>").addClass("place-detail-address").text(resInfo[i].detailAddress);
			var resDetailBtn = $("<td>").addClass("res-detail").append($("<input>").attr({
				type: "button",
				class: "btn btn-primary res-detail-btn",
				value: "상세",
				"data-res-serial-id": resInfo[i].resSerialId
			}))
			
			newRow.append(resName);
			newRow.append(resStatusCodeName);
			newRow.append(rackInfo);
			newRow.append(resClassName);
			newRow.append(installPlaceName);
			newRow.append(detailAddress);
			newRow.append(resDetailBtn);
			
			resInfoTableBody.append(newRow);
		}
	}
	

});