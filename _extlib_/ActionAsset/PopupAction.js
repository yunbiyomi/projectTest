//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================
// Object : nexacro.PopupAction
// Group : Action
//==============================================================================
if (!nexacro.PopupAction)
{
	nexacro.PopupAction = function(id, parent)
	{
		nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
	};
	
	nexacro.PopupAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.PopupAction);
	nexacro.PopupAction.prototype._type_name = "PopupAction";
	
	//===============================================================
	// nexacro.PopupAction : Create & Destroy
	//===============================================================
	nexacro.PopupAction.prototype.destroy = function()
	{
		nexacro.Action.prototype.destroy.call(this);
	};
	
	//===============================================================
	// nexacro.PopupAction : Method
	//===============================================================
	nexacro.PopupAction.prototype.run = function()
	{
		//canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun("userdata")!=false)
		{
			//TargetView로 설정된 오브젝트 가져오기
			var objView = this.getTargetView();
			
			//팝업 호출시 사용할 Param정보 가져오기
			var sPopupId = this.popupid;
			var sFormUrl = this.formurl;
			var sTitle = this.title;
			var sPopupStyle = this.popupstyle;
			var nLeft = this.popupleft;
			var nTop = this.popuptop;
			var nWidth = this.popupwidth;
			var nHeight = this.popupheight;
			var objArgs = this._args;
		
			if (this.gfnIsNull(sPopupId))
			{
				this.gfnLog("Enter a 'popupid'.","error");
				this.on_fire_onerror("error");
				return;
			}
			if (this.gfnIsNull(sFormUrl))
			{
				this.gfnLog("Select the form you want to pop up.","error");
				this.on_fire_onerror("error");
				return;
			}
			
			var objForm = this.gfnGetForm();
			
			//Action Scope에 있는 CallBack 함수가 호출되도록 설정
			objForm.fnPopupActionCallback = this.fnPopupActionCallback;
			
			// Action정보를 폼에 설정
			if (this.gfnIsNull(objForm.targetPopupAction))		objForm.targetPopupAction = {};
			objForm.targetPopupAction[sPopupId] = this;
			
			// User Argument 처리 : 팝업 Argument로 설정
			objArgs = this.gfnSetUserArgument(objArgs);
			
			objArgs._PUPUP_STYLE = sPopupStyle;
			
			// 팝업 호출
			this.gfnOpenPopup(sPopupStyle, sPopupId, sTitle, sFormUrl, nLeft, nTop, nWidth, nHeight, objArgs, objForm, this._POPUP_CALLBACK);
		}
	};
	
	nexacro.PopupAction.prototype.formurl = "";
	nexacro.PopupAction.prototype.set_formurl = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.formurl != v) {
			this.formurl = v;
		}
	};
	
	nexacro.PopupAction.prototype.popupid = "";
	nexacro.PopupAction.prototype.set_popupid = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.popupid != v) {
			this.popupid = v;
		}
	};
	
	nexacro.PopupAction.prototype.title = "";
	nexacro.PopupAction.prototype.set_title = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.title != v) {
			this.title = v;
		}
	};
	
	nexacro.PopupAction.prototype.popupstyle = "";
	nexacro.PopupAction.prototype.set_popupstyle = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.popupstyle != v) {
			this.popupstyle = v;
		}
	};
	
	nexacro.PopupAction.prototype.popupleft = "";
	nexacro.PopupAction.prototype.set_popupleft = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.popupleft != v) {
			this.popupleft = v;
		}
	};
	
	nexacro.PopupAction.prototype.popuptop = "";
	nexacro.PopupAction.prototype.set_popuptop = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.popuptop != v) {
			this.popuptop = v;
		}
	};
	
	nexacro.PopupAction.prototype.popupwidth = "";
	nexacro.PopupAction.prototype.set_popupwidth = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.popupwidth != v) {
			this.popupwidth = v;
		}
	};
	
	nexacro.PopupAction.prototype.popupheight = "";
	nexacro.PopupAction.prototype.set_popupheight = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.popupheight != v) {
			this.popupheight = v;
		}
	};
		
	nexacro.PopupAction.prototype.args = "";
	nexacro.PopupAction.prototype._args;
	nexacro.PopupAction.prototype.set_args = function (v)
	{
		if (v instanceof Object) {
			this._args = v;
			this.args = null;
		} else {
			// TODO : enter your code here.
			v = nexacro._toString(v);
			if (this.args != v) {
				this.args = v;
				
				if(this.gfnIsNull(this.args)==false)
				{
					this._args = JSON.parse(this.args);
				}
				else
				{
					this._args = null;
				}
			}
		}
	};
	
	nexacro.PopupAction.prototype.set_popupdatatype = function (v)				
	{
		var popupdatatype_enum = ["none","copyrow","adddata","replace"];
		if (v && popupdatatype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.popupdatatype != v) {			
			this.popupdatatype = v;		
		}			
	};
	
	//===============================================================		
    // nexacro.PopupAction : Event		
    //===============================================================
	nexacro.PopupAction.prototype.on_fire_canrun = function (userdata)
	{
		if (this.canrun && this.canrun._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
		
	};
	
	nexacro.PopupAction.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.PopupAction.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.PopupAction : 공통함수 전환부분
    //===============================================================
	nexacro.PopupAction.prototype.gfnOpenPopup = function (sPopupStyle, sPopupId, sTitle, sFormUrl, nLeft, nTop, nWidth, nHeight, objArgs, objForm, sCallback)
	{
		var objApp = nexacro.getApplication();
		
		//부모 Frame 정보 가져오기
		var objOwnerFrame = objForm.getOwnerFrame();
		var sOpenAlignType = "";
		var bAutoSize = false;
		var bTitle = true;
		
		if (this.gfnIsNull(nLeft))nLeft = -1;
		if (this.gfnIsNull(nTop))nTop = -1;
		if (this.gfnIsNull(nWidth)) nWidth = -1;
		if (this.gfnIsNull(nHeight)) nHeight = -1;
		
		// 중복팝업 체크
		var arrPopFrame = nexacro.getPopupFrames();
		if (arrPopFrame[sPopupId]) {	
			if (system.navigatorname == "nexacro") {
				arrPopFrame[sPopupId].setFocus();
			} else {	
				arrPopFrame[sPopupId]._getWindowHandle().focus();
			}
			return;
		}
	
		// 모바일인 경우 팝업사이즈 모두 입력하지 않았을때 full사이즈로 호출되도록 처리
		if (nexacro._getCurrentScreenType() != "desktop")
		{
			//l,t,w,h 모두 기입하지 않으면 full
			if (nLeft == -1 && nTop == -1 && nWidth == -1 && nHeight == -1)
			{
				bAutoSize = false;
				bTitle = false;
				
				if (nWidth == -1 || nWidth > objApp.mainframe.width)
				{	
					nWidth = objApp.mainframe.width;
				}
				
				if (nHeight == -1 || nHeight > nexacro.getApplication().mainframe.height)
				{
					nHeight = objApp.mainframe.height;
				}            
			}
			
			// 런타임 접속시 modal로만 동작되도록 수정(모바일 NRE에서는 open미지원)
			if (system.navigatorname == "nexacro") 
			{
				sPopupStyle = "modal";
			}
		}
		
		if(nLeft == -1 && nTop == -1) 
		{		
			sOpenAlignType = "center middle";
			
			if (system.navigatorname == "nexacro") {
// 				var curX = objApp.mainframe.left;
// 				var curY = objApp.mainframe.top;
				var curX = system.clientToScreenX(objApp.mainframe, 0);
				var curY = system.clientToScreenY(objApp.mainframe, 0);
			}else{
				var curX = window.screenLeft;
				var curY = window.screenTop;
			}
			
			nLeft	= curX + (objApp.mainframe.width / 2) - Math.round(nWidth / 2);
			nTop	= curY + (objApp.mainframe.height / 2) - Math.round(nHeight / 2) ;		
		}else{
			nLeft	=  this.parent.getOffsetLeft() + nLeft;
			nTop	=  this.parent.getOffsetTop() + nTop;
		}
		
		if (nWidth == -1 || nHeight == -1) {
			bAutoSize = true;
		}
			
		//this.gfnLog("nLeft : " + nLeft + " nTop : " + nTop + " nWidth : " + nWidth + " nHeight : " + nHeight);
		
		if(sPopupStyle == "modeless")
		{
			var sOpenStyle= "showtitlebar=true showstatusbar=false showontaskbar=true showcascadetitletext=false resizable=true autosize=" + bAutoSize +" titletext="+sTitle;
			
			nexacro.open(sPopupId, sFormUrl, objOwnerFrame, objArgs, sOpenStyle, nLeft, nTop, nWidth, nHeight, objForm);
		}
		else
		{
			var newChild = new nexacro.ChildFrame;		
			newChild.init(sPopupId, nLeft, nTop, nWidth, nHeight, null, null, sFormUrl);
			
			//newChild.set_dragmovetype("none");
			newChild.set_showtitlebar(bTitle);
			newChild.set_autosize(bAutoSize);	
			newChild.set_resizable(false);			//resizable 안됨
			if(!this.gfnIsNull(sTitle)) newChild.set_titletext(sTitle);
			newChild.set_showstatusbar(false);		//statusbar는 안보임
			newChild.set_openalign(sOpenAlignType);
			
			newChild.showModal(objOwnerFrame, objArgs, objForm, sCallback, true);
		}
	};
	
	// PopupCallback 함수
	nexacro.PopupAction.prototype.fnPopupActionCallback = function(sId, sParam)
	{
		var objTarget = this.targetPopupAction[sId];
		if (objTarget == undefined || objTarget == null)		return;
		
		objTarget.gfnSetPopupReturn(sParam);
	};
	
	// 리턴값 설정
	nexacro.PopupAction.prototype.gfnSetPopupReturn = function(sParam)
	{
		var sPopupDataType = this.popupdatatype;
		var oTargetView = this.getTargetView();
		
		// 리턴 데이터 처리
		if (!this.gfnIsNull(oTargetView) && !this.gfnIsNull(sParam) 
			&& !this.gfnIsNull(sPopupDataType) && sPopupDataType != "none")
		{
			var objDs = oTargetView.getViewDataset();
			
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Cannot find the viewdataset.","info");
				this.on_fire_onerror();
				return;
			}
			
			// 팝업 리턴데이터용 데이터셋
			var oForm = oTargetView.form;
			var sParamDsId = "dsPopupParam";
			var objParam = JSON.parse(sParam);
			var objParamDs = this.gfnGetDataset(oTargetView,sParamDsId);
			var nARow;
			
			if (this.gfnIsNull(objParamDs))
			{
				objParamDs = new nexacro.NormalDataset(sParamDsId, oForm);
			}
			
			objParamDs.loadXML(objParam.dataset);
			
			// 모델정보에 따라 복사할 컬럼값 설정
			var strColInfo = this.gfnSetModelArgument(oTargetView);
			
			if (sPopupDataType == "copyrow")										// 0번째 데이터만 복사
			{
				objDs.copyRow(objDs.rowposition,objParamDs,0,strColInfo);
			}
			else if (sPopupDataType == "adddata" || sPopupDataType == "replace")	// 모든 데이터 복사
			{
				objDs.set_enableevent(false);
				
				// replace 인 경우 기존 데이터 삭제
				if (sPopupDataType == "replace")
				{
					objDs.clearData();
				}
				
				// 모든 데이터 복사
				for(i=0; i< objParamDs.rowcount; i++)
				{
					nARow = objDs.addRow();
					objDs.copyRow(nARow,objParamDs,i,strColInfo);
				}
				
				objDs.set_enableevent(true);
			}
		}
		
		this.on_fire_onsuccess(sParam);
	};
	
	// Model Argument 처리 : 설정된 모델정보만 복사
	nexacro.PopupAction.prototype.gfnSetModelArgument = function(oTargetView)
	{
		var strColInfo = "";
		
		// Model Argument 있는지 확인
		var oModelList = this.getContents("model");		// Action 내 model 정보 
		
		// 설정한 Model Argument가 있는 경우 복사할 컬럼정보설정
		if (oModelList)
		{
			var arrColInfo = new Array();
			var oFieldList;
			
			// targetview에 해당하는 Model Argument만 처리
			var oModel = oModelList.find(oModel => oModel["viewid"] = oTargetView.id);
			
			// fieldlist정보로 strColInfo 설정 : "fieldid1=value1,fieldid2=value2" 형식
			if (oModel)
			{
				oFieldList	= oModel["fieldlist"];
				oFieldList.forEach(oField => arrColInfo.push(oField["fieldid"] + "=" + oField["value"]));
				strColInfo = arrColInfo.join(",");
			}
		}
		
		return strColInfo;
	};
	
	// User Argument 처리 : 팝업 Argument로 설정
	nexacro.PopupAction.prototype.gfnSetUserArgument = function(objArgs)
	{
		if (this.gfnIsNull(objArgs)) {
			objArgs = {};
		}
			
		var oExtraList = this.getContents("extra");		// Action 내 extra 정보 
		
		if (!oExtraList)		return objArgs;
		
		for (var i = 0; i < oExtraList.length; i++)
		{
			oExtra = oExtraList[i];
			sExtraName = oExtra["name"];
			
			// Field의 value값 반환
			sExtraValue = this.gfnGetFieldValue(oExtra);
			
			// 데이터 셋팅
			objArgs[sExtraName] = sExtraValue;
		}
		
		return objArgs;
	};
}