/**
 * Created by eric.liu on 2017/11/15.
 *
 * 网络
 */

import ProtoBuf = dcodeIO.ProtoBuf;
import ByteArray = egret.ByteArray;
import Endian = egret.Endian;

class FishUserData extends FishUtils.DataStorage {
	private static _instance:FishUserData;
	public static get instance():FishUserData {
		if (this._instance == undefined) {
			this._instance = new FishUserData();
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
}

class FishSocket extends egret.EventDispatcher {
	protected _sid: number = 0;
	public frozen: boolean = false;

	protected _clientId: number = 1;
	protected _session: number = 0;
	protected _uid: number;
	protected _token: string;
	protected _socket: egret.WebSocket;
	protected _showLogToScreen: boolean;

	protected _protoBuilderMap: any;
	protected _protoIDs: any;

	public tsServerOffset: number;

	protected _heartTimer: egret.Timer;
	protected _serverTimer: egret.Timer;
	protected _today: number;
	protected _connected: boolean;

	protected _kickOut: boolean;

	public playing: boolean;
	public isMatch: boolean;
	public isPersonalGame: boolean;
	roomInfo: any;
	seatid: number;

	showLogs: boolean = DEBUG;

	protected _ddzDispatcher:egret.EventDispatcher = null;

	private logList: any[] = [
		/.*?/
	];

	constructor() {
		super();

		// if (!alien.Native.instance.isNative) {
		// 	let params: any = alien.Utils.getUrlParams();
		// 	this._showLogToScreen = params.showLog == '1';
		// } else {
			this._showLogToScreen = false;
		//}
	}

	/**
	 * 准备服务
	 */
	ready(): void {
		this._protoBuilderMap = {
			user: ProtoBuf.loadProto(RES.getRes('fish_user_proto')),
			game: ProtoBuf.loadProto(RES.getRes('fish_game_proto'))
		};

		this._protoIDs = FishProtoIDs.getMap();

		//不是单款模式不需要做心跳处理
		if (!FISH_MODE_INDEPENDENT){
			return;
		} 

		this._heartTimer = new egret.Timer(2000);
		this._heartTimer.addEventListener(egret.TimerEvent.TIMER, this.onHeartTimer, this);

		this._serverTimer = new egret.Timer(1000);
		this._serverTimer.addEventListener(egret.TimerEvent.TIMER, this.onServerTimer, this);

		FishUtils.Native.instance.addEventListener('HEART_BEAT', this.onHeartBeat, this);
	}

	private prepareSocket(): egret.WebSocket {
		let socket: egret.WebSocket = this._socket;
		//if(!this._socket){
		socket = this._socket = new egret.WebSocket();
		socket.type = egret.WebSocket.TYPE_BINARY;
		socket['id'] = ++this._sid;
		//}

		return socket;
	}

	private onHeartBeat(event: egret.Event): void {
		console.log('on HEART_BEAT');
		this.sendHeartPackage();
	}

	/**
	 * 获取连接状态
	 * @returns {egret.WebSocket|boolean}
	 */
	get connected(): boolean {
		return this._socket && this._socket.connected;
	}

	/**
	 * 尝试连接服务器
	 * @param uid
	 * @param callback
	 * @param onError
	 */
	tryConnect(uid: number, callback: Function = null, onError: Function = null): void {
		// GameConfig.getServerUrl(uid, (response: any) => {
		// 	if (response.code == 0) {
				egret.setTimeout(this.connect, this, 200);
		// 	} else {
		// 		Toast.show(lang.loginError[501]);
		// 	}

		// 	if (callback) {
		// 		callback(response.code);
		// 	}
		// }, onError)
	}

	/**
	 * 连接服务器
	 */
	connect(): void {
		//不是单款模式，不需要处理连接
		if (!FISH_MODE_INDEPENDENT) return;
		//webService.postLoginStep(700,GameConfig.SERVER_URL);
		this.prepareSocket();
		//if (this.showLogs) console.log('socket[' + this._socket['id'] + '] connecting to ' + GameConfig.SERVER_URL);

		this._socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
		this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);

		//测试服务器
		//FishUtils.GameConfig.SERVER_URL = 'wss://cwby-agent1.hztangyou.com/ws';	//71
		//FishUtils.GameConfig.SERVER_URL = 'wss://cwby-agent2.hztangyou.com/ws';	//175

		if (RELEASE && FISH_MODE_WXMP) {
			this._socket.connectByUrl(FishUtils.GameConfig.SERVER_URL);
		} else {
			this._socket.connectByUrl(FISH_SERVER_TEST);
		}
	}

	/**
	 * 关闭连接
	 */
	close(doAfterClose: boolean = true): void {
		//不是单款模式，不需要处理连接
		if (!FISH_MODE_INDEPENDENT) return;
		if (!this.connected) {
			return;
		}
		if (this.showLogs) console.log('socket[' + this._socket['id'] + '] closing Server');

		this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
		this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);

		//this._closeByUser = true;
		this._socket.readBytes(new ByteArray());
		this._socket.close();
		if (this._heartTimeout) {
			egret.clearTimeout(this._heartTimeout);
			this._heartTimeout = null;
		}
		if (doAfterClose) {
			this.afterClose();
		}
	}

	/**
	 * 当连接成功
	 * @param event
	 */
	private onConnect(event: egret.Event): void {
		let socket: egret.WebSocket = event.target;
		//		if(this.showLogs) console.log('socket[' + socket['id'] + '] connected!');
		console.log('connected',socket['id'],this._sid);
		//alert('onConnect');
		this._connected = true;

		socket.removeEventListener(egret.Event.CONNECT, this.onConnect, this);
		if (!FISH_MODE_INDEPENDENT) return;

		socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
		socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);

		if (socket['id'] != this._sid) {
			return;
		}
		this._kickOut = false;
		//webService.postLoginStep(800,"serverOnConnect");
		this.dispatchEventWith(FishEvent.CONNECT_SERVER);
	}

	private onError(event: egret.IOErrorEvent): void {
		let socket: egret.WebSocket = event.target;
		
		//webService.postLoginStep(800,"serveronError");
		if (this.showLogs) console.log('socket[' + socket['id'] + '] Server error');
		//alert('socket[' + socket['id'] + '] Server error:' + event);

		if (socket['id'] != this._sid) {
			return;
		}
		this.dispatchEventWith(FishEvent.SERVER_ERROR);
	}

	/**
	 * 当连接被断开
	 * @param event
	 */
	private onClose(event: egret.Event): void {
		let socket: egret.WebSocket = event.target;
		//		if(this.showLogs) console.log('socket[' + socket['id'] + '] Server close');
		console.log('Disconnect');
		//alert("Disconnect");

		socket.removeEventListener(egret.Event.CLOSE, this.onClose, this);

		if (socket['id'] != this._sid) {
			return;
		}

		this.dispatchEventWith(FishEvent.SERVER_CLOSE);
		this.afterClose();
	}

	private afterClose(): void {
		if (!this._connected) {
			return;
		}
		this._connected = false;

		this._heartTimer.stop();
		this._serverTimer.stop();

		// if (!this._kickOut && alien.SceneManager.instance.currentSceneName != SceneNames.LOGIN) {
		// 	alien.Dispatcher.dispatch(EventNames.SHOW_DISCONNECT, { content: lang.disconnect_server });
		// }

		// if (alien.SceneManager.instance.currentSceneName != SceneNames.LOGIN) {
		// 	alien.PopUpManager.instance.removeAllPupUp();
		// }
	}

	/**
	 * 发送消息
	 * @param name
	 * @param data
	 */
	send(name: string, data: any, cb: Function = null): void {
		let head: string = name.substring(0, name.indexOf('.'));
		let Message = this._protoBuilderMap[head].build(name);
		let message: ProtoBuf.Message = new Message(data);
		if(!RELEASE){
			console.log("send:" + message + " " + JSON.stringify(message));
		}
		let body: egret.ByteArray = new egret.ByteArray(message.encodeAB());

		if (this.showLogs && this.inShowList(name)) {
			//if (alien.Native.instance.isNative) {
				//				console.log('send:' + name + ' ' + this._protoIDs[name] + ' ' + JSON.stringify(data));
			//} else {
				//				console.log('%csend:', 'color: #00b909', name, this._protoIDs[name], data);
			//}
		}
		if (this._showLogToScreen) {
			//alien.Dispatcher.dispatch(EventNames.LOG, 'send: ' + name + ' ' + JSON.stringify(data));
		}

		//不是单款模式，通过发消息给大厅，发送消息
		if (!FISH_MODE_INDEPENDENT) {
			this.ddzDispatchEvent(0, this._protoIDs[name], body);
			return;
		}

		let pkg: egret.ByteArray = new egret.ByteArray();
		pkg.writeUnsignedShort(body.length + 2);
		pkg.writeUnsignedShort(this._protoIDs[name]);
		//pkg.writeUnsignedInt(this.addCallback(cb));
		pkg.writeBytes(body);

		this._socket.writeBytes(pkg);

		this._socket.flush();
	}

	private _callId: number = 1000;
	private _callbackMap: any[] = [];
	private addCallback(cb: Function): number {
		let id = this._callId++;
		if (cb) {
			let time = this.tsServer;
			this._callbackMap[id] = {
				id, cb, time
			};
			console.log('addCallback:', id, time);
		}

		return id;
	}

	/**
	 * 当接受到数据
	 * @param event
	 */
	private onSocketData(event: egret.ProgressEvent): void {
		let socket: egret.WebSocket = event.target;

		if (socket['id'] != this._sid) {
			return;
		}

		let bytes: egret.ByteArray = new egret.ByteArray();
		this._socket.readBytes(bytes);

		//不是单款模式
		if (!FISH_MODE_INDEPENDENT) {
			let bytes: egret.ByteArray = new egret.ByteArray();
			this._socket.readBytes(bytes);
			let len: number = bytes.readUnsignedShort();
			let nameId = bytes.readUnsignedShort();
			this._parseBytes(nameId,len,bytes);
			return;
		}

		let len: number = bytes.readUnsignedShort();
		let nameId = bytes.readUnsignedShort();
		if (nameId < 10 && nameId != 2) {
			if (this.showLogs) {
				// if (alien.Native.instance.isNative) {
				// 	console.log('get:[' + len + '] ' + nameId);
				// } else {
					console.log('get:[%d] %d', len, nameId);
				//}
			}
			if (this._showLogToScreen) {
				//alien.Dispatcher.dispatch(EventNames.LOG, 'get: ' + nameId);
			}
		}
		switch (nameId) {
			case 0://登录成功
				this.onHeartTimer();
				this._heartTimer.start();
				this.dispatchEventWith(FishEvent.USER_LOGIN_RESPONSE, false, { code: 0 });
				break;
			case 1://登录失败
				if (this.showLogs) console.log('login failed.');
				let errorId: number = parseInt(bytes.readUTFBytes(bytes.bytesAvailable));
				this.dispatchEventWith(FishEvent.USER_LOGIN_RESPONSE, false, { code: 1, errorId });
				break;
			case 2://心跳包
				//			    console.log("收到心跳");
				if (this._heartTimeout) {
					egret.clearTimeout(this._heartTimeout);
					this._heartTimeout = null;
				}
				this._lastHeart = this.tsLocal;

				let tsServer: number = bytes.readInt();
				this.tsServerOffset = this.tsLocal - tsServer;
				//console.log('on server tsServer:' + this.tsServer);

				if (!this._serverTimer.running) {
					this._serverTimer.start();
					this.checkDate(false);
				}
				break;
			default:
				let name: string = this._protoIDs[nameId];
				if (!name) {
					console.log('没有ID为' + nameId + '的协议!');
					break;
				}

				let index: number = name.indexOf('.');
				let module: string = name.substring(0, index);
				let action: string = name.substring(index + 1);

				//let id = bytes.readUnsignedInt();
				//console.log('%s callId:%d', name, id);

				let body: egret.ByteArray = new egret.ByteArray();
				bytes.readBytes(body);
				let Message = this._protoBuilderMap[module].build(name);
				let message = Message.decode(body['buffer']);
				if(!RELEASE){
					console.log("recv:" + message + " " + JSON.stringify(message));
				}
				let acceptable: boolean = true;
				if (module == 'game' && action != 'SetSession') {//game开头的协议需要过滤session
					acceptable = this._session == message.session;
				}

				let color: string = !this.frozen && acceptable ? '#d0c400' : '#BBBBBB';

				if (this.showLogs && !this.frozen && this.inShowList(name)) {
					//if (alien.Native.instance.isNative) {
						//						console.log('get:' + len + ' ' + nameId + ' ' + name + ' ' + JSON.stringify(message));
					//} else {
						//						console.log('%cget:', 'color:' + color, len, nameId, name, message);
					//}
				}
				if (this._showLogToScreen) {
					//alien.Dispatcher.dispatch(EventNames.LOG, 'get: ' + name);
				}

				if (!this.frozen && acceptable) {
					if (this.needCache) {
						if (this.exception && this.exception.indexOf(name) > -1) {
							this.beforeDispatchMessage(name, message);
							this.dispatchEventWith(name, false, message);
						}
						else {
							this.cacheList.push([name, message]);
							return;
						}
					}
					else {
						this.beforeDispatchMessage(name, message);
						this.dispatchEventWith(name, false, message);
					}
				}

			//this.checkCallback(id, message);
		}
	}

	private exception: Array<any>;
	private needCache: Boolean;
	private cacheTime: number;
	private timer: egret.Timer;
	private cacheList: Array<any> = [];
	public startCache(exception: Array<any> = null, cTime: number = -1): void {
		console.log("开始缓存");
		if (exception) {
			this.exception = exception.concat();
		}
		else {
			this.exception = [];
		}
		//这两条特殊处理      

		this.needCache = true;
		this.cacheTime = cTime;
		if (!this.timer)
			this.timer = new egret.Timer(1000);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
		this.timer.start();
	}
	public stopCache(): void {
		console.log("缓存结束");
		this.needCache = false;
		if (this.timer) {
			this.timer.stop();
			this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
		}
		while (this.cacheList.length > 0) {
			var arr: Array<any> = this.cacheList.shift();
			this.beforeDispatchMessage(arr[0], arr[1]);
			this.dispatchEventWith(arr[0], false, arr[1]);
			if (this.needCache) {
				break;
			}
		}
	}

	private onTimer(e: egret.TimerEvent): void {
		if (this.cacheTime == -1) return;

		for (var i: number = 0; i < this.cacheList.length; i++) {
			if (typeof (this.cacheList[i][1]) == "object") {
				if (this.cacheList[i][1].hasOwnProperty("time")) {
					this.cacheList[i][1].time -= this.cacheTime;
					if (this.cacheList[i][1].time < 0)
						this.cacheList[i][1].time = 0;
				}
				else if (this.cacheList[i][1].hasOwnProperty("timeout")) {
					this.cacheList[i][1].timeout -= this.cacheTime;
					if (this.cacheList[i][1].timeout < 0)
						this.cacheList[i][1].timeout = 0;
				}
			}
			//            else if(typeof(this.cacheList[i][1]) == "string")
			//            {
			//                var s: string = this.cacheList[i][1];
			//                var idx1: number = s.indexOf('"time":');
			//                if(idx1 > 0) {
			//                    var idx2: number = s.indexOf(",",idx1);
			//                    var t: string = s.substr(idx1 + 7,idx2 - idx1 - 7);
			//                    var time: number = Number(t);
			//                    time -= this.cacheTime;
			//                    if(time < 0)
			//                        time = 0;
			//        this.cacheList[i][1] = s.substring(0,idx1) + '"time":' + time + s.substring(idx2,s.length);
			//                }
			//            }

		}
	}

	private checkCallback(id: number, message: any) {
		if (id > 0) {
			let callback = this._callbackMap[id];
			console.log('checkCallback:', id, !!callback);
			if (callback) {
				this._callbackMap.splice(id, 1);

				callback.cb(message);
			}
		}
	}

	private inShowList(name: string): boolean {
		let show: boolean = false;
		this.logList.forEach((item: any) => {
			if (typeof item == 'string') {
				if (item == name) {
					show = true;
				}
			} else {
				if (name.match(item)) {
					show = true;
				}
			}
		});

		return show;
	}

	/**
	 * 在分派消息前调用
	 * @param name
	 * @param message
	 */
	protected beforeDispatchMessage(name: string, message: any): void {
		switch (name) {  //一些特殊处理的协议
			case FishEvent.GAME_SET_SESSION:
				this._session = message.session;
				break;
			case FishEvent.USER_CHECK_RECONNECT_REP:
				if (message.roomid > 0) {
					this._session = message.session;

					//this.roomInfo = FishUtils.GameConfig.getRoomConfig(message.roomid);

					//zhu 暂时去掉 服务器下发房间信息错误监听
					/*if(!this.roomInfo || !this.roomInfo.roomID || !this.roomInfo.roomType){
						webService.postError(ErrorConfig.REPORT_ERROR,"Server beforeDispatchMessage=>"+ version + "|uuid" + webService.uuid +"|" +JSON.stringify(message) + JSON.stringify(GameConfig.roomList));
					}*/
				}
				break;
			case FishEvent.GAME_USER_ONLINE:
				if (this._uid == message.uid) {
					this.seatid = message.seatid;
				}
				break;
			case FishEvent.USER_NOTIFY_KICK_OUT:
				//",该账号已在其他地方登录!,非法操作，已经断开!,非法操作，已经断开!"
				this._kickOut = true;
				// if (alien.SceneManager.instance.currentSceneName != SceneNames.LOGIN) {
					let data: any = { content: langFish.disconnect_kick_out[message.reason] };
					if (message.reason == 4) {
						data.button = langFish.confirm;
					}
					FishUtils.Dispatcher.dispatch(FishEvent.SHOW_DISCONNECT, data);
				// }
				break;
			case FishEvent.GAME_GAME_END:
				//this.resetSession();
				break;
			
			case FishEvent.USER_OPERATE_REP:
				//ShareImageManager.instance.onUserOperateRep(message);
				break;
		}
	}

	/**
	 * 服务器同步时间
	 * @param event
	 */
	private onServerTimer(event: egret.TimerEvent = null): void {
		this.checkDate();
	}

	private checkDate(dispatch: boolean = true): void {
		let now: Date = FishUtils.TimeUtils.tsToDate(this.tsServer);
		let day: number = now.getDate();
		if (this._today != day) {
			this._today = day;

			if (dispatch) {  //零点逻辑
				FishUtils.Dispatcher.dispatch(FishEvent.CLOCK_0);
			}
		}
	}

	/**
	 * 获取本地时间戳
	 */
	get tsLocal(): number {
		return Math.floor(new Date().valueOf() / 1000);
	}

	/**
	 * 获取服务器时间戳
	 * @returns {number}
	 */
	get tsServer(): number {
		return this.tsLocal - this.tsServerOffset;
	}

	/**
	 * 服务器时间对象
	 * @returns {Date}
	 */
	get serverDate(): Date {
		return FishUtils.TimeUtils.tsToDate(this.tsServer);
	}

	/**
	 * 今日零点的时间戳
	 * @returns {number}
	 */
	get tsToday(): number {
		let d: Date = this.serverDate;
		return new Date(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()).valueOf() / 1000;
	}

	/**
	 * 今日零点起的时间戳
	 * @returns {number}
	 */
	get tsNow(): number {
		return this.tsServer - this.tsToday;
	}

	/**
	 * 用户ID
	 * @returns {number}
	 */
	get uid(): number {
		return this._uid;
	}

	/**
	 * 获取token
	 * @returns {string}
	 */
	get token(): string {
		return this._token;
	}

	/**
	 * 心跳包
	 * @param event
	 */
	private onHeartTimer(event: egret.TimerEvent = null): void {
		this.sendHeartPackage();
	}

	private _heartCount: number = 0;
	private _heartTimeout;
	private _lastHeart: number = 0;
	sendHeartPackage(): void {
		if (!this.connected) {
			return;
		}
		//        console.log('发心跳');
		let ba: egret.ByteArray = new egret.ByteArray();
		ba.writeShort(2);
		ba.writeShort(2);
		this._socket.writeBytes(ba);
		this._socket.flush();

		this._heartCount++;

		if (!this._heartTimeout) {
			this._heartTimeout = egret.setTimeout(this.onHeartTimerEnd, this, 5000);
		}
	}

	private onHeartTimerEnd(): void {
		console.log('心跳接收超时,主动关闭连接.');

		this.close();
		//MainLogic.instance.stop();

		FishUtils.Dispatcher.dispatch(FishEvent.SERVER_CLOSE);
	}

	public checkEnterForegroundTimeOut(): boolean {
		if (this._lastHeart > 0 && (this.tsLocal - this._lastHeart) > 5) {
			this.onHeartTimerEnd();
			return true;
		}
		else
			return false;
	}

	/**
	 * 登录
	 * @param uid
	 * @param token
	 */
	login(uid: string, token: string): void {
		this._token = token;

		let _platformId = 1; //H5
		// if(alien.Native.instance.isNative){
		// 	if (egret.Capabilities.os == 'Android'){
		// 		_platformId = 2;
		// 	}
		// 	else if(egret.Capabilities.os == 'iOS'){
		// 		_platformId = 3;
		// 	}
		// }
		this._uid = parseInt(uid);
		let params = [
			this._uid,
			1,
			token,
			//webService.uuid,
			FishUtils.StringUtils.makeRandomString(32),
			FishUtils.Environment.channel_id,
			_platformId,//平台ID
			// MainLogic.instance.ip ? MainLogic.instance.ip : 0,
			// MainLogic.instance.longitude ? MainLogic.instance.longitude : 0,
			// MainLogic.instance.latitude ? MainLogic.instance.latitude : 0,
		].join(':');

		let ba: egret.ByteArray = new egret.ByteArray();
		ba.writeUnsignedShort(0);
		ba.writeUTFBytes(params);
		this._socket.writeBytes(ba);
		this._socket.flush();

		//if (DEBUG) {
			console.log("login:" + params);
		//}
	}

	/**
	 * 检查重连
	 */
	checkReconnect(): void {
		this.send(FishEvent.USER_CHECK_RECONNECT_REQ, {});
	}

	/**
	 * 请求重连
	 */
	reconnect(result: number): void {
		console.log('Server: reconnect');
		this.send(FishEvent.USER_RECONNECT_TABLE_REQ, {
			result,
			index: 0,
			session: this._session,
		});
	}

	/**
	 * 重置session
	 */
	resetSession(): void {
		this._session = 0;
	}

	/**
	 * 获取当前的房间号
	 */
	getRoomId():number{
		if(this.roomInfo && this.roomInfo.roomID){
			return this.roomInfo.roomID
		}
		return null;
	}

	/**
	 * 获取当前的桌子号
	 */
	getTableId():number{
		if(this.roomInfo && this.roomInfo.tableId){
			return this.roomInfo.tableId
		}
		return null;
	}





	/**
     * 接入到斗地主中派发消息给斗地主模块
     */
    public ddzDispatchEvent(type:number, protoID:string, data:any):void{
		if (FISH_MODE_INDEPENDENT) return;
        if (this._ddzDispatcher){
			if (type == 0) {
				var sendData = {type:type, protoID:protoID, byteArray:data};
				//console.log('==================>>>>>>>> ddzDispatchEvent type:' + type + ', data:' + sendData);
            	this._ddzDispatcher.dispatchEventWith("FishMain", false, sendData);
			} else {
				this._ddzDispatcher.dispatchEventWith("FishMain", false, data);
			}
        }
	}

	/**
	 * 接入斗地主后会游戏的协议会通知此函数
	 */
	public onDDZSocketData(event:egret.Event):void{
		let data = event.data;
		//console.log('==================>>>>>>>> onDDZSocketData1',data);
		if(!data || !data.byteArray ||!data.nameId) return;
		this._parseBytes(data.nameId,data.len,data.byteArray);
	}

	/**
	 * 解析包体
	 */
	private _parseBytes(nameId:number,len:number,bytes:egret.ByteArray):void{
		//console.log("onDDZSocketData2 ====================> " + len + ', ' + nameId);
		if(!this._protoIDs) return;

		if(!bytes) return;
		if (nameId < 10 && nameId != 2) {
			if (this.showLogs) {
				if (FishUtils.Native.instance.isNative) {
					console.log('222get:[' + len + '] ' + nameId);
				} else {
					console.log('222get:[%d] %d', len, nameId);
				}
			}
			if (this._showLogToScreen) {
				FishUtils.Dispatcher.dispatch(FishEvent.LOG, 'get: ' + nameId);
			}
		}
		switch (nameId) {
			case 0://登录成功
				this.onHeartTimer();
				this._heartTimer.start();
				this.dispatchEventWith(FishEvent.USER_LOGIN_RESPONSE, false, { code: 0 });
				break;
			case 1://登录失败
				if (this.showLogs) console.log('222login failed.');
				let errorId: number = parseInt(bytes.readUTFBytes(bytes.bytesAvailable));
				this.dispatchEventWith(FishEvent.USER_LOGIN_RESPONSE, false, { code: 1, errorId });
				break;
			case 2://心跳包
				if(!FISH_MODE_INDEPENDENT) {
					return;
				}
				if (this._heartTimeout) {
					egret.clearTimeout(this._heartTimeout);
					this._heartTimeout = null;
				}
				this._lastHeart = this.tsLocal;

				let tsServer: number = bytes.readInt();
				this.tsServerOffset = this.tsLocal - tsServer;
				//console.log('on server tsServer:' + this.tsServer);
				if (!this._serverTimer.running) {
					this._serverTimer.start();
					this.checkDate(false);
				}
				break;
			default:
				let name: string = this._protoIDs[nameId];
				if (!name) {
					console.log('222没有ID为' + nameId + '的协议!');
					break;
				}

				//console.log("onDDZSocketData1====================> " + name + ', ' + nameId);

				let index: number = name.indexOf('.');
				let module: string = name.substring(0, index);
				let action: string = name.substring(index + 1);

				//let id = bytes.readUnsignedInt();
				//console.log('%s callId:%d', name, id);

				// if (action == 'SetSession') {
				// 	return;
				// }

				//console.log('===============>>>>>> module:' + module + ', name:' + name + ', action:' + action);

				let body: egret.ByteArray = new egret.ByteArray();
				bytes.readBytes(body);
				let Message = this._protoBuilderMap[module].build(name);
				if (!Message) {
					return;
				}
				let message = Message.decode(body['buffer']);
				if(!RELEASE || !FISH_MODE_INDEPENDENT){ // TODO 发布时处理注释
					console.log("222recv:" ,name, JSON.stringify(message),this.frozen);
				}
				let acceptable: boolean = true;
				// if (module == 'game' && action == 'SetSession') {//game开头的协议设置session
				// 	this._session = message.session;
				// } else {
				// 	if (module == 'game' && action != 'SetSession') {//game开头的协议需要过滤session
				// 		acceptable = this._session == message.session;
				// 	}
				// }

				let color: string = !this.frozen && acceptable ? '#d0c400' : '#BBBBBB';

				if (this.showLogs && !this.frozen && this.inShowList(name)) {
					if (FishUtils.Native.instance.isNative) {
						//						console.log('get:' + len + ' ' + nameId + ' ' + name + ' ' + JSON.stringify(message));
					} else {
						//						console.log('%cget:', 'color:' + color, len, nameId, name, message);
					}
				}
				if (this._showLogToScreen) {
					FishUtils.Dispatcher.dispatch(FishEvent.LOG, 'get: ' + name);
				}

				if (!this.frozen && acceptable) {
					if (this.needCache) {
						if (this.exception && this.exception.indexOf(name) > -1) {
							this.beforeDispatchMessage(name, message);
							this.dispatchEventWith(name, false, message);
						}
						else {
							this.cacheList.push([name, message]);
							return;
						}
					}
					else {
						this.beforeDispatchMessage(name, message);
						this.dispatchEventWith(name, false, message);
					}
				}

			//this.checkCallback(id, message);
		}
	}
}