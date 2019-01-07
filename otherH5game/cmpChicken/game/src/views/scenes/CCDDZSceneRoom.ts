import CCDDZEventManager = CCalien.CCDDZEventManager;
/**
 * Created by rockyl on 16/3/9.
 *
 * 房间场景
 */

class CCDDZSceneRoom extends CCalien.CCDDZSceneBase {
    private gold: CCDDZGold;
    private labNickName: eui.Label;
    private avatar: CCDDZAvatar;
    private grpTop: eui.Group;
    private grpBottom: eui.Group;
    private navigator: CCalien.CCDDZNavigator;
    private btnLobby: eui.Button;
    private imgRoomTitle: eui.Image;
    private grpRed: eui.Group;

    private _self: CCGlobalUserInfoData;
    /**
     * 抽红包按钮
     */
    private redBtn: eui.Button;
    /**
     * 红包余额
     */
    private lbRedCoin: eui.Label;
    private _sceneAnimationDuration: number = 500;
    private _wave: CCalien.CCDDZWave;
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
    private diamond: CCDDZGold;

    private rollMsg: CCDDZMarqueeText;
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

    private _isShowFreeDiamond: boolean = false;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.skinName = scenes.CCDDZSceneRoomSkin;

        this._self = CCDDZMainLogic.instance.selfData;
    }

    createChildren(): void {
        super.createChildren();
        this._rollMsgHorizontal = this.rollMsg.horizontalCenter;
        this.navigator.push(CCDDZPageChannels);
        this.onNavigate(null);

        let e: CCalien.CCDDZEventManager = CCDDZEventManager.instance;
        //e.registerOnObject(this,ccserver,CCGlobalEventNames.USER_CHECK_RECONNECT_REP,this.onCheckReconnectRep,this);    
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.MY_USER_INFO_UPDATE, this.onMyUserInfoUpdate, this);
        e.registerOnObject(this, this.grpBottom, egret.TouchEvent.TOUCH_TAP, this.onGrpBottomTap, this);
        e.registerOnObject(this, this.gold, egret.TouchEvent.TOUCH_TAP, this._onClickGold, this);
        e.registerOnObject(this, this.diamond, egret.TouchEvent.TOUCH_TAP, this._onClickDiamond, this);
        e.registerOnObject(this, this.grpRedcoin, egret.TouchEvent.TOUCH_TAP, this._onClickExchange, this);
        e.registerOnObject(this, this.navigator, CCalien.CCDDZNavigator.NAVIGATE, this.onNavigate, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.SHOW_ANNOUNCE, this.showAnnounce, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.SHOW_LOTTERY, this.showLotteryLuck, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.USER_FRREWARD_GET_SUCC, this._onFRechargeRewGetSucc, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.USER_DTREWARD_GET_SUCC, this._onDayTaskRewGetSucc, this);

        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.HORN_TALK_RECORDS_CHANGE, this._onHornRecChange, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.BAG_INFO_REFRESH, this._onBagRefresh, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.BUY_REVIVE_SUCC, this._onBuyReviveSucc, this);
        e.registerOnObject(this, CCDDZMailService.instance, CCGlobalEventNames.MAIL_UNREAD_UPDATE, this._onMailUnreadUpdate, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.USER_RED_COUNT_CHANGE, this._onUserRedCountChange, this);
        e.registerOnObject(this, CCalien.CCDDZDispatcher, CCGlobalEventNames.FRECHARGE_HASUPDATE, this._onFRechargeUpdate, this);

        ccserver.addEventListener(CCGlobalEventNames.USER_GET_ACTInfo_REP, this._onRecvGetActInfoRep, this);
        ccserver.addEventListener(CCGlobalEventNames.USER_GET_REWARD_REP, this._onRecvGetActRewRep, this);
        ccserver.addEventListener(CCGlobalEventNames.JOIN_PGAME_REP, this.onJoinRep, this);

        CCalien.CCDDZDispatcher.addEventListener(CCGlobalEventNames.ACT_RED_CHANGE, this._initActRed, this);
        if (CCDDZExchangeService.instance.announce) {
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
        let _data = CCDDZMainLogic.instance.selfData;
        if (!_data.isNotBuyFRecharge()) {
            this.mFRechageBg_img.visible = false;
            if (!_data.isGetTodayFRechargeRew() && !_data.isFRechargeRewGetOver()) {
                CCDDZPanelFRGetRew.getInstance().show();
            }
        }
    }


    /**
     * 点击客服
     */
    private _onClickKefu(): void {
        this._clearTipWX();
        this._saveHasClickWatchWX();
        CCGlobalGameConfig.showKeFu();
    }

    /**
     * 点击商城
     */
    private _onClickRecharge(): void {
        if (ccserver._isInDDZ) {
            this.openDDZShop();
        }
        else {
            CCDDZPanelExchange2.instance.show();
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
        this["luckyImg"]["addClickListener"](this._onClickLucky, this);
        this["vipGroup"]["addClickListener"](this._onClickVip, this);
        this["monthcardImg"]["addClickListener"](this._onClickMonthCard, this);
        this["vipLucky"]["addClickListener"](this._onClickVipLucky, this);
        this["mondayBtn"]["addClickListener"](this._onClickMonday, this);
        this.grpShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onGrpShareTap, this);

        CCalien.CCDDZDispatcher[_func](CCGlobalEventNames.SHOW_PAYCHAT, this.showLaba, this);
        ccserver[_func](CCEventNames.USER_BAG_INFO_REP, this.onBagInfoRep, this);
    }

    private _initMonday(): void {
        if (1) {
            this["mondayBtn"].visible = false;
            return;
        }
        let shouldShow = CCDDZMainLogic.instance.selfData.shouldShowMonday();
        this["mondayBtn"].visible = shouldShow;
        if (!shouldShow) {
            CCDDZPanelMonday.nullInstance();
        }
    }

    private _onClickMonday(): void {
        CCDDZPanelMonday.instance.show();
    }

    private showLaba(e: egret.Event): void {
        this.rollMsg.show();
    }

    private onBagInfoRep(event: egret.Event): void {
        let data: any = event.data;

        CCDDZBagService.instance.bagItemArray.forEach((item: CCDDZBagItemData) => {
            item.count = 0;
        });
        data.items.forEach((item: any) => {
            CCDDZBagService.instance.updateItemByData(item);
        });

        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.BAG_INFO_REFRESH, false);
    }
	/**
     * 点击分享
     */
    private _onGrpShareTap(event: egret.TouchEvent): void {
        if (!CCalien.Native.instance.isNative) {  // 非native 也就是web平台的 调起分享提示页面
            //if(!cc_nativeBridge.isWXMP && !cc_nativeBridge.isAli()){
            CCGlobalWxHelper.shareForPhone();
            // }
            //CCDDZPanelShare.instance.showInviteFriend()
        } else { // native端 直接调起分享 分享到朋友圈
            let _helper = CCGlobalWxHelper;
            //_helper.shareDownApp(null);
            _helper.shareForAndroidApp();
        }
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
        CCDDZPanelActAndNotice.getInstance().showThanksgiving();
    }

    /**
     * 点击邮件
     */
    private _onClickEmail(): void {
        CCDDZPanelMail.getInstance().show();
    }

    /**
     * 点击红包栏的兑
     */
    private _onClickExchange(): void {
        if (ccserver._isInDDZ) {
            this.openDDZShop(4);
        }
        else {
            CCDDZPanelExchange2.instance.show(4);
        }

    }

    /**
     * 商城金豆
     */
    private _onClickGold(): void {
        if (ccserver._isInDDZ) {
            this.openDDZShop();
        }
        else {
            CCDDZPanelExchange2.instance.show();
        }

    }

    /**
     * 商城钻石
     */
    private _onClickDiamond(): void {
        if (ccserver._isInDDZ) {
            this.openDDZShop(1);
        }
        else {
            CCDDZPanelExchange2.instance.show(1);
        }
    }

    private openDDZShop(flag = 0) {
        ccserver.ddzDispatchEvent(1, '', { type: 2, shopFlag: flag });
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
        CCDDZPanelFollowCourse.instance.show();
    }

    /**
     * 点击vip
     */
    private _onClickVip(): void {
        CCDDZPanelVip.instance.show();
    }
    /**
     * 点击幸运抽奖
     */
    private _onClickLucky(): void {
        CCDDZPanelLucky.instance.show(0);
    }

    /**
     * vip抽奖
     */
    private _onClickVipLucky(): void {
        this._showVipLuckyRedImg(false);
        this._recordTipTimeStampByKey("showVipLuckyRed");
        CCDDZPanelLucky.instance.show(1);
    }

    /**
     * 点击月卡
     */
    private _onClickMonthCard(): void {
        CCDDZPanelMonthCard.instance.show();
    }

    private _showVipLuckyRedImg(bShow: boolean): void {
        this["vipLuckyRedImg"].visible = bShow;
    }

    /**
     * 弹窗显示领取月卡钻石
     */
    private _showGetDiamond() {
        if (this._isShowFreeDiamond == true) return;
        this._isShowFreeDiamond = true;
        // CCDDZPanelAlert3.instance.show("领取月卡钻石奖励", 1, function(act) {
        //     if(act == "confirm") {
        //         let data = { optype: 11};
        //         ccserver.send(CCGlobalEventNames.USER_GET_REWARD_REQ,data);
        //         return true;
        //     }
        // }.bind(this), false);
        // return  false;
        CCDDZPanelMonthCardReward.instance.show();
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

    private showAnnounce(e: egret.Event): void {
        this.rollMsg.show(false); //显示完不自动隐藏
    }

    /**
     * 显示夺宝中将信息
     */
    private showLotteryLuck(e: egret.Event): void {
        this.rollMsg.show(false);
    }

    private _showInviteList(): void {
        CCDDZInviteService.instance.clearInvitePlayersList();
        CCDDZInviteService.instance.getInvitePlayersList();
        CCDDZPanelDayRed.instance.show();
        //CCDDZPanelInviteList.instance.show(CCDDZInviteService.instance.source, this.onCloseInvite.bind(this));
    }
    /**
     * 点击邀请列表
     */
    private _onClickInvite(): void {
        if (1) return;
        let _info = CCGlobalGameConfig.getCfgByField("webCfg");
        if (!_info) {
            CCGlobalGameConfig.getInviteActInfo(() => {
                this._showInviteList();
            })
        } else {
            this._showInviteList();
        }
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
        if (1) {
            this.grpShare.visible = false;
            return;
        }
        if (bShow && !CCalien.Native.instance.isNative) {
            /* if(cc_nativeBridge.isWXMP || cc_nativeBridge.isAli()){
                 bShow = false;
             }*/
            //bShow = false;
        }
        this.grpShare.visible = bShow;
    }

    private onNavigate(event: egret.Event): void {
        CCGlobalWxHelper.doWebH5ShareCfg();
        if (!event || event.data.page instanceof CCDDZPageChannels) {
            this.imgRoomTitle.source = CCGlobalResNames.cc_room_word_25;
            this._showBackGroup(false);
            this._setIsHome(true);
            if (CCalien.Native.instance.isNative && egret.Capabilities.os == "Android") {
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
            if (event.data.page instanceof CCDDZPageNormalChannel) {
                // this.imgRoomTitle.source = CCGlobalResNames.cc_room_word_28;
                this.imgRoomTitle.source = "cc_room_three_title";
                this._showGrpShare(true);
            } else {
                this.imgRoomTitle.source = CCGlobalResNames.cc_room_word_23;
                this._showGrpShare(false);
            }
        }
    }

    private onGrpBottomTap(event: egret.TouchEvent): void {
        switch (event.target.name) {
            /*case 'bank':
                let self: CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
                console.log("tap bank button: " + self.bindphone);
                if(self.bindphone) {
                    this.showBank();
                } else {
                    CCalien.Native.instance.bindThirdPart(0,(data: any) => {
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
                CCDDZPanelProfile.instance.show(() => {
                    CCDDZMainLogic.instance.refreshSelfInfo();
                });
                break;
        }
    }

    private showBank(): void {
        /*let self: CCGlobalUserInfoData = CCDDZMainLogic.instance.selfData;
        if(self.havesecondpwd) {
            if(CCalien.Native.instance.isNative || CCGlobalUserData.instance.getItem('type') == 1) { //正式账号
                PanelBank.instance.show(this.onPanelBankResult.bind(this));
            } else {  //游客账号
                if(BankService.instance.bankgold >= 10 * CCGlobalGameConfig.rechargeRatio) {
                    CCDDZAlert2.show(lang.bind_phone_notice,'common_btn_to_register',(action) => {
                        if(action != 'close') {
                            CCDDZPanelBindPhone.instance.show(this.onPanelBindPhoneResult.bind(this));
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
        if (ccserver._isInDDZ == true) {
            this.quitGame();
            return;
        }
        if (this._isHome) {
            CCDDZPanelAlert.instance.show("再赢几局就能拿奖杯了，真的要离开吗？", 0, function (act) {
                if (act == "confirm") {
                    CCalien.Native.instance.closeApp();
                }
            });
        } else {
            this.navigator.pop();
        }
    }

    private quitGame() {
        ccserver.ddzDispatchEvent(1, '', { type: 1 });
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
     * 进入红包场前先校验钻石数是否够
     */
    private checkRedNormalDiamondNum(): void {
        let _diamond = CCDDZBagService.instance.getItemCountById(3);
        let _roomInfo = CCGlobalGameConfig.getSuitableRoomConfig(_diamond, 2);
        if (!_roomInfo) {
            _roomInfo = CCGlobalGameConfig.getRoomConfigById(1000);
        }
        if (_roomInfo.minScore > _diamond) {//钻石不足
            CCDDZMainLogic.instance.noDiamondGetNewDiamondRewOrBuyRevive(_roomInfo);
            return;
        }
        CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { action: 'quick_join', roomID: 1000 }, CCalien.CCDDZsceneEffect.CCDDFade);
    }

    /**
     * 进入金豆大师场之前检查是否金豆够
     */
    private checkGoldNum(): void {
        let _roomInfo = CCGlobalGameConfig.getRoomConfigById(1004);
        let _gold = CCDDZMainLogic.instance.selfData.gold;
        console.log("checkGoldNum==============>", _gold);
        if (_roomInfo.minScore > _gold) {//金豆不足
            CCDDZMainLogic.instance.ifBuyGoldReviveMaxTipShop(_roomInfo.minScore);
            return;
        }
        CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { action: 'quick_join', roomID: 1004 }, CCalien.CCDDZsceneEffect.CCDDFade);
    }

    private joinSpecialRoom(roomid: number): void {
        if (roomid && CCGlobalGameConfig.getRoomConfigById(roomid)) {
            CCalien.CCDDZSceneManager.show("SceneCmpChicken", { action: 'quick_join', roomID: roomid }, CCalien.CCDDZsceneEffect.CCDDFade);
            // CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { action: 'quick_join', roomID: roomid }, CCalien.CCDDZsceneEffect.CCDDFade);
        }
    }

    /**
     * 显示新手金豆奖励
     */
    private _onShowNewReward(): void {
        CCDDZPanelFreshManReward.instance.show();
    }

	/**
	 * 当我的玩家信息
	 * @param event
	 */
    private onMyUserInfoUpdate(event: egret.Event = null): void {
        let userInfoData: CCGlobalUserInfoData = this._self;
        if (!userInfoData.uid) return;

        this._initMonthCardFreeDiamond()

        this._initVipRedImg();
        //多次快速刷新游戏更新失败,价格延时
        let nDiamond: any = CCDDZBagService.instance.getItemCountById(3);
        this.diamond.updateGold(nDiamond);
        this.gold.updateGold(userInfoData.gold);
        this.lbRedCoin.text = "" + (this._self.redcoin == null ? "0.00" : CCDDZUtils.exchangeRatio(this._self.redcoin / 100, true));
        this._showDayTaskDefaultByOverNum(userInfoData.getDayTaskOverCount());
        this._initTaskRedImg();
        this._initActRed();
        this._initRedNum();
        this._initVipLucky();
        this._initMonday();
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
        let cc_nativeBridge = CCalien.Native.instance;
        let _param = cc_nativeBridge.getUrlArg();
        let _shareRoom: string = _param.share_room;
        console.log("checkShareRoom==>", _shareRoom);
        let _roomNum = Number(_shareRoom);
        if (_roomNum) {
            //          -----------------自动加入牌局----------------
            ccserver.JoinPGameReq(_roomNum);
        }
    }

    private checkNickname() {
        if (CCDDZMainLogic.instance.checkNicknameCount == 0) {
            if (this._self.nickname.match(/^用户\w{15}/)) {
                CCDDZPanelModifyNickname.instance.show();
            }
            CCDDZMainLogic.instance.checkNicknameCount++;
        }
    }

    /**
     * 点击抽红包
     */
    private _onClickGetRed() {
        let _nTot: number = Number(this.redNumLabel.text);
        if (!_nTot || _nTot <= 0) {
            CCDDZAlert.show("玩游戏即可抽取，是否前往", 1, (act) => {
                if (act == "confirm") { //确定前往/
                    let page = this.navigator.currentPage;
                    if (page instanceof CCDDZPageChannels) {
                        (<CCDDZPageChannels>page).toDiamondPage();
                    }
                }
            });
            return;
        }
        let _exIns = CCDDZExchangeService.instance;
        let _info = this._self.getOneNorRoomRedFromSmall();
        if (_info && _info.roomid) {
            CCDDZExchangeService.instance.doChou(_info.roomid);
        } else if (!_exIns.doChouWangZha()) {
            _exIns.doChouNewGold();
        }
    }

    /**
     * 显示首充界面
     */
    private _showFRecharge(): void {
        if (!this._bInLobby) return;
        CCDDZPanelActAndNotice.getInstance().showFRecharge();
    }

    /**
     * 签到界面和签到奖励相关的光效
     */
    private _onSignEffectLoadOver(event: RES.ResourceEvent): void {
        if (!this._bInLobby) return;
        if (1) return;
        if (event.groupName == "signAndEmail") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onSignEffectLoadOver, this);
            CCDDZPanelSign.getInstance().show();

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
        if (1) return;
        if (RES.isGroupLoaded("signAndEmail")) {
            CCDDZPanelSign.getInstance().show();
            return;
        }
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onSignEffectLoadOver, this);
        RES.loadGroup("signAndEmail")
    }

    /**
     * 邮件合图加载完毕
     */
    private _onMailEffectLoadOver(event: RES.ResourceEvent): void {
        if (!this._bInLobby) return;
        if (1) return;
        if (event.groupName == "signAndEmail") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onMailEffectLoadOver, this);
            CCDDZPanelMail.getInstance().show();
        }
    }

    /**
     * 显示邮件
     */
    private _showEmail(): void {
        if (1) return;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onMailEffectLoadOver, this);
        RES.loadGroup("signAndEmail")
    }

	/**
	 * 获取购买首充的弹出信息
	 */
    private _getThanksPopTimeStamp(): any {
        let _stamp: string = CCalien.CCDDZlocalStorage.getItem("PopThanksTime");
        return Number(_stamp);
    }

	/**
	 * sTimeStamp:时间戳 每天首次弹出购买首充的时间戳
	 */
    private _recordThanksPopTimeStamp(): void {
        let _sTimeStamp = new Date().getTime();
        CCalien.CCDDZlocalStorage.setItem("PopThanksTime", "" + _sTimeStamp);
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
        if (CCDDZUtils.isInTimeSection("2017-11-23 00:00:00", "2017-11-26 00:00:00", new Date().getTime())) {
            if (this._isShouldPopThanks()) {
                this._recordThanksPopTimeStamp();
                CCDDZPanelActAndNotice.getInstance().showThanksgiving();
            }
        }
    }
    /**
	 * 签到查询返回
	 * @param event
	 */
    private onSignInRep(event: egret.Event): void {
        ccserver.removeEventListener(CCGlobalEventNames.USER_DAY_SIGN_IN_REP, this.onSignInRep, this);
        //if(!this._initRealName()){
        if (!this._initTipAppLucky()) {
            if (!this._initFRecharge()) {
                if (!this._initTipMonthCard()) {
                    if (!this._initTipInviteList()) {
                        if (!this._initFFF()) {

                        }
                    }
                }
            }
        }

        //this._initThanks();
        let _data = this._self;
        if (event.data.today != 1) { //today 1今天已签到 0今天未签到
            _data.setTodaySigned(false);
            if (!_data.isNotBuyFRecharge() && _data.frechargerewardday != null) {
                //今天未领取并且领取过首充奖励 否则还是点击首充按钮领取首充,全部奖励未领取完
                if (!_data.isGetTodayFRechargeRew() && !_data.isFRechargeRewGetOver()) {
                    CCDDZPanelFRGetRew.getInstance().show(); //显示首充今日的领取奖励面板
                }
            }
            this._bShowSign = true;
            this._showSignRew();
        }
        else { //已签到
            this._bShowSign = false;
            _data.setTodaySigned(true);
            if (!_data.isNotBuyFRecharge()) {
                if (_data.isGetTodayFRechargeRew()) {
                    CCDDZMainLogic.instance.alms();//签到了才可以领取救济金
                }
                else {
                    //今天未领取并且领取过首充奖励 否则还是点击首充按钮领取首充,全部奖励未领取完
                    if (_data.isHadGetFRechargeRew() && !_data.isFRechargeRewGetOver()) {
                        CCDDZPanelFRGetRew.getInstance().show(); //显示首充今日的领取奖励面板
                    }
                    else {
                        CCDDZMainLogic.instance.alms();
                    }
                }
            }
            else {
                CCDDZMainLogic.instance.alms();//签到了才可以领取救济金
            }
        }

        if (_data.freshrewardgot && _data.freshrewardgot == 1) {
            if (this._bShowSign) return;
            this._onShowNewReward();
        }
    }

    private onHappyBeanConsumeRep(e: egret.Event): void {
        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HIDE_WAITING);
        if (e.data.result == 0) {
            CCDDZAlert.show(lang.exchange_succ1);
            //this.game8868Bean.updateGold(Number(CCDDZMainLogic.instance.selfData.beans));
        }
    }

    private onHappyBeanExchangeRep(e: egret.Event): void {
        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.HIDE_WAITING);
        if (e.data.result == 0) {
            CCDDZAlert.show(lang.exchange_succ2);
        }
    }

    /**
     * 新运抽奖
     */
    private _initLucky(): void {
        let visible = false;
        let _info = CCGlobalGameConfig.getCfgByField("webCfg.luck");
        if (_info && _info.status == 1) {
            visible = true;
        }
        this["luckyImg"].visible = false;//visible
    }

    private _initVipLucky(): void {
        let visible = false;
        let _info = CCGlobalGameConfig.getCfgByField("webCfg.vip");
        if (_info && _info.status == 1) {
            visible = true;
            this._initVipLuckyRedImg();
        }
        this["vipLuckyGrp"].visible = visible;
    }

    private _initVipLuckyRedImg(): void {
        let info = CCDDZMainLogic.instance.selfData.getTodayVipLucky();
        let bShow = false;
        if (info.inTime) {
            bShow = this._shouldPopThisDay("showVipLuckyRed", false);
        }
        this._showVipLuckyRedImg(bShow);
    }

    beforeShow(params: any, back: boolean): void {
        let instance = CCDDZMainLogic.instance
        this._isShowFreeDiamond = false;
        this.grpShare.visible = false;
        this.newActBgImg.visible = false;
        this._showEmailDefaultUnreadNum(CCDDZMailService.instance.unreadCount);
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
        this._initShowInviteList();
        this._initRedNum();
        this._initTipWX();
        this._initLucky();
        //this._initTipLucky();
        //this._initTipBindPhone();
        //this._initTipInviteList();
        //this._initNationalBtn();
        ccddzwebService.getHornRec(this._onHttpRecvHornRec.bind(this));
        ccddzwebService.loadLog(2, 0);
        CCalien.CCDDZEventManager.instance.enableOnObject(this);
        this.onMyUserInfoUpdate();
        this.navigator.active();

        ccserver.addEventListener(CCGlobalEventNames.USER_DAY_SIGN_IN_REP, this.onSignInRep, this);
        //ccserver.addEventListener(CCGlobalEventNames.USER_OPERATE_REP,this._onRecvUserOperateRep,this);
        ccserver.getSignInInfo();

        ccserver.isInNewyearGiftReqNewYear();

        //app 登录直接领奖励
        ccserver.reqDownAppRewInfo();
        let duration = this._sceneAnimationDuration;

        egret.Tween.get(this.grpTop).to({ top: -this.grpTop.height }).wait(duration).to({ top: 0 }, duration, egret.Ease.cubicOut);
        egret.Tween.get(this.grpBottom).to({ bottom: -this.grpBottom.height }).wait(duration).to({ bottom: 0 }, duration, egret.Ease.cubicOut);

        this.rollMsg.visible = true;
        this.rollMsg.showLast(2);

        CCalien.CCDDZSoundManager.instance.enablePlayMusic(true);
        CCalien.CCDDZSoundManager.instance.playMusic(CCGlobalResNames.bgm);

        let _pageChannel: CCDDZPageChannels = <CCDDZPageChannels>this.navigator.currentPage;
        let _toPageChannel: boolean = false;
        let _curPageName = this.navigator.currentPage.skinName.name;
        if (params) {
            if (params.hasOwnProperty("jump2match")) {
                if (_curPageName != "CCDDZPageMatchChannelSkin") {
                    this.navigator.push(CCDDZPageMatchChannel);
                }
            } else if (params.hasOwnProperty("jump2cc")) {
                console.log("jump2cc--------------->", this.navigator.currentPage.skinName.name)
                if (this.navigator.currentPage.skinName.name != "CCDDZPageNormalChannelSkin") {
                    // console.log("CCGlobalGameConfig----all roomscfg", CCGlobalGameConfig.roomList)
                    // let ccRooms = CCGlobalGameConfig.getRoomCfgFromAll(10001);
                    let ccRooms = CCGlobalGameConfig.getRoomCfgByGameId(10, 0);
                    // let goldRooms = CCGlobalGameConfig.getCfgByField("goldRooms");
                    // let rooms = [].concat(diamondRooms, goldRooms);
                    let rooms = [].concat(ccRooms);
                    this.navigator.push(CCDDZPageNormalChannel, true, { roomList: rooms, scale: 0.8, colNum: 3, gapV: 50 });
                    // instance.resetChannelClick();
                    // instance.setWillToGame(CCDDZ_T_G_NGOLD);
                }
            }
            else if (params.toGold || params.toDiamond || params.toNiu || params.toPdk || params.toSmall || params.toFish || params.toFFF || params.toLLT) {
                if (_curPageName != "CCDDZPageChannelSkin") {
                    this.navigator.push(CCDDZPageChannels);
                }

                instance.resetChannelClick();
                if (params.toGold) { //金豆场
                    instance.setWillToGame(CCDDZ_T_G_NGOLD);
                } else if (params.toDiamond) {//钻石场
                    instance.setWillToGame(CCDDZ_T_G_DIAMOND);
                } else if (params.toNiu) { //找刺激
                    instance.setWillToGame(CCDDZ_T_G_NIU);
                } else if (params.toDzpk) { //德州扑克
                    instance.setWillToGame(CCDDZ_T_G_DZPK);
                } else if (params.toPdk) { //跑得快
                    instance.setWillToGame(CCDDZ_T_G_P_DK);
                } else if (params.toSmall) {
                    let channel: CCDDZPageChannels = <CCDDZPageChannels>(this.navigator.currentPage);
                    channel.onToSmallGame();
                } else if (params.toFish) {
                    instance.setWillToGame(CCDDZ_T_G_FISH);
                } else if (params.toFFF) {
                    instance.toFFF()
                    return;
                } else if (params.toLLT) {
                    instance.toLLT()
                    return;
                } else if (params.toNiu) { //连连看
                    instance.setWillToGame(CCDDZ_T_G_LLK);
                } else if (params.toNiu) { //2048
                    instance.setWillToGame(CCDDZ_T_G_2048);
                } else if (params.toNiu) { //翻翻乐
                    instance.setWillToGame(CCDDZ_T_G_FFL);
                }
                if (params.toSmall) {

                }
                else {
                    ccserver.checkReconnect();
                }

            }
        }

        CCDDZBagService.instance.refreshBagInfo();
        instance.refreshSelfInfo();
        instance.setScreenLandScape(1280, 640);
    }

    beforeHide(): void {
        this._bInLobby = false;
        CCDDZEventManager.instance.disableOnObject(this);

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
            ccserver.reqNewPlayerClickTask();
            _selfData.setNotShowTaskRed();
            this._showTaskRedImg(false);
        }
        CCDDZPanelDayTask.getInstance().show();
    }

    /**
     * 点击公告
     */
    private _onClickNotice(): void {
        CCDDZPanelActAndNotice.getInstance().showNotice();
    }

    /**
     * 初始化每日任务右上角的小红点和任务完成数量
     */
    private _showDayTaskDefaultByOverNum(num: number): void {
        let bShow = false;
        if (num > 0) {
            bShow = true;
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
        if (ccserver._isInDDZ) {
            ccserver.ddzDispatchEvent(1, '', { type: 3 });
        }
        else {
            CCDDZPanelSetting.instance.show();
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
    private _initFRecharge(): boolean {
        let _curPage = this.navigator.currentPage;
        //不在大厅不初始化首充
        if (!(_curPage instanceof CCDDZPageChannels)) return;

        let _data = this._self;
        let _notBuy = _data.isNotBuyFRecharge();
        let _hadGetRew = _data.isHadGetFRechargeRew();
        if (!_notBuy) {
            this.mFRechageBg_img.visible = false;
            if (!_hadGetRew && _data.frechargerewardday != null && !_data.isFRechargeRewGetOver()) {
                CCDDZPanelFRGetRew.getInstance().show();
                return true;
            }
        }
        else {
            this.mFRechageBg_img.visible = true;
            if (this._shouldPopThisDay("PopFRTime")) {
                this._showFRecharge();
                return true;
            }
        }
        return false;
    }

    /**
     * 今天是否应该弹出某个key值对应的页面
     * 此函数只针对每天只弹出一次的页面
     */
    private _shouldPopThisDay(sKey: string, bRecord: boolean = true): boolean {
        let _curPage = this.navigator.currentPage;
        if (!(_curPage instanceof CCDDZPageChannels)) return false;

        let _data = this._self;
        let _key = sKey;
        let _bShould = this._isShouldTipByKey(_key);
        if (_bShould) {
            if (bRecord) {
                this._recordTipTimeStampByKey(_key);
            }
            return true;
        }
        return false;
    }

    /**
     * 初始化FFF
     */
    private _initFFF(): boolean {
        if (this._shouldPopThisDay("tipFFF")) {
            CCDDZPanelActAndNotice.getInstance().showFFFAct()
            return true;
        }
        return false;
    }

    /**
     * 初始化实名认证
     */
    private _initRealName(): boolean {
        if (CCDDZMainLogic.instance.selfData.realName) {
            return false;
        }

        if (this._shouldPopThisDay("realName")) {
            CCDDZPanelRealName.getInstance().show();
            return true;
        }
        return false;
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

            //this.rollMsg.showLast();
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
                        if (CCalien.Native.instance.isNative) { //只有App端才可以领取
                            this._showGetRewDownAppBtn();
                        }
                        else {
                            if (!CCalien.Native.instance.isAli() && !CCalien.Native.instance.isWXMP && egret.Capabilities.os == "iOS") {
                                this._showGetRewDownAppBtn();
                            } else {
                                this._showDownAppBtn();

                            }
                        }
                    }
                    else if (data.params[0] == 2) {
                        this._hideDownAppGroup();
                    }
                    else if (data.params[1] && data.params[1] == 1) { //未登录过APP且需要提醒\
                        this._onClickDownApp();
                        if (!CCalien.Native.instance.isNative) {//注册按钮点击
                            this._showDownAppBtn();
                        }
                    }
                    else {
                        if (CCalien.Native.instance.isNative) { //没有条件需要隐藏按钮
                            this._hideDownAppGroup();
                        }
                        else { //H5版本需要显示下载
                            this._showDownAppBtn();
                        }
                    }
                }
                else { //不满足领取奖励条件
                    if (CCalien.Native.instance.isNative) { //没有条件需要隐藏按钮
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
                    CCDDZMainLogic.instance.selfData.setNationalActInfo(_data);
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
        /*this.downAppGroup.visible = true;
        this.downAppGroup["addClickListener"](this._onClickDownApp,this);
        this._playLightOnTarget();
        this._self.setNotLoginApp(true);
        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.LOGINAPP_HASUPDATE);*/
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
        CCDDZPanelActAndNotice.getInstance().showAPPAct();
    }
    /**
     * 点击下载app领奖励
     */
    private _onClickGetDownAppRew(): void {
        ccserver.reqGetDownAppRew();
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
                //let _num:any = CCGlobalGameConfig.getLoginAppRewText();
                _desc = "恭喜您获得以下奖励:\n1.金豆x5000\n2.记牌器x3天\n3.每日在APP签到多得10%金豆"; //4.表情免费次数x10\n
                this._hideDownAppGroup();
            } else if (data.optype == 2) {//国庆登录礼
                /* let hasGetDay = data.params[0];
                 if(hasGetDay<1) return; 
                 CCDDZMainLogic.instance.selfData.setNationalGetLoginRewDay(hasGetDay);
                 _desc = CCGlobalGameConfig.getNationalLoginRewByDay(hasGetDay);
                 _desc = "领取奖励：" + _desc + "成功";
                 */
            }
            else if (data.optype == 3) {//国庆邀请礼
                /*let _money =  CCDDZMainLogic.instance.selfData.getNationalInviteRew();
                _desc = _desc = "领取奖励：" + _money + "元红包余额成功";
                this._showNationalBtn(false);
                */
            }
            else if (data.optype == 11) {

            } else if (data.optype == 9) { //vip 每日奖励
                this._showVipRedImg(false);
            }
            CCDDZBagService.instance.refreshBagInfo();
        }
        /*else if(data.result == 1){
            _desc = "活动不存在";
        }
        else if(data.result ==2){
            _desc = "任务未完成";
        }
        else if(data.result == 3){
            _desc = "奖励已领取";
        }*/

        if (_desc) {
            CCDDZPanelAlert.instance.show(_desc, 0, null, _align);
        }
    }

    /**
     *  是否显示关注公众号
     */
    private _showWatchWX(bShow: boolean): void {
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
        let _nDiamond: any = CCDDZBagService.instance.getItemCountById(3);
        this.diamond.updateGold(_nDiamond);
    }

    /**
     * 服务器返回加入自创房的结果 只处理成功的，错误的在joinTable里面处理
     */
    private onJoinRep(event: egret.Event): void {
        let data: any = event.data;
        if (data.result == 0) {
            CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { roomID: data.roomid, personalgame: true }, CCalien.CCDDZsceneEffect.CCDDFade);
            CCDDZJoinTable.instance.close();
        }
    }

    /**
     * 购买复活礼包成功
     */
    private _onBuyReviveSucc(): void {
        let _pageChannel: any = this.navigator.currentPage;
        if (_pageChannel instanceof CCDDZPageChannels) {
            if (CCDDZMainLogic.instance.getWillToGame() == CCDDZ_T_G_DIAMOND) {
                this.checkRedNormalDiamondNum();
            } else if (CCDDZMainLogic.instance.getWillToGame() == CCDDZ_T_G_GOLD) {
                this.checkGoldNum();
            }
        } else if (_pageChannel instanceof CCDDZPageChannelBase) {
            if (_pageChannel.selectedRoom && _pageChannel.selectedRoom.roomID == 1004) { //点击金豆场里面的大师场
                this.checkGoldNum();
            }
        }
    }

    /**
      * 大厅断线重连，登录成功后，需要刷新玩家信息
      */
    public doReconnectToLobby(data: any): void {
        let instance = CCDDZMainLogic.instance;
        instance.refreshSelfInfo();
        let _pageChannel: any = this.navigator.currentPage;
        // if (_pageChannel instanceof CCDDZPageChannels) {
        //     let nToGame = instance.getWillToGame();
        //     instance.setWillToGame(0);
        //     if (nToGame && nToGame >= 1 && nToGame <= 10) {
        //         if (nToGame == CCDDZ_T_G_DIAMOND) {
        //             this.checkRedNormalDiamondNum();
        //         } else if (nToGame == CCDDZ_T_G_GOLD) {
        //             this.checkGoldNum();
        //         } else if (nToGame == CCDDZ_T_G_NIU) {
        //             instance.checkNiuGoldNum(data);
        //         } else if (nToGame == CCDDZ_T_G_NGOLD) {
        //             let _gold = instance.selfData.gold;
        //             let _suitable = CCGlobalGameConfig.getSuitableRoomConfig(_gold);
        //             if (!_suitable) {
        //                 CCDDZPanelRechargeTips.instance.show();
        //                 return;
        //             }
        //             CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { action: 'quick_join', roomID: _suitable.roomID }, CCalien.CCDDZsceneEffect.CCDDFade);
        //         } else if (nToGame == CCDDZ_T_G_DZPK) {
        //             if (data.roomid == 5001) {
        //                 data.isReconnect = true;
        //             }
        //             instance.checkDzpkGoldNum(data);
        // } else if (nToGame == CCDDZ_T_G_FISH) {
        //             CCDDZOtherGameManager.instance.runOtherGameByName("fish");
        //         } else if (nToGame == CCDDZ_T_G_P_DK) {
        //             instance.checkPDKGoldNum();
        //         }
        //     }
        // } 
        if (_pageChannel instanceof CCDDZPageChannels) {
            instance.setWillToGame(CCDDZ_T_G_CC);
            let nToGame = instance.getWillToGame();
            instance.setWillToGame(0);
            if (nToGame && nToGame >= 1 && nToGame <= 11) {
                if (nToGame == CCDDZ_T_G_CC) {
                    if (data.roomid == 10001) {
                        data.isReconnect = true;
                    }
                    CCDDZMainLogic.instance.checkCCGoldNum(data);
                }
            }
        }
        else {
            let room: any = _pageChannel.selectedRoom;
            if (!room) return;
            _pageChannel.selectedRoom = null;
            if (room.roomType == 2) {
                ccserver.getMatchSignUpInfo(room.matchId);
            } else if (room.roomType == 1) {
                let nHasNum = 0;
                let sType;
                if (room.roomFlag == 1) { //金豆场
                    nHasNum = this._self.gold;
                    sType = "金豆";
                } else if (room.roomFlag == 2) {
                    nHasNum = CCDDZBagService.instance.getItemCountById(3);
                    sType = "钻石";
                }

                if (nHasNum > room.maxScore) {
                    var conf = CCGlobalGameConfig.getSuitableRoomConfig(this._self.gold);
                    CCDDZAlert3.show('您拥有的' + sType + '大于' + room.maxScore + '\n推荐进入' + conf.name + '游戏', this.joinSpecialRoom.bind(this, conf.roomID), 'cc_common_btn_enter', true);
                } else if (nHasNum >= room.minScore) {
                    CCalien.CCDDZSceneManager.show("SceneCmpChicken", { action: 'quick_join', roomID: room.roomID }, CCalien.CCDDZsceneEffect.CCDDFade);
                    // CCalien.CCDDZSceneManager.show(CCGlobalSceneNames.PLAY, { action: 'quick_join', roomID: room.roomID }, CCalien.CCDDZsceneEffect.CCDDFade);
                } else {
                    instance.enterGameItemNotEnough(room);
                }
            }
        }
    }

    private _showVipRedImg(bShow: boolean): void {
        this["vipCanGetImg"].visible = bShow;
    }

    private _initVipRedImg(): void {
        let selfData = CCDDZMainLogic.instance.selfData;
        let myLevel = selfData.getCurVipLevel();
        let showRed = false;
        if (myLevel >= 1) {
            if (!selfData.hasGetTodayVipRew()) {
                showRed = true;
            }
        }
        this._showVipRedImg(showRed);
    }

    /**
     * 初始化红包右上角的红包个数
     */
    private _initRedNum(): void {
        if (1)
            return;

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
     * 获取用户是否点击了客服
     */
    private _hasClickWatchWX(): boolean {
        let _v = CCalien.CCDDZlocalStorage.getItem("hasClickKf");
        if (_v) {
            return true;
        }
        return false;
    }

    /**
     * 保存已经点击过客服
     */
    private _saveHasClickWatchWX(): void {
        CCalien.CCDDZlocalStorage.setItem("hasClickKf", "1");
    }

    /**
     * 隐藏提示点击客服和提示动画
     */
    private _clearTipWX(): void {
        this.tipWxImg.visible = false;
        egret.Tween.removeTweens(this.tipWxImg);
    }

    /**
     * 初始化是否要提示点击客服
     */
    private _initTipWX(): void {
        if (1) return;
        this._clearTipWX();
        if (this._hasClickWatchWX()) {
            return;
        }
        this._runTipWXAni();
    }

    /**
     * 提示点击客服动画
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

    /**
     * 根据key判断今天是否需要弹出
     */
    private _isShouldTipByKey(key: string): boolean {
        let _stamp: string = CCalien.CCDDZlocalStorage.getItem(key);
        if (!_stamp) return true;

        let _laststamp = Number(_stamp);
        let _curstamp = CCalien.CCDDZUtils.getCurTimeStamp();
        let _bShould = CCalien.CCDDZUtils.checkTwoTimestampIsOtherDay(_laststamp, _curstamp);
        return _bShould;
    }

	/**
	 * sTimeStamp:时间戳 每天首次弹出提示绑定手机的时间戳
	 */
    private _recordTipTimeStampByKey(key: string): void {
        let _sTimeStamp = CCalien.CCDDZUtils.getCurTimeStamp();
        CCalien.CCDDZlocalStorage.setItem(key, "" + _sTimeStamp);
    }

    /**
     * 初始化是否要提示绑定手机
     * return 是否展示了该活动的弹框
     */
    public _initTipBindPhone(): boolean {
        let _hasBind = CCGlobalUserData.instance.hasBindPhone();
        if (_hasBind) return false;
        if (this._shouldPopThisDay("tipBindTime")) {
            CCDDZPanelBindPhone.getInstance().show(2, { showClose: true, actTipBind: true });
            return true;
        }
        return false;
    }

    /**
     * 初始化是否要提示抽奖
     * return 是否展示了该活动的弹框
     */
    public _initTipLucky(): boolean {
        if (this._shouldPopThisDay("tipLucky")) {
            CCDDZPanelLucky.instance.show(0);
            return true;
        }
        return false;
    }

    /**
     * 初始化是否要提示邀请活动
     * return 是否展示了该活动的弹框
     */
    public _initTipInviteList(): boolean {
        let _info = CCGlobalGameConfig.getCfgByField("webCfg");
        if (_info && _info.status == 1) {
            if (this._shouldPopThisDay("tipInviteList")) {
                this._onClickInvite();
                return true;
            }
            return false;
        }
        return false;
    }

    /**
     * 是否显示每日奖杯
     */
    public _initShowInviteList(): void {
        let _info = CCGlobalGameConfig.getCfgByField("webCfg");
        if (_info && _info.status == 1) {
            this.inviteGroup.visible = true;
        } else {
            this.inviteGroup.visible = false;
        }
    }

    /**
     *是否需要提示领取月卡免费钻石     
    */
    public _initMonthCardFreeDiamond(): boolean {
        let selfData = CCDDZMainLogic.instance.selfData;
        if (selfData.checkMonthCardFreeDiamond() == true) {
            this._showGetDiamond();
            return true;
        }
        return false;
    }
    /**
     * 是否需要提示月卡
     */
    public _initTipMonthCard(): boolean {
        if (this._shouldPopThisDay("tipMonthCard")) {
            let selfData = CCDDZMainLogic.instance.selfData;
            if (selfData.checkMonthCardEndTime()) {
                this._onClickMonthCard();
                return true;
            }
        }
        return false;
    }

    /**
     * 是否需要提示APP免费抽奖
     */
    public _initTipAppLucky(): boolean {
        let _info = CCGlobalGameConfig.getCfgByField("webCfg.appLucky");
        if (_info && _info.status == 1) {
            if (this._shouldPopThisDay("tipAppLucky")) {
                CCDDZPanelLucky.instance.show(2);
                return true;
            }
        }
        return false;
    }
}   