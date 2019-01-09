/**
 * Created by eric.liu on 17/11/16.
 *
 * 与js互通
 */

//声明js函数
declare function callJSFunction(msg:string, param:string, callback:any):string;

class FishJsBridge {
    private static instance: FishJsBridge = null;
    private platformInstance: FishJsBridge;
    public static getInstance(): FishJsBridge {
        if(!FishJsBridge.instance) {
            FishJsBridge.instance = new FishJsBridge();
            FishJsBridge.instance.init();
        }
        return FishJsBridge.instance;
    }
    public constructor() {
        if (FishJsBridge.instance) {
            throw new egret.error("FishJsBridge is a singleton class.");
        }
        this.init();
    }
    private init(){
        window['platformInstance'] = FishJsBridge.instance; 
    }      
    public jsCallTsFunc(_arg:string):string {
        switch(_arg) {
            case 'beforeunload':
                fishServer.close();
                break;
            case 'getversion':
                return FISH_VERSION;
        }

        return '';
    }
    public tsCallJsFunc(_arg:string, _param:string='', _callback:any=null):string {
        if (!FISH_MODE_INDEPENDENT) return '';
        if (FISH_MODE_MICROCLIENT) return '';
        return callJSFunction(_arg, _param, _callback);
    }
}