/**
 * Created by rockyl on 16/3/9.
 */


module PDKalien{
	export class Image extends eui.Image{
		createChildren():void{
			super.createChildren();
		}

		private _anchorX:number;
		public get anchorX():number{return this._anchorX};
		public set anchorX(value:number){
			if(this._anchorX != value){
				this._anchorX = value;
				this.anchorOffsetX = this.width * this._anchorX;
			}
		}

		private _anchorY:number;
		public get anchorY():number{return this._anchorY};
		public set anchorY(value:number){
			if(this._anchorY != value){
				this._anchorY = value;
				this.anchorOffsetY = this.height * this._anchorY;
			}
		}
		
		private _animation:string;
		public get animation():string{return this._animation};
		public set animation(value:string){
			if(this._animation != value){
				this._animation = value;
				if(this._animation){
					this.playAnimation(this._animation);
				}
			}
		}

		//{x:1,y:1,sx:1,sy:1,a:1};200;bounceOut|{x:1,y:1,sx:1,sy:1,a:1};200;bounceIn
		private playAnimation(script:string):void{
			if(script){
				let tween:egret.Tween = egret.Tween.get(this, null, null, true);
				let lines:string[] = script.split('|');
				lines.forEach((item:string, index:number)=>{
					let tweenProps:string[] = item.split(';');
					let p:string = tweenProps[0].replace('[', '{').replace(']', '}');
					let duration:number = parseFloat(tweenProps[1]) || 0;
					if(p.length > 2){
						let props:any = eval("(" + p + ")");
						let ease;
						if(tweenProps[2]){
							ease = egret.Ease[tweenProps[2]];
						}
						tween.to(props, duration, ease);
					}else{
						tween.wait(duration);
					}
				});
			}
		}
	}
}