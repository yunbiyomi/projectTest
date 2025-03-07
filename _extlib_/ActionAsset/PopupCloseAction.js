﻿//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.PopupCloseAction		
// Group : Action		
//==============================================================================		
if (!nexacro.PopupCloseAction)		
{		
    nexacro.PopupCloseAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };
        		
    nexacro.PopupCloseAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.PopupCloseAction);		
    nexacro.PopupCloseAction.prototype._type_name = "PopupCloseAction";
	
	//===============================================================		
    // nexacro.PopupCloseAction : Create & Destroy		
    //===============================================================		
    nexacro.PopupCloseAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.PopupCloseAction : Method		
    //===============================================================		
    nexacro.PopupCloseAction.prototype.run = function()		
	{			

		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			var objForm = this.gfnGetForm();
			
			var sTargetDs = this.targetdataset;
			var sReturnType = this.returntype;
				
			var objDataset;
			var objComp;
			var oRet = {};
			var sRet = "";
			var sXML = "";
			
			if (sReturnType != "none")
			{
				var oRetParam = this._returnparam;
				
				var objDs = this._targetdataset;
			
				if (this.gfnIsNull(objDs))		objDs 	= this.gfnGetDataset(objView,sTargetDs);
				
				if (this.gfnIsNull(objDs))
				{
					this.gfnLog("Dataset does not found.","info");
					this.on_fire_onerror("error");
					return;
				}
				
				// 데이터 정보
				if (sReturnType == "currow")		// currow : 현재 위치한 행 반환
				{
					if (objDs.rowposition < 0) {
						this.gfnLog("No data is selected.", "info");
						this.on_fire_onerror(-100);
						return;
					}
					
					var objChkDs = objDs.createDataset("dataset", this.gfnGetDatasetCols(objDs),"currow==" + objDs.rowposition);
					
					if (!this.gfnIsNull(objChkDs))		sXML = objChkDs.saveXML();
					
					oRet = {
						  dataset	: sXML
					};
				}
				else if (sReturnType == "alldata")		// alldata : 데이터셋 전체 데이터
				{
					oRet = {
						  dataset	: objDs.saveXML("dataset")
					};
				}
				else if (sReturnType == "changedata")	// changedata : 변경된 데이터
				{
					oRet = {
						  dataset	: objDs.saveXML("dataset","U")
					};
				}
				
				// 리턴값을 String으로 변경
				sRet = JSON.stringify(oRet);
			}
			
			var objChildFrame	= objForm.getOwnerFrame();
			var objChildForm	= objChildFrame.form;
			
			var sPopupStyle = objChildFrame["_PUPUP_STYLE"];
			
			// 팝업이 modeless 일때
			if (sPopupStyle == "modeless") {
				
				var oOpener			= objChildForm.opener;
				var sAction			= oOpener.targetPopupAction[objChildFrame.id];
				
				sAction.gfnSetPopupReturn(sRet);
			}
			
			// 팝업창 닫기
			if (!this.gfnIsNull(objChildForm.opener))
			{
				objChildForm.close(sRet);
			}
		}		
	};
	
	nexacro.PopupCloseAction.prototype._targetdataset = null;
	nexacro.PopupCloseAction.prototype.set_targetdataset = function (v)				
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
	
	nexacro.PopupCloseAction.prototype.set_returntype = function (v)				
	{
		var returntype_enum = ["none", "currow", "changedata", "alldata"];
		if (v && returntype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.returntype != v) {			
			this.returntype = v;		
		}			
	};
	
	//===============================================================		
    // nexacro.PopupCloseAction : Event		
    //===============================================================
	nexacro.PopupCloseAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionRunEventInfo 생성
		  var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
		  
		  //true/false 리턴값을 받기 위해 _fireCheckEvent 함수 실행
		  return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
	};
	
	nexacro.PopupCloseAction.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionSuccessEventInfo 생성
		  var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	  
	nexacro.PopupCloseAction.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionErrorEventInfo 생성
		  var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.PopupCloseAction : 공통함수 전환부분
    //===============================================================
	/**
	 * dataset의 Column명을 배열로 반환
	 * @param {dataset} 대상 Dataset
	 * @return {Array} 컬럼명 배열
	 */
	nexacro.PopupCloseAction.prototype.gfnGetDatasetCols = function(ds)
	{
		var arrCol = new Array();
		var name;
		
		for(i = 0, len = ds.getColCount(); i < len; i++)
		{
			name = ds.getColID(i);
			
			arrCol.push(name);
		}
		
		return arrCol;
	};
}
