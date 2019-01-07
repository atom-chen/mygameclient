/**
 *
 * @author 
 *
 */
class CCGlobalWxHelper {
    public static NATIVE_SHARE_SUCC = 0;

    public static SHARE_FREE_GAME = 1;  // 分享自由组局
    public static SHARE_GAME = 2;  // 分享游戏
    public static SHARE_IMAGE_BASE = 10;
    public static SHARE_IMAGE_TO_TIMELINE = 11;  // 分享图片到朋友圈
    public static SHARE_IMAGE_TO_FRIENDS = 12;  // 分享图片给好友

    public constructor() {
    }

	/**
	 * 
	 * @param type 1 分享牌局给好友 2 分享游戏给好友 11 分享图片到朋友圈 12 分享图片给好友
	 * @param callBack 
	 * @param parmas [round,multiple,roomId]
     * just for H5
	 */
    public static share(type: number, callBack: any, parmas: any[] = []): void {
        if (!CCalien.Native.instance.isWXMP) return;

        if (ccserver._isInDDZ) return;

        let userData: CCGlobalUserData = CCGlobalUserData.instance;
        var sk: string = userData.getSk();
        if (!sk) {
            sk = "";
            CCDDZReportor.instance.reportCodeError("sk error share :" + CCalien.Native.instance.getChannelName() + "isApp:" + CCalien.Native.instance.isNative);
        }
        //link1:分享到朋友圈
        //link2：分享给朋友
        //imgUrl：图片链接
        //title1：分享到朋友圈标题
        //title2：分享给朋友标题
        //desc1：分享到朋友圈描述
        //desc2：分享给朋友描述
        var shareParams: any = {};
        shareParams.imgUrl = CCGlobalGameConfig.RESOURCE_URL + "shareIcon.jpg";
        shareParams.title1 = lang.thirdPartWxMp.title2;
        shareParams.link1 = CCGlobalGameConfig.WX_LOGIN_URL + "?state=3&" + "share_sk=" + sk;
        if (type == this.SHARE_FREE_GAME) {
            shareParams.title2 = lang.thirdPartWxMp.title3;
            shareParams.desc2 = CCalien.StringUtils.format(lang.thirdPartWxMp.desc3, parmas[2], parmas[0], parmas[1]);
            shareParams.link2 = CCGlobalGameConfig.WX_LOGIN_URL + "?state=3&share_room=" + parmas[2];
        }
        else {
            shareParams.title2 = lang.thirdPartWxMp.title2;
            shareParams.desc2 = lang.thirdPartWxMp.desc2;

            shareParams.link2 = CCGlobalGameConfig.WX_LOGIN_URL + "?state=3&" + "share_sk=" + sk;//lang.thirdPartWxMp.share_app_url + "?share_sk=" + sk;
        }

        CCalien.Native.instance.share(shareParams, callBack);
    }

    /**
     * 分享下载APP
     */
    static shareDownApp(callBack: Function): void {
        var shareParams: any = {};
        let userData: CCGlobalUserData = CCGlobalUserData.instance;
        var sk: string = userData.getSk();
        shareParams.title = lang.thirdPartWxMp.title2;
        shareParams.description = lang.thirdPartWxMp.desc2;
        shareParams.shareType = 0;//链接
        shareParams.sharePlatform = 2;//分享给好友
        shareParams.url = "https://wx.yiyuc.com/appshare/qrcode.php?sk=" + sk;
        CCalien.Native.instance.share(shareParams, callBack);
    }
    /**
     * 分享结果
     */
    private static _onShareRet(response): void {
        //zhu 分享成功或失败 免费赛需要知道分享结果
        let _bSucc = false;
        if (response.code == 3) {
            _bSucc = true;
            CCDDZPanelShare.instance.close();
        }
        CCalien.CCDDZDispatcher.dispatch(CCGlobalEventNames.USER_SHARE_RESULT, { shareSucc: _bSucc });
    }

    /**
     * 设置公众号的微信分享参数
     */
    public static doWebH5ShareCfg(): void {
        CCGlobalWxHelper.share(2, CCGlobalWxHelper._onShareRet.bind(CCGlobalWxHelper));
    }

    /**
     * 直接调起APP端分享到朋友圈
     */
    public static doNativeShare(): void {
        CCGlobalWxHelper.shareForNative(2, CCGlobalWxHelper._onShareRet.bind(CCGlobalWxHelper));
    }

    /**
	 * 
	 * @param type 1 分享牌局给好友 2 分享游戏给好友
	 * @param callBack sharetype 0 连接 1图片 sharePlatform 2好友 3朋友圈
	 * @param parmas [round,multiple,roomId]
	 */
    public static shareForNative(type: number, callBack: any, parmas: any[] = []): void {
        //2好友 3朋友圈
        let sharePlatform: number = 2;

        let userData: CCGlobalUserData = CCGlobalUserData.instance;
        var sk: string = userData.getSk();
        if (!sk) {
            sk = "";
        }

        let isShareH5 = true;

        let shareH5Url = CCGlobalGameConfig.WX_LOGIN_URL + "?state=3&" + "share_sk=" + sk;
        let shareDownUrl_ios = "https://m.hztangyou.com/down/";
        let shareDownUrl_android = "https://m.hztangyou.com/down/";

        let shareParams: any = {};
        if (isShareH5) {
            shareParams.url = shareH5Url;
        } else {
            shareParams.url = shareDownUrl_android;
            if (egret.Capabilities.os == "iOS") { // ios url
                shareParams.url = shareDownUrl_ios;
            }
        }
        shareParams.title = lang.thirdPartWxMp.title2;
        shareParams.description = lang.thirdPartWxMp.desc2;

        if (type == this.SHARE_FREE_GAME) {
            shareParams.title = lang.thirdPartWxMp.title3;
            shareParams.description = CCalien.StringUtils.format(lang.thirdPartWxMp.desc3, parmas[2], parmas[0], parmas[1]);
            shareParams.url = CCGlobalGameConfig.WX_LOGIN_URL + "?state=3&share_room=" + parmas[2];
        }
        shareParams.shareType = 0;
        shareParams.sharePlatform = sharePlatform;
        CCalien.Native.instance.share(shareParams, callBack);
    }

    //sharetype 0 连接 1图片 sharePlatform 2好友 3朋友圈
    public static shareImageNative(platform: number, callBack: any, parmas: any[] = []): void {
        if (!CCalien.Native.instance.isNative) {
            console.log('shareImageNative not native!');
            return;
        }
        let sharePlatform: number = 2;
        switch (platform) {
            case this.SHARE_IMAGE_TO_FRIENDS:
                sharePlatform = 2;
                break;
            case this.SHARE_IMAGE_TO_TIMELINE:
            default:
                sharePlatform = 3;
                break;
        }

        let shareParams: any = {};
        shareParams.title = lang.thirdPartWxMp.title2;
        shareParams.shareType = 1;
        shareParams.url = parmas[0];  // 图片url
        shareParams.sharePlatform = sharePlatform;
        shareParams.description = '';
        // egret.log('CCalien.Native.instance.share');
        CCalien.Native.instance.share(shareParams, callBack);
    }

    /**
     * 手机登录的分享，跳转图片
     */
    static shareForPhone(): void {
        ccddzwebService.getShareImgUrlByScene(function (response) {
            let data: any = JSON.parse(response);
            if (data.code == 0) {
                window.top.location.href = data.url;
            }
        }, 1);
    }

    /**
     * android App 分享图片给好友
     */
    static shareForAndroidApp(): void {
        let _self = this;
        ccddzwebService.getShareImgUrlByScene(function (response) {
            let data: any = JSON.parse(response);
            if (data.code == 0) {
                _self.shareImageNative(_self.SHARE_IMAGE_TO_FRIENDS, null, [data.imgurl]);
            }
        }, 1);

    }

    // public static onShareRedult(code: number, msg: string): void {
    //     if (code == this.SHARE_SUCC) {

    //     } else {

    //     }
    // }
}
