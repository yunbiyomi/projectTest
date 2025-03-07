//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.TransactionAction		
// Group : Action		
//==============================================================================		
if (!nexacro.TransactionAction)		
{		
    nexacro.TransactionAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.TransactionAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.TransactionAction);		
    nexacro.TransactionAction.prototype._type_name = "TransactionAction";	
	
	//===============================================================		
    // nexacro.TransactionAction : Create & Destroy		
    //===============================================================		
    nexacro.TransactionAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.TransactionAction : Method		
    //===============================================================		
    nexacro.TransactionAction.prototype.run = function()		
	{	
        //canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun("userdata")!=false)
		{	
			//Transaction에서 사용할 Param정보 가져오기
			var sSvcId = this.id;
			var sService = this.serviceurl;
			var sInDs = this.inputdatasets;
			var sOutDs = this.outputdatasets;
			var sArgs = this.args;
			var sCallback = this._TRAN_CALLBACK_NM;
			
			this.lfnTransaction(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback);
		}
	};
	
	nexacro.TransactionAction.prototype.set_servicemodel = function (v)
	{
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};
	
	nexacro.TransactionAction.prototype.serviceurl = "";
	nexacro.TransactionAction.prototype.set_serviceurl = function (v)
	{
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};
	
	nexacro.TransactionAction.prototype.inputdatasets = "";
	nexacro.TransactionAction.prototype.set_inputdatasets = function (v)
	{
		v = nexacro._toString(v);
		if (this.inputdatasets != v) {
			this.inputdatasets = v;
		}
	};
	
	nexacro.TransactionAction.prototype.outputdatasets = "";
	nexacro.TransactionAction.prototype.set_outputdatasets = function (v)
	{
		v = nexacro._toString(v);
		if (this.outputdatasets != v) {
			this.outputdatasets = v;
		}
	};
	
	nexacro.TransactionAction.prototype.args = "";
	nexacro.TransactionAction.prototype.set_args = function (v)
	{
		v = nexacro._toString(v);
		if (this.args != v) {
			this.args = v;
		}
	};
	
	nexacro.TransactionAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata);
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	nexacro.TransactionAction.prototype.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg);
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.TransactionAction.prototype.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionErrorEventInfo(this, "onerror", sSvcId, nErrorCd, sErrorMsg);
			event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.DsCopyRowDataAction : 공통함수 전환부분
    //===============================================================
	// Transaction
	nexacro.TransactionAction.prototype.lfnTransaction = function(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync)
	{	
		if (this.gfnIsNull(sSvcId) || this.gfnIsNull(sService))
		{
			this.gfnLog("Invalid number of arguments. : lfnTransaction()","error");
			return false;
		}
		
		// callback 함수 기본값 설정
		if (this.gfnIsNull(sCallback)) {
			sCallback = this._TRAN_CALLBACK_NM;
		}
		
		// Async
		if ((bAsync != true) && (bAsync != false)) {
			bAsync = true;	
		}
		
		var objForm = this.gfnGetForm();
		
		// Model Argument 처리 : 해당 데이터셋에 value값 설정
		this.lfnSetModelArgument(objForm);
		
		// User Argument 처리 : transaction Argument로 추가
		var sAddArg = this.lfnSetUserArgument(objForm);
		if (this.gfnIsNull(sAddArg) == false) {
			sArgs = sAddArg + " " + sArgs;
		}
		
		// Log처리용
		var dStartDate = new Date();
		var sStartTime = dStartDate.getTime();
		
		// callback에서 처리할 서비스 정보 저장
		var objSvcId = { 
			svcId		: sSvcId
		  , svcUrl    	: sService
		  , callback	: sCallback
		  , isAsync   	: bAsync
		  , startTime	: sStartTime
		};
		
		//Action Scope에 있는 CallBack 함수가 호출되도록 설정
		objForm.fnTranActionCallback = this.fnTranActionCallback;
		
		// Action정보를 폼에 설정
		if (this.gfnIsNull(objForm.targetTranAction))		objForm.targetTranAction = {};
		objForm.targetTranAction[sSvcId] = this;
		
		// DataSet 생성
		var prjName = nexacro.getApplication().projectName;
		if (objForm._BackendServiceInfo == undefined || objForm._BackendServiceInfo == null)
		{
			objForm._BackendServiceInfo = new Dataset();
			objForm._BackendServiceInfo.set_name("_BackendServiceInfo");
			objForm._BackendServiceInfo.addColumn("name","STRING", "256");
			objForm._BackendServiceInfo.addColumn("project","STRING", "256");
		}
		
		objForm._BackendServiceInfo.clearData();	
		
		objForm._BackendServiceInfo.addRow();
		objForm._BackendServiceInfo.setColumn(0,"name", this.servicemodel);  
		objForm._BackendServiceInfo.setColumn(0,"project", prjName);
		
 		sInDs += ' _BackendServiceInfo=_BackendServiceInfo';
		
		//Transaction 호출
		objForm.transaction(JSON.stringify(objSvcId), sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
	};
	
	// Transaction Callback
	nexacro.TransactionAction.prototype.fnTranActionCallback = function(svcId, nErrorCd, sErrorMsg)
	{
		var objSvcId = JSON.parse(svcId);
		var sSvcId = objSvcId.svcId;
		
		var dEndDate = new Date();
		var nElapseTime = (dEndDate.getTime() - objSvcId.startTime) / 1000;
		
		var objTarget = this.targetTranAction[sSvcId];
		if (objTarget == undefined || objTarget == null)		return;
		
		// Transaction Log
		objTarget.gfnLog("ElapseTime >> " + nElapseTime + ", ErrorCd >> " + nErrorCd + ", ErrorMsg >> " + sErrorMsg);
		
		//ErrorCode가 -1보다 클 경우 onsuccess 이벤트 호출
		if(nErrorCd>-1)
		{
			objTarget.on_fire_onsuccess(sSvcId, nErrorCd, sErrorMsg);
		}
		//ErrorCode가 0보다 작을 경우 onerror 이벤트 호출
		else
		{
			objTarget.on_fire_onerror(sSvcId, nErrorCd, sErrorMsg);
		}
	};
	
	// Model Argument 처리 : 해당 데이터셋에 value값 설정
	nexacro.TransactionAction.prototype.lfnSetModelArgument = function(objForm)
	{
		var oModelList = this.getContents("model");		// Action 내 model 정보 
		
		//this.gfnLog("model >>> ");
		//this.gfnLog(oModelList);
		
		if (!oModelList)
            return;
		
		var sViewId;
		var sModelId;
		var sIOType;
		var oFieldList;
		
		var oModel;
		var oView;
		var oViewDataset;
		var oField;
		
		var nRow;
		var sFieldValue;
		
		for (var i = 0; i < oModelList.length; i++)
        {
			oModel		= oModelList[i];
			
			sViewId		= oModel["viewid"];
			sModelId	= oModel["modelid"];
			sIOType		= oModel["iotype"];
			oFieldList	= oModel["fieldlist"];
			
			// Model이 사용된 View 객체
			oView		= objForm._findComponentForArrange(sViewId);
			
			if (oView)
			{
				oViewDataset = oView.getViewDataset();								// viewdataset
				
				if (oViewDataset == null)		return;
				
				nRow = oViewDataset.rowposition ? oViewDataset.rowposition : 0;		// rowposition
				
				if (oViewDataset && oViewDataset._type_name == "Dataset")
				{
					for (var j = 0; j < oFieldList.length; j++)
					{
						oField = oFieldList[j];
						
						// Field의 value값 반환
						sFieldValue = this.gfnGetFieldValue(oField, oView);
						
						// 데이터 셋팅
						oViewDataset.setColumn(nRow, oField["fieldid"], sFieldValue);
					}
				}
			}
		}
	};
	
	// User Argument 처리 : transaction Argument로 추가
	nexacro.TransactionAction.prototype.lfnSetUserArgument = function(objForm)
	{
		var sReturnValue = "";
		
		var oExtraList = this.getContents("extra");		// Action 내 extra 정보 
		
		//this.gfnLog("extra >>> ");
		//this.gfnLog(oExtraList);
		
		if (!oExtraList)
            return;
		
		var oExtra;
		var sExtraName;
		var sExtraValue;
		
		// oExtraList객체값을 transaction argument 형식으로 변환
		//oExtraList.forEach(oExtra => sReturnValue += " " + oExtra["name"] + "=" + nexacro.wrapQuote(oExtra["value"]));
		for (var i = 0; i < oExtraList.length; i++)
		{
			oExtra = oExtraList[i];
			sExtraName = oExtra["name"];
			
			// Field의 value값 반환
			sExtraValue = this.gfnGetFieldValue(oExtra);
			
			// transaction argument 형식으로 셋팅
			sReturnValue += " " + sExtraName + "=" + nexacro.wrapQuote(sExtraValue);
		}
		
		sReturnValue = sReturnValue.substr(1);
		//this.gfnLog(sReturnValue);
		
		return sReturnValue;
	};
}
