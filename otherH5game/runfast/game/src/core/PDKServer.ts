/**
 * Created by 20151016 on 2015/11/24.
 *
 * 服务器接口
 */
import ProtoBuf = dcodeIO.ProtoBuf;
import ByteArray = egret.ByteArray;
import Endian = egret.Endian;

class PDKServer extends egret.EventDispatcher {
	protected _sid: number = 0;
	public frozen: boolean = false;

	protected _clientId: number = 1;
	protected _session: number = 0;
	protected _uid: number;
	public _isInDDZ: boolean = false;
	public _isFirstFromDDZ: boolean = false;
	public _isReconnected: boolean = false;
	public _reconnectedSession: number = 0;
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
	private _otherIns: PDKOtherGameManager;
	roomInfo: any;
	seatid: number;

	showLogs: boolean = DEBUG;

	private logList: any[] = [
		/.*?/
	];

	private _noConsole(): void {
		console.log = function () { };
		console.warn = function () { };
		console.error = function () { };
	}

	constructor() {
		super();
		let _pdk_nativeBridge = PDKalien.Native.instance;
		if (!_pdk_nativeBridge.isNative) {
			let params: any = _pdk_nativeBridge.getUrlArg();
			this._showLogToScreen = params.showLog == '1';
			this.showLogs = this._showLogToScreen || DEBUG;
			// this.showLogs = true;
			if (!this.showLogs) {
				this._noConsole();
			}
		} else {
			this._showLogToScreen = false;
			this._noConsole();
		}
	}

	/**
	 * 准备服务
	 */
	ready(): void {
		this._protoBuilderMap = {
			user: ProtoBuf.loadProto(RES.getRes('runfast_user_proto')),
			game: ProtoBuf.loadProto(RES.getRes('runfast_game_proto')),
		};


		this._otherIns = PDKOtherGameManager.instance;
		this._protoIDs = PDKProtoIDs.getMap();

		this._heartTimer = new egret.Timer(2000);
		this._heartTimer.addEventListener(egret.TimerEvent.TIMER, this.onHeartTimer, this);

		//this._serverTimer = new egret.Timer(1000);
		//this._serverTimer.addEventListener(egret.TimerEvent.TIMER, this.onServerTimer, this);

		//APP 切换到后台后主动发心跳
		PDKalien.Native.instance.addEventListener('HEART_BEAT', this.onHeartBeat, this);
	}

	private prepareSocket(): egret.WebSocket {
		let socket: egret.WebSocket = this._socket;
		if (this._socket) {
			this.close(false);
		}

		socket = this._socket = new egret.WebSocket();
		socket.type = egret.WebSocket.TYPE_BINARY;

		return socket;
	}

	private onHeartBeat(event: egret.Event): void {
		if (this.showLogs) {
			console.log('on HEART_BEAT');
		}
		this.sendHeartPackage();
	}

	/**
	 * 移除所有的监听
	 */
	private _removeAllSocketListener(): void {
		if (this._socket) {
			this._socket.removeEventListener(egret.Event.CONNECT, this.onConnect, this);
			this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
			this._socket.removeEventListener(egret.Event.CLOSE, this.onClose, this);
			this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);
		}
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
		PDKGameConfig.getServerUrl(uid, (response: any) => {
			if (response.code == 0) {
				egret.setTimeout(this.connect, this, 200);
			} else {
				PDKToast.show(PDKlang.loginError[501]);
			}

			if (callback) {
				callback(response.code);
			}
		}, onError)

	}

	/**
	 * 连接服务器
	 */
	connect(): void {
		this.prepareSocket();

		//PDKGameConfig.SERVER_URL = "ws://39.108.158.211:9001/ws";
		//PDKGameConfig.SERVER_URL = "wss://sgpdk-agent3.16w.com:19001/ws";//38
		//PDKGameConfig.SERVER_URL = "wss://sgpdk-agent2.16w.com:19001/ws";//211

		this._socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
		this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
		this._socket.connectByUrl(PDKGameConfig.SERVER_URL);
	}

	/**
	 * 关闭连接
	 */
	close(doAfterClose: boolean = true): void {
		if (!this.connected) {
			return;
		}

		this._removeAllSocketListener();

		//this._closeByUser = true;
		this._socket.readBytes(new ByteArray());
		this._socket.close();
		this._socket = null;
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
		if (this.showLogs) {
			console.log('Server onConnect=============>');
		}
		this._connected = true;

		socket.removeEventListener(egret.Event.CONNECT, this.onConnect, this);
		socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
		socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);

		this._kickOut = false;
		this.dispatchEventWith(PDKEventNames.CONNECT_SERVER);
	}

	private onError(event: egret.IOErrorEvent): void {
		let socket: egret.WebSocket = event.target;

		if (this.showLogs) {
			console.log('Server onError=============>');
		}
		this.dispatchEventWith(PDKEventNames.SERVER_ERROR);
	}

	/**
	 * 当连接被断开
	 * @param event
	 */
	private onClose(event: egret.Event): void {
		let socket: egret.WebSocket = event.target;
		if (this.showLogs) {
			console.log('Server onClose=============>');
		}
		socket.removeEventListener(egret.Event.CLOSE, this.onClose, this);

		this.afterClose();
		PDKalien.Dispatcher.dispatch(PDKEventNames.SERVER_CLOSE);
	}

	public get kickOut(): boolean {
		return this._kickOut;
	}

	private afterClose(): void {
		if (!this._connected) {
			return;
		}
		this._connected = false;

		this._heartTimer.stop();
		//this._serverTimer.stop();

		if (!this._kickOut && PDKalien.PDKSceneManager.instance.currentSceneName != PDKSceneNames.LOGIN) {
			PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_DISCONNECT, { content: PDKlang.disconnect_server });
		}

		if (PDKalien.PDKSceneManager.instance.currentSceneName != PDKSceneNames.LOGIN) {
			PDKalien.PopUpManager.instance.removeAllPupUp();
		}
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
		if (this.showLogs) {
			console.log("send:" + message + " " + JSON.stringify(message));
		}
		let body: egret.ByteArray = new egret.ByteArray(message.encodeAB());

		if (this._showLogToScreen) {
			PDKalien.Dispatcher.dispatch(PDKEventNames.LOG, 'send: ' + name + ' ' + JSON.stringify(data));
		}
		if (this._isInDDZ) {
			this.ddzDispatchEvent(0, this._protoIDs[name], body);
			return;
		}
		this.sendDataByProtoId(this._protoIDs[name], body);
	}

	/**
	 * 根据协议ID来发送数据
	 */
	public sendDataByProtoId(_protoID: number, data: egret.ByteArray): void {
		if (!data) return;

		if (this.showLogs) {
			console.log("sendData:" + _protoID);
		}
		let pkg: egret.ByteArray = new egret.ByteArray();
		pkg.writeUnsignedShort(data.length + 2);
		pkg.writeUnsignedShort(_protoID);
		pkg.writeBytes(data);

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
		let bytes: egret.ByteArray = new egret.ByteArray();
		this._socket.readBytes(bytes);
		if (bytes.length < 4) {
			//PDKReportor.instance.reportCodeError("socket data length < 4 " + bytes.toString());
			return;
		}
		//不是单款模式
		if (this._isInDDZ) {
			let bytes: egret.ByteArray = new egret.ByteArray();
			this._socket.readBytes(bytes);
			let len: number = bytes.readUnsignedShort();
			let nameId = bytes.readUnsignedShort();
			this._parseBytes(nameId, len, bytes);
			return;
		}

		let len: number = bytes.readUnsignedShort();
		let nameId = bytes.readUnsignedShort();
		if (nameId < 10 && nameId != 2) {
			if (this.showLogs) {
				console.log('get:[' + len + '] ' + nameId);
			}
			if (this._showLogToScreen) {
				PDKalien.Dispatcher.dispatch(PDKEventNames.LOG, 'get: ' + nameId);
			}
		}
		switch (nameId) {
			case 0://登录成功
				this.onHeartTimer();
				this._heartTimer.start();
				this.dispatchEventWith(PDKEventNames.USER_LOGIN_RESPONSE, false, { code: 0 });
				break;
			case 1://登录失败
				let errorId: number = parseInt(bytes.readUTFBytes(bytes.bytesAvailable));

				if (this.showLogs) console.log('login failed. errorId:', errorId);
				this.dispatchEventWith(PDKEventNames.USER_LOGIN_RESPONSE, false, { code: 1, errorId });
				break;
			case 2://心跳包
				//			    console.log("收到心跳");
				if (this._heartTimeout) {
					egret.clearTimeout(this._heartTimeout);
					this._heartTimeout = null;
				}
				this._lastHeart = this.tsLocal;
				let _idx = bytes.position;
				let tsServer: number = bytes.readInt();
				bytes.position = _idx;
				this.tsServerOffset = this.tsLocal - tsServer;
				//console.log('on pdkServer tsServer:' + this.tsServer);
				/*if (!this._serverTimer.running) {
					this._serverTimer.start();
					this.checkDate(false);
				}*/
				this._otherIns.onSocketData(nameId, len, bytes);
				break;
			default:
				let name: string = this._protoIDs[nameId];
				if (!name) {
					console.log('没有ID为' + nameId + '的协议!');
					let body: egret.ByteArray = new egret.ByteArray(bytes.buffer);
					this._otherIns.onSocketData(nameId, len, bytes);
					return;
				}

				let index: number = name.indexOf('.');
				let module: string = name.substring(0, index);
				let action: string = name.substring(index + 1);

				//let id = bytes.readUnsignedInt();
				//console.log('%s callId:%d', name, id);

				let body: egret.ByteArray = new egret.ByteArray();
				let bytesIdx = bytes.position;
				bytes.readBytes(body);
				bytes.position = bytesIdx;

				let newBytes = null;
				if (this._otherIns.isRunOtherGame()) {
					newBytes = bytes;
				}
				let Message = this._protoBuilderMap[module].build(name);
				let message = Message.decode(body['buffer']);
				if (this.showLogs) {
					console.log("recv:" + message + " " + JSON.stringify(message));
				}
				let acceptable: boolean = true;
				if (module == 'game' && action != 'SetSession') {//game开头的协议需要过滤session
					acceptable = this._session == message.session;
				}

				/*let color: string = !this.frozen && acceptable ? '#d0c400' : '#BBBBBB';

				if (this.showLogs && !this.frozen && this.inShowList(name)) {
					if (PDKalien.Native.instance.isNative) {
						//						console.log('get:' + len + ' ' + nameId + ' ' + name + ' ' + JSON.stringify(message));
					} else {
						//						console.log('%cget:', 'color:' + color, len, nameId, name, message);
					}
				}*/
				if (this._showLogToScreen) {
					PDKalien.Dispatcher.dispatch(PDKEventNames.LOG, 'get: ' + name);
				}

				if (!this.frozen && acceptable) {
					if (this.needCache) {
						if (this.exception && this.exception.indexOf(name) > -1) {
							this.beforeDispatchMessage(name, message);
							this.dispatchEventWith(name, false, message);
							if (this._otherIns.isRunOtherGame()) {
								if (this._otherIns.isInOtherProtoListen(nameId) || this._otherIns.isListenAllProto()) {
									this._otherIns.onSocketData(nameId, len, newBytes)
								}
							}
						}
						else {
							this.cacheList.push([name, message]);
							return;
						}
					}
					else {
						this.beforeDispatchMessage(name, message);
						this.dispatchEventWith(name, false, message);
						if (this._otherIns.isRunOtherGame()) {
							if (this._otherIns.isInOtherProtoListen(nameId) || this._otherIns.isListenAllProto()) {
								this._otherIns.onSocketData(nameId, len, newBytes)
							}
						}
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
			case PDKEventNames.GAME_SET_SESSION:
				this._session = message.session;
				// pdkServer._reconnectedSession = message.session
				break;
			case PDKEventNames.USER_CHECK_RECONNECT_REP:
				if (message.roomid > 0) {
					this._session = message.session;

					this.roomInfo = PDKGameConfig.getRoomConfig(message.roomid);
					//zhu 暂时去掉 服务器下发房间信息错误监听
					/*if(!this.roomInfo || !this.roomInfo.roomID || !this.roomInfo.roomType){
						PDKwebService.postError(PDKErrorConfig.REPORT_ERROR,"Server beforeDispatchMessage=>"+ version + "|uuid" + PDKwebService.uuid +"|" +JSON.stringify(message) + JSON.stringify(PDKGameConfig.roomList));
					}*/
				}
				break;
			case PDKEventNames.GAME_USER_ONLINE:
				if (this._uid == message.uid) {
					this.seatid = message.seatid;
				}
				break;
			case PDKEventNames.USER_NOTIFY_KICK_OUT:
				//",该账号已在其他地方登录!,非法操作，已经断开!,非法操作，已经断开!"
				this._kickOut = true;
				if (PDKalien.PDKSceneManager.instance.currentSceneName != PDKSceneNames.LOGIN) {
					let data: any = { content: PDKlang.disconnect_kick_out[message.reason] };
					//reason = 1 被挤下线, reason = 2 解码失败， reason = 3 超时 , reason = 4 被锁定
					if (message.reason == 4 || message.reason == 1) {
						data.button = PDKlang.confirm;
						PDKalien.Dispatcher.dispatch(PDKEventNames.ACCOUNT_ERROR, data);
					} else if (message.reason == 5) { //游戏服务器更新
						PDKalien.Dispatcher.dispatch(PDKEventNames.SERVER_HASUPDATE);
					} else {
						PDKalien.Dispatcher.dispatch(PDKEventNames.SHOW_DISCONNECT, data);
					}
				}
				break;
			case PDKEventNames.GAME_GAME_END:
				//this.resetSession();
				break;

			case PDKEventNames.USER_OPERATE_REP:
				PDKShareImageManager.instance.onUserOperateRep(message);
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
		let now: Date = PDKalien.TimeUtils.tsToDate(this.tsServer);
		let day: number = now.getDate();
		if (this._today != day) {
			this._today = day;

			if (dispatch) {  //零点逻辑
				PDKalien.Dispatcher.dispatch(PDKEventNames.CLOCK_0);
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
	 * 获取服务器当前的时间戳,单位毫秒
	 */
	getServerStamp(): number {
		return this.tsServer * 1000;
	}

	/**
	 * 服务器时间对象
	 * @returns {Date}
	 */
	get serverDate(): Date {
		return PDKalien.TimeUtils.tsToDate(this.tsServer);
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
		if (this.showLogs) {
			console.log('心跳接收超时,主动关闭连接.');
		}

		this.close();
		PDKMainLogic.instance.stop();
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
		if (PDKalien.Native.instance.isNative) {
			if (egret.Capabilities.os == 'Android') {
				_platformId = 2;
			}
			else if (egret.Capabilities.os == 'iOS') {
				_platformId = 3;
			}
		}
		this._uid = parseInt(uid);
		let params = [
			this._uid,
			1,
			token,
			PDKwebService.uuid,
			PDKEnvironment.channel_id,
			_platformId,//平台ID
			// PDKMainLogic.instance.ip ? PDKMainLogic.instance.ip : 0,
			// PDKMainLogic.instance.longitude ? PDKMainLogic.instance.longitude : 0,
			// PDKMainLogic.instance.latitude ? PDKMainLogic.instance.latitude : 0,
		].join(':');

		let ba: egret.ByteArray = new egret.ByteArray();
		ba.writeUnsignedShort(0);
		ba.writeUTFBytes(params);
		this._socket.writeBytes(ba);
		this._socket.flush();

		if (this.showLogs) {
			console.log("Server login===============>", params);
		}
	}

	/**
	 * 检查重连
	 */
	checkReconnect(): void {
		this.send(PDKEventNames.USER_CHECK_RECONNECT_REQ, {});
	}

	/**
	 * 请求重连
	 */
	reconnect(result: number): void {
		if (this.showLogs) {
			console.log('Server: reconnect===============>', result);
		}
		// console.log("reconnect------>", this._isInDDZ, this._isReconnected, this._reconnectedSession);
		// if (this._isInDDZ && this._isReconnected && this._reconnectedSession) {
		// 	this.send(PDKEventNames.USER_RECONNECT_TABLE_REQ, {
		// 		result,
		// 		index: 0,
		// 		session: this._reconnectedSession,
		// 	});
		// }
		// else {
		this.send(PDKEventNames.USER_RECONNECT_TABLE_REQ, {
			result,
			index: 0,
			session: this._session,
		});
		// }
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
	getRoomId(): number {
		if (this.roomInfo && this.roomInfo.roomID) {
			return this.roomInfo.roomID
		}
		return null;
	}

	/**
	 * 获取当前的桌子号
	 */
	getTableId(): number {
		if (this.roomInfo && this.roomInfo.tableId) {
			return this.roomInfo.tableId
		}
		return null;
	}

	protected _ddzDispatcher: egret.EventDispatcher = null;

	initFromParams(params: any) {
		if (!params) return;
		if (!params.data) {
			this._isFirstFromDDZ = true;
		}
		else {
			let data = params.data;
			if (!data.action) {
				this._isFirstFromDDZ = true;
			}
			else if (data.action == "reconnect") {
				this._isReconnected = true;
			}

			// if (data.session) {
			// 	this._reconnectedSession = data.session;
			// }
		}
		this._isInDDZ = true;
		// console.log("initFromParams------>", this._isInDDZ, this._isReconnected, this._reconnectedSession);

		this._uid = params.serverUid;
		this._ddzDispatcher = params.dispatcher;
		this._ddzDispatcher.addEventListener("RECV_SOCKET_DATA", pdkServer.onDDZSocketData, pdkServer);
		this._ddzDispatcher.addEventListener("MY_USER_INFO_UPDATE", pdkServer._myUserInfoDataUpdata, pdkServer);
		// pdkServer.ddzDispatchEvent(1, '', { type: 2, shopFlag: flag });
		pdkServer.ddzDispatchEvent(1, '', {
			type: 6,
			protoIDS: {
				['user.LotteryRedcoinRep']: { "just": true },
			}
		});
		// this._ddzDispatcher.dispatchEvent(6)
	}

	/**
	 * 接入斗地主后会游戏的协议会通知此函数
	 */
	public onDDZSocketData(event: egret.Event): void {
		let data = event.data;
		// console.log('==================>>>>>>>> onDDZSocketData1', data);
		if (!data || !data.byteArray || !data.nameId) return;
		this._parseBytes(data.nameId, data.len, data.byteArray);
	}

	private _myUserInfoDataUpdata(e: egret.TouchEvent): void {
		console.log("_myUserInfoDataUpdata-----in------>", e.data)
		// PDKMainLogic.instance.selfData = e.data;
		PDKalien.PDKUtils.injectProp(PDKMainLogic.instance.selfData, e.data);
	}

	/**
	 * 解析包体
	 */
	private _parseBytes(nameId: number, len: number, bytes: egret.ByteArray): void {
		// console.log("_parseBytes====================>" + len + ', ' + nameId);
		if (!this._protoIDs) return;

		if (!bytes) return;
		if (nameId < 10 && nameId != 2) {
			if (this.showLogs) {
				if (PDKalien.Native.instance.isNative) {
					console.log('222get:[' + len + '] ' + nameId);
				} else {
					console.log('222get:[%d] %d', len, nameId);
				}
			}
			if (this._showLogToScreen) {
				PDKalien.Dispatcher.dispatch(PDKEventNames.LOG, 'get: ' + nameId);
			}
		}
		switch (nameId) {
			case 0://登录成功
				this.onHeartTimer();
				this._heartTimer.start();
				this.dispatchEventWith(PDKEventNames.USER_LOGIN_RESPONSE, false, { code: 0 });
				break;
			case 1://登录失败
				if (this.showLogs) console.log('222login failed.');
				let errorId: number = parseInt(bytes.readUTFBytes(bytes.bytesAvailable));
				this.dispatchEventWith(PDKEventNames.USER_LOGIN_RESPONSE, false, { code: 1, errorId });
				break;
			case 2://心跳包				
				// console.log("收到心跳");
				if (this._heartTimeout) {
					egret.clearTimeout(this._heartTimeout);
					this._heartTimeout = null;
				}
				this._lastHeart = this.tsLocal;
				let _idx = bytes.position;
				let tsServer: number = bytes.readInt();
				bytes.position = _idx;
				this.tsServerOffset = this.tsLocal - tsServer;
				this._otherIns.onSocketData(nameId, len, bytes);
				break;
			default:
				let name: string = this._protoIDs[nameId];
				if (!name) {
					console.log('222没有ID为' + nameId + '的协议!');
					break;
				}

				let index: number = name.indexOf('.');
				let module: string = name.substring(0, index);
				let action: string = name.substring(index + 1);

				let body: egret.ByteArray = new egret.ByteArray();
				bytes.readBytes(body);
				let Message = this._protoBuilderMap[module].build(name);
				if (!Message) {
					return;
				}
				let message = Message.decode(body['buffer']);

				let acceptable: boolean = true;

				let color: string = !this.frozen && acceptable ? '#d0c400' : '#BBBBBB';
				console.log('name=' + name + ' msg=' + JSON.stringify(message));

				if (this.showLogs && !this.frozen && this.inShowList(name)) {
					if (PDKalien.Native.instance.isNative) {
						//						console.log('get:' + len + ' ' + nameId + ' ' + name + ' ' + JSON.stringify(message));
					} else {
						//						console.log('%cget:', 'color:' + color, len, nameId, name, message);
					}
				}
				if (this._showLogToScreen) {
					PDKalien.Dispatcher.dispatch(PDKEventNames.LOG, 'get: ' + name);
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
	/**
     * 接入到斗地主中派发消息给斗地主模块
     */
	public ddzDispatchEvent(type: number, protoID: string, data: any): void {
		if (this._ddzDispatcher) {
			if (type == 0) {
				var sendData = { type: type, protoID: protoID, byteArray: data };
				console.log('==================>>>>>>>> ddzDispatchEvent type:' + type + ', data:' + sendData);
				this._ddzDispatcher.dispatchEventWith("RunFastMain", false, sendData);
			} else {
				this._ddzDispatcher.dispatchEventWith("RunFastMain", false, data);
			}
		}
	}
}