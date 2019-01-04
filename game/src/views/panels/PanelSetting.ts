/**
 * Created by rockyl on 15/12/28.
 *
 * 设置面板
 */

class PanelSetting extends alien.PanelBase {
    private static _instance: PanelSetting;
    public static get instance(): PanelSetting {
        if(this._instance == undefined) {
            this._instance = new PanelSetting();
        }
        return this._instance;
    }

    private grpButton: eui.Group;
    private switchMusic: eui.CheckBox;
    private switchEffect: eui.CheckBox;
    private switchVibrate: eui.CheckBox;
    private btnClose: eui.Button;
    private btnLogout: eui.Button;
    private btnBindWeiXin: eui.Button;
    private labWxService: eui.Label;
    private grpGz: eui.Scroller;
    private labGz: eui.Label;
    private labVersion:eui.Label;

    protected init(): void {
        this.skinName = panels.PanelSettingSkin;
    }

    constructor() {
        super(alien.popupEffect.Scale,{
            withFade: true,
            ease: egret.Ease.backOut
        },alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn });
    }

    createChildren(): void {
        super.createChildren();

        this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGrpButtonTap,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseTap,this);
        //        if(MainLogic.instance.fromThirdPart == WebThirdPartConfig.game8868) {    
        //            if (this.btnLogout.parent)
        //                this.btnLogout.parent.removeChild(this.btnLogout);
        //        }
        if(lang.debug == "true")
            this.btnLogout.visible = true;
        this.labVersion.text = 'v:' + alien.Native.instance.makeVersionString(version);    
//	    if(DebugHelper.isAdmin)
//            this.btnLogout.visible = true;
    }

    private onGrpButtonTap(event: egret.TouchEvent): void {
        //this.dealAction(event.target.name);
        switch(event.target.name) {
            case 'logout':
                MainLogic.instance.stop();
                UserData.instance.clearData(['id']);
                MainLogic.instance.showLogin();
                this.dealAction();
                break;
            case 'bind_weixin':
               
                break;
            case 'music':
                alien.SoundManager.instance.switchMusic();
                break;
            case 'effect':
                alien.SoundManager.instance.switchEffect();
                break;
            case 'vibrate':
                alien.SoundManager.instance.switchVibrate();
                break;

            case 'report':
                    /*if(this.labWxService.text == "")
                        this.labWxService.text = alien.StringUtils.format(lang.wx_service,GameConfig.wxService);
                    this.labWxService.visible = true;
                    this.grpButton.visible = false;*/
                    
                Reportor.instance.toReportPage();
                break;
            case 'help':
//                if(DebugHelper.isAdmin) {
//                    WxHelper.share(1,(response) => {
//                        if(response.code != 3) {                           
//                            alien.Dispatcher.dispatch(EventNames.WX_SHARE);
//                        }
//                    },[1,2,3]);
//                }
//                else
//                {
                    if(this.labGz.text == "")
                        this.labGz.textFlow = (new egret.HtmlTextParser).parser(lang.ddz_gz);
                    this.grpGz.visible = true;
                    this.grpButton.visible = false;
//                }
                break;
        }
    }

    private onBtnCloseTap(event: egret.TouchEvent): void {
        if(this.labWxService.visible) {
            this.labWxService.visible = false;
            this.grpButton.visible = true;
        }
        else if(this.grpGz.visible) {
            this.grpGz.visible = false;
            this.grpButton.visible = true;
        }
        else
            this.dealAction();
    }

    show(): void {
        this.popup(this.dealAction.bind(this));

        this.switchMusic.selected = !alien.SoundManager.instance.musicMute;
        this.switchEffect.selected = !alien.SoundManager.instance.effectMute;
        this.switchVibrate.selected = !alien.SoundManager.instance.vibrateMute;

        this.btnLogout.enabled = !server.playing;
        this.labWxService.visible = false;
        this.grpGz.visible = false;
        this.grpButton.visible = true;
    }
}