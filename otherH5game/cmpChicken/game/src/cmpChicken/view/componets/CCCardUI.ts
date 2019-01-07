/**
 *
 * @author 
 *
 */
class CCCardUI extends eui.Component {
    private num1: eui.Image;
    private num2: eui.Image;
    private flower1: eui.Image;
    private flower2: eui.Image;
    private back: eui.Image;
    private giveup: eui.Image;

    private selected: Boolean;
    private _isGiveUp: boolean;

    public constructor() {
        super()
    }

    public set Selected(value: Boolean) {
        this.selected = value;
        if (this.selected)
            this.Run(this.x, - 20, -1, -1, 0.1);
        else
            this.Run(this.x, 0, -1, -1, 0.1);
    }

    public get Selected(): Boolean {
        return this.selected;
    }

    private endX: number;
    private sendCardTime: number = 0.4;
    public sendCard(t: number): void {
        var self: CCCardUI = this;
        var fun: Function = function (): void {
            self.visible = true;
            self.StopRun();

            self.endX = self.x;
            self.alpha = 1;
            var p: egret.Point;
            p = self.parent.globalToLocal(CCalien.CCDDZStageProxy.stage.stageWidth - self.width * self.scaleX >> 1, CCalien.CCDDZStageProxy.stage.stageHeight - self.height * self.scaleY >> 1);
            self.x = p.x;
            self.y = p.y;
            //        this.width = cardWidth / 2;
            //        this.height = cardHeight / 2;

            self.Run(self.endX, 0, -1, -1, self.sendCardTime, self.runCompleteHandler);
        }
        setTimeout(fun, t);
    }

    protected running: Boolean = false;
    public Run(x: number, y: number, w: number = -1, h: number = -1, time: number = 0.7, onComplete: Function = null, alpha: number = 1, onCompleteParams: Array<any> = null): void {
        if (w < 0) {
            w = this.width;
        }
        if (h < 0) {
            h = this.height;
        }
        if (this.running) {
            egret.Tween.removeTweens(this);
        }
        this.running = true;
        //        if(!onComplete)
        //            onComplete = this.runCompleteHandler;
        if (onComplete)
            egret.Tween.get(this, null, null, null).to({ x: x, y: y, width: w, height: h, onComplete: onComplete, alpha: alpha }, time * 1000, null).call(onComplete, this, [onCompleteParams]);
        else
            egret.Tween.get(this, null, null, null).to({ x: x, y: y, width: w, height: h, onComplete: onComplete, alpha: alpha }, time * 1000, null);
    }

    public StopRun(): void {
        if (this.running) {
            egret.Tween.removeTweens(this);
        }
        this.running = false;
    }

    private runCompleteHandler(): void {
        if (this.running) {
            this.StopRun();
            this.running = false;
            this.dispatchEvent(new egret.Event("complete"));
        }
    }

    private cardValue: number;
    public set CardValue(val: number) {
        if (val < 10)
            this.cardValue = val;
        else if (val >= 10 && val <= 13)
            this.cardValue = 10;
    }

    public get CardValue(): number {
        return this.cardValue;
    }

    private id: number;
    public set CCDDZCard(value: number) {
        this.giveup.visible = false;
        this._isGiveUp = false;
        if (value) {
            let poker: any = CCDDZUtils.pidCCpoker(value);
            this.id = value;
            var flower: number = value % 10;
            var num: number = poker.num;
            this.CardValue = num;
            value = num;
            if (value > 13) {
                this.flower1.source = CCGlobal.createTextureByName('cc_poker_' + poker.signColor + '_joker');
                this.flower2.source = ""
                this.num1.source = CCGlobal.createTextureByName('cc_poker_' + poker.signColor + '_joker_ddz_icon');
                this.num2.source = ""
            }
            else {
                this.flower1.source = CCGlobal.createTextureByName("cc_poker_sign_" + flower);
                this.flower2.source = CCGlobal.createTextureByName("cc_poker_sign_" + flower);
                var str: string = "cc_poker_";
                if (flower == 1 || flower == 3)
                    str += "black_";
                else
                    str += "red_";
                switch (num) {
                    case 11:
                        str += "j";
                        break;

                    case 12:
                        str += "q";
                        break;

                    case 13:
                        str += "k";
                        break;

                    case 1:
                        str += "a";
                        break;
                    default:
                        str += num;
                }
                this.num1.source = CCGlobal.createTextureByName(str);
                this.num2.source = CCGlobal.createTextureByName(str);
            }
            this.back.visible = false;
        }
        else {
            this.back.visible = true;
        }
    }

    public get CCDDZCard(): number {
        return this.id;
    }

    public set CardId(value: number) {
        this.id = value;
        var num: number = Math.floor(value / 10);
        this.CardValue = num;
    }

    private index: number;
    public set Index(val: number) {
        this.index = val;
    }

    public get Index(): number {
        return this.index;
    }

    /**
	 * 设置是否放弃
	 * @param visible
	 */
    showMasterFlag(bshow: boolean): void {
        this._isGiveUp = bshow;
        if (this.giveup) {
            this.giveup.visible = bshow;
        }
    }

    private comboComplete(): void {
        this.dispatchEvent(new egret.Event(CCEventNames.COMBO_COMPLETE));
    }
}

window["CCCardUI"] = CCCardUI;