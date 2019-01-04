/**
 * Created by rockyl on 16/1/14.
 *
 * CD进度条
 */

class CDProgressBar extends eui.Component {
	private thumb:eui.Image;
	private labelDisplay:eui.Label;
	private _mask:egret.Shape;

	private _value:number;
	private _tween:egret.Tween;
	private _offset:number = -Math.PI / 2;
	private _radius:number;
	private _center:any;

	private _timer:number;

	createChildren():void {
		super.createChildren();

		this.addChild(this._mask = new egret.Shape());
		this.thumb.mask = this._mask;

		let x = this.thumb.width;
		let y = this.thumb.height;
		this._radius = Math.sqrt(x * x + y * y) / 2;
		this._center = {x: this.thumb.width / 2, y: this.thumb.height / 2};
	}

	public get value():number{return this._value}
	public set value(v:number){
		if(this._value != v){
			this._setValue(this._value = v);
		}
	}

	private _setValue(v:number){
		let g:egret.Graphics = this._mask.graphics;

		let beginR:number = v;

		let r = this._radius;
		let bx:number = this._center.x;
		let by:number = this._center.y;

		g.clear();
		g.beginFill(0xFF0000);
		g.moveTo(bx, by);
		g.drawArc(bx, by, r, beginR, Math.PI * 2 + this._offset);
		g.lineTo(bx, by);
		g.endFill();
	}

	private onSecond(time:number):void{
		if(this.labelDisplay){
			this.labelDisplay.text = time.toString();
		}
	}

	play(duration:number, delay:number = 0){
		this.value = this._offset;
		this._tween = egret.Tween.get(this).wait(delay).to({value: Math.PI * 2 + this._offset}, duration * 1000);

		if(this._timer > 0){
			egret.clearInterval(this._timer);
		}
		this._timer = CountDownService.register(duration, this.onSecond.bind(this));

		this.visible = true;
	}

	stop():void{
		if(this._tween){
			this._tween.setPaused(true);
		}
		if(this._timer > 0){
			egret.clearInterval(this._timer);
		}

		this.visible = false;
	}
}
window["CDProgressBar"]=CDProgressBar;