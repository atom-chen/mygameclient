module alien {
    let TextMessage:any;
    let VoiceMessage:any;
    let WechatRecorder:any;
    let AMRRecorder:any;
    let wx:any;
    let YIM:any;
    let ERROR_NAME = {
        CallApiFast:'调用接口太频繁',
        // 通用
        NotLoginError: '请先登录',
        InvalidParamError: '无效的参数',
        InvalidLoginError: '无效的登录',
        UsernameOrTokenError: '用户名或token错误',
        LoginTimeoutError: '登录超时',
        ServiceOverloadError: '服务过载，消息传输过于频繁',
        MessageTooLongError: '消息长度超出限制，最大长度1400',
        // 录音
        UnsupportedVoiceFormatError: '不支持的音频格式',
        DeviceNotSupportedError: '设备不支持录音',
        AlreadyReadyError: '已经录过音或加载过音频了，要重新录音请重新 new 一个新实例',
        CanceledError: '已经取消了录音或录音出错了，要重新录音请重新 new 一个新实例',
        NotAllowedError: '没有录音权限',
        RecorderNotStartedError: '没有启动录音却企图完成录音',
        RecorderBusyError: '录音系统正忙，可能正在录音中',
        RecordTooShortError: '录音时长太短',
        WXObjectIsEmptyError: '未传入微信wx对象',
        WXObjectNoConfigError: '微信wx对象尚未初始化',
        WXNoPermissionError: '微信wx对象没有提供录音相关接口权限'
    };

     let getErrorMsg = function(errorName) {
        return ERROR_NAME[errorName] || errorName;
    }

    let E = function(id):any {
        return document.getElementById(id);
    }

    let debugVoice = function(...args):void{
        console.log(args);
    }

    export class Voice {
        private _userInfo:any = {roomId:null};
        private _loginSucc:boolean;
        private _sdk:any = null;
        private _willJoinRoomId:any = null;
        private _userTemplate:any;
        private _curRecordVoice:any;
        private _msgList:any = [];
        private _lastRecordTime:number;
        private static _instance:Voice = null;
        public static get instance():Voice{
             if(this._instance == undefined) {
                this._instance = new Voice();
            }
            return this._instance;
        }
        public init():void{
            TextMessage = window["TextMessage"];
            VoiceMessage = window["VoiceMessage"];
            WechatRecorder = window["WechatRecorder"];
            AMRRecorder = window["AMRRecorder"];
            if(alien.Native.instance.isWXMP){
                wx = window.top["wx"];
            }
            YIM = window["YIM"];
        }

        public setUserInfo(info):void{
            this._userInfo = info;
            this._initSdk(info.yimAppID,info.userId,info.token);
        }
        /**
         * msgObj:{message:{}}
         */
        private _addToMsgList(msgObj):void{
            this._msgList.push(msgObj);
        }

        private _removeFromMsgList(msgObj):void{
            let idx = this._msgList.indexOf(msgObj);
            if(idx != -1){
                this._msgList.splice(idx,1);
            }
        }

        private _onRecvMsg(msgObj):void{
            this._addToMsgList(msgObj);
            if(!msgObj.isFromMe){
                this._debugMsg(msgObj);
            }
        }

        private _debugMsg(msgObj):void{
            if(msgObj){
                switch (msgObj.message.getType()) {
                    case 'text':
                        debugVoice("_debugMsg--text->",msgObj.message.getText());
                        break;
                    case 'voice':
                        let msg = msgObj.message;      
                        // 绑定 msg 的播放和停止事件
                        msgObj.message.on('play', function () {
                            debugVoice("_debugMsg--voice-2-play>", msgObj.serverId);
                        });
                        msgObj.message.on('end-play', function () {
                            debugVoice("_debugMsg--voice-3-playEnd>", msgObj.serverId);
                        });

                        if (msg.isPlaying()) {
                            //msg.stop();
                        } else {
                            msg.play();
                        }
                        debugVoice("_debugMsg--voice-1>",msgObj.message.getDuration());
                        break;
                    default:
                        debugVoice('收到未知消息类型：' + msgObj.message.getType());
                }
            }
        }

        private _initSdk(appKey,userId,token):void{
            if(!appKey|| !userId || !token){
                let sError = "_initSdk----error-->appKey:"+appKey+"userId:"+userId+"token:"+token;
                console.error(sError);
                Reportor.instance.reportCodeError(sError);
                return;
            }

            this._sdk = new YIM({appKey:appKey,useMessageType:[TextMessage,VoiceMessage]});

            // 初始化录音插件
            VoiceMessage.registerRecorder( [WechatRecorder, AMRRecorder] );
            if(alien.Native.instance.isWXMP){
                 // 初始化微信录音功能
                WechatRecorder.setWXObject(wx);
            }
            this._sdk.on('message:*',  (eventName, msgObj) =>{
                debugVoice("message:*============>",msgObj);
                this._onRecvMsg(msgObj);
            });

            this._sdk.on('room.join:*', (eventName, roomId) => {
                debugVoice("room.join:*============>",roomId);
                this._userInfo.roomId = roomId;
            })

            this._sdk.on('room.leave:*', (eventName, roomId) => {
                debugVoice("room.leave:*============>",roomId);
                this._resetData();
            })

            this._sdk.on('room.join-error:*',  (eventName, e, roomId)=> {
                console.error("room.join-error:*============>",e.name);
                this._resetData();
            });

            this._sdk.on('room.leave-error:*',  (eventName, e, roomId)=> {
                console.error("room.leave-error:*============>",e.name);
            });

            this.login(userId,token);
        }

        public login(userId,token,errFunc:Function=null):void{
            this._sdk.login(userId, token).then(()=>{
                this._loginSucc = true;
                if(this._willJoinRoomId){
                    this.joinRoom(this._willJoinRoomId);
                }
            }).catch((e)=>{
                this._loginSucc = false;
                if(errFunc){
                    errFunc('登录失败：' + getErrorMsg(e.name))
                }
            })
        }

        private _resetData():void{
            this.cancelRecord();
            this._userInfo.roomId = null;
            this._willJoinRoomId = null;
        }

        public logout():void{
            this._resetData();
            this._sdk.logout();
        }

        private _isLoginOk():boolean{
            let bOk = false;
            if(this._sdk && this._loginSucc){
                bOk = this._loginSucc;
            }
            return bOk;
        }

        public joinRoom(roomId,errFunc:Function=null):void{
            if(!this._isLoginOk()){
                this._willJoinRoomId = roomId;
                return;
            };
            if(this._userInfo.roomId){
                this.leaveRoom(this._userInfo.roomId);
            }

            this._sdk.joinRoom(roomId).catch((e)=>{
                if(errFunc){
                    errFunc('加入房间失败：' + getErrorMsg(e.name))
                }
            });
        }

        public leaveRoom(roomId,errFunc:Function=null):void{
            this._resetData();
            this._sdk.leaveRoom(roomId).catch((e)=>{
                if(errFunc){
                    errFunc('退出房间失：' + getErrorMsg(e.name))
                }
            });
        }

        public startRecord(errFunc:Function = null):void{
            this.cancelRecord();

            let nCur = new Date().getTime();
            if(this._lastRecordTime){
                let nDiff = alien.Utils.getTimeStampDiff(this._lastRecordTime,nCur,"second");
                if(nDiff < 1){
                    if(errFunc){
                        errFunc(ERROR_NAME.CallApiFast)
                    }
                    return;
                }
            }

            let voice = new VoiceMessage();
            this._curRecordVoice = voice;
            this._lastRecordTime = nCur;
            debugVoice("startRecord------------>");
            voice.startRecord().catch((e) =>{
                console.error("startRecord--------------->",e.name);
                this.cancelRecord();
                if(errFunc){
                    errFunc(getErrorMsg(e.name));
                }
            })
        }

        /**
         * 将会取消掉本次录音并销毁录音数据
         */
        public cancelRecord():void{
            debugVoice("cancelRecord------------>");
            if(this._curRecordVoice){
                this._curRecordVoice.cancelRecord();
            }
            this.stopRecord();
            this._curRecordVoice = null;
        }

        /**
         * 停止录音
         */
        public stopRecord():void{
            if(alien.Native.instance.isWXMP){
                if(wx){
                    wx.stopRecord();
                }
            }
        }

        /**
         * 结束录音
         * bSend:是否立刻发送
         */
        public finishRecord(bSend:boolean = true,errFunc:Function = null):void{
            debugVoice("finishRecord------------>");
            if(this._curRecordVoice){
                this._curRecordVoice.finishRecord();
                if(bSend){
                    if(this._userInfo.roomId){
                        this.sendVoiceToRoom(this._userInfo.roomId,this._curRecordVoice,errFunc);
                    }else{
                        debugVoice("finishRecord---------roomId is null-->");
                    }
                }
            }
            this._curRecordVoice = null;
        }

        /**
         * 发送文本信息
         */
        public sendTextToRoom(roomId,sText,errFunc:Function = null):void{
            let msg = new TextMessage(sText);
            this._sdk.sendToRoom(roomId, msg).catch(function (e) {
                console.error("sendTextToRoom----error-->",e.name);
                if(errFunc){
                    errFunc(getErrorMsg(e.name))
                }
            });
        }

        /**
         * 发送已经录制的语音
         */
        public sendVoiceToRoom(roomId,voice,errFunc:Function = null):void{
            if(roomId && voice){
                console.log("----sendVoiceToRoom----->",voice.getDuration());
                if(voice.isError()){
                    console.error("sendToRoom--1--error->",voice.getErrorName());
                    if(errFunc){
                        errFunc(getErrorMsg(voice.getErrorName()));
                    }
                }else{
                    debugVoice("sendVoiceToRoom------------->",roomId,voice);
                    this._sdk.sendToRoom(roomId, voice).catch(function (e) {
                        console.error("sendToRoom--2--error->",roomId,voice,e);
                        if(errFunc){
                            errFunc(getErrorMsg(e.name))
                        }
                    });
                }
            }
        }
    }
}