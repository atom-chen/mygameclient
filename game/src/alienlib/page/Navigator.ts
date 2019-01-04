/**
 * Created by rockyl on 16/3/28.
 *
 * 栈式导航
 */

module alien{
	export class Navigator extends eui.Group{
		public static NAVIGATE:string = 'navigate';
		public static duration:number = 500;

		private _pageStack:NavigationPage[];
		private _tween:egret.Tween;
		private _currentPage:NavigationPage;
		private _needActive:boolean = true;

		private _pageCache:any;

		constructor(){
			super();

			this.init();
		}

		protected init():void{
			this._pageStack = [];
			this._pageCache = {};
		}

		push(pageDef:any, animate:boolean = true, params:any = null, dispatch:boolean = true):void{
			if(!pageDef){
				return;
			}

			if(this.playing){
				return;
			}

			let pageDefName:string = pageDef.defName;
			let page:NavigationPage = this._pageCache[pageDefName];
			//console.log(pageDefName);
			//console.log('page:' + page);
			if(!page){
				this._pageCache[pageDefName] = page = new pageDef();
				page.navigation = this;
			}
			this._currentPage = page;

			let action:string = 'push';

			this.addChild(page);
			if(this._pageStack.length > 0){
				page.beforeShow(action, params);
			}
			if(dispatch){
				this.dispatchEventWith(Navigator.NAVIGATE, false, {action, page});
			}

			if(this._pageStack.length > 0){
				let sw:number = alien.StageProxy.width;

				let lastPage:NavigationPage = this._pageStack[this._pageStack.length - 1];
				this._pageStack.push(page);

				let onLastPageHide = ()=>{
					lastPage.onHide(action, params);
					this.removeChild(lastPage);
				}

				let onPageShow = ()=>{
					lastPage.onShow(action, params);
					this._tween = null;
				}

				page.x = sw;
				lastPage.beforeHide(action, params);
				if(animate){
					egret.Tween.get(lastPage).to({x: -sw}, Navigator.duration, egret.Ease.quartInOut).call(onLastPageHide, this);
				}else{
					lastPage.x = -sw;
					onLastPageHide.call(this);
				}

				if(animate){
					this._tween = egret.Tween.get(page).to({x: 0}, Navigator.duration, egret.Ease.quartInOut).call(onPageShow, this);
				}else{
					page.x = 0;
					onPageShow.call(this);
				}
			}else{
				this._pageStack.push(page);
				page.onShow(action, params);
			}
		}

		pop(animate:boolean = true, params:any = null, dispatch:boolean = true):void{
			if(this.playing){
				return;
			}
			if(this._pageStack.length > 1){
				let action:string = 'pop';
				let sw:number = alien.StageProxy.width;

				let gonePage:NavigationPage = this._pageStack.pop();
				let page:NavigationPage = this._currentPage = this._pageStack[this._pageStack.length - 1];

				this.addChild(page);
				if(dispatch){
					this.dispatchEventWith(Navigator.NAVIGATE, false, {action, page});
				}

				let onGonePageHide = ()=>{
					gonePage.onHide(action, params);
					this.removeChild(gonePage);
					this._tween = null;
				}

				let onPageShow = ()=>{
					page.onShow(action, params);
				}

				page.beforeShow(action, params);
				if(animate){
					egret.Tween.get(page).to({x: 0}, Navigator.duration, egret.Ease.quartInOut).call(onPageShow, this);
				}else{
					page.x = 0;
					onPageShow.call(this);
				}

				gonePage.beforeHide(action, params);
				if(animate){
					this._tween = egret.Tween.get(gonePage).to({x: sw}, Navigator.duration, egret.Ease.quartInOut).call(onGonePageHide, this);
				}else{
					gonePage.x = sw;
					onGonePageHide.call(this);
				}
			}
		}

		popAll(animated:boolean = true, params:any = null, dispatch:boolean = true):void{
			if(this.playing){
				return;
			}
			if(this._pageStack.length > 1){
				let action:string = 'pop';
				let sw:number = alien.StageProxy.width;

				let gonePage:NavigationPage = this._pageStack.pop();
				this._pageStack.splice(1);
				let page:NavigationPage = this._currentPage = this._pageStack[this._pageStack.length - 1];

				this.addChild(page);
				if(dispatch){
					this.dispatchEventWith(Navigator.NAVIGATE, false, {action, page});
				}

				page.beforeShow(action, params);
				gonePage.beforeHide(action, params);
				if(animated){
					egret.Tween.get(page).to({x: 0}, Navigator.duration, egret.Ease.quartInOut).call(()=>{
						page.onShow(action, params);
					});

					this._tween = egret.Tween.get(gonePage).to({x: sw}, Navigator.duration, egret.Ease.quartInOut).call(()=>{
						gonePage.onHide(action, params);
						this.removeChild(gonePage);
						this._tween = null;
					});
				}else{
					page.x = 0;
					gonePage.x = sw;
					page.onShow(action, params);
					gonePage.onHide(action, params);
					this.removeChild(gonePage);
				}
			}else{
				this._needActive = true;
				this.active(dispatch);
			}
		}

		active(dispatch:boolean = true):void{
			if(this._needActive){
				this._needActive = false;
				if(dispatch){
					this._currentPage.beforeShow('active');
					this.dispatchEventWith(Navigator.NAVIGATE, false, {action: 'pop', page: this._currentPage});
				}
			}
		}

		deactive():void{
			this._needActive = true;
			this._currentPage.beforeHide('deactive');
		}

		get size():number{
			return this._pageStack.length;
		}

		get playing():boolean{
			return !!this._tween;
		}

		get currentPage():NavigationPage{
			return this._currentPage;
		}
	}

	export class NavigationPage extends eui.Component{
		navigation:Navigator;

		constructor(){
			super();

			this.percentWidth = 100;
			this.percentHeight = 100;
		}

		beforeShow(action:string, params:any = null):void{}
		beforeHide(action:string, params:any = null):void{}
		onShow(action:string, params:any = null):void{}
		onHide(action:string, params:any = null):void{}
	}
}