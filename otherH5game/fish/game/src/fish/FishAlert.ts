/**
 * Created by eric.liu on 17/11/16.
 *
 * 提示
 */

class FishAlert extends FishPanelBase {
	private static _instance:FishAlert;
	public static get instance():FishAlert {
		if (this._instance == undefined) {
			this._instance = new FishAlert();
		}
		return this._instance;
	}

    private fish_alert_ok:eui.Button;
    private fish_alert_ok1:eui.Button;
    private fish_alert_cancel:eui.Button;
    private fish_label_msg:eui.Label;
    private callback:Function;

	constructor() {
        super();
        let self:FishAlert = this;
        self.skinName = FishAlertSkin;
	}

	createChildren():void {
		super.createChildren();
        let self:FishAlert = this;
        //设置布局
        self.anchorOffsetX = self.width/2;
        self.anchorOffsetY = self.height/2;

        self.fish_alert_ok.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_alert_ok1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_alert_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
	}

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishAlert = this;
        switch(event.target) {
            case self.fish_alert_ok:
            case self.fish_alert_ok1:
                if (self.callback) self.callback(true);
                break;
            default:
                if (self.callback) self.callback(false);
                break;
        }
        self.hide();
    }

	show(parent:eui.Group, content, type = 0, callback = null, textAlign:string ="center"):void {
        let self:FishAlert = this;
		self.callback = callback;
        self.fish_label_msg.text = content;
        self.fish_alert_ok.visible = type==0;
        self.fish_alert_cancel.visible = type==0;
        self.fish_alert_ok1.visible = type==1;

        super._show(parent);
	}

    hide() {
        let self:FishAlert = this;
        super._hide();
    }
}