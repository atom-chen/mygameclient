import PDKEventManager = PDKalien.PDKEventManager;
/**
 * Created by rockyl on 16/3/9.
 *
 * 房间场景
 */

class PDKSceneRoom extends PDKalien.SceneBase {
    private gold: PDKGold;
    private labNickName: eui.Label;
    private avatar: PDKAvatar;
    private grpTop: eui.Group;
    private grpBottom: eui.Group;
    private navigator: PDKalien.Navigator;
    private btnLobby: eui.Button;
    private imgRoomTitle: eui.Image;
    private grpRed: eui.Group;

    private _self: PDKUserInfoData;
    /**
     * 抽红包按钮
     */
    private redBtn: eui.Button;
    /**
     * 红包余额
     */
    private lbRedCoin: eui.Label;
    private _sceneAnimationDuration: number = 500;
    private _wave: PDKalien.Wave;
    private grpRedCoinAnnounce: eui.Group;

    /**
     * 客服按钮
     */
    private keFuBtn: eui.Button;
    /**
     * 任务按钮 zhu
     */
    private taskGroup: eui.Group;
    /**
     * 任务按钮右上角的小红点
     */
    private mOverTaskBg_img: eui.Image;
    /**
     * 任务按钮右上角的完成任务的数量
     */
    private mOverTask_label: eui.Label;

    /**
     * 首充背景
     */
    private mFRechageBg_img: eui.Image;

    /**
     * 点击下载App 
     */
    private downAppGroup: eui.Group;

    /**
     * 跑马灯初始的水平方向限定
     */
    private _rollMsgHorizontal: number;

    /**
     * 下载app按钮上的光效
     */
    private downLight_img: eui.Image;
    /**
     * 钻石栏
     */
    private diamond: PDKGold;

    private rollMsg: PDKMarqueeText;
    /**
     * 是否可以显示首充和签到奖励（只在大厅里面显示）
     */
    private _bInLobby: boolean;

    /**
     * 签到按钮
     */
    private signBtn: eui.Button;

    /**
     * 设置按钮
     */
    private settingBtn: eui.Button;

    /**
     * 商城按钮
     */
    private rechargeGroup: eui.Button;

    /**
     * 邀请列表
     */
    private inviteGroup: eui.Group;

    /**
     * 返回group
     */
    private backGroup: eui.Group;

    /**
     * 活动按钮
     */
    private actGroup: eui.Group;

    /**
     * 邮件按钮
     */
    private emailGroup: eui.Group;

    /**
     * 关注微信公众号
     */
    private publicWXGroup: eui.Group;

    /**
     * 提示微信公众号变更
     */
    private tipWxImg: eui.Image;

    /**
     * 红包的兑
     */
    private redExchangeImg: eui.Image;

    /**
     * 红包栏
     */
    private grpRedcoin: eui.Group;

    /**
     * 活动按钮上的小红点
     */
    private newActBgImg: eui.Image;

    /**
     * 当前第三方游戏的显示容器
     */
    private _curGameContainer: any;

    /**
     * 当前是否显示签到
     */
    private _bShowSign: boolean;

    /**
     * 红包个数背景
     */
    private redCountBgImg: eui.Image;

    /**
     * 红包个数
     */
    private redNumLabel: eui.Label;

    /**
     * 分享按钮
     */
    private grpShare: eui.Group;

    /**
     * 是否在首页
     */
    private _isHome: boolean;

    private _rechargeTit = {
        [10047]: "初级场复活礼包", //不带记牌器
        [10048]: "中级场复活礼包", // old
        [10049]: "高级场复活礼包", // old
        [10052]: "中级场复活礼包", // new-20180828
        [10053]: "高级场复活礼包", // new-20180828
    }

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.PDKSceneRoomSkin;

        this._self = PDKMainLogic.instance.selfData;
    }

    createChildren(): void {
        super.createChildren();
        this._rollMsgHorizontal = this.rollMsg.horizontalCenter;
        this.navigator.push(PDKPageChannels);
        this.onNavigate(null);
        //		this.btnLobby.visible = false;//!PDKalien.Native.instance.isNative;

        //		PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_WAITING, {content: PDKlang.waiting_for_getting_information});
        // PDKInviteService.instance.getInvitePlayersList();
        //		this.grpButton.y = PDKalien.Native.instance.isNative ? 0 : 70;


        let e: PDKalien.PDKEventManager = PDKEventManager.instance;
        // e.registerOnObject(this,pdkServer,PDKEventNames.USER_CHECK_RECONNECT_REP,this.onCheckReconnectRep,this);    
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.MY_USER_INFO_UPDATE, this.onMyUserInfoUpdate, this);
        e.registerOnObject(this, this.grpBottom, egret.TouchEvent.TOUCH_TAP, this.onGrpBottomTap, this);
        e.registerOnObject(this, this.gold, egret.TouchEvent.TOUCH_TAP, this._onClickGold, this);
        e.registerOnObject(this, this.diamond, egret.TouchEvent.TOUCH_TAP, this._onClickDiamond, this);
        e.registerOnObject(this, this.grpRedcoin, egret.TouchEvent.TOUCH_TAP, this._onClickExchange, this);
        e.registerOnObject(this, this.navigator, PDKalien.Navigator.NAVIGATE, this.onNavigate, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.SHOW_ANNOUNCE, this.showAnnounce, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.SHOW_LOTTERY, this.showLotteryLuck, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.USER_FRREWARD_GET_SUCC, this._onFRechargeRewGetSucc, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.USER_DTREWARD_GET_SUCC, this._onDayTaskRewGetSucc, this);

        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.HORN_TALK_RECORDS_CHANGE, this._onHornRecChange, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.BAG_INFO_REFRESH, this._onBagRefresh, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.BUY_REVIVE_SUCC, this._onBuyReviveSucc, this);
        e.registerOnObject(this, PDKMailService.instance, PDKEventNames.MAIL_UNREAD_UPDATE, this._onMailUnreadUpdate, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.USER_RED_COUNT_CHANGE, this._onUserRedCountChange, this);
        e.registerOnObject(this, PDKalien.Dispatcher, PDKEventNames.FRECHARGE_HASUPDATE, this._onFRechargeUpdate, this);
        pdkServer.addEventListener(PDKEventNames.USER_GET_ACTInfo_REP, this._onRecvGetActInfoRep, this);
        pdkServer.addEventListener(PDKEventNames.USER_GET_REWARD_REP, this._onRecvGetActRewRep, this);
        pdkServer.addEventListener(PDKEventNames.JOIN_PGAME_REP, this.onJoinRep, this);
        pdkServer.addEventListener(PDKEventNames.USER_DiamondGame_REP, this._onNewPlayerDiamonRewInfoRep, this);
        pdkServer.addEventListener(PDKEventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);
        pdkServer.addEventListener(PDKEventNames.USER_RECHARGE_RESULT_NOTIFY, this.onRechargeResultNotify, this);

        PDKalien.Dispatcher.addEventListener(PDKEventNames.ACT_RED_CHANGE, this._initActRed, this);


        if (PDKMsgInfoService.instance.announce) {
            this.showAnnounce(null);
        }
    }

    /**
     * 设置是否在首页
     */
    private _setIsHome(home: boolean): void {
        this._isHome = home;
    }

	/**
	 * 首充状态改变
	 */
    private _onFRechargeUpdate(): void {
        let _data = PDKMainLogic.instance.selfData;
        if (!_data.isNotBuyFRecharge()) {
            this.mFRechageBg_img.visible = false;
            if (!_data.isGetTodayFRechargeRew() && !_data.isFRechargeRewGetOver()) {
                // PDKPanelFRGetRew.getInstance().show();
            }
        }
    }
    /**
     * 点击客服
     */
    private _onClickKefu(): void {

        //PDKwebService.rechagre(10011)

        let _str = PDKGameConfig.wxService
        let _ins = PDKPanelAlert3.instance;
        _ins.show("微信客服:" + _str, 0, function (act) {
            if (act == "confirm") {
                //PDKGameConfig.copyText(this.parent, _str, "微信号(" + _str + ")");
            } else if (act == "cancel") {
                PDKPanelActAndNotice.getInstance().showRedExchange();
            }
        }, true);

        // _ins.btnCancel.labelIcon = "pdk_room_redErr";
        // _ins.btnConfirm.labelIcon = "pdk_common_copyWX";
    }

    /**
     * 点击商城
     */
    private _onClickRecharge(): void {
        if (pdkServer._isInDDZ == true) {
            this.openDDZShop();
        }
        else {
            PDKPanelExchange2.instance.show();
        }
    }

    /**
     * 使能事件
     */
    private _enableEvent(bEnable: boolean): void {
        let _func = "addEventListener";
        if (!bEnable) {
            _func = "removeEventListener"
        }
        this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
        this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
        this.mFRechageBg_img["addClickListener"](this._onClickFRecharge, this);
        this.signBtn["addClickListener"](this._onClickSign, this);
        this.keFuBtn["addClickListener"](this._onClickKefu, this);
        this.settingBtn["addClickListener"](this._onClickSetting, this);
        this.taskGroup["addClickListener"](this._onClickTask, this);
        this.rechargeGroup["addClickListener"](this._onClickRecharge, this);
        this.inviteGroup["addClickListener"](this._onClickInvite, this);
        this.redBtn["addClickListener"](this._onClickGetRed, this);
        this.backGroup["addClickListener"](this._onClickBack, this);
        this.actGroup["addClickListener"](this._onClickAct, this);
        this.emailGroup["addClickListener"](this._onClickEmail, this);
        this.redExchangeImg["addClickListener"](this._onClickExchange, this);
        this.publicWXGroup["addClickListener"](this._onClickWatchWX, this);
        this.grpShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onGrpShareTap, this);

        PDKalien.Dispatcher[_func](PDKEventNames.SHOW_PAYCHAT, this.showLaba, this);
    }

    private showLaba(e: egret.Event): void {
        this.rollMsg.show();
    }

	/**
     * 点击分享
     */
    private _onGrpShareTap(event: egret.TouchEvent): void {
        //if (!PDKalien.Native.instance.isNative) {  // 非native 也就是web平台的 调起分享提示页面
        //    PDKPanelShare.instance.showInviteFriend()
        // } else { // native端 直接调起分享 分享到朋友圈
        //     let _helper = PDKWxHelper;
        //     _helper.shareDownApp(null);
        // }
        //window.top.location.href = 'http://www.baidu.com';
        //跳转分享页面
        let userData: PDKUserData = PDKUserData.instance;
        let uid = userData.getItem('uid');
        PDKwebService.getShareAddr(uid, (response) => {
            if (response.code == 0) {
                window.top.location.href = response.data.url;
            }
        });
    }

    /**
     * 初始化邮件右上角的小红点和新邮件数量
     */
    private _showEmailDefaultUnreadNum(num: number): void {
        let bShow = false;
        if (num > 0) {
            bShow = true;
        }
        this["newEmailNumLabel"].text = "" + num;
        this["newEmailNumLabel"].visible = bShow;
        this["newEmailBgImg"].visible = bShow;
    }

    /**
     * 未读邮件数量变化
     */
    private _onMailUnreadUpdate(e: egret.Event): void {
        let data = e.data;
        if (data && data.count >= 0) {
            this._showEmailDefaultUnreadNum(data.count);
        }
    }

    /**
     * 显示活动
     */
    private _onClickAct(): void {
        PDKPanelActAndNotice.getInstance().showThanksgiving();
    }

    /**
     * 点击邮件
     */
    private _onClickEmail(): void {
        PDKPanelMail.getInstance().show();
    }

    /**
     * 点击红包栏的兑
     */
    private _onClickExchange(): void {
        if (pdkServer._isInDDZ == true) {
            this.openDDZShop(2);
        }
        else {
            PDKPanelExchange2.instance.show(2);
        }
    }

    /**
     * 商城金豆
     */
    private _onClickGold(): void {
        if (pdkServer._isInDDZ == true) {
            this.openDDZShop();
        }
        else {
            PDKPanelExchange2.instance.show();
        }
    }

    private openDDZShop(flag = 0) {
        pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: flag });
    }

    /**
     * 商城钻石
     */
    private _onClickDiamond(): void {
        if (pdkServer._isInDDZ == true) {
            this.openDDZShop(1);
        }
        else {
            PDKPanelExchange2.instance.show(1);
        }
    }

    /**
     * 播放滚动的光效
     */
    private _playLight(srcImg: eui.Image, maskImg: eui.Image): void {
        srcImg.mask = maskImg;
        let _srcX = maskImg.x;
        let _srcY = maskImg.y;
        let _toX = srcImg.x + srcImg.width + 10;
        let _func = null;

        _func = function () {
            egret.Tween.get(maskImg).to({ x: _toX, y: _srcY }, 1000).wait(500).to({ x: _srcX, y: _srcY }, 500).call(() => {
                _func();
            })
        }
        _func();
    }

    /**
     * 关注微信公众号
     */
    private _onClickWatchWX(): void {
        this._saveHasClickWatchWX();
        this._clearTipWX();
        PDKPanelFollowCourse.instance.show();
    }

    /**
	 * 	加入舞台
	 */
    private _onAddToStage(): void {
    }
	/**
	 * 从场景移除
	 */
    private _onRemovedToStage(): void {
        this._enableEvent(false);
    }

    // private checkAnnounce():void{
    //     if(PDKExchangeService.instance.announce && !this.grpRedCoinAnnounce.contains(PDKMarqueeText.getInstance())){
    //         this.grpRedCoinAnnounce.addChild(PDKMarqueeText.getInstance());
    //         PDKMarqueeText.getInstance().show();
    //     }
    // }

    private showAnnounce(e: egret.Event): void {
        this.rollMsg.show(false); //显示完不自动隐藏
    }

    /**
     * 显示夺宝中将信息
     */
    private showLotteryLuck(e: egret.Event): void {
        this.rollMsg.show(false);
    }

    // private onCreatePGameCLick(event: egret.Event): void {

    //     PDKCreateTable.instance.show();//this.onCloseInvite.bind(this)
    // }

    // private onJoinPGameCLick(event: egret.Event): void {
    //     PDKJoinTable.instance.show();//this.onCloseInvite.bind(this)
    // }

    // private onPGameHistoryCLick(event: egret.Event): void {
    //     PDKInviteService.instance.clearInvitePlayersList();
    //     PDKInviteService.instance.getInvitePlayersList();
    //     PDKPanelInviteList.instance.show(PDKInviteService.instance.source, this.onCloseInvite.bind(this));
    // }

    /**
     * 点击邀请列表
     */
    private _onClickInvite(): void {
        PDKInviteService.instance.clearInvitePlayersList();
        PDKInviteService.instance.getInvitePlayersList();
        PDKPanelInviteList.instance.show(PDKInviteService.instance.source, this.onCloseInvite.bind(this));

        // var testcards = [
        //     [121, 120, 112, 111, 110, 101, 100, 91, 90, 81, 80],
        //     [12,22,41,82,120,130,150],
        //     [20,23,30,31,51,62,73,92,93,110,112,121,123,140,150],  
        //     [13,71,72,73,82,83,110,112,113,121,122,130,131],
        //     [52,53,81,82,83,92,93,120,121,123,130,150],
        //     [10,12,13,22,23,81,82,83,92,91,120,123,150],
        //     [10,11,12,13,51,71,81,91,120,130,150],
        //     [10,13,51,52,81,82,90,91,92,93,120,130],
        //     [10,20,21,22,23,31,61,81,82,100,102,130,131],
        //     [10,22,31,61,62,71,80,81,82,83,91,100,102,130,131],
        //     [10,11,20,21,22,23,31,32,81,82,100,102,103],
        //     [10,22,23,31,61,62,71,72,80,81,82,83,91,92,100,102,131],
        //     [10,11,22,23,31,61,62,80,81,82,83,100,102,130,131],
        //     [10,11,12,13,20,21,22,23,51,52,72,73,100,111,112,130,150],
        //     [10,12,21,20,51,52,53,82,83,100,101,102,103,110,111,112,113],
        //     [31,32,41,42,51,61,71,81,91,92,100,110],
        //     [10,11,30,33,40,51,60,61,62,72,90,92,101,103,112,113,150],
        //     [10,11,12,20,21,22,31,51,62,72,73,81,82,120,121,130],
        //     [10,12,21,22,51,53,61,81,82,83,91,92,93,110,112],
        // ]

        // for(var i = 0; i < testcards.length; ++i){
        //     PDKCardsHint.printCards(testcards[i], '第' + i + '组:');
        //     var xx = PDKCardsHint.getMaxAmountCards(testcards[i]);
        //     PDKCardsHint.printCards(xx);
        //     console.log('\n\n');
        // }

        // var testcards1 = [
        //     [121, 120, 122, 121],
        //     [21, 20, 22, 21],
        //     [31, 30, 32],
        //     [21, 20, 22, 21],
        //     [21, 20, 22, 21],
        // ]

        // var testcards2 = [
        //     [],
        //     [11, 10, 12, 11],
        //     [11],
        //     [11, 10],
        //     [10,11,12]
        // ]

        // for(var j = 0; j < 5; ++j){
        //      PDKCardsHint.printCards(testcards1[j]);
        //      PDKCardsHint.printCards(testcards2[j]);
        //     for(var i = 0; i < 4; ++i){
        //         console.log('answer i: ' + i);
        //         PDKCardsHint.printCards(PDKCardsHint.getFitCards(testcards1[j], i, testcards2[j]));

        //     }

        //      console.log('\n\n\n');
        // }

    }

    private onCloseInvite(): void {
        // this.removeChild(this.inviteList);
    }

    /**
     * 是否显示返回按钮
     */
    private _showBackGroup(bShow: boolean): void {
        this.backGroup.visible = bShow;
    }

    /**
     * 显示分享按钮
     */
    private _showGrpShare(bShow: boolean): void {
        this.grpShare.visible = false;
        if (1) return;
        if (bShow && !PDKalien.Native.instance.isNative) {
            bShow = false;
        }
        bShow = true;
        this.grpShare.visible = bShow;
    }

    private onNavigate(event: egret.Event): void {
        PDKWxHelper.doWebH5ShareCfg();
        if (!event || event.data.page instanceof PDKPageChannels) {
            //this.imgRoomTitle.source = PDKResNames.room_word_25;
            this.imgRoomTitle.source = 'pdk_title_new';
            this._showBackGroup(false);
            this._setIsHome(true);
            if (PDKalien.Native.instance.isNative && egret.Capabilities.os == "Android") {
                this._showBackGroup(true);
            }
            this._showWatchWX(true);
            this._showGrpShare(true);
            this._resetRollMsgHorizontal();
        } else {
            this._setIsHome(false);
            this._showWatchWX(false);
            this._showBackGroup(true);
            this._onChangeCenterHornPos();
            // if (event.data.page instanceof PDKPageNormalChannel) {
            //     this.imgRoomTitle.source = PDKResNames.room_word_30;
            //     this._showGrpShare(true);
            // } else {
            //     this.imgRoomTitle.source = PDKResNames.room_word_23;
            //     this._showGrpShare(false);
            // }
        }
    }

    private onGrpBottomTap(event: egret.TouchEvent): void {
        switch (event.target.name) {
            /*case 'bank':
                let self: PDKUserInfoData = PDKMainLogic.instance.selfData;
                console.log("tap bank button: " + self.bindphone);
                if(self.bindphone) {
                    this.showBank();
                } else {
                    PDKalien.Native.instance.bindThirdPart(0,(data: any) => {
                        if(data.code == 0) {
                            this.showBank();
                        }
                    });
                }
                break;
                */
            case 'home_page':
                break;
            case 'add_favorite':

                break;
            case 'avatar':
                if (pdkServer._isInDDZ) {
                    let _info = PDKMainLogic.instance.selfData;
                    let _win = _info.totalwincnt;
                    let _lose = _info.totallosecnt;
                    let _raw = _info.totaldrawcnt;
                    let _total = (_win + _lose + _raw) || 1;
                    let _rate = Math.floor(100 * _win / _total);
                    let _data = _info
                    _data.winRate = _rate;
                    _data.base64 = false;
                    _data.game = _total;
                    _data.isPlaying = (pdkServer.playing ? true : false);
                    console.log("_onTouchHead-----inpdk---111----->", _data);
                    pdkServer.ddzDispatchEvent(1, '', { type: 8, data: _data });
                }
                else {
                    PDKPanelProfile.instance.show(() => {
                        PDKMainLogic.instance.refreshSelfInfo();
                    });
                }
                break;
        }
    }

    private showBank(): void {
        /*let self: PDKUserInfoData = PDKMainLogic.instance.selfData;
        if(self.havesecondpwd) {
            if(PDKalien.Native.instance.isNative || PDKUserData.instance.getItem('type') == 1) { //正式账号
                PanelBank.instance.show(this.onPanelBankResult.bind(this));
            } else {  //游客账号
                if(BankService.instance.bankgold >= 10 * PDKGameConfig.rechargeRatio) {
                    Alert2.show(PDKlang.bind_phone_notice,'common_btn_to_register',(action) => {
                        if(action != 'close') {
                            PDKPanelBindPhone.instance.show(this.onPanelBindPhoneResult.bind(this));
                        }
                    });
                } else {
                    PanelBank.instance.show(this.onPanelBankResult.bind(this));
                }
            }
        } else {
            PanelSetPassword.instance.show(this.onPanelSetPasswordResult.bind(this));
        }*/
    }

    /**
     * 点击返回
     */
    private _onClickBack(): void {
        if (pdkServer._isInDDZ == true) {
            this.quitGame();
            return;
        }
        if (this._isHome) {
            PDKPanelAlert.instance.show("再赢几局就能拿奖杯了，真的要离开吗？", 0, function (act) {
                if (act == "confirm") {
                    PDKalien.Native.instance.closeApp();
                }
            });
        } else {
            this.navigator.pop();
        }
    }

    private quitGame() {
        PDKalien.StageProxy.removeEvent();
        pdkServer.ddzDispatchEvent(1, '', { type: 1 });
    }

    /**
     * 返回上个页面
     */
    public doBack(): void {
        this._onClickBack();
    }

    private onPanelBindPhoneResult(action: string): void {
        /* if(action == 'bind_phone') {
             PanelBank.instance.show(this.onPanelBankResult.bind(this));
         }
         */
    }

    /**
     * 进入钻石场前先校验钻石数是否够
     */
    private checkRedNormalDiamondNum(bTow: boolean = false, roomid: number = 9002): void {
        let _roomInfo = PDKGameConfig.getRoomConfigById(roomid);
        let _diamond = PDKBagService.instance.getItemCountById(3);
        if (_roomInfo.minScore > _diamond) {//钻石不足
            PDKMainLogic.instance.noDiamondGetNewDiamondRewOrBuyRevive(_roomInfo.minScore, roomid);
            return;
        }

        PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'quick_join', roomID: roomid }, PDKalien.sceneEffect.Fade);
    }
	/**
	 * 当检查到重连回复
	 *
	 * @param event
	 *
	 required int32 roomid = 1;
	 required int32 session = 2;
	 required int32 clientid = 3;
	 */
    private onCheckReconnectRep(event: egret.Event): void {
        let data: any = event.data;

        let gameId: number = Math.floor(data.roomid / 1000);
        let needReconnect: boolean = data.roomid > 0 && (data.roomid < 1000 || data.roomid == 5001 || data.roomid == 5101 || gameId == PDKGameConfig.gameId);

        if (data.roomid > 999 && data.roomid < 10000 && data.gametype == 2) {
            PDKSceneManager.show(PDKSceneNames.PLAY, { personalgame: true, action: 'reconnect', roomID: data.roomid }, PDKalien.sceneEffect.Fade);
        } else if (needReconnect) {    //有重连
            PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'reconnect', roomID: data.roomid }, PDKalien.sceneEffect.Fade);
        } else {                  //没有重连
            let _pageChannel: PDKPageChannels = <PDKPageChannels>this.navigator.currentPage;
            let _bTowGame: boolean = _pageChannel.isClickTwoGame && _pageChannel.isClickTwoGame();
            if (_pageChannel.isClickRedRoom && _pageChannel.isClickRedRoom()) {
                this.checkRedNormalDiamondNum(_bTowGame, _pageChannel.getClickRoomID());
            } else {
                //自动匹配
                // let roomid:number = _pageChannel.getClickRoomID();
                // PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY,{ action: 'quick_join',roomID: roomid },PDKalien.sceneEffect.Fade);
                // return;
                let _pageChannel: PDKPageChannelBase = (<PDKPageChannelBase>this.navigator.currentPage);
                let room: any = _pageChannel.selectedRoom
                if (!room) return;
                _pageChannel.selectedRoom = null;
                if (room.roomType == 2) {
                    pdkServer.getMatchSignUpInfo(room.matchId);
                } else if (room.roomType == 1) {
                    if (this._self.gold > room.maxScore) {
                        // PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY,{ action: 'quick_join',roomID: room.roomID },PDKalien.sceneEffect.Fade);
                        var conf = PDKGameConfig.getSuitableRoomConfig(this._self.gold, room.roomFlag);
                        PDKAlert3.show('您拥有的金豆大于' + room.maxScore + '\n推荐进入' + conf.name + '游戏', this.joinSpecialRoom.bind(this, conf.roomID), 'pdk_common_btn_enter_h', true);
                    } else if (this._self.gold >= room.minScore) {
                        PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'quick_join', roomID: room.roomID }, PDKalien.sceneEffect.Fade);
                    } else {
                        // PDKAlert.show(PDKlang.noMoreGold2,0,null);
                        PDKPanelRechargeTips.instance.show();
                    }
                }
            }
        }
    }

    private joinSpecialRoom(roomid: number): void {
        if (roomid && PDKGameConfig.getRoomConfigById(roomid)) {
            PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'quick_join', roomID: roomid }, PDKalien.sceneEffect.Fade);
        }
    }

    /**
     * 显示新手金豆奖励
     */
    private _onShowNewReward(): void {
        PDKPanelFreshManReward.instance.show();
    }

	/**
	 * 当我的玩家信息
	 * @param event
	 */
    private onMyUserInfoUpdate(event: egret.Event = null): void {
        let userInfoData: PDKUserInfoData = (event && event.data) ? event.data.userInfoData : this._self;
        if (!userInfoData.uid) return;

        let nDiamond: any = PDKBagService.instance.getItemCountById(3);
        this.diamond.updateGold(nDiamond);
        this.gold.updateGold(userInfoData.gold);

        this.lbRedCoin.text = "" + (this._self.redcoin == null ? "0.00" : PDKUtils.exchangeRatio(this._self.redcoin / 100, true));

        this._showEmailDefaultUnreadNum(0);

        this._showDayTaskDefaultByOverNum(userInfoData.getDayTaskOverCount());
        this._initTaskRedImg();
        this._initActRed();
        this._initRedNum();
        this.avatar.setVipLevel(userInfoData.getCurVipLevel());
        if (userInfoData.imageid) {
            this.avatar.imageId = userInfoData.imageid;
        }

        if (userInfoData.nickname) {
            let _nameStr = userInfoData.nickname.substr(0, 10);
            this.labNickName.text = _nameStr + "(" + userInfoData.fakeuid + ")";

            //zhu 暂时屏蔽 this.checkNickname();
            this.checkShareRoom();
        }
    }

    /**
     * 显示活动上的小红点
     */
    private _showActRed(bShow: boolean): void {
        //zhu 暂时隐藏 this.newActBgImg.visible = bShow;
    }

    /**
     * 初始化活动
     */
    private _initActRed(): void {
        if (this._self.shouldShowActRed()) {
            this._showActRed(true);
        } else {
            this._showActRed(false);
        }

    }

    //第一次进入游戏则任务上显示小红点
    private _initTaskRedImg(): void {
        if (this._self.shouldShowTaskRed()) {
            this._showTaskRedImg(true)
        }
    }

    private checkShareRoom(): void {
        let _pdk_nativeBridge = PDKalien.Native.instance;
        let _param = _pdk_nativeBridge.getUrlArg();
        let _shareRoom: string = _param.share_room;
        let _roomNumber = Number(_shareRoom);
        if (_roomNumber) {
            //          -----------------自动加入牌局----------------
            pdkServer.JoinPGameReq(_roomNumber);
        }
    }

    private checkNickname() {
        if (PDKMainLogic.instance.checkNicknameCount == 0) {
            if (this._self.nickname.match(/^用户\w{15}/)) {
                PDKPanelModifyNickname.instance.show();
            }
            PDKMainLogic.instance.checkNicknameCount++;
        }
    }

    /**
     * 点击抽红包
     */
    private _onClickGetRed() {
        let _nTot: number = Number(this.redNumLabel.text);
        if (!_nTot || _nTot <= 0) {
            PDKAlert.show("游戏赢5局即可抽取，是否前往", 1, function (act) {
                if (act == "confirm") { //确定前往
                    PDKalien.Dispatcher.dispatch(PDKEventNames.TO_NORMAL_MATCH);
                }
            });
            return;
        }
        let _info = this._self.getOneNorRoomRedFromSmall();
        if (_info && _info.roomid) {
            PDKExchangeService.instance.doChou(_info.roomid);
        }
    }

    /**
     * 显示首充界面
     */
    private _showFRecharge(): void {
        if (!this._bInLobby) return;
        //PDKPanelActAndNotice.getInstance().showFRecharge();
        PDKPanelFirstRechargeNew.getInstance().show();
    }

    /**
     * 签到界面和签到奖励相关的光效
     */
    private _onSignEffectLoadOver(event: RES.ResourceEvent): void {
        if (!this._bInLobby) return;
        if (event.groupName == "pdksignAndEmail") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onSignEffectLoadOver, this);
            PDKPanelSign.getInstance().show();

            let _data = this._self;
            if (_data.freshrewardgot && _data.freshrewardgot == 1) {
                this._onShowNewReward();
            }
        }
    }

    /**
     * 显示签到界面
     */
    private _showSignRew(): void {
        if (RES.isGroupLoaded("pdksignAndEmail")) {
            PDKPanelSign.getInstance().show();
            return;
        }
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onSignEffectLoadOver, this);
        RES.loadGroup("pdksignAndEmail")
    }

    /**
     * 邮件合图加载完毕
     */
    private _onMailEffectLoadOver(event: RES.ResourceEvent): void {
        if (!this._bInLobby) return;
        if (event.groupName == "pdksignAndEmail") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onMailEffectLoadOver, this);
            PDKPanelMail.getInstance().show();
        }
    }

    /**
     * 显示邮件
     */
    private _showEmail(): void {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onMailEffectLoadOver, this);
        RES.loadGroup("pdksignAndEmail")
    }

	/**
	 * 获取购买首充的弹出信息
	 */
    private _getThanksPopTimeStamp(): any {
        let _stamp: string = PDKalien.localStorage.getItem("PopThanksTime");
        return Number(_stamp);
    }

	/**
	 * sTimeStamp:时间戳 每天首次弹出购买首充的时间戳
	 */
    private _recordThanksPopTimeStamp(): void {
        let _sTimeStamp = new Date().getTime();
        PDKalien.localStorage.setItem("PopThanksTime", "" + _sTimeStamp);
    }

    /**
     * 是否需要弹出首充购买界面
     */
    private _isShouldPopThanks(): boolean {
        let _stamp = this._getThanksPopTimeStamp();
        if (_stamp) {
            let _curDay = new Date().getDate();
            let _lastDay = new Date(_stamp).getDate();
            if (_lastDay + 1 > _curDay) {
                return false;
            }
        }
        return true;
    }

    /**
     * 初始化感恩节
     */
    private _initThanks(): void {
        if (PDKUtils.isInTimeSection("2017-11-23 00:00:00", "2017-11-26 00:00:00", new Date().getTime())) {
            if (this._isShouldPopThanks()) {
                this._recordThanksPopTimeStamp();
                PDKPanelActAndNotice.getInstance().showThanksgiving();
            }
        }
    }
    /**
	 * 签到查询返回
	 * @param event
	 */
    private onSignInRep(event: egret.Event): void {
        pdkServer.removeEventListener(PDKEventNames.USER_DAY_SIGN_IN_REP, this.onSignInRep, this);
        //this._initFRecharge();
        if (1) return;
        this._initThanks();
        let _data = this._self;
        if (event.data.today != 1) { //today 1今天已签到 0今天未签到
            _data.setTodaySigned(false);
            if (!_data.isNotBuyFRecharge() && _data.frechargerewardday != null) {
                //今天未领取并且领取过首充奖励 否则还是点击首充按钮领取首充,全部奖励未领取完
                // if (!_data.isGetTodayFRechargeRew() && !_data.isFRechargeRewGetOver()) {
                //     PDKPanelFRGetRew.getInstance().show(); //显示首充今日的领取奖励面板
                // }
            }
            this._bShowSign = true;
            this._showSignRew();
        }
        else { //已签到
            this._bShowSign = false;
            _data.setTodaySigned(true);
            if (!_data.isNotBuyFRecharge()) {
                if (_data.isGetTodayFRechargeRew()) {
                    PDKMainLogic.instance.alms();//签到了才可以领取救济金
                }
                else {
                    //今天未领取并且领取过首充奖励 否则还是点击首充按钮领取首充,全部奖励未领取完
                    // if (_data.isHadGetFRechargeRew() && !_data.isFRechargeRewGetOver()) {
                    //     PDKPanelFRGetRew.getInstance().show(); //显示首充今日的领取奖励面板
                    // }
                    // else {
                    //     PDKMainLogic.instance.alms();
                    // }
                    PDKMainLogic.instance.alms();
                }
            }
            else {
                PDKMainLogic.instance.alms();//签到了才可以领取救济金
            }
        }

        if (_data.freshrewardgot && _data.freshrewardgot == 1) {
            if (this._bShowSign) return;
            this._onShowNewReward();
        }
    }

    private onHappyBeanConsumeRep(e: egret.Event): void {
        PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
        if (e.data.result == 0) {
            PDKAlert.show(PDKlang.exchange_succ1);
            //this.game8868Bean.updateGold(Number(PDKMainLogic.instance.selfData.beans));
        }
    }

    private onHappyBeanExchangeRep(e: egret.Event): void {
        PDKalien.Dispatcher.dispatch(PDKEventNames.HIDE_WAITING);
        if (e.data.result == 0) {
            PDKAlert.show(PDKlang.exchange_succ2);
        }
    }
    beforeShow(params: any, back: boolean): void {
        PDKalien.PopUpManager.removeAllPupUp();
        //占时关闭APP福利 
        //this.downAppGroup.visible = false;
        // this.grpShare.visible = true;
        // this.inviteGroup.visible = true;
        if (!PDKalien.Native.instance.isNative) {
            this.grpShare.visible = false;
            //this.inviteGroup.visible = false;
        }
        this.newActBgImg.visible = false;

        this._setIsHome(true);
        this._bInLobby = true;
        this._bShowSign = false;
        this.rollMsg.visible = true; //zhu 默认显示
        this.redNumLabel.visible = false;
        this.redCountBgImg.visible = false;
        this.rollMsg.enableSendHorn(false);
        this.rollMsg.setInLobby(true);
        this._enableEvent(true);
        this._resetRollMsgHorizontal();
        this._initRedNum();
        this._initTipWX();
        //this._initNationalBtn();
        PDKwebService.getHornRec(this._onHttpRecvHornRec.bind(this));
        PDKwebService.loadLog(2, 0);
        PDKalien.PDKEventManager.instance.enableOnObject(this);
        this.onMyUserInfoUpdate();
        this.navigator.active();

        pdkServer.addEventListener(PDKEventNames.USER_DAY_SIGN_IN_REP, this.onSignInRep, this);
        // pdkServer.getSignInInfo();

        //app 登录直接领奖励
        pdkServer.reqDownAppRewInfo();
        PDKBagService.instance.refreshBagInfo();
        let duration = this._sceneAnimationDuration;

        egret.Tween.get(this.grpTop).to({ top: -this.grpTop.height }).wait(duration).to({ top: 0 }, duration, egret.Ease.cubicOut);
        egret.Tween.get(this.grpBottom).to({ bottom: -this.grpBottom.height }).wait(duration).to({ bottom: 0 }, duration, egret.Ease.cubicOut);

        this.rollMsg.visible = true;
        this.rollMsg.showLast(2);

        //this.checkBindWx();
        PDKalien.PDKSoundManager.instance.playMusic(PDKResNames.pdk_bgm);

        if (params) {
            if (params.hasOwnProperty("jump2match")) {
                if (this.navigator.currentPage.skinName.name != "PDKPageMatchChannelSkin") {
                    this.navigator.push(PDKPageMatchChannel);
                }
            }
            else if (params.hasOwnProperty("jump2pdk")) {
                console.log("jump2pdk--------------->", this.navigator.currentPage.skinName.name)
                if (this.navigator.currentPage.skinName.name != "PDKPageNormalChannelSkin") {
                    this.navigator.push(PDKPageNormalChannel);
                }
            }
        }
    }

    beforeHide(): void {
        this._bInLobby = false;
        PDKEventManager.instance.disableOnObject(this);

        this.navigator.deactive();

        let duration = this._sceneAnimationDuration;
        egret.Tween.get(this.grpTop).to({ top: -this.grpTop.height }, duration, egret.Ease.cubicIn);
        egret.Tween.get(this.grpBottom).to({ bottom: 0 }, duration, egret.Ease.cubicIn);
    }

    /**
     * 点击任务按钮
     */
    private _onClickTask(): void {
        let _selfData = this._self;
        if (_selfData.shouldShowTaskRed()) {
            pdkServer.reqNewPlayerClickTask();
            _selfData.setNotShowTaskRed();
            this._showTaskRedImg(false);
        }
        PDKPanelDayTask.getInstance().show();
    }

    /**
     * 点击公告
     */
    private _onClickNotice(): void {
        PDKPanelActAndNotice.getInstance().showNotice();
    }

    /**
     * 初始化每日任务右上角的小红点和任务完成数量
     */
    private _showDayTaskDefaultByOverNum(num: number): void {
        let bShow = false;
        if (num > 0) {
            //zhu 暂时屏蔽 bShow = true;
        }
        this.mOverTask_label.text = "" + num;
        this.mOverTask_label.visible = bShow;
        this._showTaskRedImg(bShow);
    }
    /**
     * 点击首充
     */
    private _onClickFRecharge(): void {
        this._showFRecharge();
    }

    /**
     * 显示任务右上角的小红点
     */
    private _showTaskRedImg(bShow: boolean): void {
        this.mOverTaskBg_img.visible = bShow;
    }

    /**
     * 点击设置
     */
    private _onClickSetting(): void {
        // let cardsid = [20, 21, 22, 30, 31, 32, 40, 41, 42, 50, 51, 52, 60, 70, 80, 90]
        // var _cardType1 = PDKCardsType.GetType(cardsid);
        // console.log("_cardType1------->", _cardType1);
        // if (1) return;
        if (pdkServer._isInDDZ) {
            pdkServer.ddzDispatchEvent(1, '', { type: 3 });
        } else {
            PDKPanelSetting.instance.show();
        }
    }

    /**
     * 点击签到
     */
    private _onClickSign(): void {
        this._showSignRew();
    }
    /**
     * 播放首充动画
     */
    private _playFRechargeAni(): void {
        /*egret.Tween.removeTweens(this.mFRechageBg_img);
        
        //首充背景的抖动
        let _rotateFunc = null;
        _rotateFunc = function(self){
            egret.Tween.get(self.mFRechageBg_img).to({rotation:-20},100).to({rotation:20},100).to({rotation:-10},80).to({rotation:10},80).to({rotation:0},60).wait(1000).call(()=>{
                _rotateFunc(self);
            })
        }
        _rotateFunc(this);
        */
    }


    /**
     * 初始化首充按钮
     */
    private _initFRecharge(): void {
        let _curPage = this.navigator.currentPage;
        //不在大厅不初始化首充
        if (!(_curPage instanceof PDKPageChannels)) return;

        let _data = this._self;
        let _notBuy = _data.isNotBuyFRecharge();
        let _hadGetRew = _data.isHadGetFRechargeRew();
        if (!_notBuy) {
            this.mFRechageBg_img.visible = false;
            if (!_hadGetRew && _data.frechargerewardday != null && !_data.isFRechargeRewGetOver()) {
                // PDKPanelFRGetRew.getInstance().show();
                //this._playFRechargeAni();
            }
        }
        else {
            this.mFRechageBg_img.visible = true;
            //this._playFRechargeAni();
            let _bShouldPop = this._isShouldPopBuyFRecharge();
            if (_bShouldPop) {
                // this._showFRecharge();
                this._recordBuyFRechargePopTimeStamp();
            }
        }
    }


	/**
	 * 获取购买首充的弹出信息
	 */
    private _getBuyFRechargePopTimeStamp(): any {
        let _stamp: string = PDKalien.localStorage.getItem("PopFRTime");
        return Number(_stamp);
    }

	/**
	 * sTimeStamp:时间戳 每天首次弹出购买首充的时间戳
	 */
    private _recordBuyFRechargePopTimeStamp(): void {
        let _sTimeStamp = new Date().getTime();
        PDKalien.localStorage.setItem("PopFRTime", "" + _sTimeStamp);
    }

    /**
     * 是否需要弹出首充购买界面
     */
    private _isShouldPopBuyFRecharge(): boolean {
        let _stamp = this._getBuyFRechargePopTimeStamp();
        if (_stamp) {
            let _curDay = new Date().getDate();
            let _lastDay = new Date(_stamp).getDate();
            if (_lastDay + 1 > _curDay) {
                return false;
            }
        }
        return true;
    }

    /**
     * 首充今日奖励领取成功
     */
    private _onFRechargeRewGetSucc(): void {
        this.mFRechageBg_img.visible = false;
    }

    /**
     * 任务奖励领取成功
     */
    private _onDayTaskRewGetSucc(): void {
        let _num = this._self.getDayTaskOverCount();
        this._showDayTaskDefaultByOverNum(_num);
    }

    /**
     * 喇叭消息变化
     */
    private _onHornRecChange(e: egret.Event): void {
        this.rollMsg.show();
    }

    /**
     * 收到http 的喇叭消息记录回复
     */
    private _onHttpRecvHornRec(data): void {
        if (data && data.total_items > 0 && data.items) {
            data.items.reverse();
            let _selfData = this._self;
            _selfData.cleanLocalHornRecByHttp();
            for (let i = 0; i < data.total_items; ++i) {
                _selfData.addHornTalkRecByHttp(data.items[i]);
            }

            // this.rollMsg.showLast();
        }
    }

    /**
     * 获取到活动的回复（1 可以领取奖励 2 已经领取奖励）
     */
    private _onRecvGetActInfoRep(e: egret.Event): void {
        let data = e.data;
        if (data) {
            if (data.optype == 1) { //登录APP奖励
                if (data.params) {
                    if (data.params[0] == 1) {//
                        if (PDKalien.Native.instance.isNative) { //只有App端才可以领取
                            this._showGetRewDownAppBtn();
                        }
                        else {
                            this._showDownAppBtn();
                        }
                    }
                    else if (data.params[0] == 2) {
                        this._hideDownAppGroup();
                    }
                    else if (data.params[1] && data.params[1] == 1) { //未登录过APP且需要提醒\
                        //this._onClickDownApp();
                        if (!PDKalien.Native.instance.isNative) {//注册按钮点击
                            this._showDownAppBtn();
                        }
                    }
                    else {
                        if (PDKalien.Native.instance.isNative) { //没有条件需要隐藏按钮
                            this._hideDownAppGroup();
                        }
                        else { //H5版本需要显示下载
                            this._showDownAppBtn();
                        }
                    }
                }
                else { //不满足领取奖励条件
                    if (PDKalien.Native.instance.isNative) { //没有条件需要隐藏按钮
                        this._hideDownAppGroup();
                    }
                    else {
                        this._showDownAppBtn();
                    }
                }
            } else if (data.optype == 2) { //国庆活动信息
                //params[0] 已签到天数 params[1] 今天是否已经签到(1未签到2已签到) params[2] 完成5局的任务的下线数量 params[3] 邀请奖励是否已经领取(1未领取 2 已领取)
                /*if(data.params && data.params.length >= 3){
                    let getRewDay =  data.params[0];
                    let todayGet  = data.params[1];
                    let inviteNum = data.params[2];
                    let getInviteRew = data.params[3] || 1;
                    let _data = {getRewDay:getRewDay,todayGet:todayGet,inviteNum:inviteNum,getInviteRew:getInviteRew};
                    PDKMainLogic.instance.selfData.setNationalActInfo(_data);
                    this._initNationalBtn();
                }*/
            }
        }
    }

    /**
     * 显示下载App领奖励按钮
     * APP端自动领取
     */
    private _showGetRewDownAppBtn(): void {
        this.downAppGroup.visible = false;
        this._onClickGetDownAppRew();
        //this._playLightOnTarget();
        //this.downApp_group["addClickListener"](this._onClickGetDownAppRew,this);
    }

    /**
     * 显示下载app按钮
     */
    private _showDownAppBtn(): void {
        this.downAppGroup.visible = true;
        this.downAppGroup["addClickListener"](this._onClickDownApp, this);
        this._playLightOnTarget();
        this._self.setNotLoginApp(true);
        PDKalien.Dispatcher.dispatch(PDKEventNames.LOGINAPP_HASUPDATE);
    }

    /**
     * 隐藏app下载或者是领奖励按钮
     */
    private _hideDownAppGroup(): void {
        this.downAppGroup.visible = false;
        this._self.setNotLoginApp(false);
    }

    /**
     * 点击领福利
     */
    private _onClickDownApp(): void {
        PDKPanelActAndNotice.getInstance().showAPPAct();
    }
    /**
     * 点击下载app领奖励
     */
    private _onClickGetDownAppRew(): void {
        pdkServer.reqGetDownAppRew();
    }

    /**
     * 领取活动奖励的回复(登录APP 和国庆活动)
     * 0:成功 1 活动不存在 2 任务未完成 3奖励已领取 4 参数错误 
     */
    private _onRecvGetActRewRep(e: egret.Event): void {
        let data = e.data;
        let _desc = null;
        let _align = "center";
        if (data.result == 0 || data.result == null) {
            if (data.optype == 1) { //登录APP
                _align = "left";
                //let _num:any = PDKGameConfig.getLoginAppRewText();
                _desc = "恭喜您获得以下奖励:\n1.钻石x32\n2.金豆x10000\n3.记牌器x7天\n4.表情免费次数x50\n5.每日在APP签到多得50%金豆";
                this._hideDownAppGroup();
            } else if (data.optype == 2) {//国庆登录礼
                /* let hasGetDay = data.params[0];
                 if(hasGetDay<1) return; 
                 PDKMainLogic.instance.selfData.setNationalGetLoginRewDay(hasGetDay);
                 _desc = PDKGameConfig.getNationalLoginRewByDay(hasGetDay);
                 _desc = "领取奖励：" + _desc + "成功";
                 */
            }
            else if (data.optype == 3) {//国庆邀请礼
                /*let _money =  PDKMainLogic.instance.selfData.getNationalInviteRew();
                _desc = _desc = "领取奖励：" + _money + "元红包余额成功";
                this._showNationalBtn(false);
                */
            }
            PDKBagService.instance.refreshBagInfo();
        }
        else if (data.result == 1) {
            _desc = "活动不存在";
        }
        else if (data.result == 2) {
            _desc = "任务未完成";
        }
        else if (data.result == 3) {
            _desc = "奖励已领取";
        }

        if (_desc) {
            PDKPanelAlert.instance.show(_desc, 0, null, _align);
        }
    }

    /**
     *  是否显示关注公众号
     */
    private _showWatchWX(bShow: boolean): void {
        this.publicWXGroup.visible = false;
        if (1) return;
        this.publicWXGroup.visible = bShow;
    }

    /**
     * 大厅的跑马灯居中
     */
    private _onChangeCenterHornPos(): void {
        this.rollMsg.horizontalCenter = 0;
    }

    /**
     * 重置跑马灯在大厅的位置
     */
    private _resetRollMsgHorizontal(): void {
        this.rollMsg.horizontalCenter = this._rollMsgHorizontal;
    }

	/**
	 * 下载App按钮播放光效
	 */
    private _playLightOnTarget(): any {
        let _func = null;
        egret.Tween.removeTweens(this.downLight_img);
        _func = function (self, target, srcScaleX, srcScaleY, toScaleX, toScaleY) {
            target.scaleX = srcScaleX;
            target.scaleY = srcScaleX;
            egret.Tween.get(target).to({ scaleX: toScaleX, scaleY: toScaleX }, 800).wait(500).to({ scaleX: srcScaleX, scaleY: srcScaleY }, 500).call(() => {
                _func(self, target, srcScaleX, srcScaleY, toScaleX, toScaleY);
            })
        }
        _func(this, this.downLight_img, 0, 0, 1.7, 1.7);
    }

    /**
     * 背包更新
     */
    private _onBagRefresh(): void {
        let _nDiamond: any = PDKBagService.instance.getItemCountById(3);
        this.diamond.updateGold(_nDiamond);
    }

    /**
     * 服务器返回加入自创房的结果 只处理成功的，错误的在joinTable里面处理
     */
    private onJoinRep(event: egret.Event): void {
        let data: any = event.data;
        if (data.result == 0) {
            PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, { roomID: data.roomid, personalgame: true }, PDKalien.sceneEffect.Fade);
            PDKJoinTable.instance.close();
        }
    }

    /**
     * 购买复活礼包成功
     */
    private _onBuyReviveSucc(): void {
        console.log("_onBuyReviveSucc------------->购买复活礼包成功")
        // this.checkRedNormalDiamondNum();
    }

    /**
     * 新手钻石奖励50钻
     */
    private _onNewPlayerDiamonRewInfoRep(e: egret.Event): void {
        let data = e.data;
        if (data.optype == 3) {
            if (data.result == null) {
                this._self.setHasGetNewDiamond();
                let _str = "恭喜您，成功领取新手钻石奖励:" + data.params + "钻"
                PDKAlert.show(_str, 0, function () {
                    pdkServer.checkReconnect();
                });
            }
        }
    }

    private onBagInfoRep(event: egret.Event): void {
        let data: any = event.data;

        // console.log("onBagInfoRep--------pdk--22-->", data);

        PDKBagService.instance.bagItemArray.forEach((item: PDKBagItemData) => {
            item.count = 0;
        });
        //if(data.result == 0){
        data.items.forEach((item: any) => {
            PDKBagService.instance.updateItemByData(item);
        });
        //}

        PDKalien.Dispatcher.dispatch(PDKEventNames.BAG_INFO_REFRESH, false);
    }

    private onRechargeResultNotify(event: egret.Event): void {
        let data: any = event.data;

        if (data.result == 0) {
            let _productId = data.productid;
            if (this._rechargeTit[_productId]) {
                PDKAlert.show("购买" + this._rechargeTit[_productId] + "成功!");
            }
        }
    }

    /**
      * 大厅断线重连，登录成功后，需要刷新玩家信息
      */
    public doReconnectToLobby(data: any): void {
        PDKalien.PopUpManager.removeAllPupUp();
        PDKMainLogic.instance.refreshSelfInfo();
        console.log("doReconnectToLobby---------->")
        let _pageChannel: any = this.navigator.currentPage;
        if (_pageChannel instanceof PDKPageChannels) {
            _pageChannel.setWillToGame(T_G_PDK);
            let nToGame = _pageChannel.getWillToGame();
            _pageChannel.setWillToGame(0);
            if (nToGame && nToGame >= 1 && nToGame <= 7) {
                if (nToGame == T_G_PDK) {
                    if (data.roomid == 9000 || data.roomid == 9001 || data.roomid == 9002 ||
                        data.roomid == 9003 || data.roomid == 9004 || data.roomid == 9005) {
                        data.isReconnect = true;
                    }
                    PDKMainLogic.instance.checkPDKGoldNum(data);
                }
            }
        } else {
            let room: any = _pageChannel.selectedRoom;
            if (!room) return;
            _pageChannel.selectedRoom = null;
            if (room.roomType == 2) {
                pdkServer.getMatchSignUpInfo(room.matchId);
            } else if (room.roomType == 1) {
                let nHasNum = 0;
                let sType;
                if (room.roomFlag == 1) { //金豆场
                    nHasNum = this._self.gold;
                    sType = "金豆";
                } else if (room.roomFlag == 2) {
                    nHasNum = PDKBagService.instance.getItemCountById(3);
                    sType = "钻石";
                }

                if (nHasNum > room.maxScore) {
                    var conf = PDKGameConfig.getSuitableRoomConfig(this._self.gold, room.roomFlag);
                    PDKAlert3.show('您拥有的' + sType + '大于' + room.maxScore + '\n推荐进入' + conf.name + '游戏', this.joinSpecialRoom.bind(this, conf.roomID), 'pdk_common_btn_enter_h', true);
                } else if (nHasNum >= room.minScore) {
                    PDKalien.PDKSceneManager.show(PDKSceneNames.PLAY, { action: 'quick_join', roomID: room.roomID }, PDKalien.sceneEffect.Fade);
                } else {
                    if (room.roomFlag == 1) {
                        PDKAlert.show(sType + "不足" + room.minScore + " 是否前往商城购买 ？", 1, function (act) {
                            if (act == "confirm") {
                                if (pdkServer._isInDDZ) {
                                    pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: 0 });
                                } else {
                                    PDKPanelExchange2.instance.show();
                                }
                            }
                        });
                    }
                    else if (room.roomFlag == 2) {
                        PDKMainLogic.instance.noDiamondGetNewDiamondRewOrBuyRevive(room.minScore, room.roomID);
                    }
                }
            }
        }
    }

    /**
 * 初始化红包右上角的红包个数
 */
    private _initRedNum(): void {
        if (1) return;
        let _nTot: number = this._self.getNorRoomRedNum();
        if (_nTot > 0) {
            if (_nTot > 99) {
                this.redCountBgImg.visible = false;
                this.redNumLabel.textColor = 0xFF0000;
            } else {
                this.redNumLabel.textColor = 0xFFFFFF;
                this.redCountBgImg.visible = true;
            }
            this.redNumLabel.text = "" + _nTot;
            this.redNumLabel.visible = true;
        } else {
            this.redNumLabel.text = "0";
            this.redNumLabel.visible = false;
            this.redCountBgImg.visible = false;
        }
    }

    /**
     * 红包个数变化
     */
    private _onUserRedCountChange(e: egret.Event): void {
        this._initRedNum();
    }

    /**
     * 获取用户是否点击了关注公众号
     */
    private _hasClickWatchWX(): boolean {
        let _v = PDKalien.localStorage.getItem("hasWatchWx");
        if (_v) {
            return true;
        }
        return false;
    }

    /**
     * 保存已经点击过关注公众号
     */
    private _saveHasClickWatchWX(): void {
        PDKalien.localStorage.setItem("hasWatchWx", "1");
    }

    /**
     * 隐藏提示公众号变更和提示动画
     */
    private _clearTipWX(): void {
        this.tipWxImg.visible = false;
        egret.Tween.removeTweens(this.tipWxImg);
    }

    /**
     * 初始化是否要提示微信变更
     */
    private _initTipWX(): void {
        this._clearTipWX();
        if (this._hasClickWatchWX()) {
            return;
        }
        this._runTipWXAni();
    }

    /**
     * 提示微信公众号变更动画
     */
    private _runTipWXAni(): void {
        let _srcY = this.tipWxImg.y;
        egret.Tween.get(this.tipWxImg).set({
            visible: true,
            loop: true,
        })
            .to({
                y: _srcY + 10,
            }, 400)
            .to({
                y: _srcY,
            }, 400).
            call(this._runTipWXAni, this);
    }
}   