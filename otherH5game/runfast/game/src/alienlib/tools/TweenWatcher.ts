/**
 * Created by rockyl on 16/3/9.
 */


module PDKalien{
	export class TweenWatcher extends egret.EventDispatcher{
		static ALL_TWEEN_COMPLETE:string = 'allTweenComplete';

		private static _instance:TweenWatcher;
		public static get instance():TweenWatcher {
			if (this._instance == undefined) {
				this._instance = new TweenWatcher();
			}
			return this._instance;
		}

		dicTweenCount:any;
		dicTweenParams:any;

		constructor(){
			super();

			this.dicTweenCount = {};
			this.dicTweenParams = {};
		}

		start(name:string, params:any = null):void{
			this.dicTweenCount[name] = 0;
			this.dicTweenParams[name] = params;
		}

		registerTween(name:string, tween:egret.Tween):void{
			this.setTweenStart(name);

			//console.log('tweenCount++' + this.tweenCount);
			tween.call(this.onTweenEnd, this, [name]);
			//todo 如果之前的tween提前结束了，那就完了，要解决一下
		}

		setTweenStart(name):void{
			this.dicTweenCount[name] ++;
		}

		setTweenEnd(name):void{
			this.onTweenEnd(name);
		}

		private onTweenEnd(name):void{
			this.dicTweenCount[name] --;
			//console.log('tweenCount--' + this.tweenCount);

			if(this.dicTweenCount[name] <= 0){
				//console.log('ALL_TWEEN_COMPLETE');
				this.dispatchEventWith(TweenWatcher.ALL_TWEEN_COMPLETE, false, {name: name, params: this.dicTweenParams[name]});
			}
		}
	}
}