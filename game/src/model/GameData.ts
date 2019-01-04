/**
 * Created by rockyl on 2016/11/9.
 *
 * 游戏数据
 */

class GameData extends DataStorage{
	private static _instance:GameData;
	public static get instance():GameData {
		if (this._instance == undefined) {
			this._instance = new GameData();
		}
		return this._instance;
	}

	constructor(){
		super();

		this.name = 'save';
	}
}