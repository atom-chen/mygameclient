/**
 * Created by lenovo on 2014/6/21.
 */

class GameConfigNiu {
    static needSystemLog:boolean=false;
    static qznnMode:number=2;
    
    static gameName: string = 'niuniu';
    static gameId: number = 7;
    static platform: string = "bode";
    static devicePlatform:number;
 
	/**
	 * 登录服务器
	 */
    static LOGIN_SERVER_URL: string = '';
   
//        static LOGIN_SERVER_URL: string = 'ws://192.168.0.84:9100/ws';  
//    	static LOGIN_SERVER_URL:string = 'ws://10.101.1.164:9001/ws';
    //	static LOGIN_SERVER_URL:string = 'ws://121.41.31.67:9001/ws';
//    static LOGIN_SERVER_URL: string = ' ws://localhost:8001/';
   
    //    static LOGIN_API_ROOT: string = 'http://xpt-head.htgames.cn:8998/index/';
    static LOGIN_API_ROOT: string = 'http://192.168.0.86:8998/index/';

    static HEAD_URL: string = "http://client-update.htgames.cn/games/img/head/";
    static RECHARGE_URL: string = "http://192.168.0.86:8998/index/pay";
    static RESOURCE_URL: string = 'http://192.168.0.81/laoqifeng/platform/';

    /**
     * 忘记密码
     */
    static FORGET_PASSWORD_URL: string = 'http://192.168.0.86:8998/index/forgot';

    /**
     * 下载客户端地址
     */
    static DOWNLOAD_PAGE_URL: string = 'http://192.168.0.86:8998/index/pay';

    /**
     * 注册账号
     */
    static SIGN_URL: string = 'http://192.168.0.86:8998/index/regist';

    //    static ROOM_TBNN_URL: string ='http://192.168.0.81/laoqifeng/game-config.php'
    //    static ROOM_DZNN_URL: string = 'http://192.168.0.81/laoqifeng/game-config.php'
    //    static ROOM_QZNN_URL: string = 'http://192.168.0.81/laoqifeng/game-config.php'
    //    static ROOM_BRNN_URL: string = 'http://192.168.0.81/laoqifeng/gconfig.php'
    
    //    static CONFIG_URLS: string ="http://192.168.0.81/laoqifenme-config.php";
    
    static ROOM_TBNN_NAME: string = "4nn";
    static ROOM_DZNN_NAME: string = "dzniuniu";
    static ROOM_QZNN_NAME: string = "combullfight";
    static ROOM_BRNN_NAME: string = "100nn";

    //    static ROOM_NAMES_URLS: Array<string> = ["",GameConfigNiu.ROOM_TBNN_NAME,GameConfigNiu.ROOM_DZNN_NAME,GameConfigNiu.ROOM_QZNN_NAME,GameConfigNiu.ROOM_BRNN_NAM    
    static ROOM_NAMES_URLS: Array<number> = [0,8,2,3,4,13,14];
    static signInRewardConfig: any;        //签到奖励配置
    static chatGold:number=10000;
    static matchGold:Array<number>=[50000,100000,150000,200000];
    static rechargeConfig:any;
    
    static game_match:number=1;
    static game_team:number=2;
    
	/**
	 * 头像服务器
	 */
    static AVATAR_ROOT: string = 'http://xpt-head.htgames.cn:8998';///uploads/avatar/

    static REPORT_URL: string = 'http://120.27.162.46:8866/_.gif';

    static LOBBY_PAGE_URL: string = '';

    static SEX_MAN: number = 1;
    static SEX_WOMAN: number = 2;

    static CARD_WIDTH: number = 113;
    static CARD_HEIGHT: number = 142;
    static CARD_GAP: number = -70;

    static CARD_RETURN_COUNT: number = 10;
    static CARD_RETURN_GAP: number = 45;
    static CARD_SCALE_SIDE: number = 0.6;

    static CHAT_COUNT_DOWN: number = 1; //聊天时间冷冻

    static SOUNDS_LOADED: boolean = false;

    static DEBUG: boolean = false;

    static language: any;
    static roomList: Array<any>;

    static game_Type_tbnn: number = 1;
    static game_Type_dznn: number = 2;
    static game_Type_qznn: number = 4;
    static game_Type_brnn: number = 4;
    static game_Type_qrnn: number = 5;
    static game_Type_clnn: number = 6;
    static game_type_match:number=7;
    static game_type_team: number = 8;

    static game_room_1: number = 1;
    static game_room_2: number = 2;
    static game_room_3: number = 3;
    static game_room_4: number = 4;

    static native_ios: number = 2;
    static native_android: number = 3;
    static native_null: number = 4;

    static upDistance: number = -65;
    static upX: number = 107;
    static downX: number = 71;
    static cardDistance: number = 69;
    static myCardDistance: number = 70;
    static armyCardDistance: number = 30;
    static niuCardDistance: number = 10;
    static brnnMasterCardDistance: number = 41;
    static brnnNormalCardDistance: number = 26;
    static brnnUpDistance: number = -38;
    static brnnUpX: number = 36;
    static brnnDownX: number = 20;
    static brnnCardDistance: number = 34;


    static GROUP_PRELOAD: string = "preload";
    static GROUP_LOAD_BG: string = "loadBg";
    static GROUP_LOGIN: string = "login";
    static GROUP_SOUND: string = "sound";
    static GROUP_NORMAL: string = "normal";
    static GROUP_GAME: string = "game";
    static GROUP_DZNN: string = "dznn";
    static GROUP_BRNN: string = "brnn";
    static GROUP_QZNN: string = "qznn";
    static GROUP_TBNN: string = "tbnn";

    //    static reconnetResult1: string ="刚才断线了，点击确定开始新的游戏";
    //    static reconnetResult2: string = "无法连接服务器，是否尝试重新连接？";
    //    static reconnetResult3: string = "刚才断线了，点击确定重新登录";
    //    static goldNotEnough: string = "金豆不足无法进入房间";
    //    static roomFull: string = "房间已满，请稍后重试";
    //    static kickOutTitle: string = "断开连接";
    //    static kickOut: Array<string> = ["","您的账号在另一台设备登录","非法操作，已经断开","非法操作，已经断开","您的账号已被冻结"];
    //    static goldNotEnough1: string = "金豆不足，无法进行游戏，确定补充金豆？";
    //    static goldNotEnough2: string = "金豆不足，无法补充,是否前往充值？";
    //    static AlmsGet: string = "领取救济金#1成功,剩余领取次数#2，点击确定后继续游戏";
    //    static AlmsGet1: string = "领取救济金#1成功,剩余领取次数#2，仍无法继续游戏,是否前往充值？";
    //    static AlmsGet2: string = "领取救济金#1成功,剩余领取次数#2";
    static localHead: Array<string> = ["default.png","head1.png","head2.png","head3.png","head4.png","head5.png","head6.png","head7.png","head8.png"];

    static defaultHead: string = "default.png";
    static shield:Array<string>;

    static getRoomConfig(id: number): any {
        var ret;
        this.roomList.forEach((room) => {
            if(room.id == id) {
                ret = room;
                return true;
            }
        });

        return ret;
    }

    static loadRoomList(roomType: number,callback: Function): void {
        //Ajax.GET((this.DEBUG ? this.RESOURCE_URL : GameConfigNiu.language.CONFIG_URLS) + 'config.php',{ id: GameConfigNiu.ROOM_NAMES_URLS[roomType] },callback);
    }

    static loadServerConfig(callback: Function): void {
        //Ajax.GET(GameConfigNiu.language.SERVER_CONFIG_URLS,{},callback);
    }

    static init(): void {
        this.language = RES.getRes('langNiu');
    }

    static getRoomType(roomId: number): number {
        var r: number ;
        if (roomId>1000)
            r= Math.floor(roomId / 1000);
        else
            r=roomId;
        if(r == 8)
            return GameConfigNiu.game_Type_tbnn;
        else if(r == 5)
            return GameConfigNiu.game_Type_brnn;
        else if(r == 2)
            return GameConfigNiu.game_Type_dznn;
        else if(r == 4)
            return GameConfigNiu.game_Type_qznn;
        else if(r == 13)
            return GameConfigNiu.game_Type_qrnn;
        else
            return GameConfigNiu.game_Type_clnn;
    }



    static getUrl(callback: Function): void {
       
    }

    static getServerUrl(uid: number,callback: Function,onError: Function): void {

    }

	/**
	 * 加载游戏配置
	 * @param callback
	 */
    static loadConfigs(callback: Function): void {
        
    }

    static getGoodsById(id: number): any {
     
    }
    
    static getShield():void
    {
        if (!this.shield)
        {
            this.shield = String(Global.createJsonData("shield")).split(",");  
//            for (var i:number=0;i<this.shield.length;i++)
//            {
//                this.shield[i]=this.shield[i].replace("(","a");
//                this.shield[i]=this.shield[i].replace(")","b");
//                this.shield[i] = this.shield[i].replace("*","b");
//            }
        }
    }
    
    static getRoomTask(roomid:number,taskId:number):Object
    {
        console.log("找不到对应战斗任务");
        return null;
    }

}