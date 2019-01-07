/**
 * Created by rockyl on 16/3/9.
 */


module CCalien {
	export class CCDDZUtils {
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
			let _time = ccserver.getServerStamp();
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
			let _args = CCalien.Native.instance.getUrlArg();
			if(_args.showLog == '1'){
				return new Date().getTime();
			}
			return ccserver.getServerStamp();
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
	}
}