/**
 * Created by rockyl on 16/3/29.
 *
 * 游戏选择频道
 */

class PDKSceneGameSel extends PDKalien.SceneBase {
    private static _instance: PDKSceneGameSel;
    static defName: string = 'PDKSceneGameSel';

    protected _roomList: any[];
    private gameList: eui.List;
    private _gameProvider: eui.ArrayCollection;
    private _toGameInfo: any;

    protected init(): void {
        this.skinName = pages.PDKSceneGameSelSkin;
    }
    constructor() {
        super();
        PDKSceneGameSel._instance = this;
        this.init();
    }

    createChildren(): void {
        super.createChildren();
    }

    public childrenCreated() {
        super.childrenCreated();
        this.gameList.dataProvider = this._gameProvider = new eui.ArrayCollection();
        this.gameList.itemRenderer = PDKIRNormalRoom;
    }

    public setWillToGame(info): void {
        this._toGameInfo = info;
    }

    public getWillToGame(): any {
        return this._toGameInfo;
    }

    private _enableListeners(bEnable: boolean) {
        let func = "addEventListener";
        if (!bEnable) {
            func = "removeEventListener";
        }
        pdkServer[func](PDKEventNames.USER_PLAYERS_AMOUNT_REP, this.onPlayersAmount, this);
    }

    /**
	 * 获取到房间人数
	 * @param event
	 */
    protected onPlayersAmount(event: egret.Event): void {
        let data: any = event.data;
        console.log("onPlayersAmount--------->", data);
        data.info.forEach((item: any, index: number) => {
            let room: any = this.getRoomById(item.room_id);
            if (room) {
                room.amount = item.amount;
            }
        });

        this._gameProvider.refresh();
    }

    protected getRoomById(id: number): any {
        let room = null;
        this._roomList.some((r: any) => {
            if (r.roomID == id) {
                room = r;
                return true;
            }
        });

        return room;
    }

    protected setRoomType(roomType: number): void {
        console.log("setRoomType------>", PDKGameConfig.roomList);
        let visibleRooms: any[] = PDKGameConfig.roomList.filter((item: any) => {
            return item.roomType == roomType;
        });
        visibleRooms.sort(function (r1, r2) { return r1.roomID - r2.roomID; })
        this._roomList = visibleRooms;
        this.dealRoomList();
        this._gameProvider.source = this._roomList;
    }


    protected dealRoomList(): void {

    }


    public static onSelGame(info: any, bJuseSet: boolean = false): void {
        this._instance.setWillToGame(info);

        if (bJuseSet) {
            return;
        }

        let roominfo = PDKGameConfig.getRoomConfigById(info.gameId);
        console.log("_onSelectRoom", roominfo);
        PDKSceneGameSel.onSelGame(roominfo, true);
        pdkServer.checkReconnect();

        console.log("_onSelGame------------------->", info);
    }

    beforeShow(params: any): void {
        super.beforeShow(params);
        this._enableListeners(true);
    }

    beforeHide(): void {
        super.beforeHide();
        this._enableListeners(false);
    }

    onShow(): void {
        super.onShow();
        pdkServer.getPlayersAmount();
        this.setRoomType(1);
    }
}