/**
 *
 * @author 
 *
 */
class PDKWxHelper {
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
        if (!PDKalien.Native.instance.isWXMP) return;

        if (pdkServer._isInDDZ) return;

        let userData: PDKUserData = PDKUserData.instance;
        var sk: string = userData.getItem('sk');
        if (!sk) {
            sk = "";
            PDKReportor.instance.reportCodeError("sk error share");
        }
        //link1:分享到朋友圈
        //link2：分享给朋友
        //imgUrl：图片链接
        //title1：分享到朋友圈标题
        //title2：分享给朋友标题
        //desc1：分享到朋友圈描述
        //desc2：分享给朋友描述
        var shareParams: any = {};
        shareParams.imgUrl = PDKGameConfig.RESOURCE_URL + "shareIcon.jpg";
        shareParams.title1 = PDKlang.thirdPartWxMp.title2;
        shareParams.link1 = PDKGameConfig.WX_LOGIN_URL + "?state=3&" + "share_sk=" + sk;
        if (type == this.SHARE_FREE_GAME) {
            shareParams.title2 = PDKlang.thirdPartWxMp.title3;
            shareParams.desc2 = PDKalien.StringUtils.format(PDKlang.thirdPartWxMp.desc3, parmas[2], parmas[0], parmas[1]);
            shareParams.link2 = PDKGameConfig.WX_LOGIN_URL + "?state=3&share_room=" + parmas[2];
        }
        else {
            shareParams.title2 = PDKlang.thirdPartWxMp.title2;
            shareParams.desc2 = PDKlang.thirdPartWxMp.desc2;

            shareParams.link2 = PDKGameConfig.WX_LOGIN_URL + "?state=3&" + "share_sk=" + sk;//PDKlang.thirdPartWxMp.share_app_url + "?share_sk=" + sk;
        }

        PDKalien.Native.instance.share(shareParams, callBack);
    }

    /**
     * 分享下载APP
     */
    static shareDownApp(callBack: Function): void {
        var shareParams: any = {};
        let userData: PDKUserData = PDKUserData.instance;
        var sk: string = userData.getItem('sk');
        shareParams.title = PDKlang.thirdPartWxMp.title2;
        shareParams.description = PDKlang.thirdPartWxMp.desc2;
        shareParams.shareType = 0;//链接
        shareParams.sharePlatform = 2;//分享给好友
        shareParams.url = "https://wx.yiyuc.com/appshare/qrcode.php?sk=" + sk;
        PDKalien.Native.instance.share(shareParams, callBack);
    }
    /**
     * 分享结果
     */
    private static _onShareRet(response): void {
        //zhu 分享成功或失败 免费赛需要知道分享结果
        let _bSucc = false;
        if (response.code == 3) {
            _bSucc = true;
            PDKPanelShare.instance.close();
        }
        PDKalien.Dispatcher.dispatch(PDKEventNames.USER_SHARE_RESULT, { shareSucc: _bSucc });
    }

    /**
     * 设置公众号的微信分享参数
     */
    public static doWebH5ShareCfg(): void {
        PDKWxHelper.share(2, PDKWxHelper._onShareRet.bind(PDKWxHelper));
    }

    /**
     * 直接调起APP端分享到朋友圈
     */
    public static doNativeShare(): void {
        PDKWxHelper.shareForNative(2, PDKWxHelper._onShareRet.bind(PDKWxHelper));
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

        let userData: PDKUserData = PDKUserData.instance;
        var sk: string = userData.getItem('sk');
        if (!sk) {
            sk = "";
        }

        let isShareH5 = true;

        let shareH5Url = PDKGameConfig.WX_LOGIN_URL + "?state=3&" + "share_sk=" + sk;
        let shareDownUrl_ios = "http://sgpdk.16w.com/wx/";
        let shareDownUrl_android = "http://sgpdk.16w.com/wx/";

        let shareParams: any = {};
        if (isShareH5) {
            shareParams.url = shareH5Url;
        } else {
            shareParams.url = shareDownUrl_android;
            if (egret.Capabilities.os == "iOS") { // ios url
                shareParams.url = shareDownUrl_ios;
            }
        }
        shareParams.title = PDKlang.thirdPartWxMp.title2;
        shareParams.description = PDKlang.thirdPartWxMp.desc2;

        if (type == this.SHARE_FREE_GAME) {
            shareParams.title = PDKlang.thirdPartWxMp.title3;
            shareParams.description = PDKalien.StringUtils.format(PDKlang.thirdPartWxMp.desc3, parmas[2], parmas[0], parmas[1]);
            shareParams.url = PDKGameConfig.WX_LOGIN_URL + "?state=3&share_room=" + parmas[2];
        }
        shareParams.shareType = 0;
        shareParams.sharePlatform = sharePlatform;
        PDKalien.Native.instance.share(shareParams, callBack);
    }

    //sharetype 0 连接 1图片 sharePlatform 2好友 3朋友圈
    public static shareImageNative(type: number, callBack: any, parmas: any[] = []): void {
        if (!PDKalien.Native.instance.isNative) {
            console.log('shareImageNative not native!');
            return;
        }
        let sharePlatform: number = 2;
        switch (type) {
            case this.SHARE_IMAGE_TO_FRIENDS:
                sharePlatform = 2;
                break;
            case this.SHARE_IMAGE_TO_TIMELINE:
            default:
                sharePlatform = 3;
                break;
        }

        let shareParams: any = {};
        shareParams.title = PDKlang.thirdPartWxMp.title2;
        shareParams.shareType = 1;
        shareParams.url = parmas[0];  // 图片url
        shareParams.sharePlatform = sharePlatform;
        shareParams.description = '';
        // egret.log('PDKalien.Native.instance.share');
        PDKalien.Native.instance.share(shareParams, callBack);
    }

    // public static onShareRedult(code: number, msg: string): void {
    //     if (code == this.SHARE_SUCC) {

    //     } else {

    //     }
    // }
}
