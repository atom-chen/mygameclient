/**
 * Created by RockyF on 2014/7/2.
 *
 * 事件名常量
 */

class EventNames{
	static PGAME_RECORD_DATA_REFRESH: string = 'personalGameRecordDataRefresh';
	static INVITE_DATA_REFRESH: string = 'inviteDataRefresh';
	static LOADING_PROGRESS:string = 'loadingProgress';
	static BUTTON_BAR_TAP:string = 'buttonBarTap';

	static CLOCK_0:string = 'clock0';

	static SELECT_CHAT:string = 'selectChat';
	static SELECT_CARDS:string = 'selectCards';
	static TAP_SEAT: string = 'tapSeat';

	static LOG:string = 'log';

	static CONTINUE_PLAY: string = 'continuePlay';
	
	static SHOW_DISCONNECT:string = 'showDisconnect';
	static HIDE_DISCONNECT:string = 'hideDisconnect';

	static SHOW_WAITING:string = 'showWaiting';
	static HIDE_WAITING:string = 'hideWaiting';
	
    static SHOW_GAME_EFFECT: string = 'showGameEffect';

	static SHOW_TOAST:string = 'showToast';
	
    static SHOW_PAYCHAT: string = 'showPayChat';
	static SHOW_ANNOUNCE: string = 'showAnnounce';
	static HIDE_ANNOUNCE: string = 'hideAnnounce';

	static SHOW_TOP_NOTIFY:string = 'showTopNotify';
	static HIDE_TOP_NOTIFY:string = 'hideTopNotify';


	static SHOW_LOTTERY: string = 'showLottery';
	static HIDE_LOTTERY: string = 'hideLottery';

	static MY_USER_INFO_UPDATE:string = 'myUserInfoUpdate';

	static REFRESH_MATCH_LIST:string = 'refreshMatchList';

	static MATCH_CD_NOTIFICATION:string = 'matchCDNotification';

	static BAG_INFO_REFRESH:string = 'bagInfoRefresh';
	static BAG_COUNT_CHANGE:string = 'bagCountChange';
	static MAIL_LIST_REFRESH: string = 'mailListRefresh';
	static MAIL_UNREAD_UPDATE: string = 'mailUnOpenUpdate';
	static MISSION_LIST_REFRESH: string = 'missionListRefresh';

	static GOLD_UPDATE:string = 'goldUpdate';
    static GOLD_RAIN_EFFECT: string = 'goldRainEffect';
    
    static WX_SHARE: string = 'wxShare';

	//server
	static CONNECT_SERVER:string = 'connectToServer';
	static SERVER_CLOSE:string = 'serverClose';
	static SERVER_ERROR: string = 'serverError';

	static LOGIN_SUCCESS:string = 'LOGIN_SUCCESS';
	static FRIEND_REQ_CHAGNE:string = "FRIEND_REQ_CHAGNE";
	static FRIEND_SEND_CHAGNE:string = "FRIEND_SEND_CHAGNE";
	/**
	 * 游戏进入后台
	 */
	static ENTER_BACKGROUND:string ='enterBackground';
	/**
	 * 首充今日奖励已领取
	 */
	static USER_FRREWARD_GET_SUCC:string = 'USER_FRREWARD_GET_SUCC';
	/**
	 * 每日任务奖励领取成功
	 */
	static USER_DTREWARD_GET_SUCC:string = "USER_DTREWARD_GET_SUCC";

	/**
	 * 活动的某些小红点的状态变化
	 */
	static ACT_RED_CHANGE:string = "ACT_RED_CHANGE";

	/**
	 * 分享结果
	 */
	static USER_SHARE_RESULT:string = "USER_SHARE_RESULT";
	
	/**
	 * 玩家红包个数变化
	 */
	static USER_RED_COUNT_CHANGE:string = "USER_RED_COUNT_CHANGE";

	/**
	 * 喇叭记录信息变化
	 */
	static HORN_TALK_RECORDS_CHANGE:string = "HORN_TALK_RECORDS_CHANGE";

	/**
	 * 大厅的跑马灯位置水平居中
	 */
	static CENTER_ROOM_HORN_POS:string = "CENTER_ROOM_HORN_POS";

	/**
	 * 国庆活动信息变化
	 */
	static NATIONAL_INFO_CHANGE:string = "NATIONAL_INFO_CHANGE";
	/**
	 * 关闭复活界面
	 */
	static CLOSE_REVIVE_PANEL ="CLOSE_REVIVE_PANEL";

	/**
	 * 购买了复活礼包
	 */
	static BUY_REVIVE_SUCC ="BUY_REVIVE_SUCC";
	
	/**
	 * 账号出现异常
	 */
	static ACCOUNT_ERROR ="ACCOUNT_ERROR";

	/**
	 * 需要隐藏顶层的所有的提示
	 */
	static HIDE_MOSTTOP_TIP = "HIDE_MOSTTOP_TIP";

	/**
	 * 收到非斗地主的协议数据
	 */
	static RECV_SOCKET_DATA = "RECV_SOCKET_DATA";
	
	/**
	 * 启动其他游戏
	 */
	static START_OTHER_GAME = "START_OTHER_GAME";
	/**
	 * 服务器已更新
	 */
	static SERVER_HASUPDATE ="SERVER_HASUPDATE";
	/**
	 * 首充状态已更新
	 */
	static FRECHARGE_HASUPDATE ="FRECHARGE_HASUPDATE";
	
	/**
	 * 是否登录APP状态已更新
	 */
	static LOGINAPP_HASUPDATE ="LOGINAPP_HASUPDATE";
	
	/**
	 * 任务上的红点
	 */
	static TASK_RED_SHOW = "TASK_RED_SHOW";

	/**
	 * 支付成功
	 */
	static RECHARGE_ONE_SUCC = "RECHARGE_ONE_SUCC";
	static GET_CARDS_RECORDER_REWARD_REQ: string = "user.GetCardsRecorderRewardReq";
	static GET_FRESHMAN_REWARD_REQ: string = "user.GetFreshManRewardReq";
	static GET_FRESHMAN_REWARD_REP: string = "user.GetFreshManRewardRep";
    static CREATE_PERSONAL_GAME_REQ: string = "user.CreatePersonalGameReq";
	static CREATE_PERSONAL_GAME_REP: string = "user.CreatePersonalGameRep";
    static JOIN_PGAME_REQ: string = "user.JoinPGameReq";
	static JOIN_PGAME_REP: string = "user.JoinPGameRep";
    static START_PGAME_REQ: string = "user.StartPGameReq";
	static START_PGAME_REP: string = "user.StartPGameRep";
    static QUERY_ROOMINFO_REQ: string = "user.QueryRoomInfoReq";
	static QUERY_ROOMINFO_REP: string = "user.QueryRoomInfoRep";
    static QUIT_PGAME_REQ: string = "user.QuitPGameReq";
	static QUIT_PGAME_REP: string = "user.QuitRoomRep";
	
    static GAME_DISSOLVE: string = "user.GameDissolve";
    static RECONNECT_PGAME_REQ: string = "user.ReconnectPGameReq";
	static RECONNECT_PGAME_REP: string = "user.ReconnectPGameRep";
	
	static USER_QUICK_JOIN_REQUEST:string = 'user.QuickJoinRequest';
	static USER_QUICK_JOIN_RESPONSE:string = 'user.QuickJoinResonpse';
	static USER_USER_INFO_REQUEST:string = 'user.UserInfoRequest';
	static USER_USER_INFO_RESPONSE:string = 'user.UserInfoResonpse';
	static USER_CHECK_RECONNECT_REQ:string = 'user.CheckReconnectReq';
	static USER_CHECK_RECONNECT_REP:string = 'user.CheckReconnectRep';
	static USER_RECONNECT_TABLE_REQ:string = 'user.ReconnectTableReq';
	static USER_RECONNECT_TABLE_REP:string = 'user.ReconnectTableRep';
	static USER_LOGIN_RESPONSE:string = 'user.loginResponse';
	static USER_PLAYERS_AMOUNT_REQ:string = 'user.PlayersAmountReq';
	static USER_PLAYERS_AMOUNT_REP:string = 'user.PlayersAmountRep';
	static USER_MODIFY_USER_INFO_REQ:string = 'user.ModifyUserInfoReq';
	static USER_MODIFY_USER_INFO_REP:string = 'user.ModifyUserInfoRep';
    static USER_REDCOIN_RANKING_LIST_REQ: string = 'user.RedcoinRankingListReq';
    static USER_REDCOIN_RANKING_LIST_REP: string = 'user.RedcoinRankingListRep';
    static USER_OPERATE_REP:string = 'user.OperateRep';
	static USER_OPERATE_REQ:string = 'user.OperateReq';
   
	
    static USER_DAY_SIGN_IN_REQ: string = 'user.DaySigninOptReq';
    static USER_DAY_SIGN_IN_REP: string = 'user.DaySigninOptRep';
	static USER_NOTIFY_KICK_OUT:string = 'user.NotifyKickout';
	static USER_MATCH_SING_UP_INFO_REQ:string = 'user.MatchSignupInfoReq';
	static USER_MATCH_SING_UP_INFO_REP:string = 'user.MatchSignupInfoRep';
	static USER_MATCH_SING_UP_REQ:string = 'user.MatchSignupReq';
	static USER_MATCH_SING_UP_REP:string = 'user.MatchSignupRep';
	static USER_MATCH_START_NTF:string = 'user.MatchStartNtf';
	static USER_MATCH_INFO_NTF:string = 'user.MatchInfoNtf';
	static USER_ENTER_MATCH_REQ:string = 'user.EnterMatchReq';
	static USER_ENTER_MATCH_REP:string = 'user.EnterMatchRep';
	static USER_RED_PACKET_ANNOUNCE:string = 'user.RedPacketAnnounce';
	static USER_BAG_INFO_REQ:string = 'user.BagInfoReq';
	static USER_BAG_INFO_REP:string = 'user.BagInfoRep';
	static USER_GIVE_UP_MATCH_REQ:string = 'user.GiveupMatchReq';
	static USER_GIVE_UP_MATCH_REP:string = 'user.GiveupMatchRep';
	static USER_ALMS_REQ:string = 'user.AlmsReq';
	static USER_ALMS_REP:string = 'user.AlmsRep';
	static USER_RECHARGE_RESULT_NOTIFY:string = 'user.RechargeResultNotify';
    static USER_REDCOIN_EXCHANGE_GOODS_REQ: string = 'user.RedcoinExchangeGoodsReq';
    static USER_REDCOIN_EXCHANGE_GOODS_REP: string = 'user.RedcoinExchangeGoodsRep';
    static USER_LOTTERY_RED_COIN_REQ: string = 'user.LotteryRedcoinReq';
    static USER_LOTTERY_RED_COIN_REP: string = 'user.LotteryRedcoinRep';
    static USER_PAY_TO_CHAT_REQ: string = 'user.Pay2chatReq';
    static USER_PAY_TO_CHAT_REP: string = 'user.Pay2chatRep';
    static USER_FRESH_MAN_REDCOIN_LOTTERY_CHANCEGOT: string = 'user.FreshManRedcoinLotteryChanceGot';
    static USER_GET_TASKREW_REQ:string  = 'user.GetDayTaskRewardReq';
    static USER_GET_TASKREW_REP:string  = 'user.GetDayTaskRewardRep';
	static USER_GET_FRREWARD_REQ:string = 'user.GetFirstRechargeRewardReq';
	static USER_GET_FRREWARD_REP:string = 'user.GetFirstRechargeRewardRep';
	static USER_GET_REWARD_REQ:string = 'user.GetRewardReq'; //国庆活动和登录APP的奖励
	static USER_GET_REWARD_REP:string = 'user.GetRewardRep';
	static USER_GET_ACTInfo_REQ = "user.GetActivityInfoReq";
	static USER_GET_ACTInfo_REP = "user.GetActivityInfoRep";
	static USER_DiamondGame_REQ = "user.DiamondGameReq";
	static USER_DiamondGame_REP = "user.DiamondGameRep";
	
	static USER_MailList_REP = "user.MailListRep";
	static USER_MailModify_REP = "user.MailModifyRep";
	static USER_MailUnread_REP = "user.MailUnreadRep";
	static USER_MailOperate_REQ = "user.MailReq";
	static USER_MailGetReward_REP ="user.MailGetRewardRep";
	
	static QUIT_WAITING_QUEUE_REQ:string  = 'user.QuitWaitingQueueReq';
	static USER_MatchOperate_REQ  = "user.MatchOperateReq";
	static USER_MatchOperate_REP  = "user.MatchOperateRep";
	static USER_CoinLottery_REQ  = 'user.RedCoindLotteryReq';
	static USER_CoinLottery_REP  = 'user.RedCoindLotteryRep';
	static USER_FriendsOptype_REQ  = 'user.FriendsOptypeReq';
	static USER_FriendsOptype_REP  = 'user.FriendsOptypeRep';


	static GAME_RECONNECT_REP:string = 'game.ReconnectRep';
	static GAME_USER_ONLINE:string = 'game.UserOnline';
	static GAME_USER_INFO_IN_GAME_REQ:string = 'game.UserInfoInGameReq';
	static GAME_USER_INFO_IN_GAME_REP:string = 'game.UserInfoInGameRep';
	static GAME_SET_SESSION:string = 'game.SetSession';
	static GAME_GAME_START_NTF:string = 'game.GameStartNtf';
	static GAME_SET_CARDS:string = 'game.SetCards';
	static GAME_ADD_CARD:string = 'game.AddCard';
	static GAME_UPDATE_GAME_INFO:string = 'game.UpdateGameInfo';
	static GAME_ASK_MASTER:string = 'game.AskMaster';
	static GAME_ANSWER_MASTER:string = 'game.AnswerMaster';
	static GAME_SET_SCORE:string = 'game.SetScore';
	static GAME_SHOW_CARD:string = 'game.ShowCard';
	static GAME_ASK_PLAY_CARD:string = 'game.AskPlayCard';
	static GAME_USE_CARD_NTF:string = 'game.UseCardNtf';
	static GAME_TALK_NTF:string = 'game.TalkNtf';
	static GAME_OPERATE_REQ:string = 'game.OperateReq';
	static GAME_OPERATE_REP:string = 'game.OperateRep';
	static GAME_GAME_END:string = 'game.GameEnd';
	static GAME_ENTER_TABLE:string = 'game.EnterTable';
	static GAME_LEAVE_TABLE:string = 'game.LeaveTable';
	static GAME_TABLE_INFO:string = 'game.TableInfo';
	static GAME_GIVE_UP_GAME_REQ:string = 'game.GiveUpGameReq';
	static GAME_GIVE_UP_GAME_REP:string = 'game.GiveUpGameRep';
	static GAME_ASK_READY:string = 'game.AskReady';
	static GAME_GET_READY_REQ:string = 'game.GetReadyReq';
	static GAME_GET_READY_REP:string = 'game.GetReadyRep';
	static GAME_USER_OFFLINE:string  = 'game.UserOffline';
	static GAME_OPERATE_REP_EX:string  = 'game.OperateRepEX';
	static GAME_REPLENISH_FREEZE_GOLD_REP:string= 'game.ReplenishFreezeGoldRep';

	static REFRESH_ROUNDSCORE_INFO: string = 'refreshRoundscoreInfo'
	static PANEL_MATCH_ROUND_RESULT_CLOSE: string = 'panelMatchRoundResultClose'
	static HIDE_LABEL_WAITING: string = "hideLabelWaiting"
	static SHOW_GRP_MATCH_DETAIL: string = "showGrpMatchDetail"
	static UPDATE_SELF_MATCH_RANK: string = "updateSelfMatchRank"
	static UPDATE_MATCH_TURN_INFO: string = "updateMatchTurnInfo"
	static WEB_GET_TASK_REWARD_SUC: string = "webGetTaskRewardSuc"

	static GAME_CTS_PDK_READY: string = 'game.CTSGPdkReady';
	static GAME_STC_PDK_READY: string = 'game.STCGPdkReady';
	static GAME_STC_PDK_GIVECARDS: string = 'game.STCGPdkGiveCards';
	static GAME_CTS_PDK_OUTCARD: string = 'game.CTSGPdkOutCard';
	static GAME_STC_PDK_OUTCARD: string = 'game.STCGPdkOutCard';
	static GAME_STC_PDK_END: string = 'game.STCGPdkEnd';
	static GAME_CTS_PDK_CARD_HOLDER: string = 'game.CTSPdkCardHolder';
	static GAME_STC_PDK_CARD_HOLDER: string = 'game.STCPdkCardHolder';
	static GAME_STC_PDK_RECONNECT: string = 'game.STCPdkReconnect';
}