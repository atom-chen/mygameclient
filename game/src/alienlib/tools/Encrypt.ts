/**
 * Created by zhu on 17/12/28.
 */


module alien {
	let ENCRYPT_KEY = "ddz";

	export class Encrypt {
		static encryptStr(sInfo:string):string{
			let j=0;
			let _len = sInfo.length;
			let _newStr = "";
			let _ascii1;
			let _ascii2; 
			let _ascii3;
			let _char;
			for(let i=0;i<_len;++i){
				if(j>= ENCRYPT_KEY.length){
					j = 0;
				}

				_ascii1 = sInfo.charCodeAt(i); 
				_ascii2 = ENCRYPT_KEY.charCodeAt(j); 
				_ascii3 = _ascii1 ^ _ascii2;
				_newStr += String.fromCharCode(_ascii3);
				j++;
			}
			return _newStr;
		}

		static decryptStr(sInfo:string):string{
			let _newStr = this.encryptStr(sInfo)
			return _newStr;
		}
	}
}