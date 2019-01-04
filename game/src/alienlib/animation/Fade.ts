import IAnimation = alien.IAnimation;
/**
 * Created by rockyl on 16/3/29.
 */

module alien{
	export class Fade implements IAnimation{
		private _tween:egret.Tween;

		private _target:any;
		private _targetAlpha:number;
		private _duration:number;

		constructor(target:any){
			this._target = target;
		}

		fadeIn(duration:number = 200):void{
			this._duration = duration;
			this._targetAlpha = 1;
			this._target.alpha = 0;
			this._target.visible = true;
			this.play();
		}

		fadeOut(duration:number = 200):void{
			this._duration = duration;
			this._targetAlpha = 0;
			this._target.alpha = 1;
			this.play();
		}

		play():void {
			this._tween = egret.Tween.get(this._target).to({alpha: this._targetAlpha}, this._duration).set({visible: this._targetAlpha > 0});
		}

		stop():void {
			if(this._tween){
				egret.Tween.removeTweens(this._target);
			}
		}

	}
}
