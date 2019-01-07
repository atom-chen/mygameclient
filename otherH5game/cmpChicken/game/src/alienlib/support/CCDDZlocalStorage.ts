/**
 * Created by rockyl on 16/3/9.
 */


module CCalien{
	export class CCDDZlocalStorage{
		static ID:string = '';

		static init(ID:string):void{
			this.ID = ID;
		}

		static getName(key:string, prefix:string = null):string{
			return (prefix || !this.ID || this.ID == '' ? prefix : this.ID) + '_' + key;
		}

		static getItem(key:string, prefix:string = null):string{
			return egret.localStorage.getItem(this.getName(key, prefix));
		}

		static setItem(key:string, value:string, prefix:string = null):boolean{
			return egret.localStorage.setItem(this.getName(key, prefix), value);
		}

		static getItemObj(key:string, defaultObj:any = null, prefix:string = null):any{
			let result:any;
			try{
				result = JSON.parse(this.getItem(key, prefix));
			}catch(e){

			}
			if(!result){
				result = defaultObj;
			}
			return result;
		}

		static setItemObj(key:string, itemObj:any, prefix:string = null):boolean{
			return this.setItem(key, JSON.stringify(itemObj), prefix);
		}
	}
}