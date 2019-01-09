/**
 * Created by eric.liu on 17/11/13.
 *
 * 事件
 */

class FishEvent {
	static CLOCK_0:string = 'clock0';
	static LOG:string = 'log';

	static SHOW_DISCONNECT:string = 'showDisconnect';
	static HIDE_DISCONNECT:string = 'hideDisconnect';

	static CONNECT_SERVER:string = 'connectToServer';
	static SERVER_CLOSE:string = 'serverClose';
	static SERVER_ERROR: string = 'serverError';

	static MY_USER_INFO_UPDATE:string = 'myUserInfoUpdate';
	static GOLD_UPDATE:string = 'goldUpdate';

	static USER_USER_INFO_REQUEST:string = 'user.UserInfoRequest';
	static USER_USER_INFO_RESPONSE:string = 'user.UserInfoResonpse';
	static USER_LOGIN_RESPONSE:string = 'user.loginResponse';
	static USER_NOTIFY_KICK_OUT:string = 'user.NotifyKickout';
	static USER_OPERATE_REP:string = 'user.OperateRep';
	static USER_CHECK_RECONNECT_REQ:string = 'user.CheckReconnectReq';
	static USER_CHECK_RECONNECT_REP:string = 'user.CheckReconnectRep';
	static USER_RECONNECT_TABLE_REQ:string = 'user.ReconnectTableReq';
	static USER_RECONNECT_TABLE_REP:string = 'user.ReconnectTableRep';
	static USER_QUICK_JOIN_REQUEST:string = 'user.QuickJoinRequest';
	static USER_QUICK_JOIN_RESPONSE:string = 'user.QuickJoinResonpse';
	static GET_FRESHMAN_REWARD_REQ: string = "user.GetFreshManRewardReq";
	static GET_FRESHMAN_REWARD_REP: string = "user.GetFreshManRewardRep";
	static LOTTERY_REDCOIN_REQ:string = 'user.LotteryRedcoinReq';
	static LOTTERY_REDCOIN_REP:string = 'user.LotteryRedcoinRep';
	static USER_BAG_INFO_REQ:string = 'user.BagInfoReq';
	static USER_BAG_INFO_REP:string = 'user.BagInfoRep';
	static USER_ALMS_REQ:string = 'user.AlmsReq';
	static USER_ALMS_REP:string = 'user.AlmsRep';
	static USER_REDCOIN_EXCHANGE_GOODS_REQ: string = 'user.RedcoinExchangeGoodsReq';
    static USER_REDCOIN_EXCHANGE_GOODS_REP: string = 'user.RedcoinExchangeGoodsRep';
	static USER_DAY_SIGNIN_OPT_REQ: string = 'user.DaySigninOptReq';
    static USER_DAY_SIGNIN_OPT_REP: string = 'user.DaySigninOptRep';

	static GAME_ENTER_TABLE:string = 'game.EnterTable';
	static GAME_LEAVE_TABLE:string = 'game.LeaveTable';
	static GAME_TABLE_INFO:string = 'game.TableInfo';
	static GAME_SET_SESSION:string = 'game.SetSession';
	static GAME_USER_ONLINE:string = 'game.UserOnline';
	static GAME_GAME_END:string = 'game.GameEnd';
	static GAME_GIVE_UP_GAME_REQ:string = 'game.GiveUpGameReq';
	static GAME_GIVE_UP_GAME_REP:string = 'game.GiveUpGameRep';
	static GAME_USER_INFO_IN_GAME_REQ:string = 'game.UserInfoInGameReq';
	static GAME_USER_INFO_IN_GAME_REP:string = 'game.UserInfoInGameRep';

	static GAME_FISH_TRACE: string = "game.STCGameFishTrace";
	static GAME_FISH_FIRE_REQ: string = "game.CTSGameFishFire";
	static GAME_FISH_FIRE_REP: string = "game.STCGameFishFire";
	static GAME_FISH_FIRE_FAIL: string = 'game.STCGameFishFireFail';
	static GAME_FISH_CATCH: string = "game.CTSGameFishCatch";
	static GAME_FISH_FISH_OVER: string = "game.STCGameFishOver";
	static GAME_FISH_SCENE: string = "game.STCGameFishScreenFish";
	static GAME_FISH_CONFIG: string = "game.STCGameFishConfig";
	static GAME_FISH_REDCOUNT: string = 'game.STCGameFishRedCount';
	static GAME_FISH_BIND_PHONE_REWARD_REQ:string = 'game.CTSGameFishBindPhoneReward'
	static GAME_FISH_BIND_PHONE_REWARD_REP:string = 'game.STCGameFishBindPhoneReward'
	static GAME_FISH_FRESHEN_GOLD_REQ:string = 'game.CTSGameFishFreshenGold'
	static GAME_FISH_FRESHEN_GOLD_REP:string = 'game.STCGameFishFreshenGold'
}