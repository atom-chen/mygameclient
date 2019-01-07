/**
 * Created by rockyl on 16/3/29.
 *
 * 频道页基类
 */

class CCDDZPageChannelBase extends CCalien.NavigationPage {
	protected listContainer:eui.Scroller;
	protected list:eui.List;
	protected _dataProvide:eui.ArrayCollection;
	protected _roomList:any[];

	selectedRoom:any;

	constructor() {
		super();

		this.init();
	}

	protected init():void {

	}

	createChildren():void {
		super.createChildren();

		this.list.dataProvider = this._dataProvide = new eui.ArrayCollection();
	}

	protected addListeners():void{
		this.list.addEventListener(egret.Event.CHANGE, this.selectRoom, this);
	}

	protected removeListeners():void{
		this.list.removeEventListener(egret.Event.CHANGE, this.selectRoom, this);
	}

	protected getRoomById(id:number):any{
		let room = null;
		this._roomList.some((r:any)=>{
			if(r.roomID == id){
				room = r;
				return true;
			}
		});

		return room;
	}

	protected selectRoom(event:egret.Event):void{		
		this.selectedRoom = this.list.selectedItem;		
		console.log("selectRoom-------------->", this.selectedRoom);
		egret.callLater(()=>{
			this.list.selectedIndex = -1;
		}, this);
	}

	protected setRoomType(roomType:number):void{
		let visibleRooms:any[] = CCGlobalGameConfig.roomList.filter((item:any) => {
			return item.roomType == roomType;
		});
		visibleRooms.sort(function (r1, r2) { return r1.roomID - r2.roomID; })
		this._roomList = visibleRooms;
		this.dealRoomList();
		this._dataProvide.source = this._roomList;
	}

	protected setRoomList(roomList:any):void{
		this._roomList = roomList;
		this._dataProvide.source = this._roomList;
	}

	protected dealRoomList():void{

	}

	beforeShow(action:string, params:any):void {
		this.selectedRoom = {}; //需要清空选择的房间信息，否则会出现前后台切换进入游戏
		this.addListeners();
	}

	beforeHide(action:string, params:any = null):void {
		this.removeListeners();
	}
}