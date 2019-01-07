/**
 * Created by rockyl on 16/3/9.
 */


module PDKalien {
	export class HashMap {
		private _length:number;
		private obj:any;

		constructor() {
			this.clear();
		}

		containsKey(key:any):boolean {
			return key in this.obj;
		}

		containsValue(value:any):boolean {
			for (let key in this.obj) {
				if (this.obj[key] == value) {
					return true;
				}
			}
			return false;
		}

		put(key:any, value:any):void {
			if (!this.containsKey(key)) {
				this.obj[key] = value;
				this._length++;
			}
		}

		get(key:any):any {
			return this.containsKey(key) ? this.obj[key] : null;
		}

		remove(key:any):any {
			if (this.containsKey(key)) {
				let value = this.obj;
				delete this.obj[key];
				this._length--;

				return value;
			}
			return null;
		}

		foreach(callback:Function, thisOjb:any):void {
			for (let key in this.obj) {
				if (!callback.call(thisOjb, key, this.obj[key])) {
					break;
				}
			}
		}

		randomGet():any {
			let values = this.valueSet;
			return values[Math.floor(Math.random() * values.length)];
		}

		get keySet():any {
			let keys = [];
			for (let key in this.obj) {
				keys.push(key);
			}

			return keys;
		}

		get valueSet():any {
			let values = [];
			for (let key in this.obj) {
				values.push(this.obj[key]);
			}

			return values;
		}

		get size():number {
			return this._length;
		}

		clear():void {
			this._length = 0;
			this.obj = {};
		}
	}
}