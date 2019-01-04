/**
 * 图片分享管理类
 * 
 */
class ShareImageManager {
	public static GAME_TYPE_RED = 1;
	public static GAME_TYPE_MATCH = 2;
	public static GAME_TYPE_FAST = 3;

	// 非本域网址 需要网页端添加跨域访问支持 Access-Control-Allow-Origin

	private static SHARE_RESULT_TAG: string = 'shareResultTag';

	private static SCENE_NORMAL: number = 1;
	private static SCENE_SPRING: number = 2;

	private static SCENE_RED_NORMAL: number = ShareImageManager.SCENE_NORMAL;
	private static SCENE_RED_BASE: number = 10;
	private static SCENE_RED_48: number = ShareImageManager.SCENE_RED_BASE + 1;
	private static SCENE_RED_96: number = ShareImageManager.SCENE_RED_BASE + 2;
	private static SCENE_RED_192: number = ShareImageManager.SCENE_RED_BASE + 3;

	private static SCENE_MATCH_NORMAL: number = ShareImageManager.SCENE_NORMAL;
	private static SCENE_MATCH_BASE: number = 30;
	private static SCENE_MATCH_500_RANK_1: number = ShareImageManager.SCENE_MATCH_BASE + 1;
	private static SCENE_MATCH_500_RANK_2: number = ShareImageManager.SCENE_MATCH_BASE + 2;
	private static SCENE_MATCH_500_RANK_3: number = ShareImageManager.SCENE_MATCH_BASE + 3;
	private static SCENE_MATCH_200_RANK_1: number = ShareImageManager.SCENE_MATCH_BASE + 6;
	private static SCENE_MATCH_200_RANK_2: number = ShareImageManager.SCENE_MATCH_BASE + 7;
	private static SCENE_MATCH_200_RANK_3: number = ShareImageManager.SCENE_MATCH_BASE + 8;

	private static SCENE_FAST_NORMAL: number = ShareImageManager.SCENE_NORMAL;
	private static SCENE_FAST_BASE: number = 50;
	private static SCENE_FAST_2: number = ShareImageManager.SCENE_FAST_BASE + 1;
	private static SCENE_FAST_5: number = ShareImageManager.SCENE_FAST_BASE + 2;
	private static SCENE_FAST_10: number = ShareImageManager.SCENE_FAST_BASE + 3;

	private static WAIT_TIMEOUT: number = 15 * 1000;	// 10s

	private static ALERT_DELAY: number = 500;	// alert延迟弹出时间

	private static _instance: ShareImageManager;
	public static get instance(): ShareImageManager {
    	if (this._instance == undefined) {
      		this._instance = new ShareImageManager();
    	}
    	return this._instance;
	}

	private _isWaitTipShowing: boolean;

	public constructor() {
		this._isWaitTipShowing = false;
  	}

	/**
	 * start[show wait]-->getImageUrl[http]-->onImageUrlResult[cb]-->share[native]-->
	 * beforeShareResult[save result]-->onShareResult[req reward-->resp reward]-->afterShareResult[reset result]-->stop[hide wait]
	 */
	/**
	 * 开始分享流程
	 */
	public start(uid: number, scene: number): void {
		// egret.log('start');
		this.showWait();
		this.getImageUrl(uid, scene,this.onImageUrlResult.bind(this));
	}

	/**
	 * 分享到指定的
	 */
	public shareImgByType(uid: number, scene: number,shareType:number):void{
		let _self = this;
		this.showWait();
		this.getImageUrl(uid, scene,function(response){
			let data: any = JSON.parse(response);
			if(Number(data.code) ==0){
				_self.shareImage(data.url,shareType);
			}
		});
	}

	/**
	 * 断线重连返回时检查分享结果
	 */
	public checkShareResult(): void {
		let shareResultCode: number = +egret.localStorage.getItem(ShareImageManager.SHARE_RESULT_TAG);
		console.log('share result:' + shareResultCode);

		if (shareResultCode) {
			if (shareResultCode == WxHelper.NATIVE_SHARE_SUCC) {
				this.onShareSucc();
			} else if (shareResultCode > WxHelper.NATIVE_SHARE_SUCC){
				this.onShareFailed();
			}
		}
	}

	/**
	 * 获取当前分享场景代码
	 */
	public getShareScene(gameType: number, value: number): number {
		let shareSceneCode = ShareImageManager.SCENE_NORMAL;

		if (gameType == ShareImageManager.GAME_TYPE_RED) {
			switch (value) {
				case 48:
					shareSceneCode = ShareImageManager.SCENE_RED_48;
					break;
				case 96:
					shareSceneCode = ShareImageManager.SCENE_RED_96;
					break;
				case 192:
					shareSceneCode = ShareImageManager.SCENE_RED_192;
					break;
				default:
					shareSceneCode = ShareImageManager.SCENE_NORMAL;
					break;
			}
		} else if (gameType == ShareImageManager.GAME_TYPE_MATCH) {
			switch (value) {
				case 201:
					shareSceneCode = ShareImageManager.SCENE_MATCH_200_RANK_1;
					break;
				case 202:
					shareSceneCode = ShareImageManager.SCENE_MATCH_200_RANK_2;
					break;
				case 203:
					shareSceneCode = ShareImageManager.SCENE_MATCH_200_RANK_3;
					break;
				case 501:
					shareSceneCode = ShareImageManager.SCENE_MATCH_500_RANK_1;
					break;
				case 502:
					shareSceneCode = ShareImageManager.SCENE_MATCH_500_RANK_2;
					break;
				case 503:
					shareSceneCode = ShareImageManager.SCENE_MATCH_500_RANK_3;
					break;
				default:
					shareSceneCode = ShareImageManager.SCENE_NORMAL;
					break;
			}
		} else if (gameType == ShareImageManager.GAME_TYPE_FAST) {
			switch (value) {
				case 200:
					shareSceneCode = ShareImageManager.SCENE_FAST_2;
					break;
				case 500:
					shareSceneCode = ShareImageManager.SCENE_FAST_5;
					break;
				case 1000:
					shareSceneCode = ShareImageManager.SCENE_FAST_10;
					break;
				default:
					shareSceneCode = ShareImageManager.SCENE_NORMAL;
					break;
			}
		}

		return shareSceneCode;
	}

	private showWait(): void {
		this._isWaitTipShowing = true;
		egret.localStorage.setItem(ShareImageManager.SHARE_RESULT_TAG, '1');
		alien.Dispatcher.dispatch(EventNames.SHOW_WAITING, {content: '分享中...'});
		egret.setTimeout(this.hideWait, this, ShareImageManager.WAIT_TIMEOUT);	// 只隐藏 不处理数据 对断线重连之类的没影响
	}

	private hideWait(isTimeOut: boolean = false): void {
		alien.Dispatcher.dispatch(EventNames.HIDE_WAITING);
		this._isWaitTipShowing = false;
	}

	private getImageUrl(uid: number, scene: number,callback:Function): void {
		// egret.log('getImageUrl uid:' + uid + ' scene:' + scene);
		 let shareUrl = GameConfig.getCfgByField("urlCfg.shareUrl");
		alien.Ajax.GET(shareUrl, { uid: uid, scene: scene }, callback, this.onImageUrlError.bind(this));
	}

	private onImageUrlResult(response: any): void {
		let data: any = JSON.parse(response);
		console.log('>>>>>>>>>>' + response);
		// egret.log('>>>>>>>>>>' + response);
		// egret.log('onImageUrlResult data.code:' + data.code);
		// egret.log('onImageUrlResult data.url:' + data.url);

		if (+data.code == 0) {
			// egret.log('shareImage');
			this.shareImage(data.url);
		} else {
			// egret.log('stop');
			console.log('onImageUrlResult:' + data.code);
			this.stop(false);
		}
	}

	private onImageUrlError(response: any): void {
		// egret.log('onImageUrlError');
		console.log('onImageUrlError');
		this.stop(false);
	}

	private shareImage(url: string,shareType:number =WxHelper.SHARE_IMAGE_TO_TIMELINE): void {
		// egret.log('shareImage:' + url);
		WxHelper.shareImageNative(shareType, this.onShareResult.bind(this), [url]);
	}

	private saveShareResult(code: number): void {
		egret.localStorage.setItem(ShareImageManager.SHARE_RESULT_TAG, '' + code);
	}

	private onShareResult(response: any): void {
		// egret.log('onShareResult:' + response);
		let code = response.code;
		this.saveShareResult(code);
		// egret.log('onShareResult code:' + code);

		if (+code == WxHelper.NATIVE_SHARE_SUCC) {
			// egret.log('onShareResult onShareSucc');
			this.onShareSucc();
		} else {
			// egret.log('onShareResult onShareFailed');
			this.onShareFailed();
		}
	}

	private onShareSucc(): void {
		// egret.log('onShareSucc');
		server.reqShareSuccRew();
	}

	private onShareFailed(): void {
		// egret.log('onShareFailed');
		this.stop(false);
	}

	public onUserOperateRep(data: any): void {
        if(data.optype == 2){ // 分享成功奖励
			if (data.result == 1) {	// 获得奖励
				this.stop(true);
			} else {	// 已经获得过
				let _gameCfg = GameConfig;
				let _cfg = _gameCfg.getShareRewCfg();
				if(!_cfg) return;

				let _name = null;
				let _idx = 1;
				let _info = "恭喜您分享成功获得以下奖励:\n";
				for(let k in _cfg){
					_name = _gameCfg.getItemNameById(parseInt(k));
					if(_name){
						_info += _idx  + "." + _name +"x" + _cfg[k] + "\n";
					}
				}
				this.stop(true, _info);
			}
        }
	}

	private resetShareResult(): void {
		egret.localStorage.setItem(ShareImageManager.SHARE_RESULT_TAG, '0');
	}

	private onAlertButton(action: string, data: any): void {
		this.resetShareResult();
	}

	/**
	 * 结束分享处理
	 */
	public stop(isSucc: boolean = false, msg: string = null): void {
		// egret.log('stop isFailed:' + isFailed);
		this.hideWait();

		let align = 'center';
		if (isSucc) {
			if (msg == null) {
				msg = '分享成功！';
			} else {
				align = 'left';
			}
		} else {
			if (msg == null) {
				msg = '分享失败！';
			}
		}
		egret.setTimeout(Alert.show, this, ShareImageManager.ALERT_DELAY, msg, 0, this.onAlertButton.bind(this), align);
	}
}