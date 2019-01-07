/**
 * Created by Rocky.L on 2015/5/21.
 *
 * Ticker管理类
 */

module CCalien{
	export class CCDDZTickerManager{
		private static _instance:CCDDZTickerManager;
		public static get instance():CCDDZTickerManager {
			if (this._instance == undefined) {
				this._instance = new CCDDZTickerManager();
			}
			return this._instance;
		}

		private _interval:number;
		private _intervalCount:number;
		private _all:ITicker[];

		constructor(interval:number = 1){
			this._all = [];
			this.interval = interval;
		}

		get interval():number{ return this._interval; }
		set interval(value:number){
			if(this._interval != value){
				this._interval = value;
			}
		}

		register(ticker:ITicker):void{
			if(this._all.indexOf(ticker) < 0){
				this._all.push(ticker);
			}
		}

		unregister(ticker:ITicker):void{
			let index = this._all.indexOf(ticker);
			if(index >= 0){
				this._all.splice(index, 1);
			}
		}

		activate():void{
			this._intervalCount = 0;

			egret.startTick(this.onTicker, this);
		}

		sleep():void{

			egret.stopTick(this.onTicker, this);
		}

		/**
		 * 时钟回调
		 */
		private onTicker(timeStamp: number):boolean{
			this._intervalCount++;
			if(this._intervalCount < this._interval){
				return;
			}
			this._intervalCount = 0;

			this._all.forEach(function(ticker:ITicker):void{
				ticker.update();
			});
		}

		static get interval():number{
			return this.instance.interval;
		}
		static set interval(value:number){
			this.instance.interval = value;
		}

		/**
		 * 注册
		 * @param ticker
		 */
		static register(ticker:ITicker):void{
			this.instance.register(ticker);
		}

		/**
		 * 反注册
		 * @param ticker
		 */
		static unregister(ticker:ITicker):void{
			this.instance.unregister(ticker);
		}

		/**
		 * 激活时钟
		 */
		static activate():void{
			this.instance.activate();
		}

		/**
		 * 沉睡时钟
		 */
		static sleep():void{
			this.instance.sleep();
		}
	}

	/**
	 * 始终接口
	 */
	export interface ITicker{
		update():void;
	}
}