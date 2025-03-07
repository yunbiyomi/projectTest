//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsDeleteSelectDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsDeleteSelectDataAction)		
{		
    nexacro.DsDeleteSelectDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsDeleteSelectDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsDeleteSelectDataAction);		
    nexacro.DsDeleteSelectDataAction.prototype._type_name = "DsDeleteSelectDataAction";		
	
	//===============================================================		
    // nexacro.DsDeleteSelectDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsDeleteSelectDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsDeleteSelectDataAction : Method		
    //===============================================================		
    nexacro.DsDeleteSelectDataAction.prototype.run = function()		
	{
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();
			var objForm;
			
			var sTarget = this.targetgrid;
			
			var objGrid;
			var objComp;
		
			//If the TargetView is set as View, not Form		
			var objForm = this.gfnGetForm();
			
			// Grid 객체 찾기
			if (sTarget) {				// targetgrid 설정시 해당 그리드
				objComp = objView.form.components[sTarget];
				
				if (objComp instanceof nexacro.Grid) {
					objGrid = objComp;
				} else {
					this.gfnLog("Specify grid component for property value of 'targetgrid'.");
					this.on_fire_onerror();
					return;
				}
			} else {						// targetgrid 미설정시 View에 있는 Grid
				var arrComp = objView.form.components;
				var arrGrid = new Array();
				
				for(var i=0; i< arrComp.length; i++) {
					objComp = arrComp[i];
				
					if (objComp instanceof nexacro.Grid) {
						arrGrid.push(objComp);
					}
				}
				
				if (arrGrid.length == 1) {
					objGrid = arrGrid[0];
				} else {
					objGrid = arrGrid;
				}
				
				if (this.gfnIsNull(objGrid)){
					this.gfnLog("Specify grid component for property value of 'targetgrid'.");
					this.on_fire_onerror();
					return;
				}
			}
			
			// 선택된 행 삭제
			this.gfnDeleteSelectRow(objGrid);	
		}	
	};
	
	nexacro.DsDeleteSelectDataAction.prototype._targetgrid = null;				// 그리드 객체
	nexacro.DsDeleteSelectDataAction.prototype.set_targetgrid = function (v)				
	{				
		// TODO : enter your code here.
		if (v instanceof nexacro.Grid) {
			if (this._targetgrid != v) {			
				this.targetgrid = v.name;
				this._targetgrid = v;
			}		
		} else {
			v = nexacro._toString(v);			
			if (this.targetgrid != v) {
				this.targetgrid = v;
				this._targetgrid = v;			// TODO
			}
		}
	};
	
	//===============================================================		
    // nexacro.DsDeleteSelectDataAction : Event		
    //===============================================================
	nexacro.DsDeleteSelectDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsDeleteSelectDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsDeleteSelectDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsDeleteSelectDataAction : 공통함수 전환부분
    //===============================================================
		/**
	 * @class 선택된 행삭제
	 * @param {Object} objGrid - 삭제 데이터 그리드
	 * @return {Boolean} 삭제 성공실패여부
	 */   
	nexacro.DsDeleteSelectDataAction.prototype.gfnDeleteSelectRow = function (objGrid)
	{
		var objDs;
		var arrDelRow;
		
		objDs = objGrid.getBindDataset();
		
		if (this.gfnIsNull(objDs)){
			this.gfnLog("No bound dataset to Grid.");
			this.on_fire_onerror();
			return;
		}
		
		arrDelRow = objGrid.getSelectedDatasetRows();
		
		if (arrDelRow == -9)
			arrDelRow = [0];
			
		objDs.deleteMultiRows(arrDelRow);
		
		this.on_fire_onsuccess(arrDelRow);
	};
	
}
