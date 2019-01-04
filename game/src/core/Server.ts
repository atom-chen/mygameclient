/**
 * Created by 20151016 on 2015/11/24.
 *
 * 服务器接口
 */
import ProtoBuf = dcodeIO.ProtoBuf;
import ByteArray = egret.ByteArray;
import Endian = egret.Endian;

class Server extends egret.EventDispatcher {
	protected _sid: number = 0;
	public frozen: boolean = false;

	protected _clientId: number = 1;
	protected _session: number = 0;
	protected _uid: number;
	protected _token: string;

	protected _id: string;
	protected _pwd: string;

	protected _socket: egret.WebSocket;
	protected _showLogToScreen: boolean;

	protected _protoBuilderMap: any;
	protected _protoIDs: any;

	public tsServerOffset: number;

	protected _sendHeartTimer: number = null;
	protected _serverTimer: number = null;
	protected _today: number;
	protected _connected: boolean;

	protected _kickOut: boolean;

	public playing: boolean;
	public isMatch: boolean;
	public isPersonalGame: boolean;
	public isCoupleGame: boolean;
	private _otherIns:OtherGameManager;
	roomInfo: any;
	seatid: number;

	showLogs: boolean = DEBUG;
	private _mustSolve = [];
	private _heartByte;
	private logList: any[] = [
		/.*?/
	];

	public setMustSolveList(infos):void{
		infos = infos ||[];
		this._mustSolve = infos;
	}

	private _noConsole():void{
		console.log = function(){};
		console.warn = function(){};
		console.error = function(){};
	}

	constructor() {
		super();
		if (!alien.Native.instance.isNative) {
			let params: any = alien.Native.instance.getUrlArg();
			this._showLogToScreen = params.showLog == '1';
			this.showLogs = this._showLogToScreen || DEBUG;
			if(!this.showLogs){
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
			user: ProtoBuf.loadProto(RES.getRes('user_proto')),
			game: ProtoBuf.loadProto(RES.getRes('game_proto')),
		};

		
		this._otherIns = OtherGameManager.instance;
		this._protoIDs = ProtoIDs.getMap();

		this._heartByte = new egret.ByteArray();
		this._heartByte.writeShort(2);
		this._heartByte.writeShort(2);

		//this._serverTimer = new egret.Timer(1000);
		//this._serverTimer.addEventListener(egret.TimerEvent.TIMER, this.onServerTimer, this);
		this._initSendHeartTimer();
		this._initRecvHeartTimeOut();
		//APP 切换到后台后主动发心跳
		alien.Native.instance.addEventListener('HEART_BEAT', this.onHeartBeat, this);
	}

	private prepareSocket(): egret.WebSocket {
		let socket: egret.WebSocket = this._socket;
		if(this._socket){
			this.close(false);
		}
		socket = this._socket = new egret.WebSocket();
		socket.type = egret.WebSocket.TYPE_BINARY;

		return socket;
	}

	private onHeartBeat(event: egret.Event): void {
		if(this.showLogs){
			console.log('on HEART_BEAT');
		}
		this.sendHeartPackage();
	}

	/**
	 * 移除所有的监听
	 */
	private _removeAllSocketListener():void{
		if(this._socket){
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
		GameConfig.getServerUrl(uid, (response: any) => {
			if (response.code == 0) {
				egret.setTimeout(this.connect, this, 200);
			} else {
				Toast.show(lang.loginError[501]);
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
		this._socket.connectByUrl(GameConfig.SERVER_URL);
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

	private _stopSendHeartTimer():void{
		if(this._sendHeartTimer){
			alien.Schedule.stop(this._sendHeartTimer);
		}
	}

	/**
	 * 清除心跳
	 */
	private _clearRecvHeartTimeout():void{
		if (this._recvHeartTimeout) {
			alien.Schedule.stop(this._recvHeartTimeout);
		}
	}

	/**
	 * 当连接成功
	 * @param event
	 */
	private onConnect(event: egret.Event): void {
		let socket: egret.WebSocket = event.target;
		if(this.showLogs){
			console.log('Server onConnect=============>');
		}
		this._connected = true;

		socket.removeEventListener(egret.Event.CONNECT, this.onConnect, this);
		socket.addEventListener(egret.Event.CLOSE, this.onClose, this);
		socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onSocketData, this);

		this._kickOut = false;
		this.dispatchEventWith(EventNames.CONNECT_SERVER);
	}

	private _removeTimersAndEvents():void{
		this._removeAllSocketListener();
		this._stopSendHeartTimer();
		this._clearRecvHeartTimeout();
	}

	private onError(event: egret.IOErrorEvent): void {
		let socket: egret.WebSocket = event.target;
		
		if(this.showLogs){
			console.log('Server onError=============>');
		}
		this._removeTimersAndEvents();
		this.dispatchEventWith(EventNames.SERVER_ERROR);
		MainLogic.instance.onSocketClose();
	}

	/**
	 * 当连接被断开
	 * @param event
	 */
	private onClose(event: egret.Event): void {
		let socket: egret.WebSocket = event.target;
		console.log('Server onClose=============>');
		socket.removeEventListener(egret.Event.CLOSE, this.onClose, this);
		this._removeTimersAndEvents();
		this.afterClose();
		MainLogic.instance.stop();
		MainLogic.instance.onSocketClose();
	}

	public get kickOut():boolean{
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
		if(this.showLogs){
			console.log("send:" + message + " " + JSON.stringify(message));
		}
		let body: egret.ByteArray = new egret.ByteArray(message.encodeAB());

		if (this._showLogToScreen) {
			alien.Dispatcher.dispatch(EventNames.LOG, 'send: ' + name + ' ' + JSON.stringify(data));
		}
		this.sendDataByProtoId(this._protoIDs[name],body);
	}

	/**
	 * 根据协议ID来发送数据
	 */
	public sendDataByProtoId(_protoID:number,data:egret.ByteArray):void{
		if(!data || !this.connected) return;

		if(this.showLogs){
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
		if(bytes.length < 4) {
			//Reportor.instance.reportCodeError("socket data length < 4 " + bytes.toString());
			return;
		}
		let len: number = bytes.readUnsignedShort();
		let nameId = bytes.readUnsignedShort();
		if (nameId < 10 && nameId != 2) {
			if (this.showLogs) {
				console.log('get:[' + len + '] ' + nameId);
			}
			if (this._showLogToScreen) {
				alien.Dispatcher.dispatch(EventNames.LOG, 'get: ' + nameId);
			}
		}	
		switch (Number(nameId)) {
			case 0://登录成功
				this.onLoginSucc();
				break;
			case 1://登录失败
				let errorId: number = parseInt(bytes.readUTFBytes(bytes.bytesAvailable));
				
				if (this.showLogs) console.log('login failed. errorId:',errorId);
				this.dispatchEventWith(EventNames.USER_LOGIN_RESPONSE, false, { code: 1, errorId });
				break;
			case 2://心跳包
				alien.Schedule.stop(this._recvHeartTimeout);
				this._lastHeart = this.tsLocal;
				let _idx = bytes.position;
				let tsServer: number = bytes.readInt();
				bytes.position = _idx;
				this.tsServerOffset = this.tsLocal - tsServer;
				this.checkDate(true);
				//console.log('on server tsServer:' + this.tsServer);
				/*if (!this._serverTimer.running) {
					this._serverTimer.start();
					this.checkDate(false);
				}*/
				this._otherIns.onSocketData(nameId,len,bytes);
				break;
			default:
				let name: string = this._protoIDs[nameId];
				if (!name) {
					console.log('ddz没有ID为' + nameId + '的协议!');
					let body: egret.ByteArray = new egret.ByteArray(bytes.buffer);
					this._otherIns.onSocketData(nameId,len,bytes);
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
				if(this._otherIns.isRunOtherGame()){
					newBytes = bytes;
				}
				let Message = this._protoBuilderMap[module].build(name);
				let message = Message.decode(body['buffer']);
				if(this.showLogs){
					console.log("recv:" + message + " " + JSON.stringify(message));
				}
				let acceptable: boolean = true;
				if (module == 'game' && action != 'SetSession') {//game开头的协议需要过滤session
					acceptable = this._session == message.session;
				}else{
					if(module == "game" && action == "SetSession"){
						this._session = message.session;
					}
				}

				if (this._showLogToScreen) {
					alien.Dispatcher.dispatch(EventNames.LOG, 'get: ' + name);
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
						if(this._otherIns.isRunOtherGame()){
							let otherListern:any = this._otherIns.isInOtherProtoListen(name);
							if (otherListern || this._otherIns.isListenAllProto() || module == 'game'){
								if((otherListern && otherListern.just) || module == 'game'){
									ddzSolve = false;
								}
								otherSolve = true;
							}
						}
						
						if(ddzSolve){
							this.beforeDispatchMessage(name, message);
							this.dispatchEventWith(name, false, message);
						}
						
						if(otherSolve){
							this._otherIns.onSocketData(nameId,len,newBytes)
						}
					}
				}

			//this.checkCallback(id, message);
		}
	}

	private exception: Array<any>;
	private needCache: Boolean;
	private cacheTime: number;
	private timer: number = null;
	private cacheList: Array<any> = [];
	public startCache(exception: Array<any> = null, cTime: number = -1,call:string = ""): void {
		console.log("cache start=>",call);
		if (exception) {
			this.exception = exception.concat();
		}
		else {
			this.exception = [];
		}
		this.needCache = true;
		this.cacheTime = cTime;
		this._stopCacheTimer();
		this.timer = alien.Schedule.setTimeout(this.onTimer, this,1000);
	}

	private _stopCacheTimer():void{
		alien.Schedule.clearTimeout(this.timer);
		this.timer = null;
	}

	public stopCache(call:string = ""): void {
		console.log("cache end=>",call);
		this.needCache = false;
		if (this.timer) {
			this._stopCacheTimer();
		}
		while (this.cacheList.length > 0) {
			var arr: Array<any> = this.cacheList.shift();
			console.log("will dispatch---->",arr[0]);
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

	private onLoginSucc():void{
		this.sendHeartPackage();
		alien.Schedule.start(this._sendHeartTimer);
		this.dispatchEventWith(EventNames.USER_LOGIN_RESPONSE, false, { code: 0 });
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
			case EventNames.GAME_SET_SESSION:
				this._session = message.session;
				break;
			case EventNames.USER_CHECK_RECONNECT_REP:
				if (message.roomid > 0) {
					this._session = message.session;

					this.roomInfo = GameConfig.getRoomConfig(message.roomid);
					//zhu 暂时去掉 服务器下发房间信息错误监听
					/*if(!this.roomInfo || !this.roomInfo.roomID || !this.roomInfo.roomType){
						webService.postError(ErrorConfig.REPORT_ERROR,"Server beforeDispatchMessage=>"+ version + "|uuid" + webService.uuid +"|" +JSON.stringify(message) + JSON.stringify(GameConfig.roomList));
					}*/
				}
				break;
			case EventNames.GAME_USER_ONLINE:
				if (this._uid == message.uid) {
					this.seatid = message.seatid;
				}
				break;
			case EventNames.USER_NOTIFY_KICK_OUT:
        		//reason = 1 被挤下线, reason = 2 解码失败， reason = 3 超时 , reason = 4 被锁定
				if(message.reason != 3){
					this._kickOut = true;
				}
				MainLogic.instance.onKickOut(message.reason);
				break;
			case EventNames.GAME_GAME_END:
				//this.resetSession();
				break;
			
			case EventNames.USER_OPERATE_REP:
				ShareImageManager.instance.onUserOperateRep(message);
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
		let now: Date = alien.TimeUtils.tsToDate(this.tsServer);
		let day: number = now.getDate();
		if (this._today != day) {
			this._today = day;

			if (dispatch) {  //零点逻辑
				alien.Dispatcher.dispatch(EventNames.CLOCK_0);
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
	getServerStamp():number{
		return this.tsServer * 1000;
	}

	/**
	 * 服务器时间对象
	 * @returns {Date}
	 */
	get serverDate(): Date {
		return alien.TimeUtils.tsToDate(this.tsServer);
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
	
	private _heartCount: number = 0;
	private _recvHeartTimeout:number;
	private _lastHeart: number = 0;

	private _initRecvHeartTimeOut():void{
		if(!this._recvHeartTimeout){
			this._recvHeartTimeout = alien.Schedule.setInterval(this.onRecvHeartTimeOut, this, 1000 * 5);
		}
		alien.Schedule.stop(this._recvHeartTimeout);
	}

	private _initSendHeartTimer():void{
		if(!this._sendHeartTimer){
			this._sendHeartTimer = alien.Schedule.setInterval( this.sendHeartPackage, this, 2000);
		}
		alien.Schedule.stop(this._sendHeartTimer);
	}

	sendHeartPackage(): void {
		if (!this.connected) {
			return;
		}
		//        console.log('发心跳');
		this._socket.writeBytes(this._heartByte);
		this._socket.flush();

		this._heartCount++;
		alien.Schedule.reset(this._recvHeartTimeout);
		alien.Schedule.start(this._recvHeartTimeout);
	}

	private onRecvHeartTimeOut(): void {
		if(this.showLogs){
			console.log('心跳接收超时,主动关闭连接.');
		}
		MainLogic.instance.stop();
		MainLogic.instance.onSocketClose();
	}

	/**
	 * 检测位于后台时间是否超过心跳超时时间
	 */
	public checkEnterForegroundTimeOut(): boolean {
		if (this._lastHeart > 0 && (this.tsLocal - this._lastHeart) > 5) {
			console.log("checkEnterForegroundTimeOut======>",true);
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
		if(alien.Native.instance.isNative){
			if (_platform == 'Android'){
				_platformId = 2;
			}
			else if(_platform == 'iOS'){
				_platformId = 3;
			}
		}else{
			if(_platform == 'iOS' && !alien.Native.instance.isAli() && !alien.Native.instance.isWXMP){ //手机登录
				_platformId = 3;
			}
		}
		// this._uid = parseInt(uid);
		let params = [
			this._id,
			1,
			this._pwd,
			webService.uuid,
			Environment.channel_id,
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

		if(this.showLogs){
			console.log("Server login===============>",params);
		}
	}

	/**
	 * 检查重连
	 */
	checkReconnect(): void {
		this.send(EventNames.USER_CHECK_RECONNECT_REQ, {});
	}

	/**
	 * 请求重连
	 */
	reconnect(result: number): void {
		if(this.showLogs){
			console.log('Server: reconnect===============>',result);
		}
		this.send(EventNames.USER_RECONNECT_TABLE_REQ, {
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
}