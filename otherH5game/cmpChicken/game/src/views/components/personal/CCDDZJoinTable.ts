/**
 *
 * @ cyj
 *
 */
class CCDDZJoinTable extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZJoinTable;
    public static get instance(): CCDDZJoinTable {
        if(this._instance == undefined) {
            this._instance = new CCDDZJoinTable();
        }
        return this._instance;
    }

    constructor() {
        super(
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            CCalien.CCDDZpopupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

//    private rectMask: eui.Rect;
    private btnClose: eui.Button;
    private lbOwner:eui.Label;
    private lbRoomID:eui.BitmapLabel;

    // private btnNumber:Array<eui.Button> = [];

    private btnJoin: eui.Button;
    // private btnShare: eui.Button;

    private roomid:number;
    protected init(): void {
        this.skinName = personal.CCDDZJoinTableSkin;
    }

    createChildren(): void {
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnJoin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onJoin,this);
        // this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
        // this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.scroll2end,this);
        for(var i = 0; i < 12; ++i){
            this['btn' + i].addEventListener(egret.TouchEvent.TOUCH_TAP,this.onNumberClick,this);
            // this.btnNumber.push();
        }
        this.roomid = 0;
        // CCDDZInviteService.instance.addEventListener(CCGlobalEventNames.INVITE_DATA_REFRESH,this.onInviteDataUpdate,this)
        // e.registerOnObject(this,CCDDZInviteService.instance,,this.onInviteDataUpdate,this);

        ccserver.addEventListener(CCGlobalEventNames.JOIN_PGAME_REP, this.onJoinRep, this);
        // ccserver.addEventListener(CCGlobalEventNames.START_PGAME_REP, this.onStartGameRep, this);
    }

    private onNumberClick(event: egret.TouchEvent): void {
        // event.currentTarget
        // (event.currentTarget as eui.Button).t
        
        var xx = Number(event.currentTarget.name);
        if(xx < 10){
            if(this.roomid < 100000){
                this.roomid = this.roomid * 10 + xx;
            }else{
                return;
            }
        }else if(xx == 10){
            this.roomid = Math.floor(this.roomid / 10);
        }else if(xx == 11){
            this.roomid = 0;
        }

        this.lbRoomID.text = this.roomid == 0 ? '':this.roomid.toString();
    }

    //zhu 只处理错误的，正确的在sceneRoom里面处理的
    private onJoinRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            if(data.result == 2){
                CCDDZPanelRechargeTips.instance.show();
            }else{
                CCDDZImgToast.instance.show(this, lang.joinPGameErr[data.result]);
            }
            // CCDDZImgToast.instance.show(this, lang.joinPGameErr[data.result]);
        }
    }

    // private onStartGameRep(event: egret.Event): void {
    //     let data: any = event.data;
    //     if(data.result != 0){
    //         // CCDDZPanelAlert.instance.show('错误编号'+ data.result, 0);
    //         // CCDDZToast.show(lang.joinPGameErr[data.result]);
    //     }else{
    //         // if(this.game == CCGlobalGameConfig.ROOM_NAMES_URLS[CCGlobalGameConfig.game_Type_qznn])
    //         //     {
    //         //         GameLogic.roomType = CCGlobalGameConfig.game_Type_qznn;
    //         //         AppControl.getInstance().showPage(QznnGamePage,false,CCGlobalGameConfig.game_Type_qznn,0,this.roomScore,0,0,CCGlobalGameConfig.game_team);
    //         //     }
    //         CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, {}, CCalien.CCDDZsceneEffect.CCDDFade);
    //         this.close();
    //     }
    // }

    private onShare(event: egret.TouchEvent): void {
        // ccserver.CreatePersonalGameReq(1, this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
        // this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]);
    }

    private onSearch(event: egret.TouchEvent): void {
        ccserver.QueryRoomInfoReq(this.roomid);
    }

    private onJoin(event: egret.TouchEvent): void {
        // var xx = [{nickname:'sdf', gold:10}, {nickname:'sdf', gold:10}, {nickname:'sdf', gold:10}];
        // var quitPlayer = '发生的发士大夫士大夫'
        // if(quitPlayer){
        //         //  quitPlayer = CCDDZBase64.decode(quitPlayer)
        //          if(quitPlayer.length > 6){
        //              quitPlayer = quitPlayer.substring(0, 6)
        //          }
        //      }
        // CCDDZPersonalDetail.instance.show(xx, null, true, quitPlayer);
        ccserver.JoinPGameReq(this.roomid);
    }

    private setPlayerInfo(index:number, imageId:string, nickname: string): void{
        this['player' + index].imageId = imageId;
        this['PInfo' + index].setName(nickname);
    }

    show(callback: Function = null, roomid:number = null): void {//data: any,
        this.roomid = 0;
        this.lbOwner.text = '';
        this.lbRoomID.text = '';
        this._callback = callback;
        this.popup();//this.dealAction.bind(this)
        if(roomid){
            this.roomid = roomid;
            this.lbRoomID.text = String(roomid);
            ccserver.JoinPGameReq(roomid);
        }
    }

    private onBtnCloseClick(event: egret.TouchEvent): void {
        this.dealAction();
    }
}