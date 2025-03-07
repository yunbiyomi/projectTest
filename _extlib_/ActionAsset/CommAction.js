//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.CommAction		
// Group : Action		
//==============================================================================		
if (!nexacro.CommAction)		
{		
    nexacro.CommAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);		
    };		
        		
    nexacro.CommAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.CommAction);		
    nexacro.CommAction.prototype._type_name = "CommAction";		
	
	//===============================================================		
    // nexacro.CommAction : Create & Destroy		
    //===============================================================		
    nexacro.CommAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.CommAction : Method		
    //===============================================================		
    nexacro.CommAction.prototype.run = function()		
	{	
        //TODO		
	};	
}