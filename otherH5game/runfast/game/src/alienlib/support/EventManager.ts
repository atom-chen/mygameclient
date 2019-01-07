/**
 * Created by rockyl on 16/5/19.
 *
 * 事件管理器
 */
module PDKalien{
	export class PDKEventManager{
		private static _instance:PDKEventManager;
		public static get instance():PDKEventManager {
			if (this._instance == undefined) {
				this._instance = new PDKEventManager();
			}
			return this._instance;
		}

		private _groups:any = {};

		register(groupName:string, target:any, eventName:string, callback:Function, thisObj:any, priority:number = 0):void{
			let item:RegisterItem = new RegisterItem();
			PDKalien.PDKUtils.injectProp(item, {target, eventName, callback, thisObj, priority}, null, false);

			let group:any = this._groups[groupName];
			if(!group){
				group = this._groups[groupName] = {enable: false, items: []};
			}
			group.items.push(item);
		}

		registerOnObject(obj:any, target:any, eventName:string, callback:Function, thisObj:any, priority:number = 0):void{
			this.register(obj['__class__'], target, eventName, callback, thisObj, priority);
		}

		enable(groupName:string):void{
			let group:any = this._groups[groupName];
			if(group && !group.enable){
				group.enable = true;
				group.items.forEach((item:RegisterItem)=>{
					item.target['addEventListener'](item.eventName, item.callback, item.thisObj, false, item.priority);
				});
			}
		}

		enableOnObject(obj:any):void{
			this.enable(obj['__class__']);
		}

		disable(groupName:string):void{
			let group:any = this._groups[groupName];
			if(group && group.enable){
				group.enable = false;
				group.items.forEach((item:RegisterItem)=>{
					item.target['removeEventListener'](item.eventName, item.callback, item.thisObj);
				});
			}
		}

		disableOnObject(obj:any):void{
			this.disable(obj['__class__']);
		}

		dump(groupName:string = null):void{
			for(let key in this._groups){
				let group:any = this._groups[key];
				console.log(key + '[' + group.items.length + ']: ' + (group.enable ? '● enable' : '○ disable'));
				console.log(group.items.map((item:RegisterItem)=>{return item.eventName;}).join(','));
			}
		}
	}

	export class RegisterItem{
		target:any;
		eventName:string;
		callback:Function;
		thisObj:any;
		priority:number;
	}
}
