/**
 *
 * @ cyj
 *
 */
class CCDDZTableInfo extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZTableInfo;
    public static get instance(): CCDDZTableInfo {
        if(this._instance == undefined) {
            this._instance = new CCDDZTableInfo();
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
    private lbRoomid:eui.Label;
    private lbLimit:eui.Label;
    private lbRound:eui.Label;
    private lbBScore:eui.Label;

    private player1:CCDDZAvatar;
    private player2:CCDDZAvatar;
    private player3:CCDDZAvatar;

    private PInfo1:CCDDZPInfItem;
    private PInfo2:CCDDZPInfItem;
    private PInfo3:CCDDZPInfItem;

    private btnStart: eui.Button;
    private btnShare: eui.Button;

    private roomid:number;

    private roominfo:any;
    protected init(): void {
        this.skinName = personal.CCDDZTableInfoSkin;
    }

    createChildren(): void {
        super.createChildren();
        this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onBtnCloseClick,this);
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onStart,this);
        this.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onShare,this);
        // this.scroller.addEventListener(eui.UIEvent.CHANGE_END,this.scroll2end,this);

        // CCDDZInviteService.instance.addEventListener(CCGlobalEventNames.INVITE_DATA_REFRESH,this.onInviteDataUpdate,this)
        // e.registerOnObject(this,CCDDZInviteService.instance,,this.onInviteDataUpdate,this);

        //ccserver.addEventListener(CCGlobalEventNames.JOIN_PGAME_REP, this.onJoinRep, this);
        ccserver.addEventListener(CCGlobalEventNames.START_PGAME_REP, this.onStartGameRep, this);
        
        // let em: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
		// em.registerOnObject(this, ccserver, CCGlobalEventNames.USER_MODIFY_USER_INFO_REP, this.onModifyUserInfoRep, this);
    }

    private onJoinRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            CCDDZPanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{

        }
    }

    private onStartGameRep(event: egret.Event): void {
        let data: any = event.data;
        if(data.result != 0){
            CCDDZPanelAlert.instance.show('错误编号'+ data.result, 0);
        }else{
            // if(this.game == CCGlobalGameConfig.ROOM_NAMES_URLS[CCGlobalGameConfig.game_Type_qznn])
            //     {
            //         GameLogic.roomType = CCGlobalGameConfig.game_Type_qznn;
            //         AppControl.getInstance().showPage(QznnGamePage,false,CCGlobalGameConfig.game_Type_qznn,0,this.roomScore,0,0,CCGlobalGameConfig.game_team);
            //     }
            CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, this.roominfo, CCalien.CCDDZsceneEffect.CCDDFade);
        }
    }

    private onShare(event: egret.TouchEvent): void {
        // ccserver.CreatePersonalGameReq(1, this.basescore[this.info3.Index], this.roundcnt[this.info1.Index], 
        // this.maxodd[this.info2.Index], this.scorelimit[this.info4.Index]);
    }

    private onStart(event: egret.TouchEvent): void {
        ccserver.StartPGameReq(this.roomid);
        
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