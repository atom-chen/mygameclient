/**
 * Created by rockyl on 15/12/1.
 *
 * cd时钟
 */

class CCDDZCDClock extends eui.Component {
	private labNum:eui.BitmapLabel;

	private _timer:number;
	private _endTime:number;

	constructor() {
		super();

		this.init();
	}

	protected init():void {

	}

	start(second:number, onComplete:Function = null):void{
		this.labNum.text = second.toString();

		this._endTime = ccserver.tsServer + second;
		this._timer = CCDDZCountDownService.register(second, this.renderTime.bind(this), onComplete);

		this.visible = true;
	}

	stop(hidden:boolean = false):void{
		this.labNum.text = '';
		CCDDZCountDownService.unregister(this._timer);

		if(hidden){
			this.visible = false;
		}
	}

	private renderTime(time:number):void{
		//console.log(time);
		this.labNum.text = time.toString();
	}
}
window["CCDDZCDClock"]=CCDDZCDClock;