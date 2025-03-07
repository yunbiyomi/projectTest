//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsSetFirstCdAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsSetFirstCdAction)		
{		
    nexacro.DsSetFirstCdAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };
	
	  		
    nexacro.DsSetFirstCdAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsSetFirstCdAction);		
    nexacro.DsSetFirstCdAction.prototype._type_name = "DsSetFirstCdAction";		
	
	//===============================================================		
    // nexacro.DsSetFirstCdAction : Create & Destroy		
    //===============================================================		
    nexacro.DsSetFirstCdAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsSetFirstCdAction : Method		
    //===============================================================		
    nexacro.DsSetFirstCdAction.prototype.run = function()		
	{	
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			//Import the object set as TargetView			
			var objView 		= this.getTargetView();
			var objForm;
			
			var sTarget			= this.targetcomp;
			var nCell			= this.gridcell;
			var sFirstName		= this.firstname;
			var sFirstCode		= this.firstcode;
			var sFirstCodeCol	= this.firstcodecol;
			var sFirstNameCol	= this.firstnamecol;
			var nInitIndex		= this.initindex;
			
			var objDs;
			var objComp = this._targetcomp;
			
			if (this.gfnIsNull(objComp))	objComp 	= this.gfnGetTargetComp(sTarget);
			if (this.gfnIsNull(objComp))	objComp 	= this.gfnGetDataset(objView,sTarget);
			
			if (this.gfnIsNull(objComp))
			{
				this.gfnLog("targetcomp does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var rtn = this.gfnSetFirstCd(objComp, nCell, sFirstName, sFirstCode, sFirstNameCol, sFirstCodeCol, nInitIndex);
			
			if(rtn==true)
			{
				this.on_fire_onsuccess(true);
			}else
			{
				this.on_fire_onerror(rtn);
			}
		}	
	};	
	
	nexacro.DsSetFirstCdAction.prototype._targetcomp = null;				// 객체
	nexacro.DsSetFirstCdAction.prototype.set_targetcomp = function (v)				
	{
		// TODO : enter your code here.
		if (v instanceof nexacro.NormalDataset
			|| v instanceof nexacro.Combo
			|| v instanceof nexacro.Radio
			|| v instanceof nexacro.Grid) {
			if (this.targetcomp != v.name) {			
				this.targetcomp = v.name;
				this._targetcomp = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			if (this.targetcomp != v) {			
				this.targetcomp = v;
				this._targetcomp = null;
			}
		}
	};
	
	nexacro.DsSetFirstCdAction.prototype.gridcell = -1;
	nexacro.DsSetFirstCdAction.prototype.set_gridcell = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.gridcell != v) {
			this.gridcell = v;
		}
	};
	
	nexacro.DsSetFirstCdAction.prototype.firstname = "";
	nexacro.DsSetFirstCdAction.prototype.set_firstname = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.firstname != v) {
			this.firstname = v;
		}
	};
	
	nexacro.DsSetFirstCdAction.prototype.firstcode = "";
	nexacro.DsSetFirstCdAction.prototype.set_firstcode = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.firstcode != v) {
			this.firstcode = v;
		}
	};
	
	nexacro.DsSetFirstCdAction.prototype.firstcodecol = "";
	nexacro.DsSetFirstCdAction.prototype.set_firstcodecol = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.firstcodecol != v) {
			this.firstcodecol = v;
		}
	};
	
	nexacro.DsSetFirstCdAction.prototype.firstnamecol = "";
	nexacro.DsSetFirstCdAction.prototype.set_firstnamecol = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.firstnamecol != v) {
			this.firstnamecol = v;
		}
	};
	
	nexacro.DsSetFirstCdAction.prototype.initindex = -1;
	nexacro.DsSetFirstCdAction.prototype.set_initindex = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.initindex != v) {
			this.initindex = v;
		}
	};
	
	//===============================================================		
    // nexacro.DsSetFirstCdAction : Event		
    //===============================================================
	nexacro.DsSetFirstCdAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsSetFirstCdAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsSetFirstCdAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsSetFirstCdAction : 공통함수 전환부분
    //===============================================================
	/**
	 * @class 첫번째 Row에 데이터 추가(콤보용)
	 * @param {Object}	objComp 		: 적용할 객체(Dataset/Combo/Radio). Combo 선택시 첫번째 index 자동설정
	 * @param {Number}	nGridCell 		: 데이터 추가 후 Index 셋팅할 값
	 * @param {String}	sFirstNm 		: 첫번째 Row에 추가할 값 ex) 전체
	 * @param {String}	sFirstCd 		: 첫번째 Row에 추가할 CD값. ex) 00
	 * @param {String}	sFirstNmCol 	: 첫번째 Row에 추가할 값 컬럼ID. (기본값:Combo의 경우 codecolumn값 사용. Dataset은 "COMN_CD")
	 * @param {String}	sFirstCdCol 	: 첫번째 Row에 추가할 CD값  컬럼ID. (기본값:Combo의 경우 datacolumn값 사용. Dataset은 "COMN_CD_NM")
	 * @param {Number}	nInitIndex 		: 데이터 추가 후 Index 셋팅할 값
	 * @return N/A
	 */
	nexacro.DsSetFirstCdAction.prototype.gfnSetFirstCd = function(objComp, nGridCell, sFirstNm, sFirstCd, sFirstNmCol, sFirstCdCol, nInitIndex) 
	{
		var objDs;		// 대상 데이터셋
		var objSetComp;		// 대상 콤보
		
		var sCodeCol = sFirstCdCol;
		var sDataCol = sFirstNmCol;
		
		var obj = objComp;
		
		if( obj instanceof nexacro.Combo 
			|| obj instanceof nexacro.Radio ){		//obj 가 콤보일경우
			objDs = obj.getInnerDataset();
			objSetComp = obj;
			
			if(this.gfnIsNull(sCodeCol)) {
				sCodeCol = objSetComp.codecolumn;
			}
			
			if(this.gfnIsNull(sDataCol)) {
				sDataCol = objSetComp.datacolumn;
			}
			
		} else if( obj instanceof Grid){		//obj 가 그리드인 경우
			nGridCell = nexacro.toNumber(nGridCell,-1);
			if (nGridCell < 0) {
				this.gfnLog("Please check the 'gridcell' value.","info");
				return false;
			}
			
			var sInnerdataset = obj.getCellProperty("Body", nGridCell, "combodataset");
			sInnerdataset = sInnerdataset.replace("@", "");
			
			objDs = obj.parent._findDataset(sInnerdataset);
			objSetComp = null;
			
			if(this.gfnIsNull(sCodeCol)) {
				sCodeCol = obj.getCellProperty("Body", nGridCell, "combocodecol");
			}
			
			if(this.gfnIsNull(sDataCol)) {
				sDataCol = obj.getCellProperty("Body", nGridCell, "combodatacol");
			}
		} else if( obj instanceof Dataset){		//obj 가 데이터셋일경우
			objDs = obj;
			objSetComp = null;
		}
		
		if(this.gfnIsNull(sCodeCol)) {
			sCodeCol = this._COM_CODE_COL;
		}
		
		if(this.gfnIsNull(sDataCol)) {
			sDataCol = this._COM_NAME_COL;
		}
		
		if(this.gfnIsNull(objDs))
		{	
			this.gfnLog("Cannot find the dataset.","info");
			return false;
		}
		
		// first set 세팅
		if(this.gfnIsNull(sCodeCol) == false && this.gfnIsNull(sDataCol) == false)
		{
			objDs.insertRow(0);
			if(sFirstCd == "")
			{
				objDs.setColumn(0, sCodeCol, "");
			}
			else
			{
				objDs.setColumn(0, sCodeCol, sFirstCd);
			}
			
			objDs.setColumn(0, sDataCol, sFirstNm);
		}
		
		// 인덱스 설정
		if( this.gfnIsNull(objSetComp) == false 
			&& nInitIndex >= 0){
			objSetComp.set_index(nInitIndex);
		}
		
		return true;
	};
}
