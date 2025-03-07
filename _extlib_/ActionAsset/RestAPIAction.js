//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.RestAPIAction		
// Group : Action		
//==============================================================================		
if (!nexacro.RestAPIAction)		
{		
    nexacro.RestAPIAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.RestAPIAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.RestAPIAction);		
    nexacro.RestAPIAction.prototype._type_name = "RestAPIAction";
	
	//===============================================================
    // nexacro.RestAPIAction : 변수선언 부분
    //===============================================================
	nexacro.RestAPIAction.prototype._oRequestInfo		= {};								// request()용 정보저장 객체
	
	//===============================================================		
    // nexacro.RestAPIAction : Create & Destroy		
    //===============================================================		
    nexacro.RestAPIAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
	
    //===============================================================		
    // nexacro.RestAPIAction : Method		
    //===============================================================		
    nexacro.RestAPIAction.prototype.run = function()		
	{	
        //canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun("userdata")!=false)
		{	
			this.gfnLoadData();
		}
	};
	
	nexacro.RestAPIAction.prototype.set_servicemodel = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};
	
	nexacro.RestAPIAction.prototype.serviceurl = "";
	nexacro.RestAPIAction.prototype.set_serviceurl = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};
	
	nexacro.RestAPIAction.prototype.rootpath = "";
	nexacro.RestAPIAction.prototype.set_rootpath = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		
		if (this.rootpath != v) {
			this.rootpath = v;
		}
	};
	
	nexacro.RestAPIAction.prototype._targetdataset = null;
	nexacro.RestAPIAction.prototype.set_targetdataset = function (v)				
	{				
		if (v instanceof nexacro.NormalDataset) {
			if (this.targetdataset != v.name) {			
				this.targetdataset = v.name;
				this._targetdataset = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			if (this.targetdataset != v) {
				this.targetdataset = v;
				this._targetdataset = null;
				
				var objView = this.getTargetView();	
				if (objView)
				{
					var objForm = objView.form;
					var objDs = objForm._findDataset(v);
					
					if (objDs != undefined) {
						this._targetdataset = objDs;
		 			}
				}
			}
		}
	};
	
	nexacro.RestAPIAction.prototype._targetdataobject = null;
	nexacro.RestAPIAction.prototype.set_targetdataobject = function (v)				
	{				
		if (v instanceof nexacro.DataObject) {
			if (this.targetdataobject != v.name) {			
				this.targetdataobject = v.name;
				this._targetdataobject = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			if (this.targetdataset != v) {
				this.targetdataobject = v;
				this._targetdataobject = null;
			}
		}
	};
	
	nexacro.RestAPIAction.prototype.inputview = "";
	nexacro.RestAPIAction.prototype._inputview = null;
	nexacro.RestAPIAction.prototype.set_inputview = function (v) {
		if (this.inputview !== v) {
			this.inputview = v;
			this._inputview = null;
		}
	};
	
	nexacro.RestAPIAction.prototype._inputdataset = null;
	nexacro.RestAPIAction.prototype.set_inputdataset = function (v)				
	{				
		if (v instanceof nexacro.NormalDataset) {
			if (this.inputdataset != v.name) {			
				this.inputdataset = v.name;
				this._inputdataset = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			if (this.inputdataset != v) {
				this.inputdataset = v;
				this._inputdataset = null;
				
				var objView = this._findViewObject(this.inputview);
				if (objView)
				{
					var objForm = objView.form;
					var objDs = objForm._findDataset(v);
					
					if (objDs != undefined) {
						this._inputdataset = objDs;
		 			}
				}
			}
		}
	};
	
	nexacro.RestAPIAction.prototype.set_methodtype = function (v)				
	{	
		var methodtype_enum = ["get", "post", "put", "delete", "head", "patch"];
		if (v && methodtype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.methodtype != v) {			
			this.methodtype = v;		
		}			
	};
	
	nexacro.RestAPIAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	nexacro.RestAPIAction.prototype.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.RestAPIAction.prototype.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionErrorEventInfo(this, "onerror", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    //  공통함수 전환부분
    //===============================================================
	// Transaction
	nexacro.RestAPIAction.prototype.gfnLoadData = function()
	{
		var sSvcId = this.id;
		var sServiceURL = this.serviceurl;
		var sRootpath = this.rootpath;
		var sMethodType = this.methodtype;
		var sCallback = this._TRAN_CALLBACK_NM;
		var bAsync;
			
		if (this.gfnIsNull(sSvcId))
		{
			this.gfnLog("Invalid number of arguments. : gfnLoadData()","error");
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
		var objView = this.getTargetView();	
		
		
		// ----------------------------------------------------
		// 1) Dataset 객체 찾기(Output)
		// ----------------------------------------------------
		var sTargetDs	= this.targetdataset;
		var objDs		= this._targetdataset;
		
		if (this.gfnIsNull(objDs))			objDs 		= this.gfnGetDataset(objView,sTargetDs);
		
		if (this.gfnIsNull(objDs))
		{
			this.gfnLog("Dataset does not found.","info");
			this.on_fire_onerror("error");
			return;
		}
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 2) DataObject 객체 찾기
		// ----------------------------------------------------
		var sTargetDo = this.targetdataobject;
		var objDo;
		
		// targetdataobject 미설정시 view에 viewdataobject 생성
		if (this.gfnIsNull(sTargetDo))
		{
			sTargetDo = "viewdataobject";
			
			// Form에 DataObject있는지 체크
			var bRet = objForm.isValidObject(sTargetDo);
			
			// Form에 DataObject이 있는 경우 oDataset에 셋팅, 없는 경우 생성 후 셋팅
			if (bRet)
			{
				objDo = objForm.all[sTargetDo];
			}
			else
			{
				//objDo = new DataObject(sTargetDo, objForm);	
				objDo = new DataObject();	
				objForm.addChild(sTargetDo, objDo);
			}
		}
		else
		{
			objDo = objDs._findDataObject(sTargetDo);
		}
		
		if (this.gfnIsNull(objDo))
		{
			this.gfnLog("Dataobject does not found.","info");
			this.on_fire_onerror("error");
			return;
		}
		
		if(this.gfnIsNull(sServiceURL))		sServiceURL = objDo.url;
		if (this.gfnIsNull(sServiceURL))
		{
			this.gfnLog("Service URL does not found.","info");
			this.on_fire_onerror("error");
			return;
		}
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 3) Dataset에 DataObject 정보 설정
		// ----------------------------------------------------
		if(this.gfnIsNull(sRootpath))		sRootpath = "$";
		
		objDs.set_binddataobject(sTargetDo);
		// - dataobjectpath값 설정
		objDs.set_dataobjectpath(sRootpath);
		// - datapath에 @.fieldid 설정
		var objColInfo;
		for (var i = 0; i < objDs.getColCount(); i++) 
		{
			objColInfo = objDs.getColumnInfo(i);
			objColInfo.set_datapath("@."+objColInfo.id);
		}
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 4) Dataset 객체 찾기(Input)
		// ----------------------------------------------------
		var sInputView	= this.inputview;
		var sInputDs	= this.inputdataset;
		var oInputData;
		
		if(!this.gfnIsNull(sInputView) || !this.gfnIsNull(sInputDs))
		{
			var objInputView = this._findViewObject(sInputView);
			var objInputDs	= this._inputdataset;
			
			if (this.gfnIsNull(objInputDs))		objInputDs	= this.gfnGetDataset(objInputView,sInputDs);
			
			if (!this.gfnIsNull(objInputDs))
			{
				oInputData = this.gfnDatasetToJson(objInputDs);
			}
		}
		
		// ----------------------------------------------------
		// 5) Action의 onsuccess, onerror 처리를 위해 이벤트 추가
		// ----------------------------------------------------
		//DataObject 데이터 로딩 성공 시 이벤트는 다음 순서로 발생합니다.
		//request: DataObject.onsuccess -> DataObject.onload -> Dataset.onload
		//load: DataObject.onload -> Dataset.onload

		//request 정보 담을 객체 초기화
		this._oRequestInfo		= {"serviceid":sSvcId, "errorcode" : null, "responsedata" : null};
		
		// DataObjec 이벤트 추가
		//objDo.addEventHandler("onsuccess", this.gfnDataObjectOnsuccess, this);
		objDo.addEventHandler("onload", this.gfnDataObjectOnload, this);
		objDo.addEventHandler("onerror", this.gfnDataObjectOnerror, this);
		
		// Dataset 이벤트 추가
		objDs.insertEventHandler("onload", 0, this.gfnDataSetOnload, this);
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 6) 변수값 설정
		if (!this.gfnIsNull(objDs))			this._targetdataset = objDs;
		if (!this.gfnIsNull(objDo))			this._targetdataobject = objDo;
		if (!this.gfnIsNull(objInputDs))	this._inputdataset = objInputDs;
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 7) DataObject request()실행
		this.gfnCallRestApi(sSvcId, sServiceURL, objDo, oInputData, sMethodType);
		// ----------------------------------------------------
		
		//this.gfnLog("id : " + objDs.id + "/ binddataobject : " + objDs.binddataobject + "/ dataobjectpath : " + objDs.dataobjectpath + "/ " + objDs.saveXML());
	};
	
// 	nexacro.RestAPIAction.prototype.gfnDataObjectOnsuccess = function(obj, e)
// 	{	
// 		this.on_fire_onsuccess(e.serviceid, e.statuscode, e.response);
// 		this.gfnLog(e.serviceid + " / " + e.statuscode + " / " + e.response);
// 	};
	
	nexacro.RestAPIAction.prototype.gfnDataObjectOnload = function(obj, e)
	{
		// request() 정보설정
		this._oRequestInfo["errorcode"] = e.reason;
		this._oRequestInfo["responsedata"] = obj.getResponse();
		
		// 이벤트제거
		obj.addEventHandler("onload", this.gfnDataObjectOnload, this);
		obj.addEventHandler("onerror", this.gfnDataObjectOnerror, this);
	};
	
	nexacro.RestAPIAction.prototype.gfnDataSetOnload = function(obj, e)
	{
		if (this._oRequestInfo["serviceid"] == this.id && e.reason == 0)
		{
			// 이벤트제거
			obj.removeEventHandlerLookup("onload", this.gfnDataSetOnload, this);
			
			// Transaction 처리후 공통처리 함수(프로젝트마다 다른값 처리위해 사용)
			var bRet = this.gfnAfterRestApi(this, oRequestInfo);
			if (!bRet)
			{
				this.gfnLog("gfnAfterRestApi() 오류가 발생했습니다.","info");
				return false;
			}
			
			var oRequestInfo = this._oRequestInfo;
			
			// 이벤트 발생
			this.on_fire_onsuccess(oRequestInfo["serviceid"], oRequestInfo["errorcode"], oRequestInfo["responsedata"]);
		}
		
		// 초기화
		this._oRequestInfo = {};
	};

	nexacro.RestAPIAction.prototype.gfnDataObjectOnerror = function(obj,  e)
	{
		this.on_fire_onerror(this.id,e.statuscode,e.errormsg);
		
		// 이벤트제거
		obj.addEventHandler("onload", this.gfnDataObjectOnload, this);
		obj.addEventHandler("onerror", this.gfnDataObjectOnerror, this);
	};
	
	
	/**
	* Dataset의 내용을 Json 형식으로 변환
	*/
	nexacro.RestAPIAction.prototype.gfnDatasetToJson = function(oDataset)
	{
		if (this.gfnIsNull(oDataset))		return;
		if (oDataset.rowcount == 0)			return;
		
		var oJson;
		
		if (oDataset.rowcount == 1) {
			oJson = this.gfnDatasetToObj(oDataset,0);
		}
		else {
			oJson = new Array();
			
			for(var i=0; i < oDataset.rowcount; i++)
			{
				oJson.push(this.gfnDatasetToObj(oDataset,i));
			}
		}
		
		return oJson;
	};
	
	/**
	* Dataset의 특정 행을 Json 형식으로 변환
	*/
	nexacro.RestAPIAction.prototype.gfnDatasetToObj = function(oDataset, nRow)
	{
		if (this.gfnIsNull(oDataset))		return;
		if (oDataset.rowcount == 0)			return;
		if (this.gfnIsNull(nRow))			nRow = 0;
		
		var i, len, name, value;
		var oObj = {};
		
		for(i = 0, len = oDataset.getColCount(); i < len; i++)
		{
			name = oDataset.getColID(i);
			
			if (this.gfnIsNull(name)) continue;
			
			value = oDataset.getColumn(nRow, name) || "";
			oObj[name] = value;
		}
		
		return oObj;
	};
}