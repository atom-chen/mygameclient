/**
 * Created by 20151016 on 2015/11/24.
 *
 * 服务器接口
 */
import ProtoBuf = dcodeIO.ProtoBuf;
import ByteArray = egret.ByteArray;
import Endian = egret.Endian;

class CCServer extends egret.EventDispatcher {
	protected _sid: number = 0;
	public frozen: boolean = false;

	protected _clientId: number = 1;
	protected _session: number = 0;
	protected _uid: number;
	protected _id: string;
	protected _pwd: string;


	public _isInDDZ: boolean = false;
	public _isFirstFromDDZ: boolean = false;

	protected _token: string;
	protected _socket: egret.WebSocket;
	protected _showLogToScreen: boolean;

	protected _protoBuilderMap: any;
	protected _protoIDs: any;

	public tsServerOffset: number;

	protected _sendHeartTimer: egret.Timer;
	protected _serverTimer: egret.Timer;
	protected _today: number;
	protected _connected: boolean;

	protected _kickOut: boolean;

	public playing: boolean;
	public isMatch: boolean;
	public isPersonalGame: boolean;
	public isCoupleGame: boolean;
	private _otherIns: CCDDZOtherGameManager;
	roomInfo: any;
	seatid: number;

	showLogs: boolean = DEBUG;
	private _mustSolve = [];

	private logList: any[] = [
		/.*?/
	];

	public setMustSolveList(infos): void {
		infos = infos || [];
		this._mustSolve = infos;
	}

	private _noConsole(): void {
		console.log = function () { };
		console.warn = function () { };
		console.error = function () { };
	}

	constructor() {
		super();
		if (!CCalien.Native.instance.isNative) {
			let params: any = CCalien.Native.instance.getUrlArg();
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
			user: ProtoBuf.loadProto(RES.getRes('ccuser_proto')),
			game: ProtoBuf.loadProto(RES.getRes('ccgame_proto')),
		};


		this._otherIns = CCDDZOtherGameManager.instance;
		this._protoIDs = CCDDZProtoIDs.getMap();


		//this._serverTimer = new egret.Timer(1000);
		//this._serverTimer.addEventListener(egret.TimerEvent.TIMER, this.onServerTimer, this);
		this._initSendHeartTimer();
		this._initRecvHeartTimeOut();
		//APP 切换到后台后主动发心跳
		CCalien.Native.instance.addEventListener('HEART_BEAT', this.onHeartBeat, this);
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
		CCGlobalGameConfig.getServerUrl(uid, (response: any) => {
			if (response.code == 0) {
				egret.setTimeout(this.connect, this, 200);
			} else {
				CCDDZToast.show(lang.loginError[501]);
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

		this._socket.addEventListener(egret.Event.CONNECT, this.onConnect, this);
		this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
		this._socket.connectByUrl(CCGlobalGameConfig.SERVER_URL);
	}

	/**
	 * 关闭连接
	 */
	close(doAfterClose: boolean = true): void {
		if (!this._socket) {
			return;
		}
		this._removeTimersAndEvents();
		this._socket.readBytes(new ByteArray());
		this._socket.close();
		this._socket = null;
		this.afterClose();
	}

	private _stopSendHeartTimer(): void {
		if (this._sendHeartTimer) {
			this._sendHeartTimer.stop();
		}
	}

	/**
	 * 清除心跳
	 */
	private _clearRecvHeartTimeout(): void {
		if (this._recvHeartTimeout) {
			this._recvHeartTimeout.stop();
		}
	}

	/**
	 * 当连接成功
	 * @param event
	 */
	private onConnect(event: egret.Event): void {
		let socket: egret.WebSocket = event.target;
		if (this.showLogs) {
			console.log('CCServer onConnect=============>');
		}
		this._connected = true;

		socket.removeEventListener(egret.Event.CONNECT, this.onConnect, this);
		socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
		socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);

		this._kickOut = false;
		this.dispatchEventWith(CCGlobalEventNames.CONNECT_SERVER);
	}

	private _removeTimersAndEvents(): void {
		this._removeAllSocketListener();
		this._stopSendHeartTimer();
		this._clearRecvHeartTimeout();
	}

	private onError(event: egret.IOErrorEvent): void {
		let socket: egret.WebSocket = event.target;

		if (this.showLogs) {
			console.log('CCServer onError=============>');
		}
		this._removeTimersAndEvents();
		this.dispatchEventWith(CCGlobalEventNames.SERVER_ERROR);
		CCDDZMainLogic.instance.onSocketClose();
	}

	/**
	 * 当连接被断开
	 * @param event
	 */
	private onClose(event: egret.Event): void {
		let socket: egret.WebSocket = event.target;
		console.log('CCServer onClose=============>');
		socket.removeEventListener(egret.Event.CLOSE, this.onClose, this);
		this._removeTimersAndEvents();
		this.afterClose();
		CCDDZMainLogic.instance.stop();
		CCDDZMainLogic.instance.onSocketClose();
	}

	public get kickOut(): boolean {
		return this._kickOut;
	}

	private afterClose(): void {
		this._connected = false;
		//this._serverTimer.stop();
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
			CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.LOG, 'send: ' + name + ' ' + JSON.stringify(data));
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
		if (!data || !this.connected) return;

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
			//CCDDZReportor.instance.reportCodeError("socket data length < 4 " + bytes.toString());
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
				CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.LOG, 'get: ' + nameId);
			}
		}
		if (Number(nameId) != 0 && Number(nameId) != 1 && Number(nameId) != 2)
			console.log("onSocketData--------->", nameId);
		switch (Number(nameId)) {
			case 0://登录成功
				
				let uid: number = parseInt(bytes.readUTFBytes(bytes.bytesAvailable));
				this._uid = uid;
				this.onLoginSucc(uid);
				// this.onLoginSucc();
				break;
			case 1://登录失败
				let errorId: number = parseInt(bytes.readUTFBytes(bytes.bytesAvailable));

				if (this.showLogs) console.log('login failed. errorId:', errorId);
				this.dispatchEventWith(CCGlobalEventNames.USER_LOGIN_RESPONSE, false, { code: 1, errorId });
				break;
			case 2://心跳包
				this._recvHeartTimeout.stop();
				this._lastHeart = this.tsLocal;
				let _idx = bytes.position;
				let tsServer: number = bytes.readInt();
				bytes.position = _idx;
				this.tsServerOffset = this.tsLocal - tsServer;
				this.checkDate(true);
				//console.log('on ccserver tsServer:' + this.tsServer);
				/*if (!this._serverTimer.running) {
					this._serverTimer.start();
					this.checkDate(false);
				}*/
				this._otherIns.onSocketData(nameId, len, bytes);
				break;
			default:
				let name: string = this._protoIDs[nameId];
				if (!name) {
					console.log('ddz没有ID为' + nameId + '的协议!');
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
				} else {
					if (module == "game" && action == "SetSession") {
						this._session = message.session;
					}
				}

				if (this._showLogToScreen) {
					CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.LOG, 'get: ' + name);
				}

				if (!this.frozen && acceptable) {
					let ddzSolve = true;
					let otherSolve = false;
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
						if (this._otherIns.isRunOtherGame()) {
							if (this._otherIns.isInOtherProtoListen(nameId) || this._otherIns.isListenAllProto() || module == 'game') {
								ddzSolve = false;
								otherSolve = true;
							}
						}

						if (module == 'user') {
							if (this._mustSolve.indexOf(name) >= 0) {
								ddzSolve = true;
							}
						}

						if (ddzSolve) {
							this.beforeDispatchMessage(name, message);
							this.dispatchEventWith(name, false, message);
						}

						if (otherSolve) {
							this._otherIns.onSocketData(nameId, len, newBytes)
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
	public startCache(exception: Array<any> = null, cTime: number = -1, call: string = ""): void {
		console.log("cache start=>", call);
		if (exception) {
			this.exception = exception.concat();
		}
		else {
			this.exception = [];
		}
		this.needCache = true;
		this.cacheTime = cTime;
		if (!this.timer)
			this.timer = new egret.Timer(1000);
		this.timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
		this.timer.start();
	}

	public stopCache(call: string = ""): void {
		console.log("cache end=>", call);
		this.needCache = false;
		if (this.timer) {
			this.timer.stop();
			this.timer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
		}
		while (this.cacheList.length > 0) {
			var arr: Array<any> = this.cacheList.shift();
			console.log("will dispatch---->", arr[0]);
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

	private onLoginSucc(uid:number): void {
		this.sendHeartPackage();
		this._sendHeartTimer.start();
		this.dispatchEventWith(CCGlobalEventNames.USER_LOGIN_RESPONSE, false, { code: 0, uid:uid });
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
			case CCGlobalEventNames.GAME_SET_SESSION:
				this._session = message.session;
				break;
			case CCGlobalEventNames.USER_CHECK_RECONNECT_REP:
				if (message.roomid > 0) {
					this._session = message.session;

					this.roomInfo = CCGlobalGameConfig.getRoomConfig(message.roomid);
					//zhu 暂时去掉 服务器下发房间信息错误监听
					/*if(!this.roomInfo || !this.roomInfo.roomID || !this.roomInfo.roomType){
						ccddzwebService.postError(CCGlobalErrorConfig.REPORT_ERROR,"CCServer beforeDispatchMessage=>"+ version + "|uuid" + ccddzwebService.uuid +"|" +JSON.stringify(message) + JSON.stringify(CCGlobalGameConfig.roomList));
					}*/
				}
				break;
			case CCGlobalEventNames.GAME_USER_ONLINE:
				if (this._uid == message.uid) {
					this.seatid = message.seatid;
				}
				break;
			case CCGlobalEventNames.USER_NOTIFY_KICK_OUT:
				//reason = 1 被挤下线, reason = 2 解码失败， reason = 3 超时 , reason = 4 被锁定
				if (message.reason != 3) {
					this._kickOut = true;
				}
				CCDDZMainLogic.instance.onKickOut(message.reason);
				break;
			case CCGlobalEventNames.GAME_GAME_END:
				//this.resetSession();
				break;

			case CCGlobalEventNames.USER_OPERATE_REP:
				CCDDZShareImageManager.instance.onUserOperateRep(message);
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
		let now: Date = CCalien.TimeUtils.tsToDate(this.tsServer);
		let day: number = now.getDate();
		if (this._today != day) {
			this._today = day;

			if (dispatch) {  //零点逻辑
				CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.CLOCK_0);
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
	 * 获取服务器时间戳,单位秒
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
		return CCalien.TimeUtils.tsToDate(this.tsServer);
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
	private _recvHeartTimeout: egret.Timer;
	private _lastHeart: number = 0;

	private _initRecvHeartTimeOut(): void {
		if (!this._recvHeartTimeout) {
			this._recvHeartTimeout = new egret.Timer(1000 * 5);
			this._recvHeartTimeout.addEventListener(egret.TimerEvent.TIMER, this.onRecvHeartTimeOut, this);
		}
		this._recvHeartTimeout.stop();
	}

	private _initSendHeartTimer(): void {
		if (!this._sendHeartTimer) {
			this._sendHeartTimer = new egret.Timer(2000);
			this._sendHeartTimer.addEventListener(egret.TimerEvent.TIMER, this.sendHeartPackage, this);
		}
	}

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
		this._recvHeartTimeout.reset()
	}

	private onRecvHeartTimeOut(): void {
		if (this.showLogs) {
			console.log('心跳接收超时,主动关闭连接.');
		}
		CCDDZMainLogic.instance.stop();
		CCDDZMainLogic.instance.onSocketClose();
	}

	/**
	 * 检测位于后台时间是否超过心跳超时时间
	 */
	public checkEnterForegroundTimeOut(): boolean {
		if (this._lastHeart > 0 && (this.tsLocal - this._lastHeart) > 5) {
			console.log("checkEnterForegroundTimeOut======>", true);
			return true;
		}
		return false;
	}

	/**
	 * 检测位于后台时间是否过长
	 */
	public checkEnterForegroundTimeLong(): boolean {
		if (this._lastHeart > 0 && (this.tsLocal - this._lastHeart) > 20) {
			console.log("checkEnterForegroundTimeLong======>", true, this.tsLocal, this._lastHeart);
			return true;
		}
		return false;
	}

	/**
	 * 登录
	 * @param uid
	 * @param token
	 */
	login(id: string, pwd: string): void {
		// this._token = token;
		this._id = id;
		this._pwd = pwd;

		let _platformId = 1; //H5
		let _platform = egret.Capabilities.os;
		if (CCalien.Native.instance.isNative) {
			if (_platform == 'Android') {
				_platformId = 2;
			}
			else if (_platform == 'iOS') {
				_platformId = 3;
			}
		} else {
			if (_platform == 'iOS' && !CCalien.Native.instance.isAli() && !CCalien.Native.instance.isWXMP) { //手机登录
				_platformId = 3;
			}
		}
		// this._uid = parseInt(uid);
		let params = [
			this._id,
			1,
			this._pwd,
			ccddzwebService.uuid,
			CCDDZEnvironment.channel_id,
			_platformId,//平台ID
			// CCDDZMainLogic.instance.ip ? CCDDZMainLogic.instance.ip : 0,
			// CCDDZMainLogic.instance.longitude ? CCDDZMainLogic.instance.longitude : 0,
			// CCDDZMainLogic.instance.latitude ? CCDDZMainLogic.instance.latitude : 0,
		].join(':');

		let ba: egret.ByteArray = new egret.ByteArray();
		ba.writeUnsignedShort(0);
		ba.writeUTFBytes(params);
		this._socket.writeBytes(ba);
		this._socket.flush();

		if (this.showLogs) {
			console.log("CCServer login===============>", params);
		}
	}

	/**
	 * 检查重连
	 */
	checkReconnect(): void {
		this.send(CCGlobalEventNames.USER_CHECK_RECONNECT_REQ, {});
	}

	/**
	 * 请求重连
	 */
	reconnect(result: number): void {
		if (this.showLogs) {
			console.log('CCServer: reconnect===============>', result);
		}
		this.send(CCGlobalEventNames.USER_RECONNECT_TABLE_REQ, {
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
		}
		this._isInDDZ = true;

		this._uid = params.serverUid;
		this._ddzDispatcher = params.dispatcher;
		this._ddzDispatcher.addEventListener("RECV_SOCKET_DATA", ccserver.onDDZSocketData, ccserver);
		ccserver.ddzDispatchEvent(1, '', {
			type: 6,
			protoIDS: {
				['user.LotteryRedcoinRep']: { "just": true },
			}
		});
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

	/**
	 * 解析包体
	 */
	private _parseBytes(nameId: number, len: number, bytes: egret.ByteArray): void {
		// console.log("_parseBytes====================>" + len + ', ' + nameId);
		if (!this._protoIDs) return;

		if (!bytes) return;
		if (nameId < 10 && nameId != 2) {
			if (this.showLogs) {
				if (CCalien.Native.instance.isNative) {
					console.log('222get:[' + len + '] ' + nameId);
				} else {
					console.log('222get:[%d] %d', len, nameId);
				}
			}
			if (this._showLogToScreen) {
				CCalien.CCDDZDispatcher.dispatch(CCEventNames.LOG, 'get: ' + nameId);
			}
		}
		switch (nameId) {
			case 0://登录成功
				this.dispatchEventWith(CCEventNames.USER_LOGIN_RESPONSE, false, { code: 0 });
				break;
			case 1://登录失败
				if (this.showLogs) console.log('222login failed.');
				let errorId: number = parseInt(bytes.readUTFBytes(bytes.bytesAvailable));
				this.dispatchEventWith(CCEventNames.USER_LOGIN_RESPONSE, false, { code: 1, errorId });
				break;
			case 2://心跳包				
				// console.log("收到心跳");
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
					if (CCalien.Native.instance.isNative) {
						//						console.log('get:' + len + ' ' + nameId + ' ' + name + ' ' + JSON.stringify(message));
					} else {
						//						console.log('%cget:', 'color:' + color, len, nameId, name, message);
					}
				}
				if (this._showLogToScreen) {
					CCalien.CCDDZDispatcher.dispatch(CCEventNames.LOG, 'get: ' + name);
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
				this._ddzDispatcher.dispatchEventWith("CCMain", false, sendData);
			} else {
				this._ddzDispatcher.dispatchEventWith("CCMain", false, data);
			}
		}
	}
}