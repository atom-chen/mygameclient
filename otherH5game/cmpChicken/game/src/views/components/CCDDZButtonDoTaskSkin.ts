class CCDDZButtonDoTaskSkin extends eui.Component {
    /**
     * 正常状态的纹理
     */
    private mNormal_img:eui.Image;
    /**
     * 按下状态的纹理
     */
    private mPress_img:eui.Image;

    /**
     * 点击按钮的回调
     */
    private _clickFunc:any;

    /**
     * 正常的纹理名
     */
    private _noraml:any;

    /**
     * 按下的纹理名
     */
    private _press:any;

    constructor() {
        super();
       
    }
    protected createChildren() {
        super.createChildren();
        this._initDefaultUI();
        this._enableEvent(true);
    }

    private _initEvent(bEnable:boolean):void{
        let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this.mNormal_img[_func](egret.TouchEvent.TOUCH_BEGIN, this._onTouchNormalBegin, this);
		this.mNormal_img[_func](egret.TouchEvent.TOUCH_END, this._onTouchNormalEnd, this);
        this.mNormal_img[_func](egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onTouchNormalCancel, this);
		this.mNormal_img[_func](egret.TouchEvent.TOUCH_CANCEL, this._onTouchNormalCancel, this);
    }
    /**
	 * 	加入舞台
	 */
	private _onAddToStage():void{	
		this._initEvent(true);
	}

	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
        this[_func](egret.Event.REMOVED_FROM_STAGE,this._onRemoveFromStage,this);
        this[_func](egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
	}

    /**
     * 显示按下的纹理
     */
    _onTouchNormalBegin():void{
        this.mNormal_img.source = this._press;
    }

    /**
     * 点击结束 显示正常的纹理
     */
    _onTouchNormalEnd():void{
        this.mNormal_img.source = this._noraml;
        if(this._clickFunc){
            this._clickFunc();
        }
    }

    /**
     * 显示正常的纹理
     */
    _onTouchNormalCancel():void{
        this.mNormal_img.source = this._noraml;
    }
    /**
     * 默认UI
     */
    private _initDefaultUI():void{
        this._noraml = this.mNormal_img.source;
        this._press = this.mPress_img.source;
        this.mNormal_img.visible = true;
        this.mPress_img.visible = false;
    }

    /**
     * 从舞台中移除
     */
    private _onRemoveFromStage():void{
        this._enableEvent(false);
        this._initEvent(false);
    }

    /**
     * 设置点击按钮的回调
     */
    public setClickFunc(func:any):void{
        if(func){
            this._clickFunc = func;
        }
    }

    /**
     * 设置按钮的正常纹理和按压时的纹理
     */
    public setPngs(normal:string,press:string){
        this._noraml = normal;
        this._press = press;

        this.mNormal_img.source = this._noraml;
    }

    /**
     * 是否允许点击
     */
    public enableTouch(bEnable:boolean):void{
        this.mNormal_img.touchEnabled = bEnable;
    }
    
    /**
     * 仅设置一个图片，并且禁止点击
     */
    public setOnePngAndForbidTouch(png:string){
        this.mNormal_img.source = png;
        this.enableTouch(false);
    }
}
window["CCDDZButtonDoTaskSkin"]=CCDDZButtonDoTaskSkin;