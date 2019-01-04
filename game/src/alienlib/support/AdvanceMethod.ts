/**
 * Created by rockyl on 16/6/12.
 *
 * 一些方法的弥补
 */

class AdvanceMethod{
	static start():void{
		if(egret.Capabilities.os == 'iOS'){
			console.log('replace Array.sort');

			let _sort = Array.prototype.sort;
			Array.prototype.sort = function(fn){
				if(!!fn && typeof fn === 'function'){
					if(this.length < 2) return this;
					let i = 0, j = i + 1, l = this.length, tmp, r = false, t = 0;
					for(; i < l; i++){
						for(j = i + 1; j < l; j++){
							t = fn.call(this, this[i], this[j]);
							r = (typeof t === 'number' ? t : !!t ? 1 : 0) > 0;
							if(r){
								tmp = this[i];
								this[i] = this[j];
								this[j] = tmp;
							}
						}
					}
					return this;
				}else{
					return _sort.call(this);
				}
			};
		}
	}
}