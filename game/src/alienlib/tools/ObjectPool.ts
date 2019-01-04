/**
 * Created by rockyl on 16/3/9.
 */


module alien {
	export class ObjectPool {
		static MAX:number = 20;

		static createMethods:Object = {};
		static initMethods:Object = {};
		static pools:Object = {};

		static registerPool(name:string, createMethod:Function, initMethod:Function = null):void {
			this.createMethods[name] = createMethod;
			this.initMethods[name] = initMethod;
			this.pools[name] = [];
		}

		static getObject(name:string, ...params):Object {
			let pool = this.pools[name];
			if (!pool) {
				console.warn(name + "没有注册在对象池中。");
				return null;
			}

			let obj:Object;
			if (pool.length > 0) {
				obj = pool.shift();
			} else {
				let createMethod = this.createMethods[name];
				obj = createMethod.apply(null, params);
			}

			let initMethod = this.initMethods[name];
			if (initMethod) {
				params.unshift(obj);
				initMethod.apply(null, params);
			}

			this.debug();

			return obj;
		}

		static recycleObject(name:string, obj:Object):void {
			if (!obj) {
				return;
			}
			let pool = this.pools[name];
			if (!pool) {
				console.warn(name + "没有注册在对象池中。");
				return;
			}

			if (pool.indexOf(obj) < 0 && pool.length <= this.MAX) {
				pool.push(obj);
			}

			this.debug();
		}

		static debug():void {
			let text = "";
			for (let key in this.pools) {
				let pool = this.pools[key];
				text += key + ":" + pool.length + "\n";
			}
			//DebugWindow.instance.text = text;
		}
	}
}