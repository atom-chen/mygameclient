/**
 * Created by eric.liu on 17/11/06.
 *
 * 捕鱼场景
 */

class FishScene extends eui.Component {
    private fish_ground:eui.Group;
    private fish_caustic:eui.Group;
    private fish_label_version:eui.Label;
    private fish_group_top:eui.Group;
    private fish_btn_exit:eui.Button;
    private fish_btn_room:eui.Button;
    private fish_btn_type:eui.Button;
    private fish_btn_shop:eui.Button;
    private fish_btn_sound_on:eui.Button;
    private fish_btn_sound_off:eui.Button;
    private fish_btn_auto:eui.Button;
    private fish_btn_future1:eui.Button;
    private fish_btn_future2:eui.Button;
    private fish_btn_redpacket:FishBtnRedpacket;
    private fish_btn_activity:eui.Button;
    private fish_cannon_1:FishCannon;
    private fish_cannon_2:FishCannon;
    private fish_cannon_3:FishCannon;
    private fish_cannon_4:FishCannon;
    private fish_userinfo_1:FishUserInfo;
    private fish_userinfo_2:FishUserInfo;
    private fish_userinfo_3:FishUserInfo;
    private fish_userinfo_4:FishUserInfo;
    private fish_panel_timeout_tip:eui.Panel;
    private fish_timeout_time:eui.BitmapLabel;
    private fish_panel_tip:eui.Panel;
    private fish_panel_tip_text:eui.Label;
    private fish_label_redpacket_tip:eui.Label;
    private touchPos:egret.Point;
    private lastFireTime:number = egret.getTimer();
    private checkLastFireIntervalId:number = 0;
    private redpacketTipTimeoutId:number = 0;

    private timeoutIdHideUI:number = 0;
    private timeoutIdFireCheck:number = 0;
    private orgin_fish_btn_exit_left:number;
    private orgin_fish_btn_room_left:number;
    private orgin_fish_btn_type_left:number;
    private orgin_fish_btn_shop_left:number;

    private old_fish_btn_auto_x:number;
    private old_fish_btn_redpacket_x:number;
    private old_fish_btn_future1_x:number;
    private old_fish_btn_future2_x:number;

    private oldScaleMode:string;
    private oldFrameRate:number;
    private oldContentWidth:number;
    private oldContentHeight:number;
    private redcoinStatus:boolean = false;

    private autoFireMode:boolean = false;
    private bulletSpaceTime:number = 100;
    private bulletMultiple:Array<number> = [];
    private selfViewId:number = 0;
    private userDatas:Array<FishUserInfoData> = [];
    private loginData:any = null;
    private signinData:any = null;
    private reconnectSession:number = null;
    private willToSuit:boolean = false;
    public static instance:FishScene = null;
    public GetFishGround():eui.Group {
        let self:FishScene = this;
        return self.fish_ground;
    }

    constructor(logindata:any, session:number=0) {
        super();
        FishScene.instance = this;
        let self:FishScene = this;
        self.loginData = logindata;
        self.reconnectSession = session;
        self.addEventListener(eui.UIEvent.ADDED_TO_STAGE, self.beforeShow, self);
        self.addEventListener(eui.UIEvent.REMOVED_FROM_STAGE, self.beforeHide, self);
        self.addEventListener(eui.UIEvent.COMPLETE, self.uiCompHandler, self);
        self.addEventListener(egret.Event.RESIZE, self.uiResizeHandler, self);
        self.skinName = FishMainSkin;
        FishActor.InitStaticResource();
        for (let i = 0; i <= FISH_USER_COUNT; i++) {
            self.userDatas.push(new FishUserInfoData());
        }

        //初始化各对象池
        FishTypes.instance;
        FishManager.GetInstance();
        FishNetManager.GetInstance();
        FishCoinManager.GetInstance();
        FishBulletManager.GetInstance();
        FishCoinNumberManager.GetInstance();

        //加载声音文件
        FishSoundManager.GetInstance().Load();
    }

    private tryReconnect() {
        let self:FishScene = this;
        if (FISH_MODE_INDEPENDENT) {
            let userData: FishUserData = FishUserData.instance;
            userData.setItem('uid', self.loginData.uid);
            userData.setItem('sk', self.loginData.sk);
            userData.setItem('username', self.loginData.username);
            userData.setItem('type', self.loginData.type);
            userData.setItem('token', FishUtils.Native.instance.isNative ? self.loginData.token : self.loginData.token, true);
            fishServer.tryConnect(self.loginData.uid);
        }
    }

    private onLoginResponse(event: egret.Event): void {
        let self:FishScene = this;
        let data = event.data;
        let _data = JSON.stringify(data);
        switch(data.code) {
            case 0:
                FishUtils.Native.instance.userLogin(fishServer.uid, self.loginData.token);
                fishServer.checkReconnect();
                break;
            default:
                fishServer.close();
                break;
        }
    }

    private onConnectToServer(event: egret.Event): void {
        let self:FishScene = this;
        fishServer.login(self.loginData.uid, self.loginData.token);
    }

    public beforeShow(event:egret.Event):void {
        this.fish_btn_activity.visible = false;
        let self:FishScene = this;
        self.removeEventListener(egret.Event.ADDED_TO_STAGE, self.beforeShow, self);
        console.log('==================>>>>>>>> beforeShow');
        //修改场景适配模式
        self.oldScaleMode = self.stage.scaleMode;
        self.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
        //修改帧速，捕鱼只需要30帧
        self.oldFrameRate = self.stage.frameRate;
        self.stage.frameRate = 60;
        //唤醒物理世界
        FishPhysics.GetInstance().Wakeup();
        //修改显示分辨率
        self.oldContentWidth = self.stage.stageWidth;
        self.oldContentHeight = self.stage.stageHeight;
        self.stage.setContentSize(FISH_DESIGN_WIDTH, FISH_DESIGN_HEIGHT);

        FishUtils.EventManager.instance.enableOnObject(self);

        fishServer.userInfoRequest(fishServer.uid); 

        //快速加入或重连房间
        fishServer.seatid = 0;
        if (self.reconnectSession == 0) {
            self.willToSuit = true;
        } else {
            fishServer.reconnect(0);
        }
    }

    public beforeHide(event:egret.Event):void {
        let self:FishScene = this;
        self.willToSuit = false;
        self.removeEventListener(egret.Event.REMOVED_FROM_STAGE, self.beforeHide, self);
        console.log('==================>>>>>>>> beforeHide');
        //修改场景适配模式
        self.stage.scaleMode = self.oldScaleMode;
        //修改帧速，恢复斗地主的60帧
        self.stage.frameRate = self.oldFrameRate;
        //物理世界睡眠
        FishPhysics.GetInstance().Sleep();
        //修改显示分辨率
        self.stage.setContentSize(self.oldContentWidth, self.oldContentHeight);
        //隐藏场景后重置场景
        self.resetScene();

        FishUtils.EventManager.instance.disableOnObject(self);
    }

    private shakeScene() {
        let self:FishScene = this;
        //震屏动作
        if (self.fish_ground) {
            var oldx = 0;
            var oldy = 0;
            egret.Tween.get(self)
                .to({x:oldx-Math.random()*8, y:oldy-Math.random()*8}, 60, egret.Ease.cubicInOut)
                .to({x:oldx+Math.random()*8, y:oldy+Math.random()*8}, 120, egret.Ease.cubicInOut)
                .to({x:oldx-Math.random()*8, y:oldy-Math.random()*8}, 120, egret.Ease.cubicInOut)
                .to({x:oldx+Math.random()*8, y:oldy+Math.random()*8}, 120, egret.Ease.cubicInOut)
                .to({x:oldx-Math.random()*8, y:oldy-Math.random()*8}, 120, egret.Ease.cubicInOut)
                .to({x:oldx+Math.random()*8, y:oldy+Math.random()*8}, 120, egret.Ease.cubicInOut)
                .to({x:0, y:0}, 60);
        }
    }

    createChildren(): void {
        super.createChildren();
        let self:FishScene = this;

        //设置版本号
        self.fish_label_version.text = FISH_VERSION + ' ' + FISH_VERSION_DESC;

        //创建水波
        var caustic = new FishCaustic();
        self.fish_caustic.addChild(caustic);
        caustic.Move();

        //设置控件事件
        self.fish_btn_exit.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_room.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_type.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_shop.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_sound_on.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_sound_off.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_auto.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_redpacket.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_activity.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_ground.addEventListener(egret.TouchEvent.TOUCH_BEGIN, self.touchBegin, self);
        self.fish_ground.addEventListener(egret.TouchEvent.TOUCH_MOVE, self.touchMove, self);
        self.fish_ground.addEventListener(egret.TouchEvent.TOUCH_CANCEL, self.touchEnd, self);
        self.fish_ground.addEventListener(egret.TouchEvent.TOUCH_END, self.touchEnd, self);
        self.fish_ground.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, self.touchEnd, self);

        //保存需要隐藏的ui元素的位置信息
        self.orgin_fish_btn_exit_left = self.fish_btn_exit.left;
        self.orgin_fish_btn_room_left = self.fish_btn_room.left;
        self.orgin_fish_btn_type_left = self.fish_btn_type.left;
        self.orgin_fish_btn_shop_left = self.fish_btn_shop.left;

        self.old_fish_btn_auto_x = self.fish_btn_auto.x;
        self.old_fish_btn_redpacket_x = self.fish_btn_redpacket.x;
        self.old_fish_btn_future1_x = self.fish_btn_future1.x;
        self.old_fish_btn_future2_x = self.fish_btn_future2.x;

        //注册事件
        let e: FishUtils.EventManager = FishUtils.EventManager.instance;
        e.registerOnObject(self, fishServer, FishEvent.USER_LOGIN_RESPONSE, self.onLoginResponse, self);
        e.registerOnObject(self, fishServer, FishEvent.CONNECT_SERVER, self.onConnectToServer, self);
        e.registerOnObject(self, fishServer, FishEvent.SERVER_CLOSE, self.onServerClose, self);
        e.registerOnObject(self, fishServer, FishEvent.SHOW_DISCONNECT, self.onServerClose, self);
        e.registerOnObject(self, fishServer, FishEvent.USER_CHECK_RECONNECT_REP, self.onCheckReconnectRep, self);
        e.registerOnObject(self, fishServer, FishEvent.USER_QUICK_JOIN_RESPONSE, self.onQuickJoinResponse, self);
        e.registerOnObject(self, fishServer, FishEvent.USER_USER_INFO_RESPONSE, self.onUserInfoResponse, self);
        e.registerOnObject(self, fishServer, FishEvent.USER_RECONNECT_TABLE_REP, self.onUserReconnectResponse, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_USER_ONLINE, self.onUserOnline, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_ENTER_TABLE, self.onEnterTable, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_LEAVE_TABLE, self.onLeaveTable, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_TABLE_INFO, self.onTableInfo, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_FISH_TRACE, self.onGameFishTrace, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_FISH_FIRE_REP, self.onGameFishFire, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_FISH_FISH_OVER, self.onGameFishOver, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_FISH_SCENE, self.onGameFishScene, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_FISH_CONFIG, self.onGameFishConfig, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_FISH_REDCOUNT, self.onGameFishRedcount, self);
        e.registerOnObject(self, fishServer, FishEvent.LOTTERY_REDCOIN_REP, self.onGameFishRedcoin, self);
        e.registerOnObject(self, fishServer, FishEvent.USER_BAG_INFO_REP, self.onUserBagInfo, self);
        e.registerOnObject(self, fishServer, FishEvent.USER_ALMS_REP, self.onUserAlms, self);
        e.registerOnObject(self, fishServer, FishEvent.GET_FRESHMAN_REWARD_REP, self.onUserGetFreshManReward, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_FISH_FIRE_FAIL, self.onGameFireFail, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_USER_INFO_IN_GAME_REP, self.onUserInfoInGame, self);
        e.registerOnObject(self, fishServer, FishEvent.USER_REDCOIN_EXCHANGE_GOODS_REP, self.onRedcoinExchangeGoods, self);
        e.registerOnObject(self, fishServer, FishEvent.USER_DAY_SIGNIN_OPT_REP, self.onDaySigninOpt, self);
        e.registerOnObject(self, fishServer, FishEvent.GAME_FISH_FRESHEN_GOLD_REP, self.onRefreshUserGold, self);
        e.enableOnObject(self);

        //单款处理断线消息
        if (FISH_MODE_INDEPENDENT) {
            FishUtils.Dispatcher.addEventListener(FishEvent.SERVER_CLOSE, self.onServerClose, self);
            if (FISH_MODE_WXMP) {
                self.fish_btn_exit.visible = false;
            }
        }

        //获取签到信息
        fishServer.sendDaySigninOptReq(1);

        //创建debugDraw调试物理
        //FishPhysics.GetInstance().CreateDebugDraw(self);
        self.addEventListener(egret.Event.ENTER_FRAME, function() {
            FishPhysics.GetInstance().Update();
        }, self);

        //初始化默认位置
        self.touchPos = egret.Point.create(self.stage.stageWidth/2, self.stage.stageHeight/2);
    }

    private uiCompHandler():void {
        let self:FishScene = this;
    }

    private uiResizeHandler():void {
    }

    private getRandomArbitrary(min, max) {
        //生成随机数
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private autoFireBullet(timeStamp:number):boolean {
        let self:FishScene = this;
        //自动发炮，间隔时间服务端配置
        if (timeStamp - self.lastFireTime > self.bulletSpaceTime) {
            self.fireBullet(self.getMyViewID(), self.touchPos);
        }
        return false;
    }

    private checkLastFire():boolean {
        console.log("checkLastFire----------->");
        let self:FishScene = this;
        let min = self.bulletMultiple[0] || 1;
        let viewId = self.getMyViewID();
        if(self.userDatas[viewId].gold < min){
            self._tipNoGold();
            return;
        }

        //1分钟不操作，提示被踢出
        var timeStamp = egret.getTimer();
        if (self.timeoutIdFireCheck == 0 && timeStamp - self.lastFireTime > 60*1000) {
            //显示倒计时提示
            let _self:FishScene = self;
            let _time:number = 10;
            self.timeoutIdFireCheck = egret.setInterval(function() {
                _self.showTimeoutTip(_time--);
                if (_time < 0) {
                    _self.closeCheckLastFire();
                    //退出游戏
                    _self.quitGame();
                }
            }, self, 1000);
        }
        return false;
    }

    private closeCheckLastFire() {
        let self:FishScene = this;
        //关闭超时检测
        if (self.timeoutIdFireCheck != 0) {
            egret.clearInterval(self.timeoutIdFireCheck);
            self.timeoutIdFireCheck = 0;
            self.showTimeoutTip(0);
        }
        self.lastFireTime = egret.getTimer();
    }

    private showTimeoutTip(time:number) {
        let self:FishScene = this;
        //显示超时通知
        self.fish_panel_timeout_tip.visible = time > 0;
        self.fish_timeout_time.text = time > 9?''+time:' '+time;
    }

    private fireBullet(viewID:number, p:egret.Point) {
        let self:FishScene = this;
        //发射子弹
        var cannon = self.getCannon(viewID);
        if (null == cannon) return;
        //如果断线
        if (null == fishServer || false == fishServer.connected) {
            self.closeAutoFire();
            FishAlert.instance.show(self.fish_group_top, "断线了，是否重新连接？", 0, self.onAlertResult.bind(self, 2));
            return;
        }
        //检测币是否充足
        if (viewID == self.getMyViewID()) {
            if (self.userDatas[viewID].gold < cannon.GetMultiple()) {
                self.closeAutoFire();
                fishServer.alms();
                return;
            }
        }
        self.lastFireTime = egret.getTimer();
        let bullet:FishBullet = cannon.FireTo(p);
        self.fish_ground.addChild(bullet);
        //如果是自己，发送请求给服务端
        if (viewID == self.getMyViewID()) {
            fishServer.fireFish(1, cannon.GetFireAngle(), cannon.GetMultiple(), bullet.GetBulletID());
        }
    }

    private touchBegin(e: egret.TouchEvent) {
        let self:FishScene = this;
        //自动发炮模式改变炮台角度
        if (self.autoFireMode) {
            self.touchPos = egret.Point.create(e.stageX, e.stageY);
            return;
        }
        //间隔控制
        if (egret.getTimer() - self.lastFireTime < self.bulletSpaceTime) {
            return;
        }
        //触摸开始，先发一炮，进入计时
        self.touchPos = egret.Point.create(e.stageX, e.stageY);
        self.fireBullet(self.getMyViewID(), self.touchPos);
        egret.startTick(self.autoFireBullet, self);

        // //倒计时隐藏ui上无用按钮
        // self.timeoutIdHideUI = egret.setTimeout((arg)=> {
        //     var __this = arg;
        //     egret.Tween.get(__this.fish_btn_exit).wait(100).to({left: -100, alpha:0.3}, 500, egret.Ease.cubicOut);
        //     egret.Tween.get(__this.fish_btn_room).wait(100).to({left: -100, alpha:0.3}, 500, egret.Ease.cubicOut);
        //     egret.Tween.get(__this.fish_btn_type).wait(200).to({left: -100, alpha:0.3}, 500, egret.Ease.cubicOut);
        //     egret.Tween.get(__this.fish_btn_shop).wait(300).to({left: -100, alpha:0.3}, 500, egret.Ease.cubicOut);
        // }, self, 1000, self)
    }

    private touchMove(e: egret.TouchEvent) {
        //触摸移动，记录位置
        this.touchPos = egret.Point.create(e.stageX, e.stageY);
    }

    private touchEnd(e: egret.TouchEvent) {
        let self:FishScene = this;
        if (self.autoFireMode) {
            return;
        }
        //触摸结束，停止自动发炮
        self.touchPos = egret.Point.create(e.stageX, e.stageY);
        egret.stopTick(self.autoFireBullet, self);

        // //显示隐藏的按钮
        // egret.clearTimeout(self.timeoutIdHideUI);
        // self.timeoutIdHideUI = 0;
        // egret.Tween.get(self.fish_btn_exit).wait(100).to({left: self.orgin_fish_btn_exit_left, alpha:1}, 500, egret.Ease.cubicIn);
        // egret.Tween.get(self.fish_btn_room).wait(100).to({left: self.orgin_fish_btn_room_left, alpha:1}, 500, egret.Ease.cubicIn);
        // egret.Tween.get(self.fish_btn_type).wait(200).to({left: self.orgin_fish_btn_type_left, alpha:1}, 500, egret.Ease.cubicIn);
        // egret.Tween.get(self.fish_btn_shop).wait(300).to({left: self.orgin_fish_btn_shop_left, alpha:1}, 500, egret.Ease.cubicIn);
    }

    private clearCheckLastFireInterval():void{
        let self:FishScene = this;
        if (self.checkLastFireIntervalId != 0) {
            //关闭检测
            egret.clearInterval(self.checkLastFireIntervalId);
        }
        self.checkLastFireIntervalId = 0;
    }

    private quitGame() {
        let self:FishScene = this;
        self.closeAutoFire();
        self.closeCheckLastFire();
        //关闭背景音乐
        FishSoundManager.GetInstance().Mute(true);
        self.clearCheckLastFireInterval();
        if (FISH_MODE_INDEPENDENT) {
            //单款模式
            fishServer.giveUpGame();
            self.resetScene();
            //接入公众号后
            if (FISH_MODE_WXMP) {
                FishAlert.instance.show(self.fish_group_top, "长时间无操作，被系统请出来休息了，是否重新加入游戏？", 0, self.onAlertResult.bind(self, 4));
            } else {
                FishJsBridge.getInstance().tsCallJsFunc('closewindow');
            }
        } else {
            //接入模式
            fishServer.giveUpGame();
            self.resetScene();
            fishServer.ddzDispatchEvent(1, '', {type:1});
        }
    }

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishScene = this;
        switch(event.target) {
            case self.fish_btn_exit:
                //离开房间
                FishAlert.instance.show(self.fish_group_top, "打鱼收益好像不错，不再玩一会了吗？", 0, self.onAlertResult.bind(self, 0));
                break;
            case self.fish_btn_room:
                //切换房间
                FishRoom.instance.show(self.fish_group_top, fishServer.roomId, self.onRoomSelect.bind(self));
                break;
            case self.fish_btn_type:
                //鱼类型介绍
                FishTypes.instance.show(self.fish_group_top);
                break;
            case self.fish_btn_shop:
                //商城
                FishShop.instance.show(self.fish_group_top);
                break;
            case self.fish_btn_sound_on:
                //关闭音乐
                FishSoundManager.GetInstance().Mute(true);
                self.fish_btn_sound_on.visible = false;
                self.fish_btn_sound_off.visible = true;
                break;
            case self.fish_btn_sound_off:
                //开启音乐
                FishSoundManager.GetInstance().Mute(false);
                self.fish_btn_sound_on.visible = true;
                self.fish_btn_sound_off.visible = false;
                break;
            case self.fish_btn_auto:
                //自动发炮
                if (self.autoFireMode) {
                    self.closeAutoFire();
                } else {
                    var e = new egret.TouchEvent(egret.TouchEvent.TOUCH_BEGIN, false, false, self.touchPos.x, self.touchPos.y, 0);
                    self.touchBegin(e);
                    self.fish_btn_auto.currentState = 'auto';
                    self.autoFireMode = true;
                }
                break;
            case self.fish_btn_redpacket:
                //红包
                self.redcoinStatus = true;
                fishServer.lotteryRedcoin(fishServer.roomId);
                break;
            case self.fish_btn_activity:
                //活动
                FishActivity.instance.show(self.fish_group_top, self.signinData);
                break;
        }
    }

    public getSuitFishRoom():any{
        let cfg = langFish["roomCfg"];
        let selfGold = fishServer.selfData.gold;
        let oneRoom = null;
        let suitRoom = null;
        let len = cfg.length;
        for (let i=len-1;i>=0;--i){
            oneRoom = cfg[i];
            if(oneRoom.minScore <= selfGold && oneRoom.maxScore >= selfGold){
                suitRoom = oneRoom;
                break;
            }
        }
        console.log("getSuitFishRoom-------------->",suitRoom,selfGold);
        return suitRoom;
    }

    private onAlertResult(type: number, result: boolean): void {
        let self:FishScene = this;
        //提示框回调
        if (type == 0 && result) {
            //TODO:测试如果大厅不能够调用REMOVED消息，则需要显式调用
            //self.beforeHide();
            //退出游戏
            self.quitGame();
        } else if (type == 1 && result) {
            //充值
            FishShop.instance.show(self.fish_group_top);
        } else if (type == 2 && result) {
            //断线提示重新加载
            self.tryReconnect();
        } else if (type == 3 && result) {
            //金豆不足领取救济金
            fishServer.alms();
        } else if (type == 4 && result) {
            //重新加入
            egret.setTimeout(function() {
                self.resetScene();
                fishServer.seatid = 0;
                let roomInfo = self.getSuitFishRoom();
                if(!roomInfo){
                    self._tipNoGold();
                    return;
                }
                fishServer.quickJoin(roomInfo.roomID);
            }, self, 1000);
        } else if (type == 5 && result) {
            //金豆超上限
            //重新加入房间
            self.fish_panel_tip_text.text = '正在切换房间...';
            self.fish_panel_tip.visible = true;
            fishServer.giveUpGame();
            egret.setTimeout(function() {
                self.resetScene();
                fishServer.seatid = 0;
                let roomInfo = self.getSuitFishRoom();
                fishServer.quickJoin(roomInfo.roomID);
                self.fish_panel_tip.visible = false;
            }, self, 300);
        } else if (type == 6 && result) {
            //金豆不足
            //重新加入房间
            self.fish_panel_tip_text.text = '正在切换房间...';
            self.fish_panel_tip.visible = true;
            fishServer.giveUpGame();
            egret.setTimeout(function() {
                self.resetScene();
                fishServer.seatid = 0;
                let roomInfo = self.getSuitFishRoom();
                if(!roomInfo){
                    self._tipNoGold();
                    return;
                }
                fishServer.quickJoin(roomInfo.roomID);
                self.fish_panel_tip.visible = false;
            }, self, 1500);
        }
    }

    private onRoomSelect(roomId: number): void {
        let self:FishScene = this;
        //选择房间回调
        if (roomId == fishServer.roomId) return;
        //重新加入房间
        self.fish_panel_tip_text.text = '正在切换房间...';
        self.fish_panel_tip.visible = true;
        fishServer.giveUpGame();
        egret.setTimeout(function() {
            self.resetScene();
            fishServer.seatid = 0;
            fishServer.quickJoin(roomId);
            self.fish_panel_tip.visible = false;
        }, self, 1500);
    }

    private getUserDataByID(uid:number):FishUserInfoData {
        let self:FishScene = this;
        //通过用户ID取用户信息
        for (var i=1;i<=FISH_USER_COUNT;i++) {
            if (self.userDatas[i].uid == uid) {
                return self.userDatas[i];
            }
        }
        return null;
    }

    private getMyViewID():number {
        let self:FishScene = this;
        if (fishServer.seatid == 0) {
            return 0;
        }
        if (self.selfViewId != 0) {
            return self.selfViewId;
        }
        //获得自己的viewid
        var selfViewId = Math.abs(fishServer.seatid-2) % 3;
        if (selfViewId == 0) {
            selfViewId = 2;
        } else if (selfViewId == NaN) {
            selfViewId = 0;
        }
        self.selfViewId = selfViewId;
        return selfViewId;
    }

    private switchSeatID2ViewID(seat:number):number {
        let self:FishScene = this;
        if (fishServer.seatid == 0) {
            return 0;
        }
        //座位id到视图id的转换
        var viewId = (self.getMyViewID() + (seat-fishServer.seatid) + FISH_USER_COUNT) % FISH_USER_COUNT;
        if (viewId == 0) {
            viewId = 4;
        }
        return viewId;
    }

    private getCannon(view:number):FishCannon {
        let self:FishScene = this;
        //获取炮台
        switch(view) {
            case 1:return self.fish_cannon_1;
            case 2:return self.fish_cannon_2;
            case 3:return self.fish_cannon_3;
            case 4:return self.fish_cannon_4;
            default:return null;
        }
    }

    private getUserInfo(view:number):FishUserInfo {
        let self:FishScene = this;
        //获取用户信息面板
        switch(view) {
            case 1:return self.fish_userinfo_1;
            case 2:return self.fish_userinfo_2;
            case 3:return self.fish_userinfo_3;
            case 4:return self.fish_userinfo_4;
            default:return null;
        }
    }

    private getUserInfoByUid(uid:number):FishUserInfo {
        let self:FishScene = this;
        for (var i, length=self.userDatas.length;i<length;i++) {
            if (self.userDatas[i].uid == uid) {
                var viewid = self.switchSeatID2ViewID(self.userDatas[i].seatid);
                return self.getUserInfo(viewid);
            }
        }
        return null;
    }

    private getViewByUid(uid:number):number {
        let self:FishScene = this;
        for (var i=0, length=self.userDatas.length;i<length;i++) {
            if (self.userDatas[i].uid == uid) {
                return self.switchSeatID2ViewID(self.userDatas[i].seatid);
            }
        }
        return 0;
    }

    private resetScene() {
        let self:FishScene = this;
        //关闭背景音乐
        FishSoundManager.GetInstance().Mute(true);
        //停止自动发炮
        self.closeAutoFire();
        egret.stopTick(self.checkLastFire, self);
        self.clearCheckLastFireInterval();
        //重置炮台
        for (var i=1;i<=4;i++) {
            self.getCannon(i).SetMultiple(0);
            self.getCannon(i).ShowCannon(false, false);
            self.getUserInfo(i).SetUserInfo(0);
        }
        //清除所有子弹、鱼、网
        FishManager.GetInstance().ClearAllFishes();
        FishNetManager.GetInstance().ClearAllNets();
        FishBulletManager.GetInstance().ClearAllBullet();
        //清除变量
        fishServer.seatid = 0;
        self.selfViewId = 0;
        self.redcoinStatus = false;
    }

    private playerSeatDown(data: any) {
        let self:FishScene = this;
        //console.log('===============================>>>>>>> 玩家坐下' + data.uid);
        //玩家坐下
        if (data.uid == fishServer.uid) {
            //自己
            self.selfViewId = 0;
            fishServer.seatid = data.seatid;
            fishServer.selfData.seatid = data.seatid;
            FishPhysics.GetInstance().selfViewId = self.getMyViewID();

            //获取个人用户信息
            fishServer.userInfoRequest(fishServer.uid);

            //交换红包和自动发炮按钮位置
            if (self.getMyViewID() == 2) {
                //2号位置
                self.fish_btn_auto.x = self.old_fish_btn_future2_x;
                self.fish_btn_future2.x = self.old_fish_btn_auto_x;
                self.fish_btn_redpacket.x = self.old_fish_btn_future1_x;
                self.fish_btn_future1.x = self.old_fish_btn_redpacket_x;
            } else {
                //1号位置
                self.fish_btn_auto.x = self.old_fish_btn_auto_x;
                self.fish_btn_redpacket.x = self.old_fish_btn_redpacket_x;
                self.fish_btn_future1.x = self.old_fish_btn_future1_x;
                self.fish_btn_future2.x = self.old_fish_btn_future2_x;
            }

            //播放背景音乐
            FishSoundManager.GetInstance().PlayBGM(0, false);
            FishSoundManager.GetInstance().Mute(false);
        }

        //保存用户信息
        var viewId = self.switchSeatID2ViewID(data.seatid);
        self.userDatas[viewId].initData(data);

        //请求用户信息 根据请求到的用户信息设置界面
        fishServer.getUserInfoInGame(data.uid);

        // //设置用户信息
        // self.getUserInfo(viewId).SetUserInfo(self.userDatas[viewId].uid, self.userDatas[viewId].nickname,
        //     self.userDatas[viewId].gold, 0, self.userDatas[viewId].imageid, self.userDatas[viewId].redcoin);

        //设置炮台
        let cannon:FishCannon = self.getCannon(viewId);
        if (cannon) {
            cannon.ShowCannon(true, data.uid == fishServer.uid);
            if (self.bulletMultiple.length > 0) cannon.SetMultiple(self.bulletMultiple[0]);
        }
    }

    private playerStandUp(uid: number) {
        //console.log('===============================>>>>>>> 玩家离开' + uid);
        //玩家站起
        let self:FishScene = this;
        //清理用户信息
        var userdata = self.getUserDataByID(uid);
        var viewId = self.switchSeatID2ViewID(userdata.seatid);
        userdata.initData({});
        //设置用户信息
        self.getUserInfo(viewId).SetUserInfo(0);
        //设置炮台
        self.getCannon(viewId).ShowCannon(false);
    }

    private closeAutoFire() {
        let self:FishScene = this;
        //关闭自动发炮
        egret.stopTick(self.autoFireBullet, self);
        self.fish_btn_auto.currentState = 'normal';
        self.autoFireMode = false;
    }

    private onServerClose(event: egret.Event): void {
        let self:FishScene = this;
        //console.log('==================>>>>>>>> onServerClose');
        //断线提示
        FishAlert.instance.show(self.fish_group_top, "断线了，是否重新连接？", 0, self.onAlertResult.bind(self, 2));
        self.closeAutoFire();
    }

    /**
	 * 当快速加入成功
     * //0成功  2 金豆不足 3 房间已满  4 用户已经存在 5 用户不存在 6 服务器不可用  7 拥有金豆超过房间上限
	 */
    private onQuickJoinResponse(event: egret.Event): void {
        //console.log('==================>>>>>>>> onQuickJoinResponse');
        let data = event.data;
        let self:FishScene = this;
        switch(data.result) {
            case 0:
                console.log('join success.');
                //清理环境
                self.closeAutoFire();
                self.closeCheckLastFire();
                self.clearCheckLastFireInterval();
                //检测超时不操作
                self.checkLastFireIntervalId = egret.setInterval(self.checkLastFire, self, 1000);
                //提示

                self.fish_panel_tip_text.text = '已经进入捕鱼' + langFish.exchange_roomid[fishServer.roomId];
                self.fish_panel_tip.visible = true;
                egret.setTimeout(function() {
                    self.fish_panel_tip.visible = false;
                }, self, 3000);
                return;
            case 1:
                FishAlert.instance.show(self.fish_group_top, "加入房间失败！", 1);
                break;
            case 2:
                let type = 3
                let btnType = 0
                let suitRoom = self.getSuitFishRoom();
                let sTipInfo = "金豆不足！"
                if(suitRoom){
                    type = 6
                    btnType = 1
                    sTipInfo = "金豆不足，点击确定进入" +langFish.exchange_roomid[suitRoom.roomID]+"！";
                }else{
                    this["almsErrClose"] = true;
                }
                FishAlert.instance.show(self.fish_group_top, sTipInfo, btnType, self.onAlertResult.bind(self, type));
                break;
            case 3:
                FishAlert.instance.show(self.fish_group_top, langFish.no_more_desk, 1);
                break;
            case 4:
                FishAlert.instance.show(self.fish_group_top, '用户已经存在', 1);
                break;
            case 7:
                let suitRoom1 = self.getSuitFishRoom();
                let sTipInfo1 = "拥有金豆超过房间上限，点击确定进入" + langFish.exchange_roomid[suitRoom1.roomID]
                FishAlert.instance.show(self.fish_group_top, sTipInfo1, 1, self.onAlertResult.bind(self, 5));
                break;
        }
        fishServer.roomId = 0;
    }

    private onTableInfo(event: egret.Event): void {
        let self:FishScene = this;
        //console.log('==================>>>>>>>> onTableInfo');
        let data = event.data;
        for(var i = 0, length=data.players.length; i < length; ++i){
            if (data.players[i].uid != fishServer.uid) {
                //这里只需要处理其他玩家
                self.playerSeatDown(data.players[i]);
            }
        }
    }

    private onUserOnline(event: egret.Event): void {
        let self:FishScene = this;
        //console.log('==================>>>>>>>> onUserOnline');
        let data = event.data;
        self.playerSeatDown(data);
    }

    private onEnterTable(event: egret.Event): void {
        let self:FishScene = this;
        //console.log('==================>>>>>>>> onEnterTable');
        let data = event.data;
        //自己进入和其他人中途进入
        self.playerSeatDown(data);
    }

    private onLeaveTable(event: egret.Event): void {
        let self:FishScene = this;
        //console.log('==================>>>>>>>> onLeaveTable');
        let data = event.data;
        if (data.uid == fishServer.uid) {
            //自己离开
            //console.log('leave:'+data.reason);
            //FishAlert.instance.show(self.fish_group_top, "被系统踢出来了，是否重新加入游戏？", 0, self.onAlertResult.bind(self, 4));
            if(data.reason == 4){
                self._tipNoGold();
            }
        } else {
            //其他人离开
            self.playerStandUp(data.uid);
        }
    }

    private onGameFishTrace(event: egret.Event): void {
        //console.log('==================>>>>>>>> onGameFishTrace');
        let data = event.data;
        let self:FishScene = this;
        //收到鱼的下发信息
        var fish = FishManager.GetInstance().BuildFish(data.fishkind-1, data.fishid);
        self.fish_ground.addChildAt(fish, 1);
        fish.MoveToTrace(data);
    }

    private onGameFireFail(event: egret.Event): void {
        //console.log('==================>>>>>>>> onGameFireFail');
        let data = event.data;
        let self:FishScene = this;
        //提示充值
        if (data.code == 1) {
            let oneRoom = self.getSuitFishRoom();
            if(oneRoom){
                if(oneRoom.roomID != fishServer.roomId){
                    FishAlert.instance.show(self.fish_group_top, "金豆不够了，发射子弹失败。点击确定进入其他场！", 1, self.onAlertResult.bind(self, 6));
                    return;
                }
            }

            self._tipNoGold(true);
        }
    }

    private onGameFishFire(event: egret.Event): void {
        //console.log('==================>>>>>>>> onGameFishFire');
        let data = event.data;
        let self:FishScene = this;
        let viewId:number = self.switchSeatID2ViewID(data.seat_id);
        //收到开炮消息
        let cannon:FishCannon = self.getCannon(viewId);
        if (null == cannon) return;
        if (data.seat_id != fishServer.seatid) {
            //其他人开炮
            var bullet = cannon.FireToAngle(data.angle);
            self.fish_ground.addChild(bullet);
            //设置其炮倍数
            cannon.SetMultiple(data.bullet_multiple);
        } else {
            //关闭超时提示
            self.closeCheckLastFire();
            //根据当前金豆更新炮倍数
            var multiple = cannon.GetMultiple();
            if (data.gold < multiple) {
                for (var i=self.bulletMultiple.length-1;i>=0;i--) {
                    if (data.gold >= self.bulletMultiple[i]) {
                        cannon.SetMultiple(self.bulletMultiple[i]);
                        break;
                    }
                }
            }
        }

        //更新金豆
        self.userDatas[viewId].gold = data.gold;
        let userinfo:FishUserInfo = self.getUserInfo(viewId);
        if (userinfo) {
            userinfo.UpdateGold(data.gold);
        }
    }

    private onGameFishOver(event: egret.Event): void {
        //console.log('==================>>>>>>>> onGameFishOver');
        let data = event.data;
        let self:FishScene = this;
        //收到鱼被捕消息
        let fish:FishActor = FishManager.GetInstance().GetFishByID(data.fishid);
        var viewId = self.switchSeatID2ViewID(data.seat_id);
        if (fish) {
            var fishtype = fish.GetFishType();
            fish.Explode(viewId, data.fish_gold, data.red_packet);
            if (fishtype == 17) {
                //金龙震屏
                self.shakeScene();
            }
        }
        //bingo效果
        let cannon:FishCannon = self.getCannon(viewId);
        if (cannon) {
            if (data.effect == 1) {
                cannon.ShowBingo(data.fish_gold);
            }
        }
        //更新玩家金豆
        self.userDatas[viewId].gold = data.gold;
        let userinfo:FishUserInfo = self.getUserInfo(viewId);
        if (userinfo) {
            userinfo.UpdateGold(data.gold);
        }
    }

    private onGameFishScene(event: egret.Event): void {
        //console.log('==================>>>>>>>> onGameFishScene');
        let data = event.data;
        let self:FishScene = this;
        //收到屏幕上的鱼消息
        var fish = FishManager.GetInstance().BuildFish(data.fish_info.fishkind-1, data.fish_info.fishid);
        self.fish_ground.addChildAt(fish, 1);
        fish.MoveToTrace(data.fish_info, data.passtime/1000);
    }

    private onGameFishConfig(event: egret.Event): void {
        //console.log('==================>>>>>>>> onGameFishConfig');
        let data = event.data;
        let self:FishScene = this;
        //收到配置消息
        let bullet_multiple:Array<number> = data.bullet_multiple;
        let bullet_space_time:number = data.bullet_space_time;
        self.bulletSpaceTime = bullet_space_time;
        self.bulletMultiple = bullet_multiple;
        //设置可用炮级
        self.fish_cannon_1.SetMultiples(bullet_multiple);
        self.fish_cannon_2.SetMultiples(bullet_multiple);
        self.fish_cannon_3.SetMultiples(bullet_multiple);
        self.fish_cannon_4.SetMultiples(bullet_multiple);
    }

    private onGameFishRedcount(event: egret.Event): void {
        //console.log('==================>>>>>>>> onGameFishRedcount');
        let data = event.data;
        let self:FishScene = this;
        //收到红包抽奖次数
        self.fish_btn_redpacket.updateNum(data.red_count);
    }

    private onGameFishRedcoin(event: egret.Event): void {
        //console.log('==================>>>>>>>> onGameFishRedcoin');
        let data = event.data;
        let self:FishScene = this;
        //收到抽红包结果
        var result = data.result;
        var coin = data.coin;
        if (result == 0) {
            //FishAlert.instance.show(self.fish_group_top, '恭喜你，抽得'+coin/100+'奖杯！请再接再厉。', 1);
            //文字提示
            let startY:number = 600;
            egret.Tween.removeTweens(self.fish_label_redpacket_tip);
            self.fish_label_redpacket_tip.x = self.fish_btn_redpacket.x+34;
            self.fish_label_redpacket_tip.y = startY;
            self.fish_label_redpacket_tip.text = `+${coin/100}奖杯`
            self.fish_label_redpacket_tip.visible = true;
            self.fish_label_redpacket_tip.alpha = 1.0;
            egret.Tween.get(self.fish_label_redpacket_tip)
                .to({y:startY-50, alpha:0.1}, 1200)
                .call(function(_self:FishScene) {
                    _self.fish_label_redpacket_tip.visible = false;
                }, self, [self]);
            //更新红包数
            let redpacket = self.fish_btn_redpacket;
            let count = + redpacket.getNum();
            if (count > 0) count--;
            redpacket.updateNum(count);
        } else {
            //抽红包失败
            self.redcoinStatus = false;
            //错误信息
            var reason = '系统错误';
            switch(result) {
                case 1:reason = '领取时发生错误，请稍后再试。';break;
                case 2:reason = '奖杯不足，请捕获更多的鱼获取奖杯。';break;
                case 3:reason = '领取时发生错误，请稍后再试。';break;
                case 4:reason = '操作过于频繁，请稍后再试。';break;
            }
            FishAlert.instance.show(self.fish_group_top, reason, 1);
        }
    }

    private onUserBagInfo(event: egret.Event): void {
        //console.log('==================>>>>>>>> onUserBagInfo');
        let data = event.data;
        let self:FishScene = this;
        //获取玩家背包信息
        let userinfo: FishUserInfo = self.getUserInfo(self.getMyViewID());
        if (userinfo) {
            data.items.forEach((item:any)=>{
                if (item.id == 3) {
                    //钻石
                    userinfo.UpdateDiamond(item.count);
                }
            });
        }
    }

    private onUserAlms(event: egret.Event): void {
        console.log('==================>>>>>>>> onUserAlms');
        let data = event.data;
        let self:FishScene = this;
        //获取救济金成功后重新加入房间
        var result = data.result;
        if (result == 0) {
            this["almsErrClose"] = false;
            //领取成功
            FishAlert.instance.show(self.fish_group_top, '金豆不足，领取救济金2000成功！', 1);
            //请求刷新金豆
            fishServer.refreshUserGoldInGame();
        } else {
            //提示充值
            //FishAlert.instance.show(self.fish_group_top, "金豆不够了，是否立即充值再战？", 0, self.onAlertResult.bind(self, 0));
            if(this["almsErrClose"]){
                self._tipNoGold(true);
            }
        }
    }

    private onUserGetFreshManReward(event: egret.Event): void {
        //console.log('==================>>>>>>>> onUserGetFreshManReward');
        let data = event.data;
        let self:FishScene = this;
        //提示领取新手奖励成功
        if (data.result == 0) {
            FishAlert.instance.show(self.fish_group_top, `欢迎您的到来，已自动帮您领取新手奖励${data.gold}金豆。`, 1);
        }

        //快速加入
        fishServer.seatid = 0;

        let roomInfo = self.getSuitFishRoom();
        if(!roomInfo){
            self._tipNoGold();
            return;
        }
        fishServer.quickJoin(roomInfo.roomID);
    }

    private onUserInfoResponse(event: egret.Event): void {
        //console.log('==================>>>>>>>> onUserInfoResponse');
        let self:FishScene = this;
        //获取用户信息成功
        let data: any = event.data;
        if (data.uid == fishServer.uid) {
            fishServer.selfData.initData(data);
            //更新红包和金豆
            let viewId: number = self.getMyViewID();
            self.userDatas[viewId].gold = fishServer.selfData.gold;
            self.userDatas[viewId].redcoin = fishServer.selfData.redcoin;
            let userinfo: FishUserInfo = self.getUserInfo(viewId);
            if (userinfo) {
                userinfo.UpdateRedcoin(fishServer.selfData.redcoin/100);
                if (!self.redcoinStatus) {
                    //TODO:去大厅抽取红包的时候，大厅会发这个用户信息更新的包
                    //但这个里面的金豆还是进入房间时的金豆，捕鱼里面的金豆没有更新上去
                    //这里做了一个很low的本地变量判断，需要服务端改进
                    userinfo.UpdateGold(fishServer.selfData.gold);
                    self.redcoinStatus = false;
                }
            }
            if (self.willToSuit && fishServer.seatid == 0){
                //尝试领取新手奖励
                if (FISH_MODE_INDEPENDENT) {
                    fishServer.getFreshManReward();
                } else {
                    let roomInfo = self.getSuitFishRoom();
                    if(!roomInfo){
                        self._tipNoGold();
                        return;
                    }
                    fishServer.quickJoin(roomInfo.roomID);
                }
            }
            self.willToSuit = false;
        }
    }

    private _justStopFire():void{
        let self:FishScene = this;
        egret.stopTick(self.checkLastFire, self);
        self.closeAutoFire();
        self.closeCheckLastFire();
        self.clearCheckLastFireInterval();
    }

    private _tipNoGold(bAlert:boolean = true):void{
        let self:FishScene = this;
        self._justStopFire()
        fishServer.giveUpGame();
        if(bAlert){
            FishAlert.instance.show(self.fish_group_top, "金豆不够了", 1,self.onAlertResult.bind(self,0,1));
        }else{
            self.onAlertResult(0,true)
        }
    }

    private onUserInfoInGame(event: egret.Event): void {
        //console.log('==================>>>>>>>> onUserInfoInGame');
        let self:FishScene = this;
        //获取用户信息成功
        let data: any = event.data;
        let viewId:number = self.getViewByUid(data.uid);
        if (viewId == 0) return;
        self.userDatas[viewId].initData(data);
        let userinfo:FishUserInfo = self.getUserInfo(viewId);
        if (userinfo) {
            userinfo.SetUserInfo(self.userDatas[viewId].uid, self.userDatas[viewId].nickname,
                self.userDatas[viewId].gold, 0, self.userDatas[viewId].imageid, self.userDatas[viewId].redcoin/100);
        }
    }

    private onCheckReconnectRep(event: egret.Event): void {
        let data: any = event.data;
        //console.log('==================>>>>>>>> onCheckReconnectRep');
        let self:FishScene = this;
        //处理断线重连，大厅在断线重连后发送这个通知，此处处理重新加入房间
        //快速加入或重连房间
        self.resetScene();
        fishServer.seatid = 0;
        if (self.reconnectSession == 0 && data.roomid == 0) {     
            
            let roomInfo = self.getSuitFishRoom();
            if(!roomInfo){
                self._tipNoGold();
                return;
            }
            fishServer.quickJoin(roomInfo.roomID);
        } else {
            fishServer.reconnectJoin(data.session);
        }
    }

    private onUserReconnectResponse(event: egret.Event): void {
        let data: any = event.data;
        //console.log('==================>>>>>>>> onUserReconnectResponse');
        let self:FishScene = this;
        self.reconnectSession = 0;

        if (data.result == 0) {
            //重连成功
            console.log('重连成功');
            //清理环境
            self.closeAutoFire();
            self.closeCheckLastFire();
            self.clearCheckLastFireInterval();
            //检测超时不操作
            self.checkLastFireIntervalId = egret.setInterval(self.checkLastFire, self, 1000);
        } else {
            //重连失败
            fishServer.seatid = 0;     
            let roomInfo = self.getSuitFishRoom();
            if(!roomInfo){
                self._tipNoGold();
                return;
            }
            fishServer.quickJoin(roomInfo.roomID);
        }
    }

    private onRedcoinExchangeGoods(event: egret.Event): void {
        let data: any = event.data;
        //console.log('==================>>>>>>>> onRedcoinExchangeGoods');
        let self:FishScene = this;

        //兑换结果
        let error:string = '';
        switch(data.result) {
            case 0:
                if ([5,6,7,10,11,12].indexOf(fishServer.exchangeId) != -1) {
                    error = '恭喜你，兑换成功！兑换后的话费，请到公众号领取。';
                } else {
                    error = '恭喜你，兑换成功！';
                }
                //请求刷新金豆
                fishServer.refreshUserGoldInGame();
                break;
            case 1: error = '对不起，该商品不存在！'; break;
            case 2: error = '对不起，奖杯不足！'; break;
            case 3: error = '对不起，系统错误！'; break;
            case 4: error = '对不起，操作过于频繁！'; break;
        }
        fishServer.exchangeId = 0;
        FishAlert.instance.show(self.fish_group_top, error, 1);
    }

    private onDaySigninOpt(event: egret.Event): void {
        let data: any = event.data;
        //console.log('==================>>>>>>>> onDaySigninOpt');
        let self:FishScene = this;
        if (data.optype == 1) {
            //请求签到信息
            if (data.result != 0) {
                FishAlert.instance.show(self.fish_group_top, '请求签到信息失败！', 1);
            } else {
                self.signinData = data;
            }
        } else if (data.optype == 2) {
            //签到
            if (data.result != 0) {
                FishAlert.instance.show(self.fish_group_top, '签到失败！', 1);
            } else {
                var start = data.reward.indexOf(':');
                var end = data.reward.indexOf('|');
                var reward = data.reward.substring(start+1, end);
                FishAlert.instance.show(self.fish_group_top, '签到成功，获得' + reward + '奖励！', 1);
                self.signinData.today = 1;
                self.signinData.total_day ++;
                //请求刷新金豆
                fishServer.refreshUserGoldInGame();
            }
        }
    }

    private onRefreshUserGold(event: egret.Event): void {
        let data: any = event.data;
        //console.log('==================>>>>>>>> onRefreshUserGold');
        let self:FishScene = this;
        console.log(data);
        fishServer.selfData.gold = data.gold;
        let userinfo:FishUserInfo = self.getUserInfo(self.getMyViewID());
        if (userinfo) {
            userinfo.UpdateGold(data.gold);
        }
    }
};