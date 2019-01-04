/**
 *
 * @ cyj
 *
 */
class JoinTable extends alien.PanelBase {
    private static _instance: JoinTable;
    public static get instance(): JoinTable {
        if(this._instance == undefined) {
            this._instance = new JoinTable();
        }
        return this._instance;
    }

    constructor() {
        super(
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            alien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
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
        this.skinName = personal.JoinTableSkin;
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
        // InviteService.instance.addEventListener(EventNames.INVITE_DATA_REFRESH,this.onInviteDataUpdate,this)
        // e.registerOnObject(this,InviteService.instance,,this.onInviteDataUpdate,this);

        server.addEventListener(EventNames.JOIN_PGAME_REP, this.onJoinRep, this);
        // server.addEventListener(EventNames.START_PGAME_REP, this.onStartGameRep, this);
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
                PanelRechargeTips.instance.show();
            }else{
                ImgToast.instance.show(this, lang.joinPGameErr[data.result]);
            }
            // ImgToast.instance.show(this, lang.joinPGameErr[data.result]);
        }
    }

    // private onStartGameRep(event: egret.Event): void {
    //     let data: any = event.data;
    //     if(data.result != 0){
    //         // PanelAlert.instance.show('错误编号'+ data.result, 0);
    //         // Toast.show(lang.joinPGameErr[data.result]);
    //     }else{
    //         // if(this.game == GameConfig.ROOM_NAMES_URLS[GameConfig.game_Type_qznn])
    //         //     {
    //         //         GameLogic.roomType = GameConfig.game_Type_qznn;
    //         //         AppControl.getInstance().showPage(QznnGamePage,false,GameConfig.game_Type_qznn,0,this.roomScore,0,0,GameConfig.game_team);
    //         //     }
    //         alien.SceneManager.show(SceneNames.PLAY, {}, alien.sceneEffect.Fade);
    //         this.close();
    //     }
    // }

    private onShare(event: egret.TouchEvent): void {
        // server.CreatePersonalGameReq(1, this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
        // this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]);
    }

    private onSearch(event: egret.TouchEvent): void {
        server.QueryRoomInfoReq(this.roomid);
    }

    private onJoin(event: egret.TouchEvent): void {
        // var xx = [{nickname:'sdf', gold:10}, {nickname:'sdf', gold:10}, {nickname:'sdf', gold:10}];
        // var quitPlayer = '发生的发士大夫士大夫'
        // if(quitPlayer){
        //         //  quitPlayer = Base64.decode(quitPlayer)
        //          if(quitPlayer.length > 6){
        //              quitPlayer = quitPlayer.substring(0, 6)
        //          }
        //      }
        // PersonalDetail.instance.show(xx, null, true, quitPlayer);
        server.JoinPGameReq(this.roomid);
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
            server.JoinPGameReq(roomid);
        }
    }

    private onBtnCloseClick(event: egret.TouchEvent): void {
        this.dealAction();
    }
}