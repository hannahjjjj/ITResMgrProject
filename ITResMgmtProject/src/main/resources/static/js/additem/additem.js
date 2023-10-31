var rowCount = 0;

//행추가 버튼
function addItemAddRow() {
	var table = document.getElementById("addItemTable");
	var newRow = table.insertRow();
	newRow.setAttribute("data-row-id", rowCount);
	
	var newCellStatus = newRow.insertCell(0);
	newCellStatus.innerHTML = "<span name='status'>I</span>";
	
	var newCellCheckBox = newRow.insertCell(1);
	newCellCheckBox.innerHTML = "<input type='checkbox' name='insertCheckBox'>";

	var newCellSn = newRow.insertCell(2);
	/*	newCellSn.innerHTML = "<input type='text' id='addItemSn" + rowCount + "' size='5'>";*/

	var newCellName = newRow.insertCell(3);
	newCellName.innerHTML = "<input type='text' id='insertName" + rowCount + "' style='text-align: center;'>";

	var newCellDesc = newRow.insertCell(4);
	newCellDesc.innerHTML = "<input type='text' id='addItemDesc" + rowCount + "' size='40'>";

	var newCellUseYN = newRow.insertCell(5);
	newCellUseYN.innerHTML = "<span>Y</span>";

	rowCount++;

	const newCells = [newCellCheckBox, newCellStatus, newCellSn, newCellName, newCellDesc, newCellUseYN];
	newCells.forEach((cell) => {
		cell.style.padding = '8px'; // Change the padding value as needed
	});

	const tableContainer = document.querySelector(".additem-table-container");
	tableContainer.scrollTop = tableContainer.scrollHeight; // 맨 아래로 스크롤 이동
}

//행삭제 버튼 (행숨김)
function addItemHideRow() {
	const selectedCheckboxes = document.querySelectorAll('input[name="checkBox"]:checked');

	selectedCheckboxes.forEach(function(checkbox) {
		var row = checkbox.closest('tr');
		row.querySelector("span[name='status']").textContent = "D";
	});

	//행추가 후 행삭제
	const insertCheckboxes = document.querySelectorAll('input[name="insertCheckBox"]:checked');
	insertCheckboxes.forEach(function(checkbox) {
		const row = checkbox.closest('tr');
		row.remove();
		rowCount--;
	});
}

//부가항목설명 클릭 시 수정가능
function handleClick(element) {
	// 부가항목설명 클릭 시 상태 U로 변경
	const addItemStatus = element.closest('tr').querySelector("span[name='status']");

	if (addItemStatus.textContent === 'D') {
		return;
	} else {
		addItemStatus.textContent = 'U';

		const tdElement = element;
		tdElement.style.padding = '0';

		//입력필드 생성
		const inputDesc = document.createElement('input');
		inputDesc.size = '40';
		inputDesc.type = 'text';
		inputDesc.value = element.textContent;
		inputDesc.classList.add('edit-field');

		//스팬을 입력 필드로 대체
		element.textContent = '';
		element.appendChild(inputDesc);

		inputDesc.focus();

		//입력 필드가 포커스를 잃을 때
		inputDesc.addEventListener('blur', function() {
			//입력 필드에서 새로운 값 가져오기
			const newDescValue = inputDesc.value;
			element.textContent = newDescValue;
		});
	}
}

//저장버튼
function addItemSaveAll() {
	// 새로 추가될 행의 부가항목명들을 배열에 저장
	const newAddItemNames = [];
	for (let i = 0; i < rowCount; i++) {
		const newAddItemName = document.getElementById('insertName' + i).value;
		if (newAddItemName !== null && newAddItemName !== '') {
			newAddItemNames.push(newAddItemName);
		}
	}

	$.ajax({
		url: '/checkDuplicateAddItemNames',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(newAddItemNames),
		success: function(response) {
			const duplicateNames = response;
			var confirmation = confirm("저장하시겠습니까?");

			if (duplicateNames.length > 0) {
				alert("중복된 부가항목명 : " + duplicateNames.join(", ") + "입니다. 다시 입력해 주세요.");
				return;
			} else {
				//Insert
				if (confirmation) {
					if (rowCount > 0) {
						var insertAddItems = new Array();
						for (var i = 0; i < rowCount; i++) {
							var addItemName = document.getElementById('insertName' + i).value;
							console.log("addItemName", addItemName);
							var addItemDesc = document.getElementById('addItemDesc' + i).value;

							if (validation(addItemName)) {
								var addItemValue = {
									addItemName: addItemName,
									addItemDesc: addItemDesc
								};
								insertAddItems.push(addItemValue);
							} else {
								alert("부가항목명 모두 작성해 주세요");
								return rowCount;
							}
						}
					}

					//Delete
					var deletedAddItems = [];

					var deleteStatus = document.getElementsByName("status");

					for (var i = 0; i < deleteStatus.length; i++) {
						var deleteStatusValue = deleteStatus[i].textContent;
						if (deleteStatusValue === "D") {
							// 해당 숨겨진 필드의 부모 행을 찾아서 addItemSn 값을 가져오기
							var row = deleteStatus[i].closest("tr");
							var addItemSn = row.querySelector('[name="addItemSn"]').textContent;
							deletedAddItems.push(addItemSn);
						}
					}

					//Update
					var updateStatus = document.getElementsByName("status");
					var updateAddItems = [];
					for (var i = 0; i < updateStatus.length; i++) {
						var updateStatusValue = updateStatus[i].textContent;
						if (updateStatusValue === 'U') {
							var row = updateStatus[i].closest("tr");
							var updateAddItemSn = row.querySelector('[name="addItemSn"]').textContent;
							var updateAddItemDesc = row.querySelector('[name="addItemDesc"]').textContent;

							var updateAddItem = {
								addItemSn: updateAddItemSn,
								addItemDesc: updateAddItemDesc
							};
							updateAddItems.push(updateAddItem);
						}
					}

					var requestData = {
						insertAddItems: insertAddItems,
						deletedAddItems: deletedAddItems,
						updateAddItems: updateAddItems
					};

					console.log("requestData", requestData);

					$.ajax({
						url: '/save/additem',
						type: 'POST',
						contentType: 'application/json',
						data: JSON.stringify(requestData),
						success: function(response) {
							rowCount = 0;
							console.log("response", response)

							$('#addItemTable > tbody').empty();

							for (var i = 0; i < response.length; i++) {
								var addTableRow = "<tr>" +
									"<td name='addItemStatus'><span name='status'>S</span></td>" +
									"<td><input type='checkbox' name='checkBox'></td>" +
									"<td name='addItemSn'>" + response[i].addItemSn + "</td>" +
									"<td name='addItemName'>" + response[i].addItemName + "</td>" +
									"<td name='addItemDesc' onclick='handleClick(this)'>" + response[i].addItemDesc + "</td>" +
									"<td name='useYN'>" + response[i].useYN + "</td>" +
									"</tr>";

								$('#addItemTable > tbody').append(addTableRow);
							}
							alert("저장되었습니다.");
							return;
						},
						error: function(xhr, status, error) {
							alert("오류가 발생했습니다. 다시 시도해주세요.");
						}
					});
				}
			}
		}
	})
	// "취소"를 클릭했을 때 아무 동작도 하지 않음
}


//insert 유효성검사
function validation(addItemName) {
	var pattern_spc = /^[^~!@#$%^&*_+|<>?:{}]+$/; // 특수문자

	if (!pattern_spc.test(addItemName)) {
		alert("부가항목명은 1글자 이상, 괄호를 제외한 특수문자는 사용할 수 없습니다.");
		return false;
	}
	return true;
}


//조회
function addItemsearch() {

	var searchAddItemUseYN = document.getElementById('searchUseYN').value;
	var searchAddItemText = document.getElementById('addItemSearchText').value;

	var searchAddItemData = {
		searchAddItemUseYN: searchAddItemUseYN,
		searchAddItemText: searchAddItemText
	};

	console.log("searchAddItemData", searchAddItemData);

	$.ajax({
		url: '/search/additem?' + $.param(searchAddItemData),
		type: 'GET',
		success: function(response) {
			console.log("response", response)

			$('#addItemTable > tbody').empty();

			if (response.length === 0) {
				// 검색 결과가 없는 경우
				 alert('검색된 결과가 없습니다.');
				var noResultRow = "<tr><td colspan='6' style='font-weight: bold;'>검색결과가 없습니다</td></tr>";
				$('#addItemTable > tbody').append(noResultRow);
			} else {
				// 검색 결과가 있는 경우
				for (var i = 0; i < response.length; i++) {
					var addTableRow = "<tr>" +
						"<td name='addItemStatus'><span name='status'>S</span></td>" +
						"<td><input type='checkbox' name='checkBox'></td>" +
						"<td name='addItemSn'>" + response[i].addItemSn + "</td>" +
						"<td name='addItemName'>" + response[i].addItemName + "</td>" +
						"<td name='addItemDesc' onclick='handleClick(this)'>" + response[i].addItemDesc + "</td>" +
						"<td name='useYN'>" + response[i].useYN + "</td>" +
						"</tr>";

					$('#addItemTable > tbody').append(addTableRow);
				}
				//alert(response.length + "건이 조회되었습니다.");
			}
			return;
		}
	});
}


function uploadFile() {
	// 파일 선택 필드를 클릭하여 파일 선택 대화 상자 열기
	document.getElementById('fileInput').click();
}

// 파일 선택 이벤트 처리
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
	const fileInput = event.target;
	const file = fileInput.files[0];
	if (file) {
		// 사용자에게 "파일 업로드 하시겠습니까?" 알림 창 표시
		if (confirm("파일을 업로드 하시겠습니까?")) {
			const formData = new FormData();
			formData.append('file', file);

			$.ajax({
				url: '/checkDuplicateAddItemNamesExcel',
				type: 'POST',
				contentType: false,
				processData: false,
				data: formData,
				success: function(response) {
					const duplicateNamesExcel = response;

					if (duplicateNamesExcel.length > 0) {
						// 중복된 ID가 있으면 사용자에게 알림을 표시
						alert("중복된 부가항목명 [" + duplicateNamesExcel.join(", ") + "] 입니다. 다시 입력해 주세요.");
						fileInput.value = '';
						return;
					} else {
						$.ajax({
							url: '/excel/upload',
							type: 'POST',
							contentType: false,
							processData: false,
							data: formData,
							success: function(response) {
								alert("엑셀 업로드가 완료되었습니다.");
								rowCount = 0;
								console.log("response", response)

								$('#addItemTable > tbody').empty();

								if (response.length === 0) {
									$('#addItemTable > tbody').append(noResultRow);
								} else {
									for (var i = 0; i < response.length; i++) {
										var addTableRow = "<tr>" +
											"<td name='addItemStatus'><span name='status'>S</span></td>" +
											"<td><input type='checkbox' name='checkBox'></td>" +
											"<td name='addItemSn'>" + response[i].addItemSn + "</td>" +
											"<td name='addItemName'>" + response[i].addItemName + "</td>" +
											"<td name='addItemDesc' onclick='handleClick(this)'>" + response[i].addItemDesc + "</td>" +
											"<td name='useYN'>Y</td>" +
											"</tr>";

										$('#addItemTable > tbody').append(addTableRow);
									}
								}
							},
							error: function() {
								alert("엑셀 업로드에 실패했습니다. 파일을 다시 선택해주세요.");
							}
						});
					}
				},
				error: function() {
					alert("엑셀 업로드에 실패했습니다. 파일을 다시 선택해주세요.");
				}
			});
		} else {
			// 사용자가 "취소"를 선택한 경우, 함수를 다시 호출하여 파일 선택 화면으로 돌아갈 수 있도록 함
			fileInput.value = ''; // 파일 입력 필드를 초기화하여 사용자가 새로운 파일을 선택할 수 있도록 함
		}
	}
}
