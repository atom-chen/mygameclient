/**
 * Created by rockyl on 15/12/1.
 *
 * cd时钟
 */

class CDClock extends eui.Component {
	private labNum:eui.BitmapLabel;

	private _timer:number;
	private _endTime:number;

	constructor() {
		super();

		this.init();
	}

	protected init():void {

	}

	start(second:number, onComplete:Function = null, bShow = true):void{
		this.labNum.text = second.toString();

		this._endTime = server.tsServer + second;
		this._timer = CountDownService.register(second, this.renderTime.bind(this), onComplete);

		this.visible = bShow;
	}

	stop(hidden:boolean = false):void{
		this.labNum.text = '';
		CountDownService.unregister(this._timer);

		if(hidden){
			this.visible = false;
		}
	}

	private renderTime(time:number):void{
		//console.log(time);
		this.labNum.text = time.toString();
	}
}
window["CDClock"]=CDClock;