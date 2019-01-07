/**
 * Created by zhu on 2017/11/09.
 * 比赛复活面板
 */

class PDKPanelMatchRevive extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelMatchRevive;

	/**
	 * 关闭按钮
	 */
	private closeImg:eui.Image;

	/**
	 * 复活按钮
	 */
	private reviveImg:eui.Image;

	/**
	 * 放弃按钮
	 */
	private giveUpImg:eui.Image;

	/**
	 * 倒计时label
	 */
	private reviveLabel:eui.Label;

	/**
	 * 差多少名晋级
	 */
	private rankLabel:eui.Label;
	
	/**
	 * 复活的花费
	 */
	private costLabel:eui.BitmapLabel;


	/**
	 * 点击放弃后的回调
	 */
	private _giveUpFunc:Function;

	/**
	 * 点击复活后的回调
	 */
	private _reviveFunc:Function;

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.PDKPanelMatchRevive;
	}
	
	createChildren():void {
		super.createChildren();
		this._initEvent();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.closeImg["addClickListener"](this._onTouchClose, this);
		this.reviveImg["addClickListener"](this._onClickReviveImg,this);
		this.giveUpImg["addClickListener"](this._onClickGiveUpImg,this);
	}

	/**
	 * 点击复活按钮 
	 */
	private _onClickReviveImg():void{
		if(this._reviveFunc){
			this._reviveFunc();
		}
	}
	/**
	 * 点击放弃按钮
	 */
	private _onClickGiveUpImg():void{
		if(this._giveUpFunc){
			this._giveUpFunc();
		}
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelMatchRevive._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	/**
	 * 更新倒计时
	 */
	public updateCountDown(_n:number):void{
		this.reviveLabel.text = "("+_n+")";
	}

	/**
	 * 设置差多少名晋级
	 */
	public setRankSub(_n:number):void{
		this.rankLabel.text = "" + _n;
	}
	
	/**
	 * 设置复活的花费 
	 */
	public setReviveCost(_n:number):void{
		this.costLabel.text = "" + _n;
	}

	/**
	 * 显示11面板
	 */
	public show(reviveFunc:any,giveUpFunc:any):void{
		this._giveUpFunc = giveUpFunc;
		this._reviveFunc = reviveFunc;
		this.popup(null,true,{alpha:0});
	}
	
	/**
	 * 获取复活单例
	 */
    public static getInstance(): PDKPanelMatchRevive {
        if(!PDKPanelMatchRevive._instance) {
            PDKPanelMatchRevive._instance = new PDKPanelMatchRevive();
        }
        return PDKPanelMatchRevive._instance;
    }

	/**
	 * 移除复活面板
	 */
	public static remove():void{
		if(PDKPanelMatchRevive._instance){
			PDKPanelMatchRevive._instance.close();
		}
	}
}