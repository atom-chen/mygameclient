class CCGold extends eui.Component {
    public imgIcon: eui.Image;
    private labGold: eui.Label;
    public btnRecharge: eui.Button;
    public nGold: number;
    public bgImg: eui.Image;
    private _isMatch: boolean;

    createChildren(): void {
        super.createChildren();

        this.btnRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnRechargeTap, this);
    }

    private onBtnRechargeTap(event: egret.TouchEvent): void {
        let exchangeType = 0;
        if (this.currentState == "goldWithBuy") {//金豆
            exchangeType = 0;
        }
        else if (this.currentState == "diamondWithBuy") { //钻石
            exchangeType = 1;
        }
        else if (this.currentState == "redcoinWithBuy") { //奖杯
            exchangeType = 4;
        }

        this.showPanelExchange(exchangeType);
    }

    private showPanelExchange(exchangetype: number): void {
        console.log("showPanelExchange-------->", exchangetype);
        if (ccserver._isInDDZ) {
            this.openDDZShop(exchangetype);
        }
        else {
            CCDDZPanelExchange2.instance.show(exchangetype);
        }

    }

    private openDDZShop(type = 0) {
        ccserver.ddzDispatchEvent(1, '', { type: 2, shopFlag: type });
    }

    /**
     * 10万以内显示精确数字，100万以内显示xx.x万，大于等于100万显示x万
     */
    private _formatGold(nGold: number): string {
        this.nGold = nGold;
        let _str = "" + nGold;
        if (nGold >= 1000000) {
            _str = _str.substring(0, _str.length - 4) + "万";
        }
        else if (nGold > 100000) {
            _str = _str.substr(0, 2) + "." + _str.substr(2, 1) + "万";
        }
        return _str;
    }

    updateGold(gold: number): void {
        console.log("updateGold--------->", gold);
        if (this.labGold) {
            if (!gold || gold < 0) gold = 0;
            this.labGold.text = this._formatGold(Number(gold));
            this.commitProperties();
        }
    }

    getGold(): number {
        return this.nGold;
    }

    setEmpty(): void {
        this.labGold.text = '';
    }

    //显示金币
    showGold(): void {
        this.imgIcon.source = "cc_play_icon_gold";
    }

    //显示钻石
    showDiamond(): void {
        this.imgIcon.source = "cc_play_icon_diamond";
    }
}
window["CCGold"] = CCGold;