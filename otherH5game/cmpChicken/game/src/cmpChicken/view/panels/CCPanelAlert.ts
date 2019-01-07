/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过CCDDZAlert.show()来调用
 */

class CCPanelAlert extends CCalien.CCDDZPanelBase {
	private static _instance: CCPanelAlert;
	public static get instance(): CCPanelAlert {
		if (this._instance == undefined) {
			this._instance = new CCPanelAlert();
		}
		return this._instance;
	}

	private lblTitle: eui.Label;
	private grpButton: eui.Group;
	private cancelBtn: CCLabelButton;
	private confirmBtn: CCLabelButton;
	private btnClose: eui.Button;
	private ctxScroller: eui.Scroller;
	private labContent: eui.Label;

	protected init(): void {
		this.skinName = panels.CCPanelAlertSkin;
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, { withFade: true, ease: egret.Ease.backIn });
	}

	createChildren(): void {
		super.createChildren();
		this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.dealAction.bind(this, "close"), this);
	}

	private onGrpButtonTap(event: egret.TouchEvent): void {
		this.dealAction(event.target.name);
	}

	show(content, type = 0, callback = null, textAlign: string = "center", textFlow: Array<egret.ITextElement> = null): void {
		this.popup();
		this.labContent.text = content;

		if (textFlow == null) {
			textFlow = [{ "text": content }];
		}
		this.labContent.textFlow = textFlow;
		this._callback = callback;
		this.labContent.textAlign = textAlign;

		this.grpButton.visible = true;
		this.labContent.validateNow();
		if (this.labContent.textHeight < this.ctxScroller.height) {
			this.labContent.y = (this.ctxScroller.height - this.labContent.textHeight) * 0.5;
		} else {
			this.labContent.y = 0;
		}

		this.ctxScroller.stopAnimation();
		this.ctxScroller.viewport.scrollV = 0;
		this.ctxScroller.validateNow();

		switch (type) {
			case 0:
				if (this.grpButton.contains(this.cancelBtn)) {
					this.grpButton.removeChild(this.cancelBtn);
				}
				break;
			case 1:
				if (!this.grpButton.contains(this.cancelBtn)) {
					this.grpButton.addChild(this.cancelBtn);
				}
				break;
		}
	}

	static getInstance(): CCPanelAlert {
		return this._instance;
	}
}

class CCAlert {
	static show(content: string, type: number = 0, callback: Function = null, textAlign: string = "center", textFlow: Array<egret.ITextElement> = null): void {
		CCPanelAlert.instance.show(content, type, callback, textAlign, textFlow);
	}
}


// CCAlert.show("牌局暂未结束，确定要退出吗？", 1, function(act) {
// 	console.log("click-----", act);
// 	if (act == "confirm") { //确定前往

// 	} else {

// 	}
// })