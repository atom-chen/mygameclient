/**
 * Created by eric.liu on 17/12/11.
 *
 * 与Native互通
 */

class FishNativeBridge {
    private static instance: FishNativeBridge = null;
    private platformInstance: FishNativeBridge;
    public static getInstance(): FishNativeBridge {
        if(!FishNativeBridge.instance) {
            FishNativeBridge.instance = new FishNativeBridge();
            FishNativeBridge.instance.init();
        }
        return FishNativeBridge.instance;
    }
    public constructor() {
        if (FishNativeBridge.instance) {
            throw new egret.error("FishJsBridge is a singleton class.");
        }
        this.init();
    }
    private init(){
        egret.ExternalInterface.addCallback('OnNativeCalled', this.OnNativeCalled);
    }

    //调用native方法
    public CallNative(func:string, msg:string):void {
        if (!FISH_MODE_MICROCLIENT) return;
        egret.ExternalInterface.call(func, msg);
    }

    //native回调
    protected OnNativeCalled(msg:string) {
        if (!FISH_MODE_MICROCLIENT) return;
        console.log('====================================>'+msg);
        alert(msg);
        let json:any = JSON.parse(msg);
        switch(json['callback']) {
            case 'initNativeGameCallback':
                break;
            case 'loginByWechatCallback':
                console.log('====================================>loginByWechatCallback');
                fishWebService.loginByWxFromWeb(json['code'], this.onVerifyLoginResponse.bind(this));
                break;
            default:
                break;
        }
    }

    //认证响应
    private onVerifyLoginResponse(response): void {
        console.log('====================================>'+response);
    }
}