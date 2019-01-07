/**
 * Created by rockyl on 16/5/16.
 *
 * 渐变切换
 */
module CCalien {
	export class FadeSwitch extends eui.Group {
		private parts:egret.DisplayObject[];
		private _index:number;
		private _old:egret.DisplayObject;

		createChildren():void {
			super.createChildren();

			this.parts = [];
			CCalien.CCDDZUtils.enumChildren(this, (child:egret.DisplayObject)=> {
				this.parts.push(child);
			});
			this.removeChildren();

			this.switchTo(0, 0);
		}

		switchTo(index:number, duration:number = 300, callback:Function = null):void {
			if (this._index != index) {
				this._index = index;
				if(this._old){
					this.removeChild(this._old);
					this._old = null;
				}
				let part:egret.DisplayObject = this.parts[index];
				let old:egret.DisplayObject = this._old = this.numChildren == 0 ? null : this.getChildAt(0);
				if (part) {
					part.alpha = 0;
					part.visible = true;
					this.addChild(part);
					egret.Tween.get(part, null, null, true).to({alpha: 1}, duration).call(()=> {
						if (callback) {
							callback();
						}
						//console.log('show', part.name);
					});
				}
				if (old) {
					egret.Tween.get(old, null, null, true).to({alpha: 0}, duration).call(()=> {
						this._old = null;
						old.alpha = 1;
						this.removeChild(old);
						//console.log('hide', old.name);
					});
				}
			}
		}
	}
}
