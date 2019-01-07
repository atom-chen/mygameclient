class CCEventNames{
	static LOADING_PROGRESS:string = 'loadingProgress';
	static BUTTON_BAR_TAP:string = 'buttonBarTap';
    static SET_PASSWORD_SUCC: string ="setPasswordSucc";

	static SELECT_CHAT:string = 'selectChat';
	static SELECT_CARDS:string = 'selectCards';
    static SHOW_ROLE_INFO: string = 'showRoleInfo';
    static COMBO_COMPLETE: string ="comboComplete";
    static SHOW_CARD_END: string = "showCardEnd";
    static CLEAR_HEAD: string = "clearHead";
    static SHOW_GOODS_TIP: string = 'showGoodsTip';
    static SHOW_USE_GOODS_PHONE: string = 'showUseGoodsPhone';
    static SHOW_GET_ITEMS: string = 'showGetItems';
    static SHOW_MISSION_GET_ITEMS: string = 'showMissionGetItems';
    static SHOW_CHARGE: string = 'showCharge';
    static SHOW_MESSAGE_BOX: string = 'showMessageBox';
    static SHOW_LABA: string = 'showLaba';
    static CLEAR_LABA: string = 'clearLaba';
    static SHOW_PANEL_TEAM: string = 'showPanelTeam';
    static SHOW_TEAM_TABLE: string = 'showTableTeam';
    static SHOW_TEAM_CONFIRM: string = 'showTeamConfirm';
    static SHOW_SERVICE: string = 'showService';
    static SHOW_GOLD_RAIN: string = 'showGoldRain';
    static SHOW_ROLE_RATE: string = 'showRoleRate';
    static SHOW_MATCH_WARN: string = 'showMatchWarn';
    static SHOW_RECHARGE_CHOOSE: string = 'showRechargeChoose';
    static SHOW_TEAM_ROOM_INFO: string = 'showTeamRoomInfo';
    static RECHARGE_SUCC: string = 'rechargeSucc';
    static TEAM_REFRESH: string = 'teamRefresh';
    static TEAM_CONFIRM: string = 'teamConfirm';
    static TEAM_START: string = 'teamStart';
    
    static CHAT_NEW_MESSGAE: string = 'chatNewMessage';
    static MAIL_LIST_REFRESH: string = 'mailListRefresh';
    static MAIL_UNREAD_UPDATE: string = 'mailUnOpenUpdate';
    
    static HIDE_CHIPS: string = 'hideChips';

	static LOG:string = 'log';
	static SHOW_DISCONNECT:string = 'showDisconnect';
	static HIDE_DISCONNECT:string = 'hideDisconnect';
	
    static SHOW_SIGN_DOWNLOAD: string = 'showSignDownload';
    static TEAM_TABLE_SCORE_CHANGE: string = 'teamTableScoreChange';
    static TEAM_NUMBER: string = 'teamNumber';

	//ccserver
	static CONNECT_SERVER:string = 'connectToServer';
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
	static USER_QUERY_FREEZE_GOLD_REP:string = 'user.QueryFreezeGoldRep';
	static USER_QUERY_FREEZE_GOLD_REQ:string = 'user.QueryFreezeGoldReq';
	
	
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
    static GAME_ASK_CASHON:string = "game.AskCashOn";
    
	static GAME_REPLENISH_FREEZEGOLD_REQ:string = "game.ReplenishFreezeGoldReq";
	static GAME_REPLENISH_FREEZEGOLD_REP:string = "game.ReplenishFreezeGoldRep";

    static SET_NUM_TEXT: string = 'SET_NUM_TEXT';
    static NUM_TYPE_DELETE: string = 'NUM_TYPE_DELETE';
    static NUM_TYPE_ADD: string = 'NUM_TYPE_ADD';
    static NUM_TYPE_INIT: string = 'NUM_TYPE_INIT';
    static AUTO_START: string = 'AUTO_START';
    static RUN_STEP2: string ='RUN_STEP2';
    static SHOW_WARN: string = 'SHOW_WARN';
    static SHOW_LOADING: string = 'SHOW_LOADING';
    
    static MISSION_LIST_REFRESH: string = 'missionListRefresh';
    static MISSION_COMPLETE: string = 'missionComplete';
    static GOLD_UPDATE: string = 'goldUpdate';

	static STRART_COMPARISON: string = "startComparison"
	static CC_SHOW_HAPPY_SCORE: string = "cc_showHappyScore"
	static CC_SHOW_SCORECHANGE: string = "cc_showScorechange"
	static CC_SHOW_NEXT_HAPPY_SCORE: string = "cc_showNextHappyScore"
	static CC_SEND_GIVE_UP_MSG: string = "cc_sendGiveUpMsg"
}