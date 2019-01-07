/**
 * Created by lenovo on 2014/6/21.
 */

class CCGameConfig {
    static needSystemLog: boolean = false;
    static qznnMode: number = 2;

    static gameName: string = 'niuniu';
    static gameId: number = 7;
    static platform: string = "bode";
    static devicePlatform: number;

	/**
	 * 登录服务器
	 */
    static LOGIN_SERVER_URL: string = '';

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

    static ROOM_TBNN_NAME: string = "4nn";
    static ROOM_DZNN_NAME: string = "dzniuniu";
    static ROOM_QZNN_NAME: string = "combullfight";
    static ROOM_BRNN_NAME: string = "100nn";

    static ROOM_NAMES_URLS: Array<number> = [0, 8, 2, 3, 4, 13, 14];
    static signInRewardConfig: any;        //签到奖励配置
    static chatGold: number = 10000;
    static matchGold: Array<number> = [50000, 100000, 150000, 200000];
    static rechargeConfig: any;

    static game_match: number = 1;
    static game_team: number = 2;

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
    static game_type_match: number = 7;
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

    static localHead: Array<string> = ["default.png", "head1.png", "head2.png", "head3.png", "head4.png", "head5.png", "head6.png", "head7.png", "head8.png"];

    static defaultHead: string = "default.png";
    static shield: Array<string>;
    static gameendData: any;
    static isShowScoreChange: boolean = true;
    static happyTypes: any;
    static playersNum: number = 0;
    static happyScorePlayerIndex: number = 0;
    static addHappyScoreTimes: number = 0;
    static giveupPlayersNum: number = 0;

    static getRoomConfig(id: number): any {
        var ret;
        this.roomList.forEach((room) => {
            if (room.id == id) {
                ret = room;
                return true;
            }
        });

        return ret;
    }

    static init(): void {
        this.language = RES.getRes('langCmpChicken');
    }

    static getRoomType(roomId: number): number {
        var r: number;
        if (roomId > 1000)
            r = Math.floor(roomId / 1000);
        else
            r = roomId;
        if (r == 8)
            return CCGameConfig.game_Type_tbnn;
        else if (r == 5)
            return CCGameConfig.game_Type_brnn;
        else if (r == 2)
            return CCGameConfig.game_Type_dznn;
        else if (r == 4)
            return CCGameConfig.game_Type_qznn;
        else if (r == 13)
            return CCGameConfig.game_Type_qrnn;
        else
            return CCGameConfig.game_Type_clnn;
    }

    static getUrl(callback: Function): void {

    }

    static getServerUrl(uid: number, callback: Function, onError: Function): void {

    }

	/**
	 * 加载游戏配置
	 * @param callback
	 */
    static loadConfigs(callback: Function): void {

    }

    static getGoodsById(id: number): any {

    }

    static getShield(): void {
        if (!this.shield) {
            this.shield = String(CCGlobal.createJsonData("shield")).split(",");
        }
    }

    static getRoomTask(roomid: number, taskId: number): Object {
        console.log("找不到对应战斗任务");
        return null;
    }

}