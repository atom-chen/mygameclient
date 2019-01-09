/**
 * Created by eric.liu on 17/12/28.
 *
 * 活动
 */

class FishSignItem extends eui.Component {
    private fish_sign_item_title:eui.Label;
    private fish_sign_item_amount:eui.BitmapLabel;

    constructor() {
        super();
        let self:FishSignItem = this;
        self.addEventListener(eui.UIEvent.COMPLETE, self.uiCompHandler, self);
        self.addEventListener(egret.Event.RESIZE, self.uiResizeHandler, self);
        self.skinName = FishSignItemSkin;
    }

    private uiCompHandler():void {
        let self:FishSignItem = this;
    }

    private uiResizeHandler():void {
    }

    public SetItemInfo(title:string, amount:string):void {
        let self:FishSignItem = this;
        self.fish_sign_item_title.text = title;
        self.fish_sign_item_amount.text = amount;
    }
}

class FishActivity extends FishPanelBase {
    private fish_parent:eui.Group;
    private fish_btn_close:eui.Button;

    private fish_activity_type_btn_bind:FishBtnShopType;
    private fish_activity_type_btn_sign:FishBtnShopType;
    private fish_activity_type_btn_selected:FishBtnShopType;
    private fish_activity_panel_sign:eui.Panel;
    private fish_activity_panel_bind:eui.Panel;

    private fish_activity_input_phone:FishInput;
    private fish_activity_input_captcha:FishInput;
    private fish_activity_btn_captcha:FishBtnCaptcha;
    private fish_activity_btn_bind:eui.Button;

    private fish_sign_item_1:FishSignItem;
    private fish_sign_item_2:FishSignItem;
    private fish_sign_item_3:FishSignItem;
    private fish_sign_item_4:FishSignItem;
    private fish_sign_item_5:FishSignItem;
    private fish_sign_item_6:FishSignItem;
    private fish_sign_item_7:FishSignItem;
    private fish_sign_btn_get:eui.Button;

    private fish_signin_data:any = null;
    private fish_timeoutid_captcha:number = 0;
    private fish_timer_captcha:number = 120;

    private static _instance: FishActivity;
    public static get instance(): FishActivity {
        if(this._instance == undefined) {
            this._instance = new FishActivity();
        }
        return this._instance;
    }

    constructor() {
        super();
        let self:FishActivity = this;
        self.skinName = FishActivitySkin;
        self.addEventListener(eui.UIEvent.ADDED_TO_STAGE, self.addToStage, self);
        self.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, self.removeFromStage, self);
    }

    public addToStage(event:egret.Event):void {
        let self:FishActivity = this;
        self.removeEventListener(egret.Event.ADDED_TO_STAGE, self.addToStage, self);
        //注册事件
        let e: FishUtils.EventManager = FishUtils.EventManager.instance;
        e.registerOnObject(self, fishServer, FishEvent.USER_DAY_SIGNIN_OPT_REP, self.onUserDaySigninOpt, self);
        e.enableOnObject(self);
    }

    public removeFromStage(event:egret.Event):void {
        let self:FishActivity = this;
        self.removeEventListener(egret.Event.REMOVED_FROM_STAGE, self.removeFromStage, self);
        //注册事件
        let e: FishUtils.EventManager = FishUtils.EventManager.instance;
        e.disableOnObject(self);
    }

    private onUserDaySigninOpt(event:egret.Event):void {
        let data: any = event.data;
        //console.log('==================>>>>>>>> onDaySigninOpt');
        let self:FishActivity = this;
        if (data.optype == 2) {
            //签到
            if (data.result == 0) {
                self.fish_sign_btn_get.currentState = 'disabled';

                self.fish_sign_item_1.currentState = data.total_day > 0 ? 'signed' : 'unsigned';
                self.fish_sign_item_2.currentState = data.total_day > 1 ? 'signed' : 'unsigned';
                self.fish_sign_item_3.currentState = data.total_day > 2 ? 'signed' : 'unsigned';
                self.fish_sign_item_4.currentState = data.total_day > 3 ? 'signed' : 'unsigned';
                self.fish_sign_item_5.currentState = data.total_day > 4 ? 'signed' : 'unsigned';
                self.fish_sign_item_6.currentState = data.total_day > 5 ? 'signed' : 'unsigned';
                self.fish_sign_item_7.currentState = data.total_day > 6 ? 'signed' : 'unsigned';
            }
        }
    }

    createChildren(): void {
        super.createChildren();
        let self:FishActivity = this;

        //设置布局
        self.anchorOffsetX = self.width/2;
        self.anchorOffsetY = self.height/2;

        self.fish_activity_type_btn_bind.fish_shoptype_label.text = '绑定手机';
        self.fish_activity_type_btn_sign.fish_shoptype_label.text = '每日签到';

        self.fish_activity_input_phone.SetPlaceHolder('请输入手机号');
        self.fish_activity_input_captcha.SetPlaceHolder('请输入验证码');
        //self.fish_activity_btn_captcha.currentState = 'disabled';
        //self.fish_activity_btn_captcha.fish_btn_captcha_title.text = '120秒';

        self.fish_activity_input_phone.inputType = egret.TextFieldInputType.TEL;
        self.fish_activity_input_captcha.inputType = egret.TextFieldInputType.TEL;

        self.fish_btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_activity_type_btn_bind.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_activity_type_btn_sign.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_activity_btn_captcha.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_activity_btn_bind.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_sign_btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);

        let userData: FishUserData = FishUserData.instance;
        self.fish_activity_type_btn_bind.visible = !userData.getItem('isbind', false);
    }

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishActivity = this;
        switch(event.target) {
            case self.fish_btn_close:
                //self.dealAction();
                break;
            case self.fish_activity_type_btn_bind:
            case self.fish_activity_type_btn_sign:
                self.selectType(event.target);
                return;
            case self.fish_sign_btn_get:
                //签到
                if (self.fish_sign_btn_get.currentState != 'disabled')
                    fishServer.sendDaySigninOptReq(2);
                return;
            case self.fish_activity_btn_captcha:
                //获取验证码
                if (self.fish_activity_btn_captcha.currentState != 'disabled') {
                    if (self.fish_activity_input_phone.text == '' || self.fish_activity_input_phone.text.length != 11) {
                        FishAlert.instance.show(self.fish_parent, "手机号格式不正确", 1);
                        return;
                    }
                    fishWebService.getCode(self.fish_activity_input_phone.text, (code)=> {
                        if (code == 0) {
                            self.fish_activity_btn_captcha.currentState = 'disabled';
                            self.fish_timer_captcha = 119;
                            self.fish_timeoutid_captcha = egret.setInterval(function(_self) {
                                let __self:FishActivity = _self;
                                if (__self.fish_timer_captcha < 1) {
                                    egret.clearInterval(__self.fish_timeoutid_captcha);
                                    __self.fish_timeoutid_captcha = 0;
                                    __self.fish_activity_btn_captcha.currentState = 'up';
                                    __self.fish_activity_btn_captcha.fish_btn_captcha_title.text = '重新获取';
                                    return;
                                }
                                __self.fish_activity_btn_captcha.fish_btn_captcha_title.text = ''+__self.fish_timer_captcha--;
                            }, self, 1000, self);
                        } else {
                            FishAlert.instance.show(self.fish_parent, "获取验证码失败，可能操作太频繁！", 1);
                        }
                    });
                }
                return;
            case self.fish_activity_btn_bind:
                //绑定手机
                if (self.fish_activity_input_phone.text == '' || self.fish_activity_input_phone.text.length != 11 || self.fish_activity_input_captcha.text == '') {
                    FishAlert.instance.show(self.fish_parent, "手机号或验证码格式不正确！", 1);
                    return;
                }
                fishWebService.bindPhone(self.fish_activity_input_phone.text, self.fish_activity_input_captcha.text, (response)=>{
                    if (response.code == 0) {
                        let userData: FishUserData = FishUserData.instance;
                        userData.setItem('isbind', true);
                        FishAlert.instance.show(self.fish_parent, "绑定成功！", 1);
                        //领取奖励
                        fishServer.getBindPhoneReward();
                    } else {
                        //绑定失败
                        let error:string = '未知错误';
                        let code:number = response.code;
                        switch(code) {
                            case 2016:error='该手机已经绑定过';break;
                            case 2004:error='找不到该用户';break;
                            case 2017:error='绑定失败';break;
                            case 2024:error='验证码错误';break;
                        }
                        FishAlert.instance.show(self.fish_parent, "绑定失败！错误："+error, 1);
                    }
                });
                return;
        }
        self.hide();
    }

    private selectType(btn:FishBtnShopType) {
        let self:FishActivity = this;
        if (self.fish_activity_type_btn_selected)
            self.fish_activity_type_btn_selected.currentState = 'up';
        btn.currentState = 'downAndSelected';
        self.fish_activity_type_btn_selected = btn;
        self.fish_activity_panel_bind.visible = (btn == self.fish_activity_type_btn_bind);
        self.fish_activity_panel_sign.visible = (btn == self.fish_activity_type_btn_sign);
    }

    show(parent:eui.Group, signinData:any): void {
        let self:FishActivity = this;
        super._show(parent);
        self.fish_parent = parent;
        self.fish_signin_data = signinData;
        self.selectType(self.fish_activity_type_btn_sign);

        self.fish_sign_item_1.SetItemInfo('第一天', '1000');
        self.fish_sign_item_2.SetItemInfo('第二天', '1200');
        self.fish_sign_item_3.SetItemInfo('第三天', '1400');
        self.fish_sign_item_4.SetItemInfo('第四天', '1600');
        self.fish_sign_item_5.SetItemInfo('第五天', '1800');
        self.fish_sign_item_6.SetItemInfo('第六天', '2000');
        self.fish_sign_item_7.SetItemInfo('第七天', '2700');
        self.fish_sign_item_1.currentState = self.fish_signin_data.total_day > 0 ? 'signed' : 'unsigned';
        self.fish_sign_item_2.currentState = self.fish_signin_data.total_day > 1 ? 'signed' : 'unsigned';
        self.fish_sign_item_3.currentState = self.fish_signin_data.total_day > 2 ? 'signed' : 'unsigned';
        self.fish_sign_item_4.currentState = self.fish_signin_data.total_day > 3 ? 'signed' : 'unsigned';
        self.fish_sign_item_5.currentState = self.fish_signin_data.total_day > 4 ? 'signed' : 'unsigned';
        self.fish_sign_item_6.currentState = self.fish_signin_data.total_day > 5 ? 'signed' : 'unsigned';
        self.fish_sign_item_7.currentState = self.fish_signin_data.total_day > 6 ? 'signed' : 'unsigned';
        self.fish_sign_btn_get.currentState = self.fish_signin_data.today == 1 ? 'disabled' : 'normal';

        self.fish_activity_input_phone.text = '';
        self.fish_activity_input_captcha.text = '';
    }

    hide() {
        let self:FishActivity = this;
        super._hide(function(arg) {
            let self:FishShop = arg;
        }, self);
    }
}