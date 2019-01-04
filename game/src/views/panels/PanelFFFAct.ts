/**
 *
 * @ cyj
 *
 */

class PanelFFFAct extends alien.PanelBase {
    private static _instance: PanelFFFAct;
    public static get instance(): PanelFFFAct {
        if(this._instance == undefined) {
            this._instance = new PanelFFFAct();
        }
        return this._instance;
    }

    constructor() {
        super(
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

    /**
     * 开始游戏
     */
    private playImg:eui.Image;

    protected init(): void {
        this.skinName =  panels.PanelFFF;
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
		PanelFFFAct._instance = null;
	}

    private _initTime():void{
		let fffCfg = GameConfig.getCfgByField("webCfg.fff");
        this["actTimeLabel1"].text = fffCfg.time;
    }

    /**
     * 点击开始游戏
     */
    private _onClickPlayFFF():void{
		PanelActAndNotice.remove();
        let cfg = GameConfig.getCfgByField("drawcard_conf");
        alien.SceneManager.show("SceneFffPlay",{roomInfo:cfg.turn});
    }

    static getInstance():PanelFFFAct{
        return PanelFFFAct.instance;
    }

	public static nullInstance():void{
		let _ins = PanelFFFAct._instance;
		if(_ins ){
			_ins.close(true);
		}
		PanelFFFAct._instance = null;
	}
}