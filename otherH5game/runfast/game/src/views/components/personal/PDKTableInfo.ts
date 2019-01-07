/**
 *
 * @ cyj
 *
 */
class PDKTableInfo extends PDKalien.PDKPanelBase {
    private static _instance: PDKTableInfo;
    public static get instance(): PDKTableInfo {
        if(this._instance == undefined) {
            this._instance = new PDKTableInfo();
        }
        return this._instance;
    }

    constructor() {
        super(
            PDKalien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backOut },
            PDKalien.popupEffect.Scale,{ withFade: true,ease: egret.Ease.backIn }
        );
    }

//    private rectMask: eui.Rect;
    private btnClose: eui.Button;
    private lbRoomid:eui.Label;
    private lbLimit:eui.Label;
    private lbRound:eui.Label;
    private lbBScore:eui.Label;

    private player1:PDKAvatar;
    private player2:PDKAvatar;
    private player3:PDKAvatar;

    private PInfo1:PDKIPInfItem;
    private PInfo2:PDKIPInfItem;
    private PInfo3:PDKIPInfItem;

    private btnStart: eui.Button;
    private btnShare: eui.Button;

    private roomid:number;

    private roominfo:any;
    protected init(): void {
        this.skinName = personal.PDKTableInfoSkin;
    }

    createChildren(): void {
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStart,this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
        // this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.scroll2end,this);

        // PDKInviteService.instance.addEventListener(PDKEventNames.INVITE_DATA_REFRESH,this.onInviteDataUpdate,this)
        // e.registerOnObject(this,PDKInviteService.instance,,this.onInviteDataUpdate,this);

        //pdkServer.addEventListener(PDKEventNames.JOIN_PGAME_REP, this.onJoinRep, this);
        pdkServer.addEventListener(PDKEventNames.START_PGAME_REP, this.onStartGameRep, this);
        
        // let em: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		// em.registerOnObject(this, pdkServer, PDKEventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
    }

    private onJoinRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            PDKPanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{

        }
    }

    private onStartGameRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            PDKPanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{
            // if(this.game == PDKGameConfig.ROOM_NAMES_URLS[PDKGameConfig.game_Type_qznn])
            //     {
            //         GameLogic.roomType = PDKGameConfig.game_Type_qznn;
            //         AppControl.getInstance().showPage(QznnGamePage,false,PDKGameConfig.game_Type_qznn,0,this.roomScore,0,0,PDKGameConfig.game_team);
            //     }
            PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, this.roominfo, PDKalien.sceneEffect.Fade);
        }
    }

    private onShare(event: egret.TouchEvent): void {
        // pdkServer.CreatePersonalGameReq(1, this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
        // this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]);
    }

    private onStart(event: egret.TouchEvent): void {
        pdkServer.StartPGameReq(this.roomid);
        
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