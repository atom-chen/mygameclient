/**
 * Created by zhu on 2018/01/31.
 * 规则提示
 */

class RunFastPanelRuleTip extends alien.PanelBase {
	private static _instance: RunFastPanelRuleTip;
	private close_img: eui.Image;
	private imgRule: eui.Image;
	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, { withFade: false, ease: egret.Ease.backIn });
	}

	init(): void {
		this.skinName = panels.RunFastPanelRuleTipSkin;
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
		let e: alien.EventManager = alien.EventManager.instance;

		//e.registerOnObject(this,alien.Dispatcher,PDKEventNames.NATIONAL_INFO_CHANGE,this._updateByGetRewRep,this);
		//server.addEventListener(PDKEventNames.USER_GET_REWARD_REP, this._onRecvGetActRewRep, this);
		//e.registerOnObject(this,alien.Dispatcher,PDKEventNames.MY_USER_INFO_UPDATE,this._userinfoUpdate,this);
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
		EventManager.instance.enableOnObject(this);
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage(): void {
		this._enableEvent(false);
		alien.EventManager.instance.disableOnObject(this);
		RunFastPanelRuleTip._instance = null;
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
	public show(_gametype: number = 0) {
		// _gametype 0-普通  1-2人 2-比赛
		// this.imgRule.source = bTwoGame ? 'pdk_two_rule2' : 'pdk_rule';
		let _imgsrc = "pdk_rule_match";
		switch (_gametype) {
			case 0:
				_imgsrc = "pdk_rule_match"
				break;
			case 1:
				_imgsrc = "pdk_rule_match"
				break;
			case 2:
				_imgsrc = "pdk_rule_match"
				break;
			default:
				_imgsrc = "pdk_rule_match"
				break;
		}
		this.imgRule.source = _imgsrc;
		this.popup();
	}

	/**
	 * 获取规则提示
	 */
	public static getInstance(): RunFastPanelRuleTip {
		if (!RunFastPanelRuleTip._instance) {
			RunFastPanelRuleTip._instance = new RunFastPanelRuleTip();
		}
		return RunFastPanelRuleTip._instance;
	}

	/**
	 * 移除规则提示
	 */
	public static remove(): void {
		if (RunFastPanelRuleTip._instance) {
			RunFastPanelRuleTip._instance.close();
		}
	}
}