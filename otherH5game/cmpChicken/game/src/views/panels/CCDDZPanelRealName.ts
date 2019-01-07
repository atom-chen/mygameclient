/**
 * zhu 17/12/16
 * 实名认证
 */

class CCDDZPanelRealName extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelRealName;
	public static get instance():CCDDZPanelRealName {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelRealName();
		}
		return this._instance;
	}
	private closeImg:eui.Image;
	/**
	 * 真实姓名
	 */
	private nameInput:eui.TextInput;
	/**
	 * 身份证号
	 */
	private idInput:eui.TextInput;
	private commitBtn:eui.Button;
	protected init():void {
		this.skinName = panels.CCDDZPanelRealName;
	}

	constructor(){
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});
	}

	createChildren():void {
		super.createChildren();
		this.nameInput.prompt = ccddz_namePrompt;
		this.nameInput.maxChars = ccddz_nameLen;
		this.idInput.maxChars = ccddz_idLen;
		this.idInput.prompt = ccddz_idPrompt;
		this.nameInput.inputType = egret.TextFieldInputType.TEXT;
		this.currentState = "act";
		this._initEvent();
	}

	private _initEvent():void{
		this._enableEvent(true);
		this.closeImg["addClickListener"](this._onClickClose,this);
		this.commitBtn["addClickListener"](this._onClickCommitNow,this);
	}
	
	/**
     * 使能事件
     */
    private _enableEvent(bEnable:boolean):void{
        let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
        this[_func](egret.Event.REMOVED_FROM_STAGE,this._onRemoveFromStage,this);
    }

	/**
	 * 校验姓名
	 */
	private  _checkName(bTip:boolean):boolean{
		let _str = this.nameInput.text;
		if(!_str ){
			if(bTip){
				CCDDZToast.show("姓名不能为空");
			}
			return false;
		}
		return true;
	}

	/**
	 * 校验身份证号码
	 */
	private _checkID(bTip:boolean):boolean{
		let _str = this.idInput.text;
		if(!_str){
			if(bTip){
				CCDDZToast.show("身份证号码不能为空");
			}
			return false;
		}else if(_str.length < 18){
			if(bTip){
				CCDDZToast.show("请输入18位身份证号码");
			}
		}
		return true;
	}

	/**
	 * 关闭按钮
	 */
	private _onClickClose():void{
		this.dealAction();
	}

	/**
	 * 点击立即绑定
	 */
	private _onClickCommitNow():void{
		if(!this._checkName(true)) {
			return;
		}else if(!this._checkID(true)){
			return;
		}
		let name = this.nameInput.text;
		let id = this.idInput.text;
		ccddzwebService.postRealNameAuth(name,id,function(response){
			if(response.code == 0){
				CCDDZPanelRealName.nullInstance();
			}
			CCDDZToast.show(response.message);
		})
	}

	/**
	 * 从舞台移除
	 */
	private _onRemoveFromStage():void{
		this._enableEvent(false);
		CCDDZPanelRealName._instance = null;
		//CCDDZEventManager.instance.disableOnObject(this);
	}

	show():void{
		this.currentState = "single";
		this._initEvent();
		this.popup(null,true,{alpha:0})
	}


	public static nullInstance():void{
		let _ins = CCDDZPanelRealName._instance;
		if(_ins ){
			_ins.close(true);
		}
		CCDDZPanelRealName._instance = null;
	}

	/**
	 * 获取实名认证单例
	 */
    public static getInstance(): CCDDZPanelRealName {
        if(!CCDDZPanelRealName._instance) {
            CCDDZPanelRealName._instance = new CCDDZPanelRealName();
        }
        return CCDDZPanelRealName._instance;
    }
}