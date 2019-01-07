/**
 * Created by rockyl on 16/3/9.
 */

module PDKalien {
	export class Dispatcher {
		static instance:egret.EventDispatcher;

		static init():void {
			Dispatcher.instance = new egret.EventDispatcher();
		}

		static dispatch(eventName:string, params:any = null):void {
			if (params) {
				Dispatcher.instance.dispatchEventWith(eventName, false, params);
			} else {
				Dispatcher.instance.dispatchEvent(new egret.Event(eventName));
			}
		}

		static addEventListener(eventName:string, callback:Function, thisObj:any):void {
			Dispatcher.instance.addEventListener(eventName, callback, thisObj);
		}

		static removeEventListener(eventName:string, callback:Function, thisObj:any):void {
			Dispatcher.instance.removeEventListener(eventName, callback, thisObj);
		}
	}
}