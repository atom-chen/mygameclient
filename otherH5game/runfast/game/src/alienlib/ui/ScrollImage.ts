/**
 * Created by rockyl on 16/3/30.
 *
 * 滚动图片
 */
module PDKalien{
	export class ScrollImage extends eui.Component implements PDKalien.ITicker{
		private _imgs:eui.Image[];
		private _widthMax:number;
		private _playing:boolean;

		public speedX:number = -0.5;
		public speedY:number = 0;

		constructor() {
			super();

			this.init();
		}

		private init():void {
			this._imgs = [];

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedToStage, this);
		}

		private onAddedToStage(event:egret.Event):void{
			if(this._playing){
				PDKalien.TickerManager.register(this);
			}
		}

		private onRemovedToStage(event:egret.Event):void{
			PDKalien.TickerManager.unregister(this);
		}

		protected createChildren():void {
			super.createChildren();

			this._imgs = [];
			this._widthMax = 0;
			PDKalien.PDKUtils.enumChildren(this, (img:eui.Image)=>{
				this._imgs.push(img);
				this._widthMax += img.width;
			});

			this.play();
		}

		play():void{
			this._playing = true;
			PDKalien.TickerManager.register(this);
		}

		stop():void{
			this._playing = false;
			PDKalien.TickerManager.unregister(this);
		}

		update():void {
			this._imgs.forEach((img:eui.Image)=>{
				img.x += this.speedX;
				img.y += this.speedY;

				if(this.speedX < 0 && img.x < -img.width){
					img.x = this._widthMax - img.width;
				}
			});
		}
	}
}
