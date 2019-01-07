/**
 *
 * @author 
 *
 */
class PDKMarqueeText extends eui.Component {
    public constructor() {
        super();
    }

    // public announceplayed:number; // 0未播放 1 播放中 2 播放完毕
    private callback: any;
    public announceonly: boolean = false;
    private bg_img: eui.Image;
    protected createChildren(): void {
        super.createChildren();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removeFromStage, this);
        //        Dispatcher.addListener(EventNames.CLEAR_LABA,this.clear,this);
        this.skinName = components.PDKMarqueeSkin;
        //        this.txt.mask = this.maskR;
        this.m_width = this.maskR.width;
        this.step = 3;
        // this.announceplayed = 0;
        this.bg_img["addClickListener"](this._onClickOpenHornTalk, this, false);
    }

    private clear(): void {
        this.stop();
    }

    protected addToStage(e: egret.Event): void {
        this.x = PDKalien.StageProxy.stage.stageWidth - this.width >> 1;
        this.y = 114;
        PDKalien.StageProxy.stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
        this.bg_img["addClickListener"](this._onClickOpenHornTalk, this, false);
    }

    protected removeFromStage(e: egret.Event): void {
        PDKalien.StageProxy.stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
        this.clear();
    }

    protected onResize(e: egret.Event): void {
        this.x = PDKalien.StageProxy.stage.stageWidth - this.width >> 1;
    }

    private txt: eui.Label;
    private maskR: eui.Scroller;
    private step: number;
    private m_width: number;
    private index: number;
    private isMouseOver: boolean;
    private imgRedCoin: eui.Image;
    /**
     * 喇叭图标
     */
    private imgTrumpet: eui.Image;
    /**
     * 发送喇叭消息按钮
     */
    private openHorn_img: eui.Image;
    /**
     * 是否在大厅
     */
    private _bInLobby: boolean = false;
    /**
     * 是否正在滚动展示中
     */
    private _bScrolling: boolean = false;

    // private adjustPos():void{
    //     if(this.parent){
    //         this.y = 0;
    //         this.x = (this.parent.width - this.width) / 2;
    //     }
    // }

    public show(announceonly: boolean = null): void {
        //zhu
        if (this._bScrolling) return;

        this.announceonly = announceonly;
        this.txt.text = "";
        this.txt.x = this.maskR.x;
        this.checkNext();

        //        this.addEventListener(egret.TouchEvent.TOUCH_ROLL_OVER,this.onMouseOver,this);
        //        this.addEventListener(egret.TouchEvent.TOUCH_ROLL_OUT,this.onMouseOut,this);

    }

    private onMouseOver(e: egret.TouchEvent): void {
        this.isMouseOver = true;
    }

    private onMouseOut(e: egret.TouchEvent): void {
        this.isMouseOver = false;
    }

    private deleteAnnounce(): void {
        PDKMsgInfoService.instance.deleteAnnounce();
        this._bScrolling = false;
        this.announceonly = false;
        /*if(this._bInLobby) return; //大厅不隐藏
        this.visible = false;*/
    }

    /**
     * 从喇叭记录中拿一条数据显示
     */
    private _showOneMsgByHornRec(data: any): void {
        let _one = data;
        let name = _one.name.substr(0, 9);
        let _ret = { type: 4, text: "", time: 3000 };
        _ret.text = "<font color='#ffffff'>【" + name + "】:</font>" + " <font color='#F0FF00'>" + _one.msg + "</font>";
        this.showOne(_ret, false);
    }

    /**
     * 从游戏中抽到的奖券记录中取第一条显示
     */
    private _showOneMsgByChouRec(data: any): void {
        if (!data.hasOwnProperty('nickname')) {
            data.nickname = '';
        }

        let _ret = { type: 3, text: "", time: 4000 };
        let name = "金豆场";
        if (data.room_id) {
            name = PDKlang.exchange_roomid[data.room_id];
        }
        if (!name) {
            name = "金豆场";
        }
        _ret.text = "恭喜<font color='#F0FF00'>" + data.nickname.substr(0, 9) + "</font>在" + name + "抽得<font color='#F0FF00'>" + PDKUtils.exchangeRatio(data.money, true) + "</font>" + " 奖杯";

        this.showOne(_ret, false);
    }

    /**
     * 显示最后一条
     * type:1 喇叭消息 2:游戏中抽奖券的消息
     */
    public showLast(type: number = 1): void {
        console.log("showLast------------->", type);
        this.txt.text = "";
        this.txt.x = this.maskR.x;
        this.announceonly = false;
        egret.Tween.removeTweens(this.txt);
        let _exIns = PDKMsgInfoService.instance;
        if (_exIns.announce && _exIns.announce.length > 0) {
            this.announceonly = true;
            let _info = this.getNextText();
            this.showOne(_info);
        }
        else if (type == 1) {
            let _data = PDKMainLogic.instance.selfData.getHornTalkRecList(); //用户喇叭消息
            if (_data.length > 0) {
                let _one = _data[_data.length - 1];
                this._showOneMsgByHornRec(_one);
            }
        }
        else if (type == 2) {
            let _data = PDKMsgInfoService.instance.getOneChouMaxInfo();
            console.log("showLast2----------", _data);
            if (_data) {
                this._showOneMsgByChouRec(_data);
            }
        }
    }

    /**
     * obj{type:xx,text:xxx}
     */
    private showOne(_obj: any, bCheckNext: boolean = true, callback: Function = null): void {
        this.visible = true;
        this.txt.text = "";
        this.txt.textColor = 0xFFFFFF;
        this.txt.textFlow = (new egret.HtmlTextParser).parser(_obj.text);
        this.txt.x = this.m_width;
        var endX: number = - this.txt.width;
        var time: number = Math.floor((this.txt.x - endX) / this.step) * 50;
        this.txt.alpha = 1;
        this.txt.cacheAsBitmap = false;
        this.txt.validateNow();
        if (this.announceonly) {
            this._bScrolling = true;
            this.txt.cacheAsBitmap = true;
            egret.Tween.get(this.txt).to({ x: endX }, time).call(this.deleteAnnounce.bind(this));
        } else {
            this._bScrolling = true;
            if (_obj.type == 1) {//公告
                this.txt.cacheAsBitmap = true;
                egret.Tween.get(this.txt).to({ x: endX }, time).call(this.checkNext.bind(this, true));
            } else {
                this.txt.x = (this.m_width - this.txt.measuredWidth) * 0.5;
                this.txt.visible = false;
                this.txt.alpha = 0;
                egret.Tween.get(this.txt).set({ visible: true }).to({ alpha: 1 }, 200).wait(_obj.time).to({ alpha: 0 }, 1000).wait(1000).call(() => {
                    if (bCheckNext) {
                        this.checkNext(true);
                    }
                    if (callback) {
                        callback();
                    }
                });
            }
        }
    }

    private checkNext(delAnnounce: boolean = false): void {
        if (delAnnounce) {
            PDKMsgInfoService.instance.deleteAnnounce();
        }
        this.announceonly = false;
        var _obj: any = this.getNextText();
        if (_obj.text == "") {
            this.stop();
        }
        else {
            this.showOne(_obj);
        }
    }

    /**
     * return Object{type:xx,text:xx}
     * type 1:系统公告 2:游戏奖励 3:抽红包 4:玩家喇叭 5:夺宝中奖
     */
    private getNextText(): any {
        let _exIns = PDKMsgInfoService.instance;
        let _selfData = PDKMainLogic.instance.selfData;
        let _ret = { type: 1, text: "", time: 3000 };
        //比赛前的提示
        let _matchInfo = null;//MatchService.instance.getOneMatchMarquee();
        if (_exIns.announce && _exIns.announce.length > 0) {
            this.imgRedCoin.visible = false;
            this.imgTrumpet.visible = true;
            this.txt.textColor = 0xF4DD10;
            let text = _exIns.announce;
            _ret.type = 1;
            _ret.text = "<font color='#FFEA00'>【 系统 】</font>" + "<font color='#FFEA00'>" + text + "</font>";
        } else if (_matchInfo) {
            _ret.type = 1;
            _ret.text = _matchInfo;
        } else if (_exIns._showInfoQueen && _exIns._showInfoQueen.length) {
            this.imgRedCoin.visible = true;
            this.imgTrumpet.visible = false;
            var data = _exIns.getOneChouInfoFromFront(true);
            _ret.type = 3;
            _ret.time = 4000;
            if (data) {
                if (!data.hasOwnProperty('nickname')) {
                    data.nickname = '';
                }
                let str: string = "";
                let name = "金豆场";
                if (data.room_id) {
                    name = PDKlang.exchange_roomid[data.room_id];
                }

                if (!name) {
                    name = "金豆场";
                }

                str += "恭喜<font color='#F0FF00'>" + data.nickname.substr(0, 9) + "</font>在" + name + "抽得<font color='#F0FF00'>" + PDKUtils.exchangeRatio(data.money, true) + "</font>" + "奖杯";
                _ret.text = str;
            } else {
                _ret.text = "";
            }
        }
        else if (_exIns.lottery && _exIns.lottery.nickname && _exIns.lottery.c_rewarddes) {
            _ret.type = 5;
            _ret.text = "恭喜<font color='#F0FF00'>" + _exIns.lottery.nickname.substr(0, 9) + "</font>" + "夺宝获得<font color='#F0FF00'>" + _exIns.lottery.c_rewarddes + "</font>";
            _exIns.delLottery();
        }
        else if (_selfData.getHornTalkShowLen() > 0) {
            let _obj = _selfData.getFrontHornTalkShow();
            if (!_obj || !_obj.name || !_obj.msg) return "";
            _ret.type = 4;
            _ret.text = "<font color='#FFFFFF'>【" + _obj.name.substr(0, 9) + "】:</font>  " + "<font color='#F0FF00'>" + _obj.msg + "</font>";
        }//大厅里面的滚动文字不显示游戏奖励和抽红包
        else if (_exIns.matchChampionMsg && _exIns.matchChampionMsg.length) {
            this.imgRedCoin.visible = true;
            this.imgTrumpet.visible = false;
            var data = _exIns.matchChampionMsg.shift();
            _ret.type = 2;
            _ret.time = 6000;
            if (data) {
                let info = data.content.split("|")
                if (info.length == 4) {
                    _ret.text = "恭喜<font color='#F0FF00'>" + info[0].substr(0, 6) + "</font>夺得<font color='#F0FF00'>" + info[1] + "</font>第" + info[2] + "名,获得:<font color='#F0FF00'>" + info[3] + "</font>";
                } else if (info.length == 3) {
                    _ret.text = "<font color='#F0FF00'>" + info[0] + "</font>" + info[1] + "<font color='#F0FF00'>" + info[2] + "</font>";
                } else {
                    _ret.text = data.content;
                }
            } else {
                _ret.text = "";
            }
        }

        return _ret;
    }

    public stop(): void {
        this._bScrolling = false;
        egret.Tween.removeTweens(this.txt);
        /*
        if(this._bInLobby) return; //大厅不隐藏
        this.visible = false;
        */
    }
    /**
     * 大厅
     */
    public setInLobby(bIn: boolean): void {
        this._bInLobby = bIn;
    }
    /**
     * 使能发送喇叭点击，是否可以点击后弹出发送喇叭消息面板
     */
    public enableSendHorn(bEnable: boolean): void {
        bEnable = false;
        this.bg_img.touchEnabled = bEnable;
        this.openHorn_img.visible = bEnable;
    }

    /**
     * 打开喇叭输入面板
     */
    public _onClickOpenHornTalk(): void {
        PDKPanelHornTalk.getInstance().show();
    }

    /**
     * 邀请排行榜列表的吓一条记录
     */
    private _getRankNext(): void {
        let _infos = this["inviteRankList"] || [];
        let _one = _infos.shift();
        if (_one) {
            let _ret = { type: 4, text: "", time: 3000 }; //PDKUtils.exchangeRatio(_one.coin / 100,true) 
            _ret.text = "<font color='#F0FF00'>" + _one.nickname + " </font>" + "通过邀请已累计获得<font color='#F0FF00'>" + _one.coin + "</font>钻石";
            this.showOne(_ret, false, this._getRankNext.bind(this));
        } else {
            this.stop();
        }
    }
    /**
     * 给定的邀请排行榜列表
     */
    public showByInviteRankList(inviteList: any): void {
        this["inviteRankList"] = inviteList;
        if (!this._bScrolling) {
            this._getRankNext();
        }
    }
}

window["PDKMarqueeText"] = PDKMarqueeText;