/**
 * Created by rockyl on 15/12/1.
 *
 * cd时钟
 */

class PDKCDClock extends eui.Component {
	private labNum: eui.BitmapLabel;

	private _timer: number;
	private _second: number;
	private _oncomplete: Function;
	private _endTime: number;

	constructor() {
		super();

		this.init();
	}

	protected init(): void {

	}

	start(second: number, onComplete: Function = null, bshow = true): void {
		this.labNum.text = second.toString();

		this._endTime = pdkServer.tsServer + second;
		this._second = second;
		this._oncomplete = onComplete;
		// this._timer = PDKCountDownService.register(second, this.renderTime.bind(this), onComplete);
		this._timer = egret.setInterval((this.renderTime.bind(this)), this, 1000);
		this.visible = bshow;
	}

	stop(hidden: boolean = false): void {
		this.labNum.text = '';
		// PDKCountDownService.unregister(this._timer);
		if (this._timer) {
			egret.clearInterval(this._timer);
			this._timer = 0;
		}
		if (this._oncomplete) {
			this._oncomplete();
		}
		if (hidden) {
			this.visible = false;
		}
	}

	private renderTime(): void {
		// console.log("renderTime----------->", this._second);
		this._second--;
		if (this._second < 0) {
			this._second = 0;
			this.stop();
		}
		let time = this._second;
		this.labNum.text = time.toString();
	}
}