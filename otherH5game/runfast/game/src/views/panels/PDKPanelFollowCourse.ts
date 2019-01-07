/**
 *
 * @ cyj
 *
 */

class PDKPanelFollowCourse extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelFollowCourse;
    public static get instance(): PDKPanelFollowCourse {
        if(this._instance == undefined) {
            this._instance = new PDKPanelFollowCourse();
        }
        return this._instance;
    }

    constructor() {
        super(
            PDKalien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            PDKalien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    
    private btnClose: eui.Button;
    /**
     * 复制微信公众号
     */
    private copyWX_img:eui.Image;

    protected init(): void {
        this.skinName =  panels.PDKPanelFollowCourseSkin;
    }

    createChildren(): void {
        super.createChildren();
        this._enableEvent(true);
        //this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseClick,this);
    }

    private playAnimate():void{
        for(var i = 1; i < 7; ++i){
            egret.Tween.get(this['step' + i]).set({
                visible:true,
                alpha:0,
            }).wait((i - 1) * 1200)
            .to({ 
                alpha:1,
            }, 1200);
        }
    }

    private setStepVisible(v:boolean):void{
        for(var i = 1; i < 7; ++i){
            this['step' + i].visible = v;
        }
    }

    private stopAnimate():void{
        for(var i = 1; i < 7; ++i){
            egret.Tween.removeTweens(this['step' + i]);
        }
        this.setStepVisible(true);
    }

    show(): void {
        this.setStepVisible(false);
        // this._callback = this.close;
        this.playAnimate();
        this.popup();
        //this.setStepVisible.bind(this, false)
    }

	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
		this.copyWX_img[_func](egret.TouchEvent.TOUCH_TAP, this._onClickCopyWX, this);
        this.btnClose[_func](egret.TouchEvent.TOUCH_TAP, this._onTouchClose, this);
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
        this.stopAnimate();
		this.dealAction();
	}
	/**
	 * 	加入舞台
	 */
	private _onAddToStage():void{
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
		PDKPanelFollowCourse._instance = null;
	}
    /**
     * 点击复制微信公众号
     */
    private _onClickCopyWX():void{
        PDKGameConfig.copyText(this.parent,"三桂跑得快","公众号(三桂跑得快)");
    }
}