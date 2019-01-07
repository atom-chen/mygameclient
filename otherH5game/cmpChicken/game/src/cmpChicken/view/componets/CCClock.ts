class CCClock extends eui.Component {
    private timeNum: eui.BitmapLabel;

    private r: number = 42;
    private fullTime: number;
    private time: number;
    private timerCount: number;
    private timer: any;
    public constructor() {
        super();
    }

    public init(): void {

    }

    private timePer: number = 50;
    private timePerCount: number = 20;

    public set Num(value: number) {
        if (value < 0)
            value = 0;
        value = Math.floor(value);
        this.timerCount = 0;
        this.fullTime = value;
        this.time = value;
        this.timeNum.text = value.toString();

        if (!this.timer) {
            this.visible = true;
            this.timer = egret.setInterval(() => {
                this.onTimer();
            }, this, 1000);
        }
    }

    private onTimer(): void {
        this.time = this.time - 1;
        this.timeNum.text = "" + this.time;
        if (this.time <= 0) {
            this.onComplete();
            return;
        }
    }

    private onComplete(): void {
        this.stopTimer();
    }

    private clearTimer(): void {
        if (this.timer) {
            egret.clearInterval(this.timer);
        }
        this.timer = null;
    }

    public stopTimer(): void {
        this.visible = false;
        this.clearTimer();
    }
}

window["CCClock"] = CCClock;