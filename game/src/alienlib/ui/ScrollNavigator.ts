/**
 * Created by rockyl on 16/8/3.
 *
 * 可滑动的导航
 */

module alien{
	export class ScrollNavigator extends eui.Group {
		private _touchBeginPoint:any;
		private _touchMoved:boolean;
		private _contentPoint:any = {};
		private _dragOffset:any = {};
		private _selectedIndex:number = -1;
		private _totalPage:number = 0;
		private _points:any[] = [];

		private _touchCancel:boolean;
		private _touchedTarget:egret.DisplayObject;

		private _dragThreshold = 10;

		public get dragThreshold(): number {
			return this._dragThreshold;
		}

		public set dragThreshold(value: number) {
			this._dragThreshold = value;
		}

		createChildren(): void {
			super.createChildren();

			egret.callLater(this.setup, this);
		}

		private setup():void{
			this.scrollEnabled = true;

			alien.Utils.enumChildren(this, (child:egret.DisplayObject, index:number)=>{
				child.x = index * this.width;
				child.y = 0;
			});

			this._totalPage = this.numChildren;
			//this.showPage(0, false, false);

			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this, true);
			alien.StageProxy.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this, true);
			alien.StageProxy.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
			this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this, true);
		}

		private onTouchBegin(event:egret.TouchEvent):void{
			this._touchBeginPoint = {x: event.stageX, y: event.stageY};
			this._contentPoint.x = this.scrollH;
			this._contentPoint.y = this.scrollV;
			this._touchedTarget = event.target;

			this._touchCancel = false;
			this._points.splice(0);

			egret.Tween.removeTweens(this);

			this._touchMoved = false;
		}

		/**
		 * @private
		 * @param event
		 */
		private dispatchCancelEvent(event:egret.TouchEvent) {
			let cancelEvent = new egret.TouchEvent(egret.TouchEvent.TOUCH_CANCEL, event.bubbles, event.cancelable);
			let target:egret.DisplayObject = this._touchedTarget;
			target.dispatchEvent(cancelEvent);
			let list = this.$getPropagationList(target);
			let length = list.length;
			let targetIndex = list.length * 0.5;
			let startIndex = -1;

			for (let i = 0; i < length; i++) {
				if (list[i] === this) {
					startIndex = i;
					break;
				}
			}
			list.splice(0, startIndex + 1);
			targetIndex -= startIndex + 1;
			this.$dispatchPropagationEvent(cancelEvent, list, targetIndex);
			egret.Event.release(cancelEvent);
		}

		private onTouchMove(event:egret.TouchEvent):void{
			/*if (event.isDefaultPrevented()) {
			 return;
			 }*/

			if(this._touchBeginPoint){
				let offsetX = event.stageX - this._touchBeginPoint.x;
				if(Math.abs(offsetX) > this._dragThreshold){
					this.dispatchCancelEvent(event);

					this._dragOffset.x = offsetX;

					this._points.push({t:new Date().valueOf(), x:event.stageX, y: event.stageY});

					this.scrollH = this._contentPoint.x - this._dragOffset.x;

					this._touchCancel = true;

					this._touchMoved = true;
				}
			}

			//event.preventDefault();

			//console.log('move', event.stageX, new Date().valueOf());
		}

		private onTouchEnd(event:egret.TouchEvent):void{
			if(this._touchBeginPoint){
				let page = -1;
				let l = this._points.length;
				if(Math.abs(this._dragOffset.x) > this.width / 3){
					page = this.switchPage(alien.MathUtils.sign(-this._dragOffset.x));
				}else if(l > 0){
					let p = this._points[l == 1 ? 1 : l - 2];
					if(p){
						let sx:number = (p.x - event.stageX) / (new Date().valueOf() - p.t);
						//console.log(sx);
						if(Math.abs(sx) > 1){
							page = this.switchPage(alien.MathUtils.sign(sx));
						}
					}
				}

				if(this._touchMoved){
					this.showPage(page < 0 ? this._selectedIndex : page);
				}
			}

			this._touchBeginPoint = null;
			this._dragOffset = {};
			//console.log('end ', event.stageX, new Date().valueOf());
		}

		private switchPage(dir:number):number{
			let page:number = this._selectedIndex + dir;

			if(page < 0){
				page = 0;
			}else if(page > this._totalPage - 1){
				page = this._totalPage - 1;
			}

			return page;
		}

		private onTouchTap(event:egret.TouchEvent):void{
			if(this._touchCancel){
				event.stopPropagation();
			}
		}

		private removeListeners():void{

		}

		showPage(page:number, animation:boolean = true, dispatch:boolean = true):void{
			egret.callLater(()=>{
				this._callPageOut();

				let samePage = false;//this._selectedIndex == page;
				this._selectedIndex = page;

				let x:number = page * this.width;

				if(animation){
					egret.Tween.removeTweens(this);
					egret.Tween.get(this).to({scrollH: x}, Math.abs(this.scrollH - x), egret.Ease.quartOut).call(()=>{
						if(!samePage){
							this._callPageIn(page);
						}
					});
				}else{
					this.scrollH = x;
					if(!samePage){
						this._callPageIn(page);
					}
				}

				if(dispatch && !samePage){
					this.dispatchEventWith(egret.Event.CHANGE, false, {page});
				}
			}, this);
		}

		private _callPageOut():void{
			if(this._selectedIndex >= 0){
				let child:egret.DisplayObject = this.getChildAt(this._selectedIndex);
				if(child['sleep']){
					child['sleep']();
				}
			}
		}

		private _callPageIn(page:number):void{
			let child:egret.DisplayObject = this.getChildAt(page);
			if(child['activate']){
				child['activate']();
			}
		}

		toForward():number{
			let page:number = this._selectedIndex - 1;
			if(page > -1){
				this.showPage(page);
			}

			return this._selectedIndex;
		}

		toNext():number{
			let page:number = this._selectedIndex + 1;
			if(page < this._totalPage){
				this.showPage(page);
			}

			return this._selectedIndex;
		}

		hasForward():boolean{
			return this._selectedIndex > 0;
		}

		hasNext():boolean{
			return this._selectedIndex < this._totalPage - 1;
		}

		get totalPage():number{return this._totalPage}
		get selectedIndex():number{return this._selectedIndex}
		get selectedChild():egret.DisplayObject{
			if(this._selectedIndex >= 0){
				return this.getChildAt(this._selectedIndex);
			}

			return null;
		}
	}
}
