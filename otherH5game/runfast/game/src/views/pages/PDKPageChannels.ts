/**
 * Created by rockyl on 16/3/29.
 *
 * 房间频道页
 */
let T_G_PDK = 1;

class PDKPageChannels extends PDKalien.PDKNavigationPage {
    static defName: string = 'PDKPageChannels';

    private static _ins: PDKPageChannels = null;
    // public list:eui.List;
    private redRank: PDKRedRank;

    // private matchtest:any;
    private enter_pdk: eui.Group;
    private enter_normal: eui.Button;
    private enter_master: eui.Button;
    private enter_master2: eui.Button;
    private enter_diy: eui.Button;
    private enter_red: eui.Button;
    private enter_red2: eui.Button;
    private _bRedNormal: boolean;//是否点击了红包场
    private _bTwoGame: boolean;//是否点击了二人场
    private _roomID: number = 0;
    private _nToGame: number;

    private pdkRooms: any;
    constructor() {
        super();
        this.setClickRedNormal(false);
        this.pdkRooms = PDKGameConfig.getCfgByField("pdkRooms");
        this.init();
    }

    private init(): void {
        // this.matchtest = {"1000081":1,"1000557":1,"1000562":1,"1000024":1,"1000561":1,"1000019":1,"1000564":1,"1069058":1,"1000575":1,"1000556":1,"1000558":1,"1069065":1,"1000022":1,"1000054":1,"1000559":1,"1000560":1,"1000550":1,"1000046":1,"1000325":1,"1000056":1,"1000534":1,"1000563":1,"1000369":1,"1000566":1,"1000003":1,"1000565":1,"1000038":1,"1000015":1};
        this.skinName = pages.PDKPageChannelSkin;
        PDKPageChannels._ins = this;
    }

    createChildren(): void {
        super.createChildren();

        // this.list.itemRenderer = PDKIRChannel;
        // this.list.dataProvider = new eui.ArrayCollection([
        // 	{id: 0, pageDef: PDKPageNormalChannel},
        // 	{id: 1, pageDef: PDKPageMatchChannel},
        // ]);


        // this.list.addEventListener(egret.Event.CHANGE, this.onSelectChannel, this);
        this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        this.onResize(null);
        this.resetChannelClick();

        // let e: PDKalien.PDKEventManager = PDKEventManager.instance;
        // e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.TO_NORMAL_MATCH,this.onToNormalMatch,this);
    }

    /**
    * 重置房间点击
    */
    public resetChannelClick(): void {
        this._nToGame = 0;
    }

    /**
     *  zhu 牌里的下载页面
     */
    private _showPaiLiDownload(): void {
        let self = this;

        let copyString = PDKGameConfig.wxService;
        let alertContent = "招募推广员,加微信:" + copyString + "\n(点击确定即可复制微信号)";
        //PDKGameConfig.copyText(this.parent,copyString,"微信号");

        PDKPanelAlert3.instance.show(alertContent, 0, function () {
            PDKGameConfig.copyText(this.parent, copyString, "微信号(" + copyString + ")");
        })
        //window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.htgames.chess&from=groupmessage&isappinstalled=1";
    }

    public setWillToGame(nType: number): void {
        this._nToGame = nType;
    }

    public getWillToGame(): number {
        return this._nToGame;
    }

    /**
     * zhu 设置是否点击红包场
     */
    public setClickRedNormal(bRed: boolean): void {
        this._bRedNormal = bRed;
    }
    public setClickTwoGame(bTwo: boolean): void {
        this._bTwoGame = bTwo;
    }

    /**
     * 是否点击了红包场
     */
    public isClickRedRoom(): boolean {
        return this._bRedNormal;
    }
    public isClickTwoGame(): boolean {
        return this._bTwoGame;
    }

    public getClickRoomID(): number {
        return this._roomID;
    }

    /**
     * 去普通场
     */
    private onToNormalMatch(): void {
        this.navigation.push(PDKPageNormalChannel);
        // this.setClickRedNormal(false);
        // this._roomID = 3101;
        // pdkServer.checkReconnect();
    }

    /**
     * 去红包场
     */
    private onToRedNormal(bShowRevive: boolean = true): void {
        this.setClickRedNormal(true);
        pdkServer.checkReconnect();
    }

    /**
     * 去跑得快
     */
    private onToPdkGame(): void {
        this._roomID = 9000;
        this.setWillToGame(T_G_PDK);
        this.setClickTwoGame(true);
        pdkServer.checkReconnect();
    }

    private onSelectChannel(event: egret.Event): void {
        var name = event.currentTarget.name;
        this.resetChannelClick();
        switch (name) {
            case 'pdk':
                this.onToPdkGame();
                break;
            default:
                this._roomID = 0;
                break;
        }
        // let channel:any = this.list.selectedItem;
        // if (this.list.selectedIndex==1){
        //     this.list.selectedIndex = -1;
        //     this.navigation.push(channel.pageDef);
        //     // if(this.matchtest[String(pdkServer.uid)]){
        //     //     this.navigation.push(channel.pageDef);
        //     // }else{
        //     //     PDKAlert.show("暂未开启",0);
        //     // }
        // }else{
        //     this.list.selectedIndex = -1;
        //     this.navigation.push(channel.pageDef);
        // }
    }

    beforeShow(params: any): void {
        this.enter_pdk["addClickListener"](this.onSelectChannel, this);
        this.enter_normal["addClickListener"](this.onSelectChannel, this);
        this.enter_master["addClickListener"](this.onSelectChannel, this);
        this.enter_master2["addClickListener"](this.onSelectChannel, this);
        this.enter_diy["addClickListener"](this.onSelectChannel, this);
        this.enter_red["addClickListener"](this.onSelectChannel, this);
        this.enter_red2["addClickListener"](this.onSelectChannel, this);
        this.setClickRedNormal(false);
        PDKEventManager.instance.enableOnObject(this);
        PDKMainLogic.instance.hideIndexDownAndRefresh();
    }


    beforeHide(): void {
        PDKEventManager.instance.disableOnObject(this);
    }

    onResize(e: egret.Event): void {
        // this.list.layout["gap"] = (PDKalien.StageProxy.width - this.redRank.x - this.redRank.width - 50) / 2 - 283;
    }
}

class PDKIRChannel extends eui.ItemRenderer {
    public imgIcon: eui.Image;
    public imgLabel: eui.Image;
    public openFlag: eui.Image;
    protected dataChanged(): void {
        super.dataChanged();

        this.imgIcon.source = 'room_channel_icon_' + this.data.id;
        this.imgLabel.source = 'room_channel_lab_' + this.data.id;
        if (this.data.id == 1) {
            //this.playOpenAnimate();
        } else {
            // this.removeChild(this.openFlag);
            // this.openFlag.removefromm
        }
    }

    public playOpenAnimate(): void {
        this.openFlag.visible = true;
        egret.Tween.get(this.openFlag).set({
            visible: true,
            // loop:true,
            y: 87,
        })
            .to({
                y: 77,
            }, 446).
            to({
                y: 87,
            }, 446).
            call(this.playOpenAnimate, this);
    }
}