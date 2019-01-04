module alien {
	export class Schedule {
		private _taskMap:any = {};
		private _idIndex:number = 0;
		private _count = 0;
		private _oneFrameSecTime:number;
		private _oneFrameMilliSecTime:number;
		private _intervalId:number = null;
		private _isRunning:boolean = null;
		private _clearTimeout:Function = egret.clearTimeout;
		private _clearInterval:Function = egret.clearInterval;

		constructor(){
			this._oneFrameSecTime = 1 / alien.StageProxy.stage.frameRate;
			this._oneFrameMilliSecTime = this._oneFrameSecTime*1000;
		}

		private _remove(key:number):void{
			if(this._taskMap[key]){
				this._count--;
				delete this._taskMap[key];
			}
		}

		private _update():void{
			let cur = Date.now();
			let item;
			let willDelKey = [];
			for (let key in this._taskMap) {	
				item = this._taskMap[key];
				if(!item.running){
					continue;
				}

				item.last = cur;
				if(item.last >= item.start + item.time){
					item.start = cur;
					item.last = cur;
					item.curCount++;
					if(item.repeatCount > 0){
						if (item.curCount >= item.repeatCount) {
							willDelKey.push(key);
						}
					}
					item.func.apply(item.target,item.args);
				}
			}

			for(let key in willDelKey){
				this._remove(willDelKey[key]);
			}
		}


		private _reset(key:number){
			if(this._taskMap[key]){
				let item = this._taskMap[key];
				item.curCount = 0;
				item.running = false;
			}
		}
		
		private _setRunning(key:number,bRunning:boolean):void{
			if(this._taskMap[key]){
				let item = this._taskMap[key];
				item.running = bRunning;
				item.start = Date.now();
				item.last = item.start;
			}
		}
		
		private _stop(key:number){
			this._setRunning(key,false);
		}

		private _start(key:number){
			this._setRunning(key,true);
		}

		private _initData(){
			this._isRunning = false;
			this._idIndex = 0;
			this._intervalId = null;
			this._taskMap = {};
		}
		
		private _startSchedule(){
			this._clearSelfInterval();
			this._isRunning = true;
			this._intervalId = egret.setInterval(this._update,this,this._oneFrameMilliSecTime);
		}

		private _clearSelfInterval(){
			if (this._intervalId >0){
				this._clearInterval(this._intervalId);
			}
		}

		private _stopSchedule(){
			this._isRunning = false;
		}

		public isRunning():boolean{
			return this._isRunning;
		}
		
		private static _instance:Schedule;

		public static get instance():Schedule {
			if (this._instance == undefined) {
				this._instance = new Schedule();
			}
			return this._instance;
		}

		public static init(){
			alien.Schedule.instance;
		}

		/**
		 * delay: call cycle millseconds
		 * repeatCount:run numbers
		 */
		public static task(callback: Function, thisObject: Object, delay: number,repeatCount:number, ...args: any[]): number{
			let ins = alien.Schedule.instance;
			ins._idIndex++;
			ins._count++;
			let id = ins._idIndex;
			ins._taskMap[id] = {id:id,func:callback,target:thisObject,time:delay,curCount:0,running:true,repeatCount:repeatCount || 1,args:args,start:Date.now(),last:Date.now()};
			return id
		}

		public static setTimeout<Z>(listener: (this: Z, ...arg) => void, thisObject: Z, delay: number, ...args: any[]): number{
			return alien.Schedule.task(listener,thisObject,delay,1,...args);
		}

		public static setInterval<Z>(listener: (this: Z, ...arg) => void, thisObject: Z, delay: number, ...args: any[]): number{
			return alien.Schedule.task(listener,thisObject,delay,-1,...args);
		}

		public static startSchedule(){
			alien.Schedule.instance._startSchedule();
		}

		public static stopSchedule(){
			alien.Schedule.instance._stopSchedule();
		}

		public static reset(key:number){
			alien.Schedule.instance._reset(key);	
		}
		
		public static stop(key:number){
			alien.Schedule.instance._stop(key);
		}

		public static start(key:number){
			alien.Schedule.instance._start(key);
		}

		public static clearTimeout(key:number):void{
			let ins = alien.Schedule.instance;
			ins._remove(key);
		}

		public static clearInterval(key:number):void{
			let ins = alien.Schedule.instance;
			ins._remove(key);
		}
	}
}