//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsDeleteCheckedDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsDeleteCheckedDataAction)		
{		
    nexacro.DsDeleteCheckedDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsDeleteCheckedDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsDeleteCheckedDataAction);		
    nexacro.DsDeleteCheckedDataAction.prototype._type_name = "DsDeleteCheckedDataAction";		
	
	//===============================================================		
    // nexacro.DsDeleteCheckedDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsDeleteCheckedDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsDeleteCheckedDataAction : Method		
    //===============================================================		
    nexacro.DsDeleteCheckedDataAction.prototype.run = function()		
	{	
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			var objForm;
			
			var sTargetDs = this.targetdataset;
			var sCheckColumnId = this.checkcolumnid;
			
			var objDataset;
			var objComp;
			var objDs = this._targetdataset;
			
			if (this.gfnIsNull(objDs))	objDs 	= this.gfnGetDataset(objView,sTargetDs);
			
			// 데이터셋이 지정되지 않은 경우 error
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			// 컬럼이 지정되지 않은 경우 error
			if (this.gfnIsNull(sCheckColumnId))
			{
				this.gfnLog("Specify a value for 'checkcolumnid'.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			
 			// Call Function
 			var rtn = this.gfnDeletCheckedeRow(objDs,sCheckColumnId);
			
			if(rtn.length > 0)
			{
				this.on_fire_onsuccess(rtn);
			}
		}
	};
	
	nexacro.DsDeleteCheckedDataAction.prototype._targetdataset = null;
	nexacro.DsDeleteCheckedDataAction.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DsDeleteCheckedDataAction.prototype.checkcolumnid = "";
	nexacro.DsDeleteCheckedDataAction.prototype.set_checkcolumnid = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.checkcolumnid != v) {
			this.checkcolumnid = v;
		}
	};
	
	//===============================================================		
    // nexacro.DsDeleteCheckedDataAction : Event		
    //===============================================================
	nexacro.DsDeleteCheckedDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsDeleteCheckedDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsDeleteCheckedDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsDeleteCheckedDataAction : 공통함수 전환부분
    //===============================================================
		/**
	 * @class dataSet에 행삭제
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @param {Number} nRowIndex - 필터된 데이터 체크여부(기본값:false)
	 * @return {Boolean} 삭제 성공실패여부
	 */   
	nexacro.DsDeleteCheckedDataAction.prototype.gfnDeletCheckedeRow = function (objDs,sCheckColumnId)
	{
		// 삭제된 row Array
		var arrDelRow = new Array();
		
		// 선택된 자료가 없습니다.
		if (objDs.getCaseCount(sCheckColumnId + "== true ||" + sCheckColumnId + "==1") == 0) {
			this.gfnLog("No Selected data.","info");
			this.on_fire_onerror();
			return arrDelRow;
		}
		
		// 행삭제
		objDs.set_enableevent(false);
		for(var i=objDs.rowcount-1; i>=0; i--) {
			if (objDs.getColumn(i,sCheckColumnId) == true || objDs.getColumn(i,sCheckColumnId) == 1) {
				arrDelRow.unshift(i);
				objDs.deleteRow(i);
			}
		}
		objDs.set_enableevent(true);
	
		return arrDelRow;
	};
}