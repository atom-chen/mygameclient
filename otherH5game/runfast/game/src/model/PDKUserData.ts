/**
 * Created by rockyl on 2016/11/9.
 *
 * 用户数据
 */
let _encrypt = PDKalien.Encrypt.encryptStr;
let _decrypt = PDKalien.Encrypt.encryptStr;
class PDKUserData extends PDKDataStorage {
	private static _instance: PDKUserData;
	public static get instance(): PDKUserData {
		if (this._instance == undefined) {
			this._instance = new PDKUserData();
		}
		return this._instance;
	}

	constructor() {
		super();

		this.name = 'user';
	}

	init(prefix) {
		this.prefix = prefix;
	}

	/**
	 * 设置某个值
	 * bSave: 是否立即保存
	 */
	private _setValue(_key: string, _val: string, bSave: boolean = false): void {
		let _key1 = _encrypt(_key);
		let _val1 = _encrypt(_val);
		this.setItem(_key1, _val1, bSave);
	}

	/**
	 * 获取某个值
	 */
	private _getValue(_key: string): string {
		let _key1 = _encrypt(_key);
		let _v = this.save[_key1] || null;
		if (_v) {
			_v = _decrypt(_v);
		}
		return _v;
	}

	/**
     * 保存本地手机信息
     */
	static saveLocalPhone(phone: string): void {
		let _key = _encrypt("phone");
		let _val = _encrypt(phone);
		PDKalien.localStorage.setItem(_key, _val);
	}

    /**
     * 保存本地支付宝信息
     */
	static saveLocalAli(account: string, name: string): void {
		let _key = _encrypt("ali");
		let _val = _encrypt(account + "|" + name);
		PDKalien.localStorage.setItem(_key, _val);
	}

    /**
     * 获取本地保存的支付宝信息
     */
	static getLocalAli(): any {
		let _key = _encrypt("ali");
		let _val = PDKalien.localStorage.getItem(_key);
		if (_val) {
			let _str: string = _decrypt(_val);
			let _info = _str.split("|");
			if (_info.length < 2) return null;

			let _account = _info[0];
			let _name = _info[1];
			return { account: _account, name: _name };
		}
		return null;
	}

    /**
     * 获取本地保存的手机号
     */
	static getLocalPhone(): string {
		let _key = _encrypt("phone");
		let _val = PDKalien.localStorage.getItem(_key);
		if (_val) {
			let _str = _decrypt(_val);
			return _str;
		}
		return null;
	}

	public setToken(token: string, bSave: boolean = false): void {
		let _key = "token";
		let _val = token;
		this._setValue(_key, _val, bSave);
	}

	public setUid(uid: string, bSave: boolean = false): void {
		let _key = "uid";
		let _val = uid;
		this._setValue(_key, _val, bSave);
	}

	public setSk(sk: string, bSave: boolean = false): void {
		let _key = "sk";
		let _val = sk;
		this._setValue(_key, _val, bSave);
	}

	/**
	 * 获取token
	 */
	public getToken(): string {
		let _key = "token";
		return this._getValue(_key);
	}

	/**
	 * 获取uid
	 */
	public getUid(): string {
		let _key = "uid";
		return this._getValue(_key);
	}

	/**
	 * 获取uid
	 */
	public getSk(): string {
		let _key = "sk";
		return this._getValue(_key);
	}

}