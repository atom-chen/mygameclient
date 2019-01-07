/**
 *
 * @ cyj
 *
 */

class CCDDZPanelFFFAct extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelFFFAct;
    public static get instance(): CCDDZPanelFFFAct {
        if(this._instance == undefined) {
            this._instance = new CCDDZPanelFFFAct();
        }
        return this._instance;
    }

    constructor() {
        super(
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    /**
     * 开始游戏
     */
    private playImg:eui.Image;

    protected init(): void {
        this.skinName =  panels.CCDDZPanelFFF;
    }

    createChildren(): void {
        super.createChildren();
        this._enableEvent(true);
        this._initTime();
    }


    show(): void {
        this.popup();
    }

	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
		this.playImg[_func](egret.TouchEvent.TOUCH_TAP, this._onClickPlayFFF, this);
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
		CCDDZPanelFFFAct._instance = null;
	}

    private _initTime():void{
		let fffCfg = CCGlobalGameConfig.getCfgByField("webCfg.fff");
        this["actTimeLabel1"].text = fffCfg.time;
    }

    /**
     * 点击开始游戏
     */
    private _onClickPlayFFF():void{
		CCDDZPanelActAndNotice.remove();
        let cfg = CCGlobalGameConfig.getCfgByField("drawcard_conf");
        CCalien.CCDDZSceneManager.show("SceneFffPlay",{roomInfo:cfg.turn});
    }

    static getInstance():CCDDZPanelFFFAct{
        return CCDDZPanelFFFAct.instance;
    }

	public static nullInstance():void{
		let _ins = CCDDZPanelFFFAct._instance;
		if(_ins ){
			_ins.close(true);
		}
		CCDDZPanelFFFAct._instance = null;
	}
}