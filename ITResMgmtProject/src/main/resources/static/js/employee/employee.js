let rowCount = 0;

//행추가 버튼
function addRow() {
	const table = document.getElementById("empTable");
	const newRow = table.insertRow();
	newRow.setAttribute("data-row-id", rowCount);

	const newCellStatus = newRow.insertCell(0);
	newCellStatus.innerHTML = "<span name='empStatus'>I</span>";

	const newCellCheckBox = newRow.insertCell(1);
	newCellCheckBox.innerHTML = "<input type='checkbox' name='addCheckbox'>";

	const newCellEmpId = newRow.insertCell(2);
	newCellEmpId.innerHTML = "<input type='text' style='text-align:center;' id='empId" + rowCount + "'>";


	const newCellEmpPwd = newRow.insertCell(3);
	newCellEmpPwd.innerHTML = "<input type='password' style='text-align:center;' id='empPwd" + rowCount + "'>";


	const newCellEmpName = newRow.insertCell(4);
	newCellEmpName.innerHTML = "<input type='text' style='width:100px; text-align:center;' id='empName" + rowCount + "'>";

	//<select>에서 전체옵션 뺀 나머지 옵션
	const newCellEmpType = newRow.insertCell(5);
	const empTypeSelect = document.createElement('select');
	empTypeSelect.id = 'empTypeCode' + rowCount;
	empTypeSelect.name = 'empTypeList'; // 선택 목록의 name 속성 설정
	empTypeSelect.style.fontSize = '15px';

	document.querySelectorAll('#searchEmpTypeList option:not(:first-child)').forEach((option) => {
		const empTypeSelectOption = document.createElement('option');
		empTypeSelectOption.value = option.value;
		empTypeSelectOption.textContent = option.textContent;
		empTypeSelect.appendChild(empTypeSelectOption);
	});

	newCellEmpType.appendChild(empTypeSelect);

	const newCellEmpStatus = newRow.insertCell(6);
	const empStatusSelect = document.createElement('select');
	empStatusSelect.id = 'empTypeStatus' + rowCount;
	empStatusSelect.name = 'empStatusList';
	empStatusSelect.style.fontSize = '15px';

	document.querySelectorAll('#searchEmpStatusList option:not(:first-child)').forEach((option) => {
		const empStatusSelectOption = document.createElement('option');
		empStatusSelectOption.value = option.value;
		empStatusSelectOption.textContent = option.textContent;
		empStatusSelect.appendChild(empStatusSelectOption);
	});

	newCellEmpStatus.appendChild(empStatusSelect);

	rowCount++;

	const newCells = [newCellCheckBox, newCellStatus, newCellEmpId, newCellEmpPwd, newCellEmpName, newCellEmpType, newCellEmpStatus];
	newCells.forEach((cell) => {
		cell.style.padding = '8px'; // Change the padding value as needed
	});

	const tableContainer = document.querySelector(".employee-table-container");
	tableContainer.scrollTop = tableContainer.scrollHeight; // 맨 아래로 스크롤 이동
}

//행삭제 버튼
function hideRow() {
	//원래 있던 행삭제
	const selectedCheckboxes = document.querySelectorAll('input[name="empCheckbox"]:checked');

	selectedCheckboxes.forEach(function(checkbox) {
		const row = checkbox.closest('tr');
		//row.style.display = 'none';
		row.querySelector("span[name='empStatus']").textContent = "D";
		row.querySelector("td[name='employeeName']").contentEditable = 'false';
	});

	//행추가한 행 삭제
	const insertCheckboxes = document.querySelectorAll('input[name="addCheckbox"]:checked');
	insertCheckboxes.forEach(function(checkbox) {
		const row = checkbox.closest('tr');
		row.remove();
		rowCount--;
	});
}

async function test(element) {
	return new Promise(function(resolve) {
		$.ajax({
			url: '/findEmployeePwd',
			type: 'Post',
			data: { employeeId: element },
			success: function(response) {

				// JSON 응답에서 employeePwd 필드의 값을 추출
				var employeePwd = response.employeePwd;
				resolve(employeePwd);
			},
			error: function(request, status, error) {
				alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
			}
		});
	});
}


//저장
async function saveList() {
	//Delete
	var deletedEmployeeIds = [];
	var deleteEmpStatus = document.getElementsByName("empStatus");

	for (var i = 0; i < deleteEmpStatus.length; i++) {
		var deleteEmpStatusValue = deleteEmpStatus[i].textContent;
		if (deleteEmpStatusValue === "D") {
			// 해당 숨겨진 필드의 부모 행을 찾아서 employeeId 값을 가져옵니다.
			var row = deleteEmpStatus[i].closest("tr");
			var employeeId = row.querySelector('[name="employeeId"]').textContent;
			console.log("employeeId : ", employeeId);
			deletedEmployeeIds.push(employeeId);
		}
	}//delete

	//Update
	var hiddenFields = document.getElementsByName("empStatus");
	var updatedEmployeeInfo = [];
	for (var i = 0; i < hiddenFields.length; i++) {
		var hiddenValue = hiddenFields[i].textContent;
		if (hiddenValue === "U") {
			// 해당 숨겨진 필드의 부모 행을 찾아서 employeeId 값을 가져옵니다.
			var row = hiddenFields[i].closest("tr");
			var updateEmpId = row.querySelector('[name="employeeId"]').textContent;
			var updateEmpPwd = row.querySelector('[name="employeePwd"]').value;
			var updateEmpName = row.querySelector('input[name="employeeName"]').value;

			if (updateEmpPwd === "**********") {
				updateEmpPwd = await test(updateEmpId);
			}

			var updateEmpType = null;
			var updateEmpStatus = null;

			//name="empType"인 <span> text와 일치하는 <select><option> value값 가져오기
			//span text값 가지고오기
			var empTypeElement = row.querySelector('span.text[name="empType"]');
			var empTypetext = empTypeElement.textContent;

			//empTypeList <select> 가지고 오기	
			var selectElement = row.querySelector('select[name="empTypeList"]');

			//empTypeList <select>의 <option> 가지고 오기
			for (var j = 0; j < selectElement.options.length; j++) {
				var option = selectElement.options[j];
				//console.log("Option " + i + ": " + option.value + " - " + option.textContent);
				if (empTypetext === option.textContent) {
					updateEmpType = option.value;
					break;
				}
			}

			//name="empStatus"인 <span> text와 일치하는 <select><option> value값 가져오기
			//span text값 가지고오기
			var empStatusElement = row.querySelector('span.text[name="empStatus"]');
			var empStatustext = empStatusElement.textContent;

			//empTypeList <select> 가지고 오기	
			var typeSelectElement = row.querySelector('select[name="empStatusList"]');

			//empTypeList <select>의 <option> 가지고 오기
			for (var k = 0; k < typeSelectElement.options.length; k++) {
				var tpyeOption = typeSelectElement.options[k];
				//console.log("Option " + i + ": " + option.value + " - " + option.textContent);
				if (empStatustext === tpyeOption.textContent) {
					updateEmpStatus = tpyeOption.value;
					break;
				}
			}
			if (updateValidation(updateEmpName, updateEmpPwd)) {
				var updateEmployee = {
					employeeId: updateEmpId,
					employeePwd: updateEmpPwd,
					employeeName: updateEmpName,
					employeeTypeCode: updateEmpType,
					employeeStatusCode: updateEmpStatus
				};
				updatedEmployeeInfo.push(updateEmployee);
			} else {
				return;
			}
		}

	}//update
	console.log("updatedEmployeeInfo", updatedEmployeeInfo);

	//Insert
	//1. 입력칸 모두 작성할 것
	var insertEmp = new Array();
	if (rowCount > 0) {
		for (let i = 0; i < rowCount; i++) {
			var insertEmpId = document.getElementById('empId' + i).value;
			var insertEmpPwd = document.getElementById('empPwd' + i).value;
			var insertEmpName = document.getElementById('empName' + i).value;
			var insertEmpTypeCode = document.getElementById('empTypeCode' + i).value;
			var insertEmpStatusCode = document.getElementById('empTypeStatus' + i).value;

			if (insertEmpId && insertEmpName && insertEmpPwd) {
				var insertEmpVal = {
					employeeId: insertEmpId,
					employeeName: insertEmpName,
					employeeStatusCode: insertEmpStatusCode,
					employeeTypeCode: insertEmpTypeCode,
					employeePwd: insertEmpPwd
				};
				insertEmp.push(insertEmpVal);
			} else {
				alert("입력칸 모두 작성해 주세요");
				insertEmp.length = 0; //employee 배열 비우기
				return rowCount;
			}
		}
		//2. 입력칸 모두 입력했을 시 ID중복 검사
		if (insertEmp.length > 0) {
			console.log("성공");
			var deplicateIdCheck = [];
			for (let i = 0; i < insertEmp.length; i++) {
				var insertEmpIdData = insertEmp[i].employeeId;
				deplicateIdCheck.push(insertEmpIdData);
			}

			console.log("중복체크 위해 insertId값 모두 담기", deplicateIdCheck);
			$.ajax({
				url: '/checkDuplicateEmployeeIds',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify(deplicateIdCheck),
				success: function(response) { //중복된 ID값만 넘어옴
					const duplicateIds = response;

					if (duplicateIds.length > 0) {
						// 중복된 ID가 있으면 사용자에게 알림을 표시하고, focus주기
						for (let i = 0; i < duplicateIds.length; i++) {
							for (let j = 0; j < rowCount; j++) {
								const empIdInput = document.getElementById('empId' + j);
								if (empIdInput.value === duplicateIds[i]) {
									alert("중복된 사원ID [" + duplicateIds + "] 입니다. 다시 입력해 주세요.");
									empIdInput.focus();
									return;
								}
							}
						}
						return;
					} else {
						//3. 중복 검사가 완료되면 유효성검사
						for (let i = 0; i < rowCount; i++) {
							var insertEmpId = document.getElementById('empId' + i).value;
							var insertEmpPwd = document.getElementById('empPwd' + i).value;
							var insertEmpName = document.getElementById('empName' + i).value;

							console.log("유효성 rowCount", rowCount);

							if (!validation(insertEmpId, insertEmpPwd, insertEmpName, i)) {
								// 유효성 검사 실패
								return false;
							}
						}
						if ((rowCount > 0 && insertEmp.length > 0) && (deletedEmployeeIds.length >= 0 || updatedEmployeeInfo.length >= 0)) {
							var requestData = {
								employee: insertEmp,
								deletedEmployeeIds: deletedEmployeeIds,
								updatedEmployeeInfo: updatedEmployeeInfo
							};
							saveAjax(requestData);
						}
						else {
							return;
						}
					}
				},
				error: function(request, error) {
					alert("메시지:" + request.responseText + "\n" + "에러:" + error);
				}
			});
		}
	}

	//Update 또는 Delete만 존재할 경우
	if ((rowCount === 0) && (deletedEmployeeIds.length >= 0 || updatedEmployeeInfo.length >= 0)) {
		var requestData = {
			employee: insertEmp,
			deletedEmployeeIds: deletedEmployeeIds,
			updatedEmployeeInfo: updatedEmployeeInfo
		};
		saveAjax(requestData);
	}
	else {
		return;
	}
}



//저장할때 ajax실행 함수
function saveAjax(requestData) {
	var confirmation = confirm("저장하시겠습니까?");

	if (confirmation) {
		$.ajax({
			url: '/save/employee',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(requestData),
			success: function(response) {
				rowCount = 0;

				var empTypeSelect = document.querySelector("select[name='empTypeList']");
				var empStatusSelect = document.querySelector("select[name='empStatusList']");

				$('#empTable > tbody').empty();

				for (var i = 0; i < response.length; i++) {
					var addTableRow = "<tr>" +
						"<td><span name='empStatus'>S</span></td>" +
						"<td><input type='checkbox' name='empCheckbox'></td>" +
						"<td name='employeeId'>" + response[i].employeeId + "</td>" +
						"<td><input type='text' value='**********' name='employeePwd' onclick='showPasswordField(this)'" +
						"class='employee-input employee-pwd'></input></td>" +
						"<td><input type='text' name='employeeName'" + "value='" + response[i].employeeName + "''" +
						"onclick='handleClick(this)' class='employee-input employee-name'></input></td>";

					//사원유형 <td>
					var employeeTypeCell = "<td name='employeeType' onclick='handleClick(this)'>" +
						"<span class='text' name='empType'>" + response[i].employeeType + "</span>";

					employeeTypeCell += empTypeSelect.outerHTML; // 'empTypeSelect'를 새 셀에 추가합니다..
					employeeTypeCell += "</td>";

					//사원상태 <td>
					var employeeStatusCell = "<td name='employeeStatus' onclick='handleClick(this)'>" +
						"<span class='text' name='empStatus'>" + response[i].employeeStatus + "</span>";

					employeeStatusCell += empStatusSelect.outerHTML; // 'empStatusSelect'를 새 셀에 추가합니다.
					employeeStatusCell += "</td>";

					addTableRow += employeeTypeCell + employeeStatusCell + "</tr>";

					$('#empTable > tbody').append(addTableRow);
				}
				alert("저장되었습니다.");
				return;
			},
			error: function(request, error) {
				alert("메시지:" + request.responseText + "\n" + "에러:" + error);
			}
		});
	}
}

//유효성 검사
function validation(insertEmpId, insertEmpPwd, insertEmpName, count) {
	// 사원ID 유효성 검사
	var pattern_id = /^[^~!@#$%^&*_+|<>?:{}()-,.=\p{Script=Hangul}\s]/u;
	var pattern_length = /^.{5,}$/;
	var pattern_whitespace = /^\S*$/;
	if (!pattern_length.test(insertEmpId) || !pattern_id.test(insertEmpId) || !pattern_whitespace.test(insertEmpId)) {
		alert("사원ID는 5글자 이상이며, 특수문자, 공백, 한글을 사용할 수 없습니다.");
		document.getElementById('empId' + count).focus();
		return false;
	}

	// 사원비밀번호 유효성 검사
	var pattern_pwd = /^(?=.*[!@#$%^&*_+|<>?:{}()-,.=])[^\s]{6,}$/;
	if (!pattern_pwd.test(insertEmpPwd)) {
		alert("사원비밀번호는 특수문자 포함 6글자 이상, 공백은 사용할 수 없습니다.");
		document.getElementById('empPwd' + count).focus();
		return false;
	}

	// 사원명 유효성 검사
	var pattern_name = /^[a-zA-Z가-힣]{2,}$/;
	if (!pattern_name.test(insertEmpName)) {
		alert("사원명은 2글자 이상, 숫자, 공백, 특수문자는 사용할 수 없습니다.");
		document.getElementById('empName' + count).focus();
		return false;
	}
	return true;
}

//Update시 유효성검사, focus주기
function updateValidation(updateEmpName, updateEmpPwd) {
	// 사원명 유효성 검사
	if (!/^[^\d\s!@#$%^&*(),.?":{}|<>]{2,}$/.test(updateEmpName)) {
		alert("수정된 사원명은 2글자 이상, 숫자, 공백, 특수문자는 사용할 수 없습니다.");
		const updateElementName = document.getElementsByName("employeeName");
		for (var i = 0; i < updateElementName.length; i++) {
			if (updateElementName[i].value === updateEmpName) {
				updateElementName[i].focus();
				break;
			}
		}
		return false;
	}

	if (!/^(?=.*[!@#$%^&*_+|<>?:{}()-,.=])[^\s]{6,}$/.test(updateEmpPwd)) {
		alert("사원비밀번호는 특수문자 포함 6글자 이상, 공백은 사용할 수 없습니다.");
		const updateElementPwd = document.getElementsByName("employeePwd");
		for (var i = 0; i < updateElementPwd.length; i++) {
			if (updateElementPwd[i].value === updateEmpPwd) {
				updateElementPwd[i].focus();
				break;
			}
		}
		return false;
	}
	return true;
}


const cells = document.querySelectorAll('td[name="employeeName"], td[name="employeeType"], td[name="employeeStatus"]');

cells.forEach((cell) => {
	cell.addEventListener('click', function() {
		handleClick(this);
	});
});

function handleClick(element) {
	const empStatusSpan = element.closest('tr').querySelector("span[name='empStatus']");

	if (empStatusSpan.textContent === 'D') {
		return;
	} else {
		empStatusSpan.textContent = 'U';

		// 클릭한 셀이 'employeeType' 또는 'employeeStatus'인 경우에만 showSelectBox 함수 실행
		if (element.getAttribute('name') === 'employeeType' || element.getAttribute('name') === 'employeeStatus') {
			showSelectBox(element);
		}
	}
}

function showSelectBox(listItem) {
	const textElement = listItem.querySelector(".text");
	textElement.style.display = "none";

	const selectElement = listItem.querySelector(".select");
	selectElement.style.display = "inline-block";
	selectElement.style.fontSize = "15px";

	selectElement.focus();

	const selectedText = textElement.textContent;

	// select 요소 내의 모든 option 요소를 가져옵니다.
	const options = Array.from(selectElement.options);

	// 선택한 셀의 값을 기반으로 해당 값을 가진 옵션을 찾아 선택합니다.
	for (let i = 0; i < options.length; i++) {
		if (options[i].textContent === selectedText) {
			selectElement.selectedIndex = i;
			break; // 찾았으므로 루프 종료
		}
	}

	selectElement.addEventListener("change", function() {
		textElement.innerText = selectElement.options[selectElement.selectedIndex].textContent;
	});

	selectElement.addEventListener("blur", function() {
		textElement.style.display = "inline-block";
		selectElement.style.display = "none";
	});
}

//사원비밀번호 가져오기
function showPasswordField(element) {
	const empStatusSpan = element.closest('tr').querySelector("span[name='empStatus']");
	empStatusSpan.textContent = 'U';

	element.value = "";

	const employeeId = element.closest('tr').querySelector("td[name='employeeId']").textContent;
	console.log('선택된 사원의 ID: ' + employeeId);

	$.ajax({
		url: '/findEmployeePwd',
		type: 'Post',
		data: { employeeId: employeeId },
		success: function(response) {
			// JSON 응답에서 employeePwd 필드의 값을 추출
			var employeePwd = response.employeePwd;

			element.value = employeePwd;
			element.focus();
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
}

var empTypeSelect = document.querySelector("select[name='empTypeList']");
var empStatusSelect = document.querySelector("select[name='empStatusList']");	

//조회
function searchList() {
	const employeeTypeCode = document.getElementById('searchEmpTypeList').value;
	const employeeStatusCode = document.getElementById('searchEmpStatusList').value;
	const searchText = document.getElementById('searchText').value;

	const searchData = {
		employeeTypeCode: employeeTypeCode,
		employeeStatusCode: employeeStatusCode,
		searchText: searchText
	};

	$.ajax({
		url: '/search/employee?' + $.param(searchData),
		type: 'GET',
		success: function(response) {
			$('#empTable > tbody').empty();

			if (response.length === 0) {
				// 검색 결과가 없는 경우
				alert('검색된 결과가 없습니다.');
				var noResultRow = "<tr><td colspan='7' style='text-align:center; font-weight:bold;'>검색결과가 없습니다</td></tr>";
				$('#empTable > tbody').append(noResultRow);
			} else {
				// 검색 결과가 있는 경우
				for (var i = 0; i < response.length; i++) {
					var addTableRow = "<tr>" +
						"<td><span name='empStatus'>S</span></td>" +
						"<td><input type='checkbox' name='empCheckbox'></td>" +
						"<td name='employeeId'>" + response[i].employeeId + "</td>" +
						"<td><input type='text' value='**********' name='employeePwd' onclick='showPasswordField(this)'" +
						"class='employee-input employee-pwd'></input></td>" +
						"<td><input type='text' name='employeeName'" + "value='" + response[i].employeeName + "''" +
						"onclick='handleClick(this)' class='employee-input employee-name'></input></td>";


					//사원유형 <td>
					var employeeTypeCell = "<td name='employeeType' onclick='handleClick(this)'>" +
						"<span class='text' name='empType'>" + response[i].employeeType + "</span>";

					employeeTypeCell += empTypeSelect.outerHTML; // 'empTypeSelect'를 새 셀에 추가합니다..
					employeeTypeCell += "</td>";

					//사원상태 <td>
					var employeeStatusCell = "<td name='employeeStatus' onclick='handleClick(this)'>" +
						"<span class='text' name='empStatus'>" + response[i].employeeStatus + "</span>";

					employeeStatusCell += empStatusSelect.outerHTML; // 'empStatusSelect'를 새 셀에 추가합니다.
					employeeStatusCell += "</td>";

					addTableRow += employeeTypeCell + employeeStatusCell + "</tr>";

					$('#empTable > tbody').append(addTableRow);
				}
				//alert(response.length + "건이 조회되었습니다.");
			}
			return;
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
}