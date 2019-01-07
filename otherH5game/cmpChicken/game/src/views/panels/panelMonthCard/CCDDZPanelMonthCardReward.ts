/**
 * Created by angleqqs on 18/6/20.
 *
 * 月卡面板
 */

class CCDDZPanelMonthCardReward extends CCalien.CCDDZPanelBase {

	private static _instance: CCDDZPanelMonthCardReward;

	public static get instance(): CCDDZPanelMonthCardReward {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelMonthCardReward();
		}
		return this._instance;
	}

	protected init(): void {
		this.skinName = panels.CCDDZPanelMonthCardRewardSkin;
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, { withFade: true, ease: egret.Ease.backIn });
		this["addEventListener"](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

	createChildren(): void {
		super.createChildren();
	}

	private _enableEvent(bEnable: boolean): void {
		let _func = "addEventListener";
		if (!bEnable) {
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this["btnClose"][_func](egret.TouchEvent.TOUCH_TAP, this._onClickClose, this);
		this["btnGet"]["addClickListener"](this._onClickGet, this);
	}

	private _onAddToStage(): void {
		this._enableEvent(true);
	}

	private _onRemovedToStage(): void {
		this._enableEvent(false);
		this["removeEventListener"](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
		CCDDZPanelMonthCardReward._instance = null;
	}

	show(): void {
		this.popup(this.dealAction.bind(this));
		this._refreshMonthCardInfo();
	}

	private _onClickClose(evt: egret.TouchEvent): void {
		this.close();
	}

    /**
	 * 领取
	 */
	private _onClickGet(monthType: number): void {
		let data = { optype: 11 };
		ccserver.send(CCGlobalEventNames.USER_GET_REWARD_REQ, data);
		this.close();
	}

	public _refreshMonthCardInfo(): void {
		if (!CCDDZPanelMonthCardReward._instance) return;
		let monthCard2RevivalUseTime = (CCDDZMainLogic.instance.selfData["monthcardinfo"][4] == 0 ? 0 : CCDDZMainLogic.instance.selfData["monthcardinfo"][4] * 1000);
		let monthCard2EndTime = (CCDDZMainLogic.instance.selfData["monthcardinfo"][2] == 0 ? 0 : CCDDZMainLogic.instance.selfData["monthcardinfo"][2] * 1000);
		let nowTime = ccserver.getServerStamp();
		let diffDay = Math.ceil(CCDDZUtils.getTimeStampDiff(nowTime, monthCard2EndTime, "day"));

		let _str = "剩余<font color='0xE10000'>" + diffDay + "次</font>领奖机会，剩余<font color='0xE10000'>" + (diffDay * 10) + "颗</font>未领取！";
		let _textFlow = (new egret.HtmlTextParser).parser(_str);
		this["lblDes"].textFlow = _textFlow
	}
}