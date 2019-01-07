/**
 * Created by rockyl on 15/12/28.
 *
 * 设置面板
 */

class PDKPanelSetting extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelSetting;
    public static get instance(): PDKPanelSetting {
        if (this._instance == undefined) {
            this._instance = new PDKPanelSetting();
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
    private showType: number = 0;

    protected init(): void {
        this.skinName = panels.PDKPanelSettingSkin;
    }

    constructor() {
        super(PDKalien.popupEffect.Scale, {
            withFade: true,
            ease: egret.Ease.backOut
        }, PDKalien.popupEffect.Scale, { withFade: true, ease: egret.Ease.backIn });
    }

    createChildren(): void {
        super.createChildren();

        this.grpButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGrpButtonTap, this);
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnCloseTap, this);
        //        if(PDKMainLogic.instance.fromThirdPart == WebThirdPartConfig.game8868) {    
        //            if (this.btnLogout.parent)
        //                this.btnLogout.parent.removeChild(this.btnLogout);
        //        }
        // if(PDKlang.debug == "true")
        //     this.btnLogout.visible = true;

        //	    if(PDKDebugHelper.isAdmin)
        //            this.btnLogout.visible = true;
    }

    private onGrpButtonTap(event: egret.TouchEvent): void {
        //this.dealAction(event.target.name);
        switch (event.target.name) {
            case 'logout':
                PDKMainLogic.instance.stop();
                PDKUserData.instance.clearData(['id']);
                PDKMainLogic.instance.showLogin();
                this.dealAction();
                break;
            case 'bind_weixin':

                break;
            case 'music':
                PDKalien.PDKSoundManager.instance.switchMusic();
                break;
            case 'effect':
                PDKalien.PDKSoundManager.instance.switchEffect();
                break;
            case 'vibrate':
                PDKalien.PDKSoundManager.instance.switchVibrate();
                break;
            case 'report':
                PDKReportor.instance.toReportPage();
                break;
            case 'help':
                if (this.labGz.text == "")
                    this.labGz.textFlow = (new egret.HtmlTextParser).parser(PDKlang.ddz_gz);
                this.grpGz.visible = true;
                this.grpButton.visible = false;
                break;
        }
    }

    private onBtnCloseTap(event: egret.TouchEvent): void {
        if (this.showType == 1) {
            this.dealAction();
            return;
        }
        if (this.labWxService.visible) {
            this.labWxService.visible = false;
            this.grpButton.visible = true;
        }
        else if (this.grpGz.visible) {
            this.grpGz.visible = false;
            this.grpButton.visible = true;
        }
        else
            this.dealAction();
    }

    show(type: number = 0): void {
        this.popup(this.dealAction.bind(this));

        this.switchMusic.selected = !PDKalien.PDKSoundManager.instance.musicMute;
        this.switchEffect.selected = !PDKalien.PDKSoundManager.instance.effectMute;
        this.switchVibrate.selected = !PDKalien.PDKSoundManager.instance.vibrateMute;

        this.btnLogout.enabled = !pdkServer.playing;
        this.labWxService.visible = false;
        this.grpGz.visible = false;
        this.grpButton.visible = true;

        this.showType = type;
        if (type == 1) {
            //显示帮助
            if (this.labGz.text == "")
                this.labGz.textFlow = (new egret.HtmlTextParser).parser(PDKlang.ddz_gz);
            this.grpGz.visible = true;
            this.grpButton.visible = false;
        }
    }
}