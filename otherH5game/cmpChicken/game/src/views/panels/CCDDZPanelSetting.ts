/**
 * Created by rockyl on 15/12/28.
 *
 * 设置面板
 */

class CCDDZPanelSetting extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelSetting;
    public static get instance(): CCDDZPanelSetting {
        if(this._instance == undefined) {
            this._instance = new CCDDZPanelSetting();
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
        this.skinName = panels.CCDDZPanelSettingSkin;
    }

    constructor() {
        super(CCalien.CCDDZpopupEffect.Scale,{
            withFade: true,
            ease: egret.Ease.backOut
        },CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn });
    }

    createChildren(): void {
        super.createChildren();

        this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGrpButtonTap,this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseTap,this);
        //        if(CCDDZMainLogic.instance.fromThirdPart == WebThirdPartConfig.game8868) {    
        //            if (this.btnLogout.parent)
        //                this.btnLogout.parent.removeChild(this.btnLogout);
        //        }
        if(lang.debug == "true")
            this.btnLogout.visible = true;
        this.labVersion.text = 'v:' + CCalien.Native.instance.makeVersionString(ccddz_version);    
//	    if(CCGlobalDebugHelper.isAdmin)
//            this.btnLogout.visible = true;
    }

    private onGrpButtonTap(event: egret.TouchEvent): void {
        //this.dealAction(event.target.name);
        switch(event.target.name) {
            case 'logout':
                CCDDZMainLogic.instance.stop();
                CCGlobalUserData.instance.clearData(['id']);
                CCDDZMainLogic.instance.showLogin();
                this.dealAction();
                break;
            case 'bind_weixin':
               
                break;
            case 'music':
                CCalien.CCDDZSoundManager.instance.switchMusic();
                break;
            case 'effect':
                CCalien.CCDDZSoundManager.instance.switchEffect();
                break;
            case 'vibrate':
                CCalien.CCDDZSoundManager.instance.switchVibrate();
                break;

            case 'report':
                    /*if(this.labWxService.text == "")
                        this.labWxService.text = CCalien.StringUtils.format(lang.wx_service,CCGlobalGameConfig.wxService);
                    this.labWxService.visible = true;
                    this.grpButton.visible = false;*/
                    
                CCDDZReportor.instance.toReportPage();
                break;
            case 'help':
//                if(CCGlobalDebugHelper.isAdmin) {
//                    CCGlobalWxHelper.share(1,(response) => {
//                        if(response.code != 3) {                           
//                            CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.WX_SHARE);
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

        this.switchMusic.selected = !CCalien.CCDDZSoundManager.instance.musicMute;
        this.switchEffect.selected = !CCalien.CCDDZSoundManager.instance.effectMute;
        this.switchVibrate.selected = !CCalien.CCDDZSoundManager.instance.vibrateMute;

        this.btnLogout.enabled = !ccserver.playing;
        this.labWxService.visible = false;
        this.grpGz.visible = false;
        this.grpButton.visible = true;
    }
}