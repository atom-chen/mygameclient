/**
 *
 * @author 
 *
 */
class CCPlayerUI extends eui.Component {
    public constructor() {
        super();

    }
    public labNickName: eui.Label;
    public playerHead: CCPlayerHead;
    public playerGold: CCGold;
    public playerCardView: CCCardView;

    private _globalPos: egret.Point;

    private _userInfoData: CCGlobalUserInfoData;

    update(data: CCGlobalUserInfoData): void {
        this.updateHeadImage(data.imageid);
        this.updateNickname(data);
        if (!isNaN(data.gold)) {
            this.updateGold(data.gold);
        }
    }

    /**
     * 更新昵称
     */
    updateNickname(data: any): void {
        let _selfData = CCDDZMainLogic.instance.selfData;
        if (data.uid == _selfData.uid) {
            if (_selfData.nickname) {
                let _nameStr = _selfData.nickname.substr(0, 10);
                this.labNickName.text = _nameStr + "(" + _selfData.fakeuid + ")";
            }
        } else {
            this.labNickName.text = data.nickname;
        }
    }

    /**
     * 更新玩家的图像id
     */
    updateHeadImage(imageid: string): void {
        if (imageid) {
            if (imageid != this.playerHead.imageId) {
                this.playerHead.imageId = imageid;
            }
        }
        if(imageid == "") {
            this.playerHead.imageId = "";
        }
    }

	/**
	 * 清理现场
	 */
    clean(): void {
        this.playerHead.clean();
        this.labNickName.text = '';
        this.playerGold.setEmpty();
    }


	/**
	 * 设置头像是否可以点击 zhu
	 */
    public setHeadTouch(bEnable: boolean): void {
        this.playerHead.setHeadTouch(bEnable);
        this.playerHead.setHeadTouchFunc(this._onTouchHead.bind(this))
    }

    /**
 * 点击玩家头像回调 zhu
 */
    private _onTouchHead(): void {
        if (!this._userInfoData) return;
        let _rate = (100 * this._userInfoData.getWinRate()).toFixed(0) + "%";
        let _redBeg = this._userInfoData.redcoingot;
        let _nick = this._userInfoData.nickname;
        let _gold = this._userInfoData.gold;
        let _head = this._userInfoData.imageid;
        let _game = this._userInfoData.totalwincnt + this._userInfoData.totallosecnt + this._userInfoData.totaldrawcnt;
        let _seatId = this._userInfoData.seatid;
        let _uid = this._userInfoData.uid;
        let _praise = this._userInfoData.praise;
        let data = { nick: _nick, gold: _gold, head: _head, winRate: _rate, game: _game, redBeg: _redBeg, seatId: _seatId, uid: _uid, praise: _praise };
        CCDDZPanelPlayerInfo.getInstance().show(data);
    }

    set userInfoData(userInfoData: CCGlobalUserInfoData) {
        this._setUserInfoData(userInfoData);
    }

    protected _setUserInfoData(userInfoData: CCGlobalUserInfoData) {
        this._userInfoData = userInfoData;

        if (!this._userInfoData) {
            this.playerHead.clean();
        }
    }

    get userInfoData(): CCGlobalUserInfoData {
        return this._userInfoData;
    }

    updateUserInfoData(data: any): void {
        this._userInfoData = data;
        this.update(data);
    }

	/**
	 * 获取头像的全局坐标
	 */
    getAvatarPos(): egret.Point {
        if (!this._globalPos) {
            this._globalPos = this.localToGlobal(this.playerHead.x + this.playerHead.width / 2 - 20, this.playerHead.y + this.playerHead.height / 2 - 20);
        }
        return this._globalPos;
    }

    updateGold(gold: number, bSet: boolean = true): void {
        if (bSet) {
            this.playerGold.updateGold(Number(gold));
        }
        else {
            let tmp = this.playerGold.getGold();
            console.log("updateGold------->", tmp, gold);
            if (!tmp) tmp = 0;
            tmp += Number(gold);
            this.playerGold.updateGold(Number(tmp));
        }
    }

    /**
     * 更新钻石(钻石栏和金豆栏用的是一个控件CCDDZGold)
     */
    updateDiamond(nDiamond: number): void {
        this.playerGold.updateGold(Number(nDiamond));
    }

    setReadyFlagVisible(v: boolean): void {
        this.playerHead.setReadyFlagVisible(v);
    }
}

window["CCPlayerUI"] = CCPlayerUI;