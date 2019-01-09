/**
 * Created by eric.liu on 17/12/15.
 *
 * 登录
 */

class FishLogin extends eui.Component {
    private fish_login_img_bg:eui.Image;
    private fish_login_img_logo:eui.Image;
    private fish_login_btn_wx:eui.Button;
    private callback:Function = null;
    private callbackParam:any = null;
    constructor(callback, obj) {
        super();
        let self:FishLogin = this;
        self.callback = callback;
        self.callbackParam = obj;
        self.createView();
    }

    private createView():void {
        let self:FishLogin = this;
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
        RES.loadConfig("resource/fish.login.res.json", "resource/");
    }

    protected createChildren(): void {
        super.createChildren();
        let self:FishLogin = this;
    }

    private onThemeLoadComplete(): void {
        let self:FishLogin = this;
        self.skinName = FishLoginSkin;
        RES.loadGroup("fish_login", 1);
    }

    private onConfigComplete(event:RES.ResourceEvent):void {
        let self:FishLogin = this;
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, self.onConfigComplete, self);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onResourceLoadComplete, self);
        let theme = new eui.Theme("resource/fish.login.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    }

    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        let self:FishLogin = this;
        if (event.groupName == "fish_login") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, self.onResourceLoadComplete, self);
            //设置logo
            self.fish_login_img_bg.source = 'fish_wd_login';
            self.fish_login_img_logo.source = 'fish_wd_name';
            self.fish_login_btn_wx.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);

            //准备好以后，调用微端显示窗口
            FishNativeBridge.getInstance().CallNative('showGameView', '');
        }
    }

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishLogin = this;
        switch(event.target) {
            case self.fish_login_btn_wx:
                if (self.callback) {
                    self.callback(self.callbackParam, self);
                }
            break;
        }
    }
}
