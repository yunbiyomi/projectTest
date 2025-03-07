var pAction = nexacro.Action.prototype;

//===============================================================
// nexacro.Action : 변수선언 부분(변경불가)
//===============================================================
// 대상 Action : PopupAction, PopupActionM
pAction._POPUP_CALLBACK = "fnPopupActionCallback";			// 팝업 Callback함수(Action 내부에서 사용)

// 대상 Action : TransactionAction
pAction._TRAN_CALLBACK_NM = "fnTranActionCallback";			// Action공통 Callback함수명

//===============================================================
// nexacro.Action : 변수선언 부분(프로젝트마다 변경)
//===============================================================
// 대상 Action : ExcelExportAction, ExcelImportAction
pAction._COM_EXCEL_URL = "svc::XExportImport";			// XENI URL

// 대상 Action : DsSetFirstCdAction
pAction._COM_CODE_COL = "COMN_CD";							// 공통코드 코드컬럼명
pAction._COM_NAME_COL = "COMN_CD_NM";						// 공통코드 코드명컬럼명


//---------------------------------------------------------------
// 대상 Action : RestAPIAction
//---------------------------------------------------------------
// request 함수
pAction.gfnCallRestApi = function(sSvcId, sServiceURL, objDo, oInputData, sMethodType)
{
	// TODO : 프로젝트마다 필요시 구현필요
	
	if (this.gfnIsNull(sMethodType))		sMethodType = "post";
	
	sMethodType = sMethodType.toUpperCase();
	
	// request 호출
	if (!this.gfnIsNull(oInputData)) {
		var header = {"Content-Type" : "application/json; charset=UTF-8"};
		var strPostdata = JSON.stringify(oInputData);
		var oParam = {
						"httpheader":header, 
						"postdata":strPostdata
					};
		objDo.request(sSvcId,sMethodType,sServiceURL,oParam);
	} else {
		objDo.request(sSvcId,sMethodType,sServiceURL);
	}
};

// request 처리후 공통처리 함수
pAction.gfnAfterRestApi = function(oAction)
{
	var bRet = true;
	
	// TODO : 프로젝트마다 필요시 구현필요
	
	return bRet;
};
//---------------------------------------------------------------