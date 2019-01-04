/**
 * Created by rockyl on 2016/11/9.
 *
 * 用户数据
 */
let _encrypt = alien.Encrypt.encryptStr;
let _decrypt = alien.Encrypt.encryptStr;

class UserData extends DataStorage{
	private static _instance:UserData;
	public static get instance():UserData {
		if (this._instance == undefined) {
			this._instance = new UserData();
		}
		return this._instance;
	}

	constructor(){
		super();

		this.name = 'user';
	}

	init(prefix){
		this.prefix = prefix;
	}

	/**
	 * 设置某个值
	 * bSave: 是否立即保存
	 */
	private _setValue(_key:string,_val:string,bSave:boolean = false):void{
		let _key1 = _encrypt(_key);
		let _val1 = _encrypt(_val);
		this.setItem(_key1,_val1,bSave);
	}

	/**
	 * 获取某个值
	 */
	private _getValue(_key:string):string{
		let _key1 = _encrypt(_key);
		let _v = this.save[_key1] ||null;
		if(_v){
			_v = _decrypt(_v);
		}
		return _v;
	}

	/**
     * 保存本地手机信息
     */
    public saveLocalPhone(phone:string,bSave:boolean = false):void{
		if(!phone || phone.length != 11) return;

		let _key = "phone";
		let _val = phone;
		this.setBindPhone(true);
		this._setValue(_key,_val,bSave);
    }
	
    /**
     * 保存本地支付宝信息
     */
    public saveLocalAli(account:string,name:string,bSave:boolean = true):void{
		let _key = "ali";
		let _val = account+"|"+name;
		this._setValue(_key,_val,bSave);
    }

	/**
	 * hasBind:1已绑定其他为未绑定
	 */
	public setBindWx(hasBind:boolean):void{
		let _key = "bindWx";
		let _hasBind ="0";
		if(hasBind){
			_hasBind = "1";
		}
		this._setValue(_key,_hasBind);
	}

	public hasBindWx():boolean{
		let _key = "bindWx";
		let _val = this._getValue(_key);
		if(_val && _val == "1"){
			return true;
		}
		return false;
	}

	/**
	 * hasBind:1已绑定其他为未绑定
	 */
	public setBindAli(hasBind:boolean):void{
		let _key = "bindAli";
		let _hasBind ="0";
		if(hasBind){
			_hasBind = "1";
		}
		this._setValue(_key,_hasBind);
	}

	/**
	 * 是否已经绑定手机
	 */
	public hasBindAli():boolean{
		let _key = "bindAli";
		let _val = this._getValue(_key);
		if(_val && _val == "1"){
			return true;
		}
		return false;
	}

	/**
	 * hasBind:1已绑定其他为未绑定
	 */
	public setBindPhone(hasBind:boolean):void{
		let _key = "bindPhone";
		let _hasBind ="0";
		if(hasBind){
			_hasBind = "1";
		}
		this._setValue(_key,_hasBind);
	}

	/**
	 * 是否已经绑定手机
	 */
	public hasBindPhone():boolean{
		let _key = "bindPhone";
		let _val = this._getValue(_key);
		if(_val && _val == "1"){
			return true;
		}
		return false;
	}

    /**
     * 获取本地保存的支付宝信息
     */
    public getLocalAli():any{
		let _key = "ali";
		let _val = this._getValue(_key);
		if(_val){
			let _str:string = _val;
			let _info = _str.split("|");
			if(_info.length<2) return null;

			let _account = _info[0];
			let _name = _info[1];
			return {account:_account,name:_name};
		}
		return null;
    }

    /**
     * 获取本地保存的手机号
     */
    public getLocalPhone():string{
		let _key = "phone";
		return this._getValue(_key);
	}

	public setToken(token:string,bSave:boolean = false):void{
		let _key = "token";
		let _val = token;
		this._setValue(_key,_val,bSave);
	}

	public setUid(uid:string,bSave:boolean = false):void{
		let _key = "uid";
		let _val = uid;
		this._setValue(_key,_val,bSave);
	}

	public setSk(sk:string,bSave:boolean = false):void{
		let _key = "sk";
		let _val = sk;
		this._setValue(_key,_val,bSave);
	}

	/**
	 * 获取token
	 */
	public getToken():string{
		let _key = "token";
		return this._getValue(_key);
	}

	/**
	 * 获取uid
	 */
	public getUid():string{
		let _key ="uid";
		return this._getValue(_key);
	}

	/**
	 * 获取uid
	 */
	public getSk():string{
		let _key = "sk";
		return this._getValue(_key);
	}

	/**
	 * 点击过新年礼盒
	 */
	public setHasClickNewYearGift():void{
		this._setValue("newYearGift","1",true);
	}

	/**
	 * 是否点击过新年礼盒
	 */
	public hasClickNewYearGift():boolean{
		let _val = this._getValue("newYearGift");
		if(_val && _val == "1"){
			return true;
		}
		return false;
	}

	/**
	 * 点击过新年开工礼
	 */
	public setHasClickNewYearWork():void{
		this._setValue("newYearWork","1",true);
	}

	/**
	 * 是否点击过新年开工礼
	 */
	public hasClickNewYearWork():boolean{
		let _val = this._getValue("newYearWork");
		if(_val && _val == "1"){
			return true;
		}
		return false;
	}

	/**
	 * 点击过新年任务
	 */
	public setHasClickNewYearTask():void{
		this._setValue("newYearTask","1",true);
	}

	/**
	 * 是否点击过新年任务
	 */
	public hasClickNewYearTask():boolean{
		let _val = this._getValue("newYearTask");
		if(_val && _val == "1"){
			return true;
		}
		return false;
	}
}