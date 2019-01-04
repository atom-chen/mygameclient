/**
 * 德州扑克上局记录
 */

class PanelDzpkHistory extends alien.PanelBase {
	private static _instance:PanelDzpkHistory;
	private usersList:eui.List;
    protected _dataProvide:eui.ArrayCollection;

	public static get instance():PanelDzpkHistory {
		if (this._instance == undefined) {
			this._instance = new PanelDzpkHistory();
		}
		return this._instance;
	}


	protected init():void {
		this.skinName = panels.PanelDzpkHistory;
        this._dataProvide = new eui.ArrayCollection();
        this.usersList.dataProvider = this._dataProvide;
        this.usersList.itemRenderer = HistoryItemDzpk;
	}

	constructor() {
		/*super(alien.popupEffect.Flew, {withFade: true, direction: 'right',duration:200},
		alien.popupEffect.Flew, {withFade: true, direction: 'right',duration:200});*/
		super();
	}

	createChildren():void {
		super.createChildren();
		this["typeRootGrp"].addEventListener(egret.TouchEvent.TOUCH_TAP, this._touchContent, this);
		this["touchGrp"].addEventListener(egret.TouchEvent.TOUCH_TAP, this._touchEmpty, this);
	}

	private _touchContent():void{
	}

	private _touchEmpty():void{
		this.close();
	}

	show(data:any):void {
		this.percentWidth = 100;
		this.percentHeight = 100;
		//this.validateNow();
		this.popup();
		let info = [];
		let publiccards:any = data.publiccards;
		let plen = data.players.length;
		for(let i=0;i<plen;++i){
			data.players[i].publiccards = data.players[i].handcards.concat(publiccards);
			info.push(data.players[i]);
		}
		this._dataProvide.source = info;
        this._dataProvide.refresh();
	}
	
	static getInstance():PanelDzpkHistory{
		return this._instance;
	}
}
