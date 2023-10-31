function changePageBtn(data,page){
	var str=""
	for(var i=data.page.startPage;i<=data.page.endPage;i++){
		if(page==i){
			//str+='<button class="page-link page-link-val" onclick="paging('+i+')" style="font-weight:bolder;text-align:center;">'+i+'</button>'
			str+='<button class="page-link page-link-val" onclick="paging('+i+')" style="text-align:center;">'+i+'</button>'
		}else{
			str+='<button class="page-link page-link-val" onclick="paging('+i+')">'+i+'</button>'
		}
	}
	$(".page-btn").html(str);
}
function paging(page) {
    var topUpperResClassName = $("#topUpperResClassName option:selected").text();
    var upperResClassName = $("#upperResClassName option:selected").text();
    var resClassName = $("#resClassName option:selected").text();
    var resName = $("input[name='resName']").val();
    var installPlaceName = $("input[name='installPlaceName']").val();
    var manufactureCompanyName = $("input[name='manufactureCompanyName']").val();
    var mgmtId = $("input[name='mgmtId']").val();
    // 선택된 라디오 버튼 값 가져오기 (사용 여부)
    var monitoringYn = $("input[name='monitoringYn']:checked").val();

	var totalPageCount=$("#totalPageCount").val();
	if(totalPageCount<page){
		alert("마지막 페이지 입니다.")
		return;
	}else if(page==0){
		alert("첫번째 페이지 입니다.")
		return;
	}
	
	$.ajax({
        type: 'GET',
        url: '/resinfopagination',
        contentType: "application/json",
        data: {
			"topUpperResClassName" : topUpperResClassName,
            "upperResClassName" : upperResClassName,
            "resClassName" : resClassName,
            "resName" : resName,
            "installPlaceName" : installPlaceName,
            "manufactureCompanyName" : manufactureCompanyName,
            "mgmtId" : mgmtId,
            "monitoringYn" : monitoringYn,
            'page': page
        },
        success: function (response) {
           $('tbody#resInfoTable').empty();
			console.log(response.page);
            // Iterate over the response data and append new rows
            for (var i = 0; i < response.selectAllResInfo.length; i++) {
                var resInfoRow = "<tr>"+
                        "<td>"+response.selectAllResInfo[i].topUpperResClassName+"</td>"+
                        "<td>"+response.selectAllResInfo[i].upperResClassName+"</td>"+
                        "<td>"+response.selectAllResInfo[i].resClassName+"</td>"+
                        "<td>"+response.selectAllResInfo[i].resName+"</td>"+
                        "<td>"+response.selectAllResInfo[i].installPlaceName+"</td>"+
                        "<td>"+response.selectAllResInfo[i].manufactureCompanyName+"</td>"+
                        "<td>"+response.selectAllResInfo[i].mgmtId+"</td>"+
                        "<td>"+response.selectAllResInfo[i].monitoringYn+"</td>"+
 						"<td><input type='hidden' name ='resSerialId' value='" + response.selectAllResInfo[i].resSerialId
						+"'>" +"<button type='button' id='resinfo-detail-btn' style='border:none; background-color:transparent;'>" +
						"<img src='assets/img/detail2.png' style='width:25px; height:25px;'></button></td>"+
                        "</tr>";
                $('tbody#resInfoTable').append(resInfoRow);
            }
			$("#nextPage").removeAttr("onclick");
			$("#nextPage").attr("onclick","paging("+(page+1)+")");
			
			$("#previousPage").removeAttr("onclick");
			$("#previousPage").attr("onclick","paging("+(page-1)+")");
			
			changePageBtn(response,page);
        },
        error: function (error) {
            // 요청이 실패한 경우 처리
            console.log('에러:', error);
        }
    });
}
	// 모달창에서 table별 클릭이동
	function showTable(tableName) {
	    // Hide all tables
	    $('.addTable table').hide();
	
	    // Show the selected table based on tableName
	    $('#' + tableName + 'Table').show();

  		// 모든 탭의 배경색 초기화
	    $('.nav-link').css('background-color', '');
	
	    // 선택한 탭 배경색 변경
	    $('#' + tableName + 'Tab').css('background-color', '#7289AB');

	    // 모든 탭의 글자 색상 초기화
	    $('.nav-link').css('color', 'gray');
	
	    // 선택한 탭 글자 색상 변경
	    $('#' + tableName + 'Tab').css('color', 'white');
	    
	    // Remove 'active' class from all nav links
	    $('.nav-link').removeClass('active');
	
	    $('a.nav-link').filter(function() {
	        return $(this).text().trim() === tableName;
	    }).addClass('active');
	}
	
$(document).ready(function(){
	    $('#resInfoTable').on('click', '#resinfo-detail-btn', function () {
		$('.error-message').text('');
        var resName = $(this).closest('tr').find('td:nth-child(4)').text();
		var resSerialId = $(this).closest('tr').find('input[name="resSerialId"]').val();
        console.log(resSerialId);
        $.ajax({
            type: 'GET',
            url: '/resinfo/detail',
            data: {
                "resName": resName
            },
            success: function (response) {
                $('#resinfo-detail-modal input[name="resClassName"]').val(response.resClassName);
                $('#resinfo-detail-modal input[name="resClassId"]').val(response.resClassId);
                $('#resinfo-detail-modal input[name="resName"]').val(response.resName);
                $('#resinfo-detail-modal input[name="mgmtId"]').val(response.mgmtId);
                $('#resinfo-detail-modal input[name="mgmtDeptName"]').val(response.mgmtDeptName);
                $('#resinfo-detail-modal input[name="resSerialId"]').val(response.resSerialId);
                $('#resinfo-detail-modal input[name="resStatusCode"]').val(response.resStatusCode);
                $('#resinfo-detail-modal input[name="managerName"]').val(response.managerName);
                $('#resinfo-detail-modal input[name="resSn"]').val(response.resSn);
                $('#resinfo-detail-modal input[name="manufactureCompanyName"]').val(response.manufactureCompanyName);
                $('#resinfo-detail-modal input[name="modelName"]').val(response.modelName);
                $('#resinfo-detail-modal input[name="installPlaceName"]').val(response.installPlaceName);
                $('#resinfo-detail-modal input[name="installPlaceSn"]').val(response.installPlaceSn);
                $('#resinfo-detail-modal input[name="rackInfo"]').val(response.rackInfo);
                $('#resinfo-detail-modal input[name="introductionDate"]').val(response.introductionDate);
                $('#resinfo-detail-modal input[name="introdutionPrice"]').val(response.introductionPrice);
                $('#resinfo-detail-modal input[name="expirationDate"]').val(response.expirationDate);
                $('#resinfo-detail-modal input[name="addInfo"]').val(response.addInfo);
                $('#resinfo-detail-modal input[name="useYn"]').val(response.useYn);
                $('#resinfo-detail-modal input[name="purchaseCompanyName"]').val(response.purchaseCompanyName);
                $('#resinfo-detail-modal input[name="monitoringYn"]').val(response.monitoringYn);
 				$('#resinfo-detail-modal').modal('show');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });

        $.ajax({
            type: 'GET',
            url: '/resinfo/additemvalue',
            data: {
                "resSerialId": resSerialId
            },
            success: function (response) {
                $('#additionalInfoTable tbody').empty();
                for (var i = 0; i < response.length; i++) {
                    addTableRow = "<tr>" +
                        "<td>" + response[i].addItemName + "</td>" +
                       	"<td><input type='text'id='addItemValue-input' name='resDetailValue' value='"+response[i].resDetailValue+"'></td>" +
                        "</tr>";
                    $('#additionalInfoTable tbody').append(addTableRow);
                }
                showTable('additionalInfo');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });
		
		$.ajax({
		    type: 'GET',
		    url: '/resinfo/ip',
		    data: {
		        "resSerialId": resSerialId
		    },
		    success: function (response) {
				$('#ipListTableTbody').empty();
		        for (var i = 0; i < response.length; i++) {
		            var addTableRow = "<tr>" +
		                "<td><input type='checkbox' name='ipSn' value='" + response[i].ipSn + "'></td>" +
		                "<td><input type='text' readonly='readonly' name='ip' value='" + response[i].ip + "'></td>" +
		                "<td><input type='text' readonly='readonly' name='detailCodeName' value='" + response[i].detailCodeName + "'></td>" +
		                "<td><input type='hidden' readonly='readonly' name='ipTypeCode' value='" + response[i].ipTypeCode + "'></td>" +
		                "<td></td>" +
		                "</tr>";
		            $('#ipListTableTbody').append(addTableRow); // IP 주소 행을 테이블에 추가합니다.
		        }
		        showTable('ipList');
		    },
		    error: function (error) {
		        console.log('에러:', error);
		    }
		});


		$('#res-info-save-btn').on('click', function () {
			var resClassId = $('#resinfo-detail-modal input[name=resClassId]').val();
            var mgmtId = $('#resinfo-detail-modal input[name=mgmtId]').val();
            var mgmtDeptName = $('#resinfo-detail-modal input[name="mgmtDeptName"]').val();
            var resName = $('#resinfo-detail-modal input[name="resName"]').val();
            var resStatusCode = $('#resinfo-detail-modal select[name="resStatusCode"]').val();
            var managerName = $('#resinfo-detail-modal input[name="managerName"]').val();
            var resSn = $('#resinfo-detail-modal input[name="resSn"]').val();
            var manufactureCompanyName = $('#resinfo-detail-modal input[name="manufactureCompanyName"]').val();
            var modelName = $('#resinfo-detail-modal input[name="modelName"]').val();
            var installPlaceSn = $('#resinfo-detail-modal #install-place-sn-input').val();
            var rackInfo = $('#resinfo-detail-modal input[name="rackInfo"]').val();
            var resSerialId = $('#resinfo-detail-modal input[name="resSerialId"]').val();
            var introductionDate = $('#resinfo-detail-modal input[name="introductionDate"]').val();
            var expirationDate = $('#resinfo-detail-modal input[name="expirationDate"]').val();
            var introdutionPrice = $('#resinfo-detail-modal input[name="introdutionPrice"]').val();
            var useYn = 'Y';
            var monitoringYn = 'Y';
            var purchaseCompanyName = $('#resinfo-detail-modal input[name="purchaseCompanyName"]').val();
            var addInfo = $('#resinfo-detail-modal input[name="addInfo"]').val();
			var addItemSnElements = $('#additionalInfoTable input[name="addItemSn"]');
			var resDetailValueElements = $('#additionalInfoTable input[name="resDetailValue"]');
			var resDetailValue = $('#additionalInfoTable input[name="resDetailValue"]').val();
			console.log(resSerialId);
			var resSerialList=[];
			var addItemSnList = [];
			var resDetailValueList = [];
			for (var i = 0; i < addItemSnElements.length; i++) {
				resSerialList.push(resSerialId);
			    addItemSnList.push(addItemSnElements.eq(i).val()); // 현재 순서의 addItemSn 값 가져오기
				resDetailValueList.push(resDetailValueElements.eq(i).val()); // 현재 순서의 resDetailValue 값 가져오기
			}
			console.log("resSerialIdList: "+resSerialList)
			console.log(addItemSnList);
			var ipSn = $('#ipListTable input[name="ipSn"]');
			var ipTypeCode = $('#ipListTable input[name="ipTypeCode"]');

			var ipSnList = [];
			var ipTypeCodeList = [];
			var resSerialList2 = [];
			
			for (var i = 0; i < ipSn.length; i++) {
			    resSerialList2.push(resSerialId);
			    ipSnList.push(ipSn.eq(i).val());
			    ipTypeCodeList.push(ipTypeCode.eq(i).val());
			}
					 $.ajax({
		                type: 'POST',
		                url: '/resinfo/update',
		                data: JSON.stringify({
							'resClassId': resClassId,
						    'mgmtId': mgmtId,
						    'mgmtDeptName': mgmtDeptName,
						    'resName': resName,
						    'resStatusCode': resStatusCode,
						    'managerName': managerName,
						    'resSn': resSn,
						    'manufactureCompanyName': manufactureCompanyName,
						    'modelName': modelName,
						    'installPlaceSn': installPlaceSn,
						    'rackInfo': rackInfo,
						    'resSerialId': resSerialId,
						    'introductionDate': introductionDate,
						    'expirationDate': expirationDate,
						    'introdutionPrice': introdutionPrice,
						    'useYn': useYn,
						    'monitoringYn': monitoringYn,
						    'purchaseCompanyName': purchaseCompanyName,
						    'addInfo': addInfo,
							'resDetailValue' : resDetailValue,
							'resSerialIdList' : resSerialList,
							'addItemSnList' : addItemSnList,
							'resDetailValueList' : resDetailValueList,
							'resSerialIdList2' : resSerialList2,
							'ipSnList' : ipSnList,
							'ipTypeCodeList' : ipTypeCodeList
						}),
		                contentType: "application/json",
		                success: function (response) {

						    // 모달 내용을 변경할 때, 모달 요소와 그 내부 요소들을 선택합니다.
						    var modal = $('#check-modal');
						    var span = modal.find('#content');
						
						    // 원하는 내용으로 span 요소의 텍스트를 변경합니다.
						    span.text('수정 완료하였습니다.');
						
						    // 모달을 표시합니다.
						    modal.modal('show');
							showResourceDetail(response.resName);
		                },
		                error: function (error) {
		                    console.log('에러:', error);
		                }
		            });

			});

    });

    function showResourceDetail(resName) {
	var resName = $('#resinfo-detail-modal input[name="resName"]').val();
	var resSerialId = $('#resinfo-detail-modal input[name="resSerialId"]').val();
        $.ajax({
            type: 'GET',
            url: '/resinfo/detail',
            data: {
                "resName": resName
            },
            success: function (response) {
                $('#resinfo-detail-modal input[name="resClassName"]').val(response.resClassName);
                $('#resinfo-detail-modal input[name="resName"]').val(response.resName);
                $('#resinfo-detail-modal input[name="mgmtId"]').val(response.mgmtId);
                $('#resinfo-detail-modal input[name="mgmtDeptName"]').val(response.mgmtDeptName);
                $('#resinfo-detail-modal input[name="resSerialId"]').val(response.resSerialId);
                $('#resinfo-detail-modal input[name="resStatusCode"]').val(response.resStatusCode);
                $('#resinfo-detail-modal input[name="managerName"]').val(response.managerName);
                $('#resinfo-detail-modal input[name="resSn"]').val(response.resSn);
                $('#resinfo-detail-modal input[name="manufactureCompanyName"]').val(response.manufactureCompanyName);
                $('#resinfo-detail-modal input[name="modelName"]').val(response.modelName);
                $('#resinfo-detail-modal input[name="installPlaceName"]').val(response.installPlaceName);
                $('#resinfo-detail-modal input[name="rackInfo"]').val(response.rackInfo);
                $('#resinfo-detail-modal input[name="introductionDate"]').val(response.introductionDate);
                $('#resinfo-detail-modal input[name="introdutionPrice"]').val(response.introductionPrice);
                $('#resinfo-detail-modal input[name="expirationDate"]').val(response.expirationDate);
                $('#resinfo-detail-modal input[name="addInfo"]').val(response.addInfo);
                $('#resinfo-detail-modal input[name="useYn"]').val(response.useYn);
                $('#resinfo-detail-modal input[name="purchaseCompanyName"]').val(response.purchaseCompanyName);
                $('#resinfo-detail-modal input[name="monitoringYn"]').val(response.monitoringYn);
                $('#resinfo-detail-modal').modal('show');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });
        $.ajax({
            type: 'GET',
            url: '/resinfo/additemvalue',
            data: {
                "resSerialId": resSerialId
            },
            success: function (response) {
                $('#additionalInfoTable tbody').empty();
                for (var i = 0; i < response.length; i++) {
                    addTableRow = "<tr>" +
                        "<td>" + response[i].addItemName + "</td>" +
                       	"<td><input id='addItemValue-input' type='text' name='resDetailValue' value='"+response[i].resDetailValue+"'></td>" +
                        "</tr>";
                    $('#additionalInfoTable tbody').append(addTableRow);
                }
                showTable('additionalInfo');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });
        $.ajax({
            type: 'GET',
            url: '/resinfo/ipmapping',
            data: {
                "resSerialId": resSerialId
            },
            success: function (response) {
                $('#ipListTable tbody').empty();
                for (var i = 0; i < response.length; i++) {
                    addTableRow = "<tr>" +
		                "<td><input type='checkbox' name='ipSn' value='" + response[i].ipSn + "'></td>" +
                        "<td>" + response[i].ip + "</td>" +
                       	"<td><input type='text' name='detailCodeName' value='"+response[i].detailCodeName+"'></td>" +
                       	"<td></td>" +
                       	"<td></td>" +
                        "</tr>";
                    $('#ipListTableTbody').append(addTableRow);
                }
                showTable('ipListTable');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });
    }
});
$(document).ready(function () {
    $('#newResInfoBtn').on('click', function () {
		$('.error-message').text('');
        clearModalContent()
        $('#resinfo-detail-modal').modal('show');
        $('#res-info-save-btn').on('click', function () {
            var resClassId = $('#resinfo-detail-modal input[name=resClassId]').val();
            var resClassName = $('#resinfo-detail-modal input[name=resClassName]').val();
            var mgmtId = $('#resinfo-detail-modal input[name=mgmtId]').val();
            var mgmtDeptName = $('#resinfo-detail-modal input[name="mgmtDeptName"]').val();
            var resName = $('#resinfo-detail-modal input[name="resName"]').val();
            var resStatusCode = $('#resinfo-detail-modal select[name="resStatusCode"]').val();
            var managerName = $('#resinfo-detail-modal input[name="managerName"]').val();
            var resSn = $('#resinfo-detail-modal input[name="resSn"]').val();
            var manufactureCompanyName = $('#resinfo-detail-modal input[name="manufactureCompanyName"]').val();
            var modelName = $('#resinfo-detail-modal input[name="modelName"]').val();
            var installPlaceSn = $('#resinfo-detail-modal #install-place-sn-input').val();
            var rackInfo = $('#resinfo-detail-modal input[name="rackInfo"]').val();
            var resSerialId = $('#resinfo-detail-modal input[name="resSerialId"]').val();
            var introductionDate = $('#resinfo-detail-modal input[name="introductionDate"]').val();
            var expirationDate = $('#resinfo-detail-modal input[name="expirationDate"]').val();
            var introdutionPrice = $('#resinfo-detail-modal input[name="introdutionPrice"]').val();
            var useYn = 'Y';
            var monitoringYn = 'Y';
            var purchaseCompanyName = $('#resinfo-detail-modal input[name="purchaseCompanyName"]').val();
            var addInfo = $('#resinfo-detail-modal input[name="addInfo"]').val();
			var addItemSnElements = $('#additionalInfoTable input[name="addItemSn"]');
			var resDetailValueElements = $('#additionalInfoTable input[name="resDetailValue"]');
			var ipSn = $('#ipListTable input[name="ipSn"]');
			var ipTypeCode = $('#ipListTable input[name="ipTypeCode"]');
			
			var resSerialList=[];
			var addItemSnList = [];
			var resDetailValueList = [];
			for (var i = 0; i < addItemSnElements.length; i++) {
				resSerialList.push(resSerialId)
			    addItemSnList.push(addItemSnElements.eq(i).val()); // 현재 순서의 addItemSn 값 가져오기
				resDetailValueList.push(resDetailValueElements.eq(i).val()); // 현재 순서의 resDetailValue 값 가져오기
			}
			var ipSnList=[];
			var ipTypeCodeList=[];
			var resSerialList2=[];
			for(var i=0; i < ipSn.length; i++){
				resSerialList2.push(resSerialId);
				ipSnList.push(ipSn.eq(i).val());
				ipTypeCodeList.push(ipTypeCode.eq(i).val());
				console.log(ipTypeCodeList);
			}
		$('.error-message').text('');
 			if (!resClassName.trim()) {
                $('#errormessage1').text('필수입력값을 입력하세요.');
            }
            if (!mgmtId.trim()) {
	 			$('#errormessage2').text('필수입력값을 입력하세요.');
            }
            if (!resName.trim()) {
		 		$('#errormessage3').text('필수입력값을 입력하세요.');
            }
            if (!resStatusCode.trim()) {
		 		$('#errormessage4').text('필수입력값을 입력하세요.');
            }
            if (!resSn.trim()) {
		 		$('#errormessage5').text('필수입력값을 입력하세요.');
            }
			if(!manufactureCompanyName.trim()){
				$('#errormessage6').text('필수입력값을 입력하세요.');
			}
            if (!modelName.trim()) {
		 		$('#errormessage7').text('필수입력값을 입력하세요.');
            }
            if (!installPlaceSn.trim()) {
		 		$('#errormessage8').text('필수입력값을 입력하세요.');
            }
            if (!resSerialId.trim()) {
		 		$('#errormessage9').text('필수입력값을 입력하세요.');
            }

            // 나머지 필드에 대한 유효성 검사 및 에러 메시지 추가

            // 에러 메시지가 없을 경우 서버로 데이터를 전송
            if ($('.error-message').length === 0){
	            $.ajax({
	                type: 'POST',
	                url: '/resinfo/insert',
	                data: JSON.stringify({
	                    'resClassId': resClassId,
	                    'mgmtId': mgmtId,
	                    'mgmtDeptName': mgmtDeptName,
	                    'resName': resName,
	                    'resStatusCode': resStatusCode,
	                    'managerName': managerName,
	                    'resSerialId': resSerialId,
	                    'manufactureCompanyName': manufactureCompanyName,
	                    'modelName': modelName,
	                    'installPlaceSn': installPlaceSn,
	                    'rackInfo': rackInfo,
	                    'resSn': resSn,
	                    'introductionDate': introductionDate,
	                    'expirationDate': expirationDate,
	                    'introdutionPrice': introdutionPrice,
	                    'useYn': useYn,
	                    'monitoringYn': monitoringYn,
	                    'purchaseCompanyName': purchaseCompanyName,
	                    'addInfo': addInfo,
						'resSerialIdList' : resSerialList,
						'addItemSnList' : addItemSnList,
						'resDetailValueList' : resDetailValueList,
						'resSerialIdList2' : resSerialList2,
						'ipSnList' : ipSnList,
						'ipTypeCodeList' : ipTypeCodeList
	                }),
	                contentType: "application/json",
	                success: function (response) {
						if(resDetailValueList.length===0){
							alert("부가항목값을 입력해주세요.")
							return;
						}
						if(ipSnList.length===0){
							alert("IP를 선택해주세요.")
							return;
						}
					    // 모달 내용을 변경할 때, 모달 요소와 그 내부 요소들을 선택합니다.
					    var modal = $('#check-modal');
					    var span = modal.find('#content');
					    // 원하는 내용으로 span 요소의 텍스트를 변경합니다.
					    span.text('저장 완료하였습니다.');
					    // 모달을 표시합니다.
					    modal.modal('show');
		                showResourceDetail(response.resName);
	                },
	                error: function (error) {
	                    console.log('에러:', error);
	                }
	            });
}
        });
    });

    function showResourceDetail(resName) {
	var resName = $('#resinfo-detail-modal input[name="resName"]').val();
	var resSerialId = $('#resinfo-detail-modal input[name="resSerialId"]').val();
        $.ajax({
            type: 'GET',
            url: '/resinfo/detail',
            data: {
                "resName": resName
            },
            success: function (response) {
                $('#resinfo-detail-modal input[name="resClassName"]').val(response.resClassName);
                $('#resinfo-detail-modal input[name="resName"]').val(response.resName);
                $('#resinfo-detail-modal input[name="mgmtId"]').val(response.mgmtId);
                $('#resinfo-detail-modal input[name="mgmtDeptName"]').val(response.mgmtDeptName);
                $('#resinfo-detail-modal input[name="resSerialId"]').val(response.resSerialId);
                $('#resinfo-detail-modal input[name="resStatusCode"]').val(response.resStatusCode);
                $('#resinfo-detail-modal input[name="managerName"]').val(response.managerName);
                $('#resinfo-detail-modal input[name="resSn"]').val(response.resSn);
                $('#resinfo-detail-modal input[name="manufactureCompanyName"]').val(response.manufactureCompanyName);
                $('#resinfo-detail-modal input[name="modelName"]').val(response.modelName);
                $('#resinfo-detail-modal input[name="installPlaceName"]').val(response.installPlaceName);
                $('#resinfo-detail-modal input[name="rackInfo"]').val(response.rackInfo);
                $('#resinfo-detail-modal input[name="introductionDate"]').val(response.introductionDate);
                $('#resinfo-detail-modal input[name="introdutionPrice"]').val(response.introductionPrice);
                $('#resinfo-detail-modal input[name="expirationDate"]').val(response.expirationDate);
                $('#resinfo-detail-modal input[name="addInfo"]').val(response.addInfo);
                $('#resinfo-detail-modal input[name="useYn"]').val(response.useYn);
                $('#resinfo-detail-modal input[name="purchaseCompanyName"]').val(response.purchaseCompanyName);
                $('#resinfo-detail-modal input[name="monitoringYn"]').val(response.monitoringYn);
                $('#resinfo-detail-modal').modal('show');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });
        $.ajax({
            type: 'GET',
            url: '/resinfo/additemvalue',
            data: {
                "resSerialId": resSerialId
            },
            success: function (response) {
                $('#additionalInfoTable tbody').empty();
                for (var i = 0; i < response.length; i++) {
                    addTableRow = "<tr>" +
                        "<td>" + response[i].addItemName + "</td>" +
                       	"<td><input type='text' name='resDetailValue' id='addItemValue-input' value='"+response[i].resDetailValue+"'></td>" +
                        "</tr>";
                    $('#additionalInfoTable tbody').append(addTableRow);
                }
                showTable('additionalInfo');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });
        $.ajax({
            type: 'GET',
            url: '/resinfo/ipmapping',
            data: {
                "resSerialId": resSerialId
            },
            success: function (response) {
                $('#ipListTable tbody').empty();
                for (var i = 0; i < response.length; i++) {
                    addTableRow = "<tr>" +
		                "<td><input type='checkbox' name='ipSn' value='" + response[i].ipSn + "'></td>" +
                        "<td>" + response[i].ip + "</td>" +
                       	"<td><input type='text' name='detailCodeName' value='"+response[i].detailCodeName+"'></td>" +
                       	"<td></td>" +
                       	"<td></td>" +
                        "</tr>";
                    $('#ipListTableTbody').append(addTableRow);
                }
                showTable('ipListTable');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });
    }

    // 대분류 선택 시
    $('#topUpperResClassName').change(function () {
        var selectedMainCategoryId = $(this).val();

        // 중분류와 소분류 select 요소의 옵션 초기화
        $('#upperResClassName, #resClassName').find('option').show();

        if (selectedMainCategoryId !== '') {
            // "전체"가 아닌 경우 중분류와 소분류 select 요소 필터링
            $('#upperResClassName option').each(function () {
                var upperResClassId = $(this).data('upper-res-class-id');
                if (upperResClassId !== selectedMainCategoryId) {
                    $(this).hide();
                }
            });
        }

        // 소분류 select 요소 초기화
        $('#upperResClassName, #resClassName').val('');
    });

    // 중분류 선택 시
    $('#upperResClassName').change(function () {
        var selectedMiddleCategoryId = $(this).val();

        // 소분류 select 요소 필터링
        $('#resClassName option').each(function () {
            var upperResClassId = $(this).data('upper-res-class-id');
            if (upperResClassId !== selectedMiddleCategoryId) {
                $(this).hide();
            }
        });

        // 소분류 select 요소 초기화
        $('#resClassName').val('');
    });

	//IP리스트 찾기 버튼 클릭시
	$('#search-ip-list-btn').on('click',function(){
		$('#resinfo-detail-modal').modal('hide');
	    $('#ip-list-choose-modal').modal('show');
		pagingIpList(1)
	});
	
	// 모달이 열릴 때
	$('#ip-list-choose-modal').on('show.bs.modal', function () {
	    // 이전에 선택한 값을 초기화
	    $('table#ip-list-table input[type=checkbox]').prop('checked', false);
	});
	
	// 모달이 닫힐 때
	$('#ip-list-choose-modal').on('hidden.bs.modal', function () {
	    // 이전에 선택한 값을 초기화
	    $('table#ip-list-table input[type=checkbox]').prop('checked', false);
		$('#resinfo-detail-modal').modal('show');
	});
	
	// ip 저장 눌렀을 때 기능
	$('#choose-ip-list-btn').click(function () {
		var flag=true;
	    var checkedIpList = $('table#ip-list-table input[type=checkbox]:checked');
	    // 체크된 항목이 1개인 경우에만 처리
	    if (checkedIpList.length === 0) {
	        alert('ip를 선택해주세요.');
	    } else {
	        // 선택한 IP 목록을 담을 배열
	        var selectedIPs = [];
	
	        // 선택한 IP를 배열에 추가
			var trCount = $('#ipListTable tbody tr');
	        checkedIpList.each(function () {
	            var tr = $(this).closest('tr');
	            var td = tr.children();
	            var ipSn = td.eq(0).find('input[name=ipSn]').val();
	            var ip = td.eq(1).text();
	            var detailCodeName = td.eq(2).text();
				var ipTypeCode = tr.find('input[name=ipTypeCode]').val();
	            selectedIPs.push({ ipSn: ipSn, ip: ip, detailCodeName: detailCodeName ,ipTypeCode : ipTypeCode});
				trCount.each(function(){
					var td=$(this).children();
					var ip2=td.eq(0).children().eq(0).val()
					if(ipSn==ip2){
						alert("기존에 등록된 IP주소는 등록할 수 없습니다")
						flag=false;
						return;
					}
				});
	        });
				if(!flag){
					$('table#ip-list-table input[type=checkbox]').prop('checked', false);
					return;
				}
		 		// 선택한 IP 목록을 테이블에 추가
		        for (var i = 0; i < selectedIPs.length; i++) {
		            var addTableRow = "<tr>" +
		                "<td><input type='checkbox' name='ipSn' value='" + selectedIPs[i].ipSn + "'></td>" +
		                "<td><input type='text' readonly='readonly' name='ip' value='" + selectedIPs[i].ip + "'></td>" +
		                "<td><input type='text' readonly='readonly' name='detailCodeName' value='" + selectedIPs[i].detailCodeName + "'></td>" +
						"<td><input type='hidden' readonly='readonly' name='ipTypeCode' value='" + selectedIPs[i].ipTypeCode + "'></td>" +
						"<td></td>"
		                "</tr>";
		            $('#ipListTable tbody').append(addTableRow); // IP 주소 행을 테이블에 추가합니다.
		        }
		        $('#ip-list-choose-modal').modal('hide');

					var resSerialId = $('#resinfo-detail-modal input[name="resSerialId"]').val();
					var ipSn = $('#ipListTable input[name="ipSn"]');
					var ipTypeCode = $('#ipListTable input[name="ipTypeCode"]');
					var ipSnList=[];
					var ipTypeCodeList=[];
					var resSerialList2=[];
					for(var i=0; i < ipSn.length; i++){
						resSerialList2.push(resSerialId);
						ipSnList.push(ipSn.eq(i).val());
						ipTypeCodeList.push(ipTypeCode.eq(i).val());
						console.log(ipTypeCodeList);
					}

		        $('#resinfo-detail-modal').modal('show');
	    }
	});
	

	// 설치장소 찾기 버튼 클릭 시
	$('#installPlaceSearchBtn').on('click', function() {
		$('#resinfo-detail-modal').modal('hide');
	    $('#install-place-choose-modal').modal('show');
		paging(1)
	});
	
	// 체크박스 클릭 시
	$('table#install-place-list-table input[type=checkbox]').on('click', function () {
	    $('table#install-place-list-table input[type=checkbox]').not(this).prop('checked', false);
	});
	
	// 모달이 열릴 때
	$('#install-place-choose-modal').on('show.bs.modal', function () {
	    // 이전에 선택한 값을 초기화
	    $('table#install-place-list-table input[type=checkbox]').prop('checked', false);
	});
	
	// 모달이 닫힐 때
	$('#install-place-choose-modal').on('hidden.bs.modal', function () {
	    // 이전에 선택한 값을 초기화
	    $('table#install-place-list-table input[type=checkbox]').prop('checked', false);
		$('#resinfo-detail-modal').modal('show');
	});
	
	// 설치장소 저장 눌렀을 때 기능
	$('#choose-install-place-btn').click(function () {
	    var checkedInstallPlace = $('table#install-place-list-table input[type=checkbox]:checked');
	
	    // 체크된 항목이 1개인 경우에만 처리
	    if (checkedInstallPlace.length === 1) {
	        var tr = checkedInstallPlace.closest('tr');
	        var td = tr.children();
	        var installPlaceSn = td.eq(0).children().eq(0).val();
	        var installPlaceName = td.eq(1).text();
	        console.log(installPlaceSn + ',' + installPlaceName);
	        $('input[id=install-place-input]').val(installPlaceName);
	        $('input[name=installPlaceSn]').val(installPlaceSn);
	
	        $('#install-place-choose-modal').modal('hide');
			$('#resinfo-detail-modal').modal('show');
	    } else {
	        alert('설치장소를 선택해주세요.');
	    }
	});

	
	// "조회" 버튼 클릭 시 (검색기능)
    $('#search_btn').on('click', function() {
        // 대/중/소분류 값을 가져옴
        var topUpperResClassName = $("#topUpperResClassName option:selected").text();
        var upperResClassName = $("#upperResClassName option:selected").text();
        var resClassName = $("#resClassName option:selected").text();
        var resName = $("input[name='resName']").val();
        var installPlaceName = $("input[name='installPlaceName']").val();
        var manufactureCompanyName = $("input[name='manufactureCompanyName']").val();
        var mgmtId = $("input[name='mgmtId']").val();
        // 선택된 라디오 버튼 값 가져오기 (사용 여부)
        var monitoringYn = $("input[name='monitoringYn']:checked").val();

        //Ajax 요청을 보냄
        $.ajax({
            type: 'GET', // 또는 'GET', 요청 방식 선택
            url: '/resinfo/search', // Controller의 URL
            data: {
                "topUpperResClassName" : topUpperResClassName,
                "upperResClassName" : upperResClassName,
                "resClassName" : resClassName,
                "resName" : resName,
                "installPlaceName" : installPlaceName,
                "manufactureCompanyName" : manufactureCompanyName,
                "mgmtId" : mgmtId,
                "monitoringYn" : monitoringYn
            },
            success: function(response) {
                $('tbody#resInfoTable > tr').remove();
                if (response.selectAllResInfo.length === 0) {
                    alert('검색된 결과가 없습니다.');
                    addTableRow = "<tr>" + "<td colspan='9' style='text-align:center; font-weight: bold;'>" + "검색된 결과가 없습니다." + "</td>" + "</tr>";
                    $('tbody#resInfoTable').append(addTableRow);
					$('nav.paging-nav').hide();
                    return;
                }
                $('tbody#resInfoTable').empty();
	            // Iterate over the response data and append new rows
	            for (var i = 0; i < response.selectAllResInfo.length; i++) {
	                var resInfoRow = "<tr>"+
	                        "<td>"+response.selectAllResInfo[i].topUpperResClassName+"</td>"+
	                        "<td>"+response.selectAllResInfo[i].upperResClassName+"</td>"+
	                        "<td>"+response.selectAllResInfo[i].resClassName+"</td>"+
	                        "<td>"+response.selectAllResInfo[i].resName+"</td>"+
	                        "<td>"+response.selectAllResInfo[i].installPlaceName+"</td>"+
	                        "<td>"+response.selectAllResInfo[i].manufactureCompanyName+"</td>"+
	                        "<td>"+response.selectAllResInfo[i].mgmtId+"</td>"+
	                        "<td>"+response.selectAllResInfo[i].monitoringYn+"</td>"+
	 						"<td><input type='hidden' name ='resSerialId' value='" + response.selectAllResInfo[i].resSerialId
							+ "'>" 
							+ "<button type='button' id='resinfo-detail-btn' style='border:none; background-color:transparent;'>"
							+ "<img src='assets/img/detail2.png' style='width:25px; height:25px;'></button></td>" +	"</tr>";                   

	                $('tbody#resInfoTable').append(resInfoRow);
	            }
				$("#totalPageCount").val(response.page.totalPageCount);
				changePageBtn(response,1)
            },
            error: function(error) {
                // 요청이 실패한 경우 처리
                console.log('에러:', error);
            }
        });
    });

	
	$('#res-class-search-btn').on('click',function(){
		$('#resinfo-detail-modal').modal('hide');
		$('#res-class-choose-modal').modal('show');
	    selectedThirdTableValue = undefined;
	    selectedThirdTableValue2 = undefined;
	    $('#res-class-list-table tbody td').removeClass('selected');
	    $('#res-class-list-table tbody td').html(function () {
	        return $(this).text();  // Remove bold style
	    });
	
	    // 첫 번째 테이블의 선택 상태 초기화
	    $('#res-class-list-table tbody tr').show();
	});
		

 	var selectedThirdTableValue; // 세 번째 테이블에서 선택한 값의 변수
	$('#res-class-list-table2 tbody tr').hide();
	$('#res-class-list-table3 tbody tr').hide();
    // 첫 번째 테이블에서 항목 선택 시
    $('#res-class-list-table tbody').on('click', 'td', function () {
        var selectedValue = $(this).attr('value');
		$(this).html('<strong>' + $(this).text() + '</strong>');
        // 두 번째 테이블에서 선택한 대분류에 속하는 중분류만 표시
        $('#res-class-list-table2 tbody tr').hide();
        $('#res-class-list-table2 tbody tr').each(function () {
            if ($(this).attr('value') === selectedValue) {
                $(this).show();
            }
        });

        // 세 번째 테이블 초기화
        $('#res-class-list-table3 tbody tr').hide();
    });

    // 두 번째 테이블에서 항목 선택 시
    $('#res-class-list-table2 tbody').on('click', 'td', function () {
        var selectedValue = $(this).attr('value');
		var parentTrValue = $(this).closest('tr').attr('value');
		console.log(parentTrValue)
        // 세 번째 테이블에서 선택한 중분류에 속하는 소분류만 표시
        $('#res-class-list-table3 tbody tr').hide();
        $('#res-class-list-table3 tbody tr').each(function () {
            if ($(this).attr('value') === selectedValue) {
                $(this).show();
            }
        });

        // 두 번째 테이블에서 선택한 값 초기화
        selectedThirdTableValue = undefined;
    });

    // 세 번째 테이블에서 항목 선택 시
    $('#res-class-list-table3 tbody').on('click', 'td', function () {
        selectedThirdTableValue = $(this).text();
        selectedThirdTableValue2 = $(this).attr('value');
    });

	// 각 테이블의 td 클릭 시
	$('#res-class-list-table tbody td, #res-class-list-table2 tbody td, #res-class-list-table3 tbody td').on('click', function () {
	    var tableId = $(this).closest('table').attr('id');
	    $('#' + tableId + ' tbody td').removeClass('selected');
	    $('#' + tableId + ' tbody td').html(function () {
	        return $(this).text();  // Remove bold style
	    });
	
	    $(this).addClass('selected');
	    $(this).html('<strong>' + $(this).text() + '</strong>');
	});

    // 확인 버튼 클릭 시 선택한 자원 분류 가져오기
    $('#choose-res-class-btn').on('click', function () {
        $('input[name=resClassName]').val(selectedThirdTableValue);
        $('input[name=resClassId]').val(selectedThirdTableValue2);
		$('#res-class-choose-modal').modal('hide');
		$('#resinfo-detail-modal').modal('show');
		
        var resClassId = $('#resinfo-detail-modal input[name=resClassId]').val();
		
        $.ajax({
            type: 'GET',
            url: '/resinfo/additem',
            data: {
                "resClassId": resClassId
            },
            success: function (response) {
                $('#additionalInfoTable tbody').empty();
                for (var i = 0; i < response.length; i++) {
                    addTableRow = "<tr>" +
                        "<td><input type='hidden' name='addItemSn' value='"+ response[i].addItemSn +"'>" + response[i].addItemName + "</td>" +
                       	"<td><input type='text' id='addItemValue-input' name='resDetailValue'>" + "</td>" +
                        "</tr>";
                    $('#additionalInfoTable tbody').append(addTableRow);
                }
                showTable('additionalInfo');
            },
            error: function (error) {
                console.log('에러:', error);
            }
        });

    });
	// 모달이 닫힐 때 선택한 값 초기화
	$('#res-class-choose-modal').on('hidden.bs.modal', function () {
	    selectedThirdTableValue = undefined;
	    selectedThirdTableValue2 = undefined;
	    $('#res-class-list-table2 tbody tr').hide();
	    $('#res-class-list-table3 tbody tr').hide();
	    $('#res-class-list-table3 tbody td').removeClass('selected');
	    $('#res-class-list-table3 tbody td').html(function () {
	        return $(this).text();  // Remove bold style
	    	});
    	});
	function paging(page) {
		$.ajax({
	        type: 'GET',
	        url: '/resinfo/installplace',
	        contentType: "application/json",
	        data: {
	            'page': page
	        },
	        success: function (response) {
	            var pagingHtml = pagingLine(response);
				updateTable(response.selectResInstallPlace);
	            $('ul#pagination').html(pagingHtml);  // 수정된 선택자
				
	        },
	        error: function (error) {
	            // 요청이 실패한 경우 처리
	            console.log('에러:', error);
	        }
	    });
	}
	function pagingIpList(page){
		$.ajax({
	        type: 'GET',
	        url: '/resinfo/iplist',
	        contentType: "application/json",
	        data: {
	            'page': page
	        },
	        success: function (response) {
	            var pagingHtml = pagingLine(response);
				ipListTable(response.selectAllIpInfoList);
	            $('ul#pagination2').html(pagingHtml);  // 수정된 선택자
	        },
	        error: function (error) {
	            console.log('에러:', error);
	        }
	    });
	}
	//페이지 누르면 이동하는 기능
	$("#pagination").on("click", ".page-btn", function() {
	    const page = $(this).val();
	    paging(page);
	});
	
	//페이지 누르면 이동하는 기능
	$("#pagination2").on("click", ".page-btn", function() {
	    const page = $(this).val();
		pagingIpList(page);
	});
	
	
	//부가항목 리스트 모달 페이징처리
	function pagingLine(data) {
	    var totalPage = data.page.totalPageCount;
	    var page = data.page.nowPage;
	    var totalPageBlock = data.page.totalPageBlock;
	    var nowPageBlock = data.page.nowPageCount;
	    var startPage = data.page.startPage;
	    var endPage = data.page.endPage;
	
	    var pagingLine = "<ul id='paging-line-ul' style='display: flex; justify-content: center; align-items: center; list-style: none; padding: 0;'>";
	
	    if (nowPageBlock > 1) {
	        pagingLine += `<li id='paging-line-li' style='margin-right: 10px;'><button class='page-btn' value=${startPage-1}>⏪</button></li>`;
	    }
	
	    for (var i = startPage; i <= endPage; i++) {
	        var isActive = i === page ? "active" : "";
	        pagingLine += `<li id='paging-line-li' style='margin-right: 10px;'><button class='page-btn ${isActive}' value=${i}>${i}</button></li>`;
	    }
	
	    if (nowPageBlock < totalPageBlock) {
	        pagingLine += `<li><button class='page-btn' value=${endPage+1}>⏩</button></li>`;
	    }
	
	    pagingLine += "</ul>";
	
	    // Add custom CSS styles
	    var customStyles = `
	        <style>
	            ul #paging-line-ul {
	                display: flex;
	                justify-content: center;
	                align-items: center;
	                list-style: none;
	                padding: 0;
	            }
	
	            ul li #paging-line-li {
	                margin-right: 10px;
	            }
	
	            ul li:last-child {
	                margin-right: 0;
	            }
	
	            ul li button {
	                border: none;
	                background: none;
	                font-size: 16px;
	                cursor: pointer;
	            }
	
	            ul li button:focus {
	                outline: none;
	            }
	        </style>
	    `;
	    pagingLine += customStyles;
	
	    return pagingLine;
	}


function updateTable(installPlace) {
	var tbody = $('#install-place-list-table tbody');
	tbody.empty();  // tbody 내용을 초기화
	for (var i = 0; i < installPlace.length; i++) {
        var installPlaceSn = installPlace[i].installPlaceSn;
        var addTableRow = "<tr>" +
            "<td><input type='checkbox' name='installPlaceSn' value='" + installPlaceSn + "'"+ "></td>" +
            "<td>" + installPlace[i].installPlaceName + "</td>" +
            "<td>" + installPlace[i].installPlacePostno + "</td>" +
            "<td>" + installPlace[i].installPlaceAddress + "</td>" +
            "</tr>";
        $('#install-place-list-table tbody').append(addTableRow);
	}
}

function ipListTable(ipList){
	var tbody = $('#ip-list-table tbody');
	tbody.empty();  // tbody 내용을 초기화
	for (var i = 0; i < ipList.length; i++) {
        var ipSn = ipList[i].ipSn;
		var ipTypeCode = ipList[i].ipTypeCode;
        var addTableRow = "<tr>" +
            "<td><input type='checkbox' name='ipSn' value='" + ipSn + "'"+ "></td>" +
            "<td>" + ipList[i].ip + "</td>" +
            "<td>" + ipList[i].detailCodeName + "</td>" +
			"<input type='hidden' readonly='readonly' name='ipTypeCode' value='" + ipTypeCode + "'>" +
            "</tr>";
        $('table#ip-list-table tbody').append(addTableRow);
	}
}
});

function clearModalContent() {
  // 모달 내부의 input 요소 초기화
  var inputElements = document.querySelectorAll('#resinfo-detail-modal input');
  for (var i = 0; i < inputElements.length; i++) {
    inputElements[i].value = '';
  }

  // 모달 내부의 select 요소 초기화
  var selectElements = document.querySelectorAll('#resinfo-detail-modal select');
  for (var j = 0; j < selectElements.length; j++) {
    selectElements[j].selectedIndex = 0;
  }

  // 모달 내부의 텍스트 영역 초기화
  var textElements = document.querySelectorAll('#resinfo-detail-modal textarea');
  for (var k = 0; k < textElements.length; k++) {
    textElements[k].value = '';
  }


  // additionalInfoTable의 tbody 비우기
  $('#additionalInfoTable tbody').empty();

  // ipListTable의 tbody 비우기
  $('#ipListTable tbody').empty();
}

