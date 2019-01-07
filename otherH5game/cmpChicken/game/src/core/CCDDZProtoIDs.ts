/**
 * Created by rockyl on 15/12/8.
 *
 * 协议映射表
 */

class CCDDZProtoIDs{
	static getMap():any{
        let protoIDs = {}
        
        protoIDs[2001] = "game.GameStartNtf"
        protoIDs["game.GameStartNtf"] = 2001
        protoIDs[2002] = "game.SetSession"
        protoIDs["game.SetSession"] = 2002
        protoIDs[2003] = "game.TableInfo"
        protoIDs["game.TableInfo"] = 2003
        protoIDs[2004] = "game.EnterTable"
        protoIDs["game.EnterTable"] = 2004
        protoIDs[2005] = "game.AskReady"
        protoIDs["game.AskReady"] = 2005
        protoIDs[2006] = "game.LeaveTable"
        protoIDs["game.LeaveTable"] = 2006
        protoIDs[2007] = "game.GetReadyReq"
        protoIDs["game.GetReadyReq"] = 2007
        protoIDs[2008] = "game.GetReadyRep"
        protoIDs["game.GetReadyRep"] = 2008
        protoIDs[2009] = "game.AskCashOn"
        protoIDs["game.AskCashOn"] = 2009
        protoIDs[2010] = "game.AnswerCashOn"
        protoIDs["game.AnswerCashOn"] = 2010
        protoIDs[2011] = "game.UseCardNtf"
        protoIDs["game.UseCardNtf"] = 2011
        protoIDs[2012] = "game.AskMaster"
        protoIDs["game.AskMaster"] = 2012
        protoIDs[2013] = "game.AnswerMaster"
        protoIDs["game.AnswerMaster"] = 2013
        protoIDs[2014] = "game.SetScore"
        protoIDs["game.SetScore"] = 2014
        protoIDs[2015] = "game.AskPlayCard"
        protoIDs["game.AskPlayCard"] = 2015
        protoIDs[2016] = "game.AddCard"
        protoIDs["game.AddCard"] = 2016
        protoIDs[2017] = "game.ShowCard"
        protoIDs["game.ShowCard"] = 2017
        protoIDs[2018] = "game.GameEnd"
        protoIDs["game.GameEnd"] = 2018
        protoIDs[2019] = "game.TalkNtf"
        protoIDs["game.TalkNtf"] = 2019
        protoIDs[2020] = "game.RobotSetInfos"
        protoIDs["game.RobotSetInfos"] = 2020
        protoIDs[2021] = "game.SetCards"
        protoIDs["game.SetCards"] = 2021
        protoIDs[2022] = "game.ReconnectReq"
        protoIDs["game.ReconnectReq"] = 2022
        protoIDs[2023] = "game.ReconnectRep"
        protoIDs["game.ReconnectRep"] = 2023
        protoIDs[2024] = "game.GiveUpGameReq"
        protoIDs["game.GiveUpGameReq"] = 2024
        protoIDs[2025] = "game.GiveUpGameRep"
        protoIDs["game.GiveUpGameRep"] = 2025
        protoIDs[2026] = "game.UserOffline"
        protoIDs["game.UserOffline"] = 2026
        protoIDs[2027] = "game.UserOnline"
        protoIDs["game.UserOnline"] = 2027
        protoIDs[2028] = "game.GameActionReq"
        protoIDs["game.GameActionReq"] = 2028
        protoIDs[2029] = "game.GameActionRep"
        protoIDs["game.GameActionRep"] = 2029
        protoIDs[2030] = "game.UpdateMasterInfo"
        protoIDs["game.UpdateMasterInfo"] = 2030
        protoIDs[2031] = "game.UpdateBetInfo"
        protoIDs["game.UpdateBetInfo"] = 2031
        protoIDs[2032] = "game.GameStatusNtf"
        protoIDs["game.GameStatusNtf"] = 2032
        protoIDs[2033] = "game.UpdateGameInfo"
        protoIDs["game.UpdateGameInfo"] = 2033
        protoIDs[2034] = "game.OperateReq"
        protoIDs["game.OperateReq"] = 2034
        protoIDs[2035] = "game.OperateRep"
        protoIDs["game.OperateRep"] = 2035
        protoIDs[2036] = "game.UserInfoInGameReq"
        protoIDs["game.UserInfoInGameReq"] = 2036
        protoIDs[2037] = "game.UserInfoInGameRep"
        protoIDs["game.UserInfoInGameRep"] = 2037
        protoIDs[2038] = "game.AiInfo"
        protoIDs["game.AiInfo"] = 2038
        protoIDs[2039] = "game.ServerInfoNtf"
        protoIDs["game.ServerInfoNtf"] = 2039
        protoIDs[2040] = "game.SidePotInfo"
        protoIDs["game.SidePotInfo"] = 2040
        protoIDs[2041] = "game.OperateRepEX"
        protoIDs["game.OperateRepEX"] = 2041
        protoIDs[2042] = "game.ReplenishFreezeGoldReq"
        protoIDs["game.ReplenishFreezeGoldReq"] = 2042
        protoIDs[2043] = "game.ReplenishFreezeGoldRep"
        protoIDs["game.ReplenishFreezeGoldRep"] = 2043

        protoIDs[1001] = "user.UserInfoRequest"
        protoIDs["user.UserInfoRequest"] = 1001
        protoIDs[1002] = "user.UserInfoResonpse"
        protoIDs["user.UserInfoResonpse"] = 1002
        protoIDs[1003] = "user.ModifyUserInfoReq"
        protoIDs["user.ModifyUserInfoReq"] = 1003
        protoIDs[1004] = "user.ModifyUserInfoRep"
        protoIDs["user.ModifyUserInfoRep"] = 1004
        protoIDs[1005] = "user.CheckReconnectReq"
        protoIDs["user.CheckReconnectReq"] = 1005
        protoIDs[1006] = "user.CheckReconnectRep"
        protoIDs["user.CheckReconnectRep"] = 1006
        protoIDs[1007] = "user.ReconnectTableReq"
        protoIDs["user.ReconnectTableReq"] = 1007
        protoIDs[1008] = "user.ReconnectTableRep"
        protoIDs["user.ReconnectTableRep"] = 1008
        protoIDs[1009] = "user.QuickJoinRequest"
        protoIDs["user.QuickJoinRequest"] = 1009
        protoIDs[1010] = "user.QuickJoinResonpse"
        protoIDs["user.QuickJoinResonpse"] = 1010
        protoIDs[1011] = "user.PlayersAmountReq"
        protoIDs["user.PlayersAmountReq"] = 1011
        protoIDs[1012] = "user.PlayersAmountRep"
        protoIDs["user.PlayersAmountRep"] = 1012

        protoIDs[1013] = "user.MatchOperateReq"
        protoIDs["user.MatchOperateReq"] = 1013
        protoIDs[1014] = "user.MatchOperateRep"
        protoIDs["user.MatchOperateRep"] = 1014

        protoIDs[1021] = "user.MatchSignupReq"
        protoIDs["user.MatchSignupReq"] = 1021
        protoIDs[1022] = "user.MatchSignupRep"
        protoIDs["user.MatchSignupRep"] = 1022
        protoIDs[1023] = "user.MatchStartNtf"
        protoIDs["user.MatchStartNtf"] = 1023
        protoIDs[1024] = "user.EnterMatchReq"
        protoIDs["user.EnterMatchReq"] = 1024
        protoIDs[1025] = "user.EnterMatchRep"
        protoIDs["user.EnterMatchRep"] = 1025
        protoIDs[1026] = "user.MatchInfoNtf"
        protoIDs["user.MatchInfoNtf"] = 1026
        protoIDs[1027] = "user.QueryFreezeGoldReq"
        protoIDs["user.QueryFreezeGoldReq"] = 1027
        protoIDs[1028] = "user.QueryFreezeGoldRep"
        protoIDs["user.QueryFreezeGoldRep"] = 1028

        protoIDs[1038] = "user.DaySigninOptReq"
        protoIDs["user.DaySigninOptReq"] = 1038
        protoIDs[1039] = "user.DaySigninOptRep"
        protoIDs["user.DaySigninOptRep"] = 1039
        protoIDs[1040] = "user.MatchSignupInfoReq"
        protoIDs["user.MatchSignupInfoReq"] = 1040
        protoIDs[1041] = "user.MatchSignupInfoRep"
        protoIDs["user.MatchSignupInfoRep"] = 1041
        protoIDs[1042] = "user.NotifyKickout"
        protoIDs["user.NotifyKickout"] = 1042

        protoIDs[1046] = "user.BagInfoReq"
        protoIDs["user.BagInfoReq"] = 1046
        protoIDs[1047] = "user.BagInfoRep"
        protoIDs["user.BagInfoRep"] = 1047
        protoIDs[1048] = "user.GiveupMatchReq"
        protoIDs["user.GiveupMatchReq"] = 1048
        protoIDs[1049] = "user.GiveupMatchRep"
        protoIDs["user.GiveupMatchRep"] = 1049
        protoIDs[1050] = "user.AlmsReq"
        protoIDs["user.AlmsReq"] = 1050
        protoIDs[1051] = "user.AlmsRep"
        protoIDs["user.AlmsRep"] = 1051
        protoIDs[1052] = "user.RechargeResultNotify"
        protoIDs["user.RechargeResultNotify"] = 1052

        protoIDs[1055] = "user.Pay2chatReq"
        protoIDs["user.Pay2chatReq"] = 1055
        protoIDs[1056] = "user.Pay2chatRep"
        protoIDs["user.Pay2chatRep"] = 1056

        protoIDs[1061] = "user.MailReq"
        protoIDs["user.MailReq"] = 1061
        protoIDs[1062] = "user.MailDetail"
        protoIDs["user.MailDetail"] = 1062
        protoIDs[1063] = "user.MailListRep"
        protoIDs["user.MailListRep"] = 1063
        protoIDs[1064] = "user.MailModifyRep"
        protoIDs["user.MailModifyRep"] = 1064
        protoIDs[1065] = "user.MailGetRewardRep"
        protoIDs["user.MailGetRewardRep"] = 1065
        protoIDs[1066] = "user.MailUnreadRep"
        protoIDs["user.MailUnreadRep"] = 1066

        protoIDs[1073] = "user.CreatePersonalGameReq"
        protoIDs["user.CreatePersonalGameReq"] = 1073
        protoIDs[1074] = "user.CreatePersonalGameRep"
        protoIDs["user.CreatePersonalGameRep"] = 1074
        protoIDs[1075] = "user.JoinPGameReq"
        protoIDs["user.JoinPGameReq"] = 1075
        protoIDs[1076] = "user.JoinPGameRep"
        protoIDs["user.JoinPGameRep"] = 1076
        protoIDs[1077] = "user.StartPGameReq"
        protoIDs["user.StartPGameReq"] = 1077
        protoIDs[1078] = "user.StartPGameRep"
        protoIDs["user.StartPGameRep"] = 1078
        protoIDs[1079] = "user.QueryRoomInfoReq"
        protoIDs["user.QueryRoomInfoReq"] = 1079
        protoIDs[1080] = "user.QueryRoomInfoRep"
        protoIDs["user.QueryRoomInfoRep"] = 1080
        protoIDs[1081] = "user.QuitPGameReq"
        protoIDs["user.QuitPGameReq"] = 1081
        protoIDs[1082] = "user.QuitRoomRep"
        protoIDs["user.QuitRoomRep"] = 1082
        protoIDs[1083] = "user.GameDissolve"
        protoIDs["user.GameDissolve"] = 1083
        protoIDs[1084] = "user.ReconnectPGameReq"
        protoIDs["user.ReconnectPGameReq"] = 1084
        protoIDs[1085] = "user.ReconnectPGameRep"
        protoIDs["user.ReconnectPGameRep"] = 1085

        protoIDs[1090] = "user.RedcoinExchangeGoodsReq"
        protoIDs["user.RedcoinExchangeGoodsReq"] = 1090
        protoIDs[1091] = "user.RedcoinExchangeGoodsRep"
        protoIDs["user.RedcoinExchangeGoodsRep"] = 1091
        protoIDs[1092] = "user.LotteryRedcoinReq"
        protoIDs["user.LotteryRedcoinReq"] = 1092
        protoIDs[1093] = "user.LotteryRedcoinRep"
        protoIDs["user.LotteryRedcoinRep"] = 1093
        protoIDs[1094] = "user.RedcoinRankingListReq"
        protoIDs["user.RedcoinRankingListReq"] = 1094
        protoIDs[1095] = "user.RedcoinRankingListRep"
        protoIDs["user.RedcoinRankingListRep"] = 1095
        protoIDs[1096] = "user.FreshManRedcoinLotteryChanceGot"
        protoIDs["user.FreshManRedcoinLotteryChanceGot"] = 1096
        protoIDs[1099] = "user.DissolveGameReq"
        protoIDs["user.DissolveGameReq"] = 1099
        protoIDs[1100] = "user.DissolveGameRep"
        protoIDs["user.DissolveGameRep"] = 1100
        protoIDs[1101] = "user.QueryRoomPlayingReq"
        protoIDs["user.QueryRoomPlayingReq"] = 1101
        protoIDs[1102] = "user.QueryRoomPlayingRep"
        protoIDs["user.QueryRoomPlayingRep"] = 1102
        protoIDs[1107] = "user.GetFreshManRewardReq"
        protoIDs["user.GetFreshManRewardReq"] = 1107
        protoIDs[1108] = "user.GetFreshManRewardRep"
        protoIDs["user.GetFreshManRewardRep"] = 1108
        protoIDs[1109] = "user.GetCardsRecorderRewardReq"
        protoIDs["user.GetCardsRecorderRewardReq"] = 1109
        protoIDs[1110] = "user.GetDayTaskRewardReq"
        protoIDs["user.GetDayTaskRewardReq"] = 1110
        protoIDs[1111] = "user.GetDayTaskRewardRep"
        protoIDs["user.GetDayTaskRewardRep"] = 1111
        protoIDs[1112] = "user.GetFirstRechargeRewardReq"
        protoIDs["user.GetFirstRechargeRewardReq"] = 1112
        protoIDs[1113] = "user.GetFirstRechargeRewardRep"
        protoIDs["user.GetFirstRechargeRewardRep"] = 1113
        protoIDs[1114] = "user.GetRewardReq"
        protoIDs["user.GetRewardReq"] = 1114
        protoIDs[1115] = "user.GetRewardRep"
        protoIDs["user.GetRewardRep"] = 1115
        protoIDs[1116] = "user.GetActivityInfoReq"
        protoIDs["user.GetActivityInfoReq"] = 1116
        protoIDs[1117] = "user.GetActivityInfoRep"
        protoIDs["user.GetActivityInfoRep"] = 1117
        protoIDs[1118] = "user.OperateReq"
        protoIDs["user.OperateReq"] = 1118
        protoIDs[1119] = "user.OperateRep"
        protoIDs["user.OperateRep"] = 1119
        protoIDs[1120] = "user.DiamondGameReq"
        protoIDs["user.DiamondGameReq"] = 1120
        protoIDs[1121] = "user.DiamondGameRep"
        protoIDs["user.DiamondGameRep"] = 1121
        protoIDs[1122] = "user.QuitWaitingQueueReq"
        protoIDs["user.QuitWaitingQueueReq"] = 1122
        protoIDs[1123] = "user.RedCoindLotteryReq"
        protoIDs["user.RedCoindLotteryReq"] = 1123
        protoIDs[1124] = "user.RedCoindLotteryRep"
        protoIDs["user.RedCoindLotteryRep"] = 1124
        return protoIDs
	}
}

