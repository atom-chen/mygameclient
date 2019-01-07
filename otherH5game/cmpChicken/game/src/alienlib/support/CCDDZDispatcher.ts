/**
 * Created by rockyl on 16/3/9.
 */

module CCalien {
	export class CCDDZDispatcher {
		static instance:egret.EventDispatcher;

		static init():void {
			CCDDZDispatcher.instance = new egret.EventDispatcher();
		}

		static dispatch(eventName:string, params:any = null):void {
			if (params) {
				CCDDZDispatcher.instance.dispatchEventWith(eventName, false, params);
			} else {
				CCDDZDispatcher.instance.dispatchEvent(new egret.Event(eventName));
			}
		}

		static addEventListener(eventName:string, callback:Function, thisObj:any):void {
			CCDDZDispatcher.instance.addEventListener(eventName, callback, thisObj);
		}

		static removeEventListener(eventName:string, callback:Function, thisObj:any):void {
			CCDDZDispatcher.instance.removeEventListener(eventName, callback, thisObj);
		}
	}
}