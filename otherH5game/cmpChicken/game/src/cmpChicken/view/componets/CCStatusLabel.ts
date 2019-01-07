/**
 *
 * @author 
 *
 */
class CCStatusLabel extends eui.Component {
    private timeTxt: eui.Label;

    public constructor() {
        super();
    }

    public static GAME_START: number = 1;
    public static GAME_WATING: number = 2;

    private interval: any;
    private time: number;
    public setStatus(val: number, leftTime: number) {
        if (leftTime < 0)
            leftTime = 0;
        switch (val) {
            case CCStatusLabel.GAME_START:
                let _textFLow = <Array<egret.ITextElement>>[
                    { text: "即将开始游戏：" },
                    { text: leftTime, style: { "textColor": 0xF3F309, "stroke": 1, "strokeColor": 0xF3F309 } },
                    { text: " 秒" }
                ];
                this.timeTxt.textFlow = _textFLow;
                break;
            case CCStatusLabel.GAME_WATING:
                
                break;
        }
        this.time = leftTime;
        this.clearInterval();
        this.interval = egret.setInterval(() => {
            this.onInterval();
        }, this, 1000);
    }

    private clearInterval(): void {
        if (this.interval) {
            egret.clearInterval(this.interval);
        }
        this.interval = null;
    }

    private onInterval(): void {
        this.time--;
        if (this.time <= 0) {
            this.clearInterval();
        }//
        else {
            let _textFLow = <Array<egret.ITextElement>>[
                { text: "即将开始游戏：" },
                { text: this.time, style: { "textColor": 0xF3F309, "stroke": 1, "strokeColor": 0xF3F309 } },
                { text: " 秒" }
            ];
            this.timeTxt.textFlow = _textFLow;
        }
    }
}

window["CCStatusLabel"] = CCStatusLabel;