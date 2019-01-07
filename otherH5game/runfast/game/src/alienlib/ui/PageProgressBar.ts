/**
 * Created by rockyl on 16/4/25.
 */

module PDKalien{
	export class PageProgressBar extends eui.Component {
		public btnReduce: eui.Button;
		public btnIncrease: eui.Button;
		public grpPoints: eui.Group;

		protected pointRes:string;

		private _index:number;
		protected _total:number;

		createChildren():void {
			super.createChildren();

			this._index = -1;

			let imgPoint:eui.Image = <eui.Image>this.grpPoints.removeChildAt(0);
			this.pointRes = <string>imgPoint.source;

			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

			this.renderPoints();
			this.index = 0;
		}

		private onTap(event:egret.TouchEvent):void{
			switch (event.target.name){
				case 'reduce':
					this._setIndex(this._index - 1);
					break;
				case 'increase':
					this._setIndex(this._index + 1);
					break;
			}
		}

		private renderPoints():void{
			this.grpPoints.removeChildren();
			for(let i = 0; i < this.total; i ++){
				let img = new eui.Image(this.pointRes);
				img.scaleX = img.scaleY = img.alpha = 0.7;
				this.grpPoints.addChild(img);
			}
		}

		public get total():number{return this._total;}
		public set total(value:number){
			this._total = value;
		}

		get index():number {return this._index;}
		set index(value:number) {
			this._setIndex(value, false);
		}

		protected _setIndex(value:number, dispatch:boolean = true){
			let i:number = value;
			if(i < 0){
				i = this._total - 1;
			}else if(i > this._total - 1){
				i = 0
			}

			this.updateIndex(this._index, this._index = i, dispatch);
		}

		protected updateIndex(oldValue:number, newValue:number, dispatch:boolean = true):void{
			if(oldValue >= 0){
				let imgOld:eui.Image = <eui.Image>this.grpPoints.getChildAt(oldValue);
				egret.Tween.get(imgOld, null, null, true).to({scaleX: 0.7, scaleY: 0.7, alpha: 0.7}, 200);
			}

			let imgNew:eui.Image = <eui.Image>this.grpPoints.getChildAt(newValue);
			egret.Tween.get(imgNew, null, null, true).to({scaleX: 1, scaleY: 1, alpha: 1}, 200);

			if(dispatch){
				this.dispatchEventWith(egret.Event.CHANGE);
			}
		}
	}
}
