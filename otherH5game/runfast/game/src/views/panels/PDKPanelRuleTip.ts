/**
 * Created by zhu on 2018/01/31.
 * 规则提示
 */

class PDKPanelRuleTip extends PDKalien.PDKPanelBase {
	private static _instance: PDKPanelRuleTip;
	private close_img: eui.Image;
	private imgRule: eui.Image;
	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, { withFade: false, ease: egret.Ease.backIn });
	}

	init(): void {
		this.skinName = panels.PDKPanelRuleTip;
	}

	createChildren(): void {
		super.createChildren();
		this._initEvent();
	}

	/**
	 * 初始化事件
	 */
	private _initEvent(): void {
		this.close_img["addClickListener"](this._onClickClose, this);
		this._enableEvent(true);
		let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;

		//e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.NATIONAL_INFO_CHANGE,this._updateByGetRewRep,this);
		//pdkServer.addEventListener(PDKEventNames.USER_GET_REWARD_REP, this._onRecvGetActRewRep, this);
		//e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.MY_USER_INFO_UPDATE,this._userinfoUpdate,this);
	}


	/**
	 * 点击关闭
	 */
	private _onClickClose(): void {
		this.dealAction();
	}
	/**
	 * 	加入舞台
	 */
	private _onAddToStage(): void {
		PDKEventManager.instance.enableOnObject(this);
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage(): void {
		this._enableEvent(false);
		PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelRuleTip._instance = null;
	}
	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable: boolean): void {
		let _func = "addEventListener";
		if (!bEnable) {
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	/**
	 * 显示规则提示
	 */
	public show(bTwoGame: boolean = false) {
		// this.imgRule.source = bTwoGame ? 'pdk_two_rule2' : 'pdk_rule';
		this.imgRule.source = ((pdkServer.roomInfo.roomID == 9002 || pdkServer.roomInfo.roomID == 9004 || pdkServer.roomInfo.roomID == 9005) ? 'pdk_rule_new2' : 'pdk_rule_new');
		this.popup();
	}

	/**
	 * 获取规则提示
	 */
	public static getInstance(): PDKPanelRuleTip {
		if (!PDKPanelRuleTip._instance) {
			PDKPanelRuleTip._instance = new PDKPanelRuleTip();
		}
		return PDKPanelRuleTip._instance;
	}

	/**
	 * 移除规则提示
	 */
	public static remove(): void {
		if (PDKPanelRuleTip._instance) {
			PDKPanelRuleTip._instance.close();
		}
	}
}