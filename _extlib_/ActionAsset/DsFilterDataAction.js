//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsFilterDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsFilterDataAction)		
{		
    nexacro.DsFilterDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsFilterDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsFilterDataAction);		
    nexacro.DsFilterDataAction.prototype._type_name = "DsFilterDataAction";		
	
	//===============================================================		
    // nexacro.DsFilterDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsFilterDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsFilterDataAction : Method		
    //===============================================================		
    nexacro.DsFilterDataAction.prototype.run = function()		
	{	
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView = this.getTargetView();	
			var sTargetDs = this.targetdataset;
			var sFilter = this.filter;
			var nInitRowPosition = this.initrowposition;
		
			var objDs 	= this._targetdataset;
			
			if (this.gfnIsNull(objDs))	objDs 	= this.gfnGetDataset(objView,sTargetDs);
			
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var rtn = this.gfnFilterData(objView, objDs, sFilter, nInitRowPosition);
			
			if(rtn==0)
			{
				this.on_fire_onerror();
			}
			else
			{
				this.on_fire_onsuccess(rtn);
			}
		}
	};
	
	nexacro.DsFilterDataAction.prototype._targetdataset = null;
	nexacro.DsFilterDataAction.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DsFilterDataAction.prototype.filter = "";
	nexacro.DsFilterDataAction.prototype.set_filter = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.filter != v) {
			this.filter = v;
		}
	};
	
	nexacro.DsFilterDataAction.prototype.set_initrowposition = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.initrowposition != v) {
			this.initrowposition = v;
		}
	};
	
	//===============================================================		
    // nexacro.DsFilterDataAction : Event		
    //===============================================================
	nexacro.DsFilterDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsFilterDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsFilterDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsFilterDataAction : 공통함수 전환부분
    //===============================================================
	/**
	 * @class 데이터를 필터
	 * @param {Object} objDs - 필터 될 Dataset
	 * @param {String} sFilter - 필터 String
	 * @return N/A
	 */   
	nexacro.DsFilterDataAction.prototype.gfnFilterData = function (objView, objDs, sFilter, nInitRowPosition)
	{
		var sFilterStr = "";
		var sFilterModel = "";
		
		objDs.set_enableevent(false);
		
		// Filter 문자열 처리
		if (!this.gfnIsNull(sFilter))
		{
			var sViewNm = objView ? objView.name : "";
			
			sFilterStr = this.gfnGetFieldValue(sFilter, sViewNm, false, "this.parent.parent.parent");
		}
		
		// Model Argument로 Filter문자열 생성
		sFilterModel = this.gfnSetModelArgument(objDs);
		
		if (!this.gfnIsNull(sFilterModel))
		{
			sFilterStr += (this.gfnIsNull(sFilterStr) ? "" : " && ") + sFilterModel;
		}
		
		// Filter값 초기화(Filter값이 설정되지 않은 경우 기존 Filter값 초기화 하기위해...)
		objDs.filter("");
		
		// Filter값이 있는 경우 Filter
		if (!this.gfnIsNull(sFilterStr))
		{
			objDs.filter(sFilterStr);
		}
		
		objDs.set_enableevent(true);
		
		// Filter 후 rowposition 초기화
		if (!this.gfnIsNull(nInitRowPosition) 
			&& objDs.rowcount > nexacro.toNumber(nInitRowPosition,objDs.rowcount))
		{
			objDs.set_rowposition(nInitRowPosition);
		}
	};
	
	// Model Argument 처리 : 해당 데이터셋이 value값인 데이터 Filter 설정(viewdataset용)
	nexacro.DsFilterDataAction.prototype.gfnSetModelArgument = function(objDs)
	{
		if (!objDs)							return "";
		
		var sFilterModel = "";
		
		var oModelList = this.getContents("model");		// Action 내 model 정보 
		
		if (oModelList)
		{
			var oParent = objDs.parent.parent;
			
			if(oParent instanceof nexacro.View)
			{
				// targetview에 해당하는 Model Argument만 처리
				var oModel = oModelList.find(oModel => oModel["viewid"] = oParent.id);
				
				var arrFilter = new Array();
				var oFieldList = oModel["fieldlist"];
				var oField;
				var sFieldValue;
				
				// 컬럼 셋팅
				for (var j = 0; j < oFieldList.length; j++)
				{
					oField = oFieldList[j];
					
					// Field의 value값 반환
					sFieldValue = this.gfnGetFieldValue(oField, oParent, false, "this.parent.parent.parent");
					
					// Filter 값 셋팅
					arrFilter.push(oField["fieldid"] + "==" + sFieldValue);
				}
				
				sFilterModel = arrFilter.join(" && ");
			}
		}
		
		return sFilterModel;
	};
}