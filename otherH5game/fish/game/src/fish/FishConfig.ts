/**
 * Created by eric.liu on 17/11/06.
 *
 * 定义
 */

//编辑器模式
const FISH_MODE_EDITOR:boolean = false;
const FISH_MODE_EDITOR_TITLE:string = '路径编辑器';

//单款模式 非单款模式接受大厅传过来的dispatcher用于收发消息
const FISH_MODE_INDEPENDENT:boolean = false;

//微信公众号模式 如果发布单款到微信公众号需要打开
const FISH_MODE_WXMP:boolean = false;

//微端模式
const FISH_MODE_MICROCLIENT:boolean = false;

//设计分辨率
const FISH_DESIGN_WIDTH:number = 1280;
const FISH_DESIGN_HEIGHT:number = 720;

const FISH_TYPE_COUNT:number = 22;  //鱼的类型数
const FISH_USER_COUNT:number = 4;   //用户数

const FISH_TAG_FISH:number = 1;     //鱼的tag
const FISH_TAG_BULLET:number = 2;   //子弹的tag

//服务器相关
var FISH_SERVER_TEST:string = 'ws://129.211.1.47:9001/ws';
//const FISH_SERVER_TEST:string = 'ws://116.62.166.71:9001/ws';
//const FISH_SERVER_TEST:string = 'wss://cwby-agent1.hztangyou.com/ws';
const FISH_ROOMID_TEST:number = 3002;
const FISH_CONFIG_URL:string = 'http://192.168.0.81/laoqifeng/doudizhu/';

const FISH_GAME_NAME:string = '触玩捕鱼';
const FISH_VERSION:string = 'v1.1.1(build.10)';
const FISH_VERSION_DESC:string = '增加切换房间';

//账号相关
const FISH_USERID_TEST:string = '1694534';
const FISH_TOKEN_TEST:string = 'vsAoleRSj8pQtA7X7AtjAPjpAPXsbSaN';
const FISH_UUID_TEST:string = '785bd24210674ec64f3e26e8f800293f';