/**
 * Created by rockyl on 16/3/30.
 * 进度条
 */

class PDKQProgressBar extends eui.Component {
	private _maximum:number = 100;
	private _minimum:number = 0;
	private _value:number = 0;

	private _maxWidth:number;

	private imgThumbMask:eui.Image;
	private grpThumb:eui.Group;
	private labelDisplay:eui.Label;
	private imgRepeat:PDKalien.ScrollImage;

	createChildren():void {
		super.createChildren();

		this.grpThumb.mask = this.imgThumbMask;
		//this.mask = this.imgMask;
		this._maxWidth = this.grpThumb.width;
	}

	startAnimation():void{
		this.imgRepeat.play();
	}

	stopAnimation():void{
		this.imgRepeat.stop();
	}

	get value():number{return this._value}
	set value(v:number){
		this._value = Math.max(Math.min(v, this.maximum), 0);
		this.updateValue();
	}

	get maximum():number {
		return this._maximum;
	}

	set maximum(value:number) {
		this._maximum = value;
		this.updateValue();
	}

	get minimum():number {
		return this._minimum;
	}

	set minimum(value:number) {
		this._minimum = value;
		this.updateValue();
	}

	protected updateValue():void{
		this.labelDisplay.text = this._value + '/' + this._maximum;
		let w:number = this._maxWidth * (this._value / this._maximum);
		egret.Tween.get(this.grpThumb, null, null, true).to({width: w}, 100);
		egret.Tween.get(this.imgThumbMask, null, null, true).to({width: w}, 100);
	}
}