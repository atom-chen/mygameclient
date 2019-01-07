/**
 * Created by rockyl on 2016/11/9.
 *
 * 游戏数据
 */

class PDKGameData extends PDKDataStorage{
	private static _instance:PDKGameData;
	public static get instance():PDKGameData {
		if (this._instance == undefined) {
			this._instance = new PDKGameData();
		}
		return this._instance;
	}

	constructor(){
		super();

		this.name = 'save';
	}
}