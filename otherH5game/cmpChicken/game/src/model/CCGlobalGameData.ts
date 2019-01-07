/**
 * Created by rockyl on 2016/11/9.
 *
 * 游戏数据
 */

class CCGlobalGameData extends CCGlobalDataStorage {
	private static _instance: CCGlobalGameData;
	public static get instance(): CCGlobalGameData {
		if (this._instance == undefined) {
			this._instance = new CCGlobalGameData();
		}
		return this._instance;
	}

	constructor() {
		super();

		this.name = 'save';
	}
}