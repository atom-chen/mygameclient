/**
 *
 * @ cyj
 *
 */
class TableInfo extends alien.PanelBase {
    private static _instance: TableInfo;
    public static get instance(): TableInfo {
        if(this._instance == undefined) {
            this._instance = new TableInfo();
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
    private lbRoomid:eui.Label;
    private lbLimit:eui.Label;
    private lbRound:eui.Label;
    private lbBScore:eui.Label;

    private player1:Avatar;
    private player2:Avatar;
    private player3:Avatar;

    private PInfo1:PInfItem;
    private PInfo2:PInfItem;
    private PInfo3:PInfItem;

    private btnStart: eui.Button;
    private btnShare: eui.Button;

    private roomid:number;

    private roominfo:any;
    protected init(): void {
        this.skinName = personal.TableInfoSkin;
    }

    createChildren(): void {
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStart,this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
        // this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.scroll2end,this);

        // InviteService.instance.addEventListener(EventNames.INVITE_DATA_REFRESH,this.onInviteDataUpdate,this)
        // e.registerOnObject(this,InviteService.instance,,this.onInviteDataUpdate,this);

        //server.addEventListener(EventNames.JOIN_PGAME_REP, this.onJoinRep, this);
        server.addEventListener(EventNames.START_PGAME_REP, this.onStartGameRep, this);
        
        // let em: alien.EventManager = alien.EventManager.instance;
		// em.registerOnObject(this, server, EventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
    }

    private onJoinRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            PanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{

        }
    }

    private onStartGameRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            PanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{
            // if(this.game == GameConfig.ROOM_NAMES_URLS[GameConfig.game_Type_qznn])
            //     {
            //         GameLogic.roomType = GameConfig.game_Type_qznn;
            //         AppControl.getInstance().showPage(QznnGamePage,false,GameConfig.game_Type_qznn,0,this.roomScore,0,0,GameConfig.game_team);
            //     }
            alien.SceneManager.show(SceneNames.PLAY, this.roominfo, alien.sceneEffect.Fade);
        }
    }

    private onShare(event: egret.TouchEvent): void {
        // server.CreatePersonalGameReq(1, this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
        // this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]);
    }

    private onStart(event: egret.TouchEvent): void {
        server.StartPGameReq(this.roomid);
        
    }

    private setPlayerInfo(index:number, imageId:string, nickname: string): void{
        this['player' + index].imageId = imageId;
        this['PInfo' + index].setName(nickname);
    }

    show(data: any,callback: Function = null): void {
        this.roomid = data.roomid;
        this.lbRoomid.text = data.roomid;
        this.lbLimit.text = data.maxodd;
        this.lbRound.text = data.roundcnt;
        this.lbBScore.text = data.basescore;
        this.roominfo = {roomid: data.roomid, maxOdds: data.maxodd, roundcnt: data.roundcnt, 
            baseScore:data.basescore, matchType:1, personalgame:true};
        // var xx = {roomid: data.roomid, }
        if(data.owner){
            this.setPlayerInfo(1, data.owner.imageId, data.owner.nickname);
        }

        this._callback = callback;
        this.popup();//this.dealAction.bind(this)
    }

    private onBtnCloseClick(event: egret.TouchEvent): void {
        this.dealAction();
    }
}