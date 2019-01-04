/**
 * Created by rockyl on 16/3/9.
 */


module alien {
	export class Utils {
		static injectProp(target:Object, data:Object = null, callback:Function = null, ignoreMethod:boolean = true, ignoreNull:boolean = true):boolean {
			if (!data) {
				return false;
			}

			let result = true;
			for (let key in data) {
				let value:any = data[key];
				if((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null)){
					if(callback){
						callback(target, key, value);
					}else{
						target[key] = value;
					}
				}
			}
			return result;
		}

		static getDirtyData(oldData:any, newData:any):any{
			let dirtyData:any;

			for(let key in newData){
				if(oldData[key] != newData[key]){
					if(!dirtyData){
						dirtyData = {};
					}
					dirtyData[key] = newData[key];
				}
			}

			return dirtyData;
		}

		static combineProp(sources:any[]):any{
			let ret:any = {};
			sources.forEach((source:any)=>{
				if(!source){
					return;
				}
				for(let key in source){
					if(ret[key] == null){
						ret[key] = source[key];
					}
				}
			});

			return ret;
		}

		static enumChildren(container:egret.DisplayObjectContainer, callback:Function):void{
			for(let i = 0, li = container.numChildren; i < li; i++){
				if(callback(container.getChildAt(i), i)){
					break;
				}
			}
		}

		static enumChildren2(container: egret.DisplayObjectContainer, callback: Function): void {
			for (let li = container.numChildren, i = li - 1; i >= 0; i--) {
				if (callback(container.getChildAt(i), i)) {
					break;
				}
			}
		}

		static removeChildren(container:egret.DisplayObjectContainer, callback:Function):void{
			let i = 0;
			while(container.numChildren > 0){
				callback(container.removeChildAt(0), i);
				i++;
			}
		}

		static clone(source:any, def:any = null, ignoreMethod:boolean = true):any{
			let target:any = def ? new def() : {};
			this.injectProp(target, source, null, ignoreMethod);

			return target;
		}

		static arrToIntArr(arr:any[]):number[] {
			for (let i:number = 0, li:number = arr.length; i < li; i++) {
				arr[i] = parseInt(arr[i]);
			}

			return arr;
		}

		static getUrlParams():any {
			let params:any = {};
			let href:string = window.location.href;
			let index:number = href.indexOf("?");
			if (index < 0) {
				return params;
			}
			let hashes = href.substr(index + 1).split('&');
			for (let i = 0; i < hashes.length; i++) {
				let arr:Array<string> = hashes[i].split('=');
				params[arr[0]] = arr[1];
			}
			return params;
		}

		static getUrlBase():string {
			let href:string = window.location.href;
			let index:number = href.indexOf("?");
			return href.substring(0, index < 0 ? href.length : index);
		}

		static anchorCenter(target:any, width:number = 0, height:number = 0):void {
			this.anchorRate(target, 0.5, 0.5, width, height);
		}

		static anchorRate(target:any, rx:number, ry:number, width:number = 0, height:number = 0):void {
			if(width == 0){
				width = target.width;
			}
			if(height == 0){
				height = target.height;
			}
			target.x += target.anchorOffsetX = width * rx;
			target.y += target.anchorOffsetY = height * ry;
		}

		/**
		 * object转成查询字符串
		 * @param obj
		 * @returns {string}
		 */
		static obj2query(obj:any):string{
			if(!obj){
				return '';
			}
			let arr:string[] = [];
			for(let key in obj){
				arr.push(key + '=' + obj[key]);
			}
			return arr.join('&');
		}

		static parseColorTextFlow(source:string):any[]{
			let statics:string[] = source.split(/\[.*?\]/g);
			let dynamics:string[] = source.match(/\[.*?\]/g);

			let ret:any[] = [];
			let s;
			let i = 0;
			let li = statics.length - 1;
			for (; i < li; i++) {
				s = statics[i];

				if(s){
					ret.push({text: s});
				}
				let cs:string = dynamics[i];
				cs = cs.substr(1, cs.length - 2);
				let obj:any = {};
				let arr = cs.split('|');
				if(arr.length == 1){
					obj.style = {textColor: parseInt(arr[0], 16)};
				}else{
					obj.text = arr[0];
					obj.style = {textColor: parseInt(arr[1], 16)};
				}
				ret.push(obj);
			}
			s = statics[i];
			if(s){
				ret.push({text: s});
			}

			return ret;
		}

		static parser:egret.HtmlTextParser = new egret.HtmlTextParser();
		static parseHtmlText(source:string):any[]{
			return this.parser.parser(source);
		}

		static scrollTo(index, itemSize, gap = 0){
			return (itemSize + gap) * index;
		}

		static getByteLen(str) {
			return str.replace(/[^\x00-\xff]/g, '__').length;
		}

		/**
		 * 检测两个时间戳不是同一天,并且后一个的时间戳大
		 */
		static checkTwoTimestampIsOtherDay(_smallstamp:number,_bigstamp:number):boolean{
            let _lastDay = new Date(_smallstamp).getDate();
			let _curDay = new Date(_bigstamp).getDate();
            if(_lastDay != _curDay && _bigstamp > _smallstamp){
                return true;
            }
			return false;
		}

		/**
		 * 检测当前的时间是否在某个小时区间内
		 */
		static checkCurHourisInHourRange(beginHour:number,endHour:number):boolean{
			let _time = server.getServerStamp();
			let hour = new Date(_time).getHours();
			if(hour>=beginHour && hour < endHour){
				return true;
			}
			return false;
		}

		/**
		 * 获取当前的事件戳
		 */
		static getCurTimeStamp():number{
			let _args = alien.Native.instance.getUrlArg();
			if(_args.showLog == '1'){
				return new Date().getTime();
			}
			return server.getServerStamp();
		}
		/** 
		* 获取时间戳差值对应的时间
		* 返回精度为：秒，分，小时，天
		* diffType:"second" ,"minute","hour","day","all";
		*/
		static getTimeStampDiff(startTimeStamp:number, endTimeStamp:number, diffType:string):any
		{
			let _startStmp = startTimeStamp;
			let _endStmp = endTimeStamp;
			diffType = diffType.toLowerCase();
			let sTime:Date = new Date(_startStmp);
			let eTime:Date = new Date(_endStmp);
			let _diff = eTime.getTime() - sTime.getTime();
			let divNum = 1;
			
			switch (diffType) 
			{
				case "second":
					divNum = 1000;
					break;
				case "minute":
					divNum = 1000 * 60;
					break;
				case "hour":
					divNum = 1000 * 3600;
					break;
				case "day":
					divNum = 1000 * 3600 * 24;
					break;
				case "all":
					let _ret:any = {};
					let _day = 1000 * 3600 * 24;
					let _hour = 1000 * 3600;
					let _minute = 1000 * 60;
					let _second = 1000;
					
					let leftStamp = _diff%_day; 
					_ret.days = Math.floor(_diff/_day);
					_ret.hours = Math.floor(leftStamp/_hour);
					leftStamp = leftStamp%_hour;
					_ret.minutes = Math.floor(leftStamp/_minute);
					leftStamp = leftStamp%_minute;
					_ret.seconds = Math.round(leftStamp/_second);
					leftStamp = leftStamp%_second;
					_ret.milliseconds = leftStamp;
					return _ret;
				default:
					break;
			}
			return _diff / divNum;
		}

		/**
		 * 是否在某个时间周期内
		 * startTime:2017-10-15 00:00:00
		 * endTime:2017-10-15 00:00:00
		 * checkTimeStamp:xxxxx 单位毫秒的时间戳
		 */
		static isInTimeSection(startTime:string,endTime:string,checkTimeStamp:number,includeStart:boolean =true,includeEnd:boolean = true):boolean{
			let startTimeStamp = new Date(Date.parse(startTime.replace(/-/g, "/"))).getTime();
			let endTimeStamp = new Date(Date.parse(endTime.replace(/-/g, "/"))).getTime();
			if(checkTimeStamp >= startTimeStamp && checkTimeStamp <= endTimeStamp){
				if(!includeStart && startTimeStamp == checkTimeStamp){
					return false;
				}else if(!includeEnd && endTimeStamp == checkTimeStamp){
					return false;
				}

				return true;
			}
			return false;
		}

		/**
		 * 检查两个时间戳是否是同一天
		 */
		static isTwoStampSameDay(stamp1:number,stamp2:number):boolean{
			let date1:Date = new Date(stamp1);
			let date2:Date = new Date(stamp2);
			if((date1.getFullYear() == date2.getFullYear()) && (date1.getMonth() == date2.getMonth()) && (date1.getDate() == date2.getDate())){
				return true;
			}
			return false;
		}

		/**
		 * 浮点型转字符串
		 * degree：保留的小数精度
		 */
		static flatToString(val:number,degree:number):string{
			let _s = "" + val;
			let _a = _s.split(".");
			let _ret = "";
			if(_a.length <= 1){
				_ret = _s;
				if(degree >0){
					let _ss = ""
					for(let i=0;i<degree;++i){
						_ss += "0";
					}
					_ret += "." + _ss;
				}
			}else{
				_ret = _a[0] + "." + _a[1].substr(0,degree);
			}
			return _ret;
		}

		/**
		 * 屏幕适配
		 * bW：true 宽铺满屏幕 obj.width = stageWidth;
		 * bH:true 高铺满屏幕 obj.height = stagetHeight;
		 */
		static adaptScreenWH(obj: egret.DisplayObjectContainer, bW: boolean, bH: boolean): void {
			if (!obj) return;

			let stage = alien.StageProxy.stage;
			if (bW) {
				obj.width = stage.stageWidth;
			}
			if (bH) {
				obj.height = stage.stageHeight;
			}
		}

		/**
		 * 判断是不是iphonex设备 x  x-max xr
		 */
		static isiphoneX() {
			let bIphone = /iphone/gi.test(navigator.userAgent)
			let ratio = window.devicePixelRatio || 1;
			let screen = {
				width: window.innerWidth * ratio,
				height: window.innerHeight * ratio
			};

			return (bIphone && ((screen.width == 1125 && screen.height == 2436)
				|| (screen.width == 1242 && screen.height == 2688)
				|| (screen.width == 828 && screen.height == 1792)));
		}
	}
}