/**
 * Created by rockyl on 16/3/29.
 *
 * 普通房间频道
 */

class CCDDZPageNormalChannel extends CCDDZPageChannelBase {
    static defName: string = 'CCDDZPageNormalChannel';
    //private wxMp: eui.Image;

    static roomWordImg: any = {
        [10001]: "cc_room_word_0",   //2人金豆初级场
        [10002]: "cc_room_word_1",   //2人金豆中级场
        [10003]: "cc_room_word_2",   //2人金豆高级场
        [10004]: "cc_room_word_0",   //2人钻石初级场
        [10005]: "cc_room_word_1",   //2人钻石中级场
        [10006]: "cc_room_word_2"   //2人钻石高级场
    }

    protected init(): void {
        this.skinName = pages.CCDDZPageNormalChannelSkin;
    }

    createChildren(): void {
        super.createChildren();

        this.list.itemRenderer = CCDDZIRNormalRoom;
    }

    protected addListeners(): void {
        super.addListeners();

        ccserver.addEventListener(CCGlobalEventNames.USER_PLAYERS_AMOUNT_REP, this.onPlayersAmount, this);
        //this.wxMp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.navigateToUrl,this);

    }

    protected removeListeners(): void {
        super.removeListeners();

        ccserver.removeEventListener(CCGlobalEventNames.USER_PLAYERS_AMOUNT_REP, this.onPlayersAmount, this);
        //this.wxMp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.navigateToUrl,this);
    }

    protected selectRoom(event: egret.Event): void {
        super.selectRoom(event);
        if (this.selectedRoom && this.selectedRoom.showDownApp) {
            CCDDZPanelActAndNotice.getInstance().showAPPAct();
            return;
        }
        ccserver.checkReconnect();
    }


	/**
	 * 获取到房间人数
	 * @param event
	 */
    protected onPlayersAmount(event: egret.Event): void {
        let data: any = event.data;
        let bShowCnt = CCGlobalGameConfig.getCfgByField("custom.onLineCnt");
        if (!bShowCnt)
            return;

        data.info.forEach((item: any, index: number) => {
            let room: any = this.getRoomById(item.room_id);
            if (room) {
                room.amount = item.amount;
            }
        });

        this._dataProvide.refresh();
    }

	/**
	 * 快速加入游戏
	 */
    private fastJoin(): void {
		/*for (let i = this._roomList.length - 1; i >= 0; i--) {
			let room = this._roomList[i];

			if(parseInt(this._self.gold) >= room.minScore){
				this.selectedRoom = room;
				ccserver.checkReconnect();
				break;
			}
		}*/
    }

    private navigateToUrl(): void {
        this.followCourse();
    }

    private _foramtRoomList(params: any): any {
        let len = params.roomList.length;
        let roomList = [];
        for (let i = 0; i < len; ++i) {
            let oneInfo = params.roomList[i];
            oneInfo.scale = params.scale;
            roomList.push(oneInfo);
        }
        return roomList;
    }

    beforeShow(action: string, params: any): void {
        super.beforeShow(action, params);
        console.log("beforeShow---111--->", params);
        if (params) {
            let roomList = this._foramtRoomList(params);
            console.log("beforeShow---222--->", roomList);
            roomList.sort((a, b) => {
                if (a.roomType == b.roomType) {
                    b.roomID - a.roomID;
                }
                return b.roomType - a.roomType;
            })
            this.setRoomList(roomList);
            let layout: eui.TileLayout = <eui.TileLayout>this.list.layout;
            layout.requestedColumnCount = params.colNum;
            layout.verticalGap = params.gapV;
            if (params.colNum == 3) {
                layout.horizontalGap = 30;
            } else {
                layout.horizontalGap = 65;
            }
        }
        ccserver.getPlayersAmount(1);
        ccserver.getPlayersAmount(8);
    }

    followCourse(): void {
        CCDDZPanelFollowCourse.instance.show();
    }

    beforeHide(action: string, params: any = null): void {
        this.removeListeners();
    }
}

class CCDDZIRNormalRoom extends eui.ItemRenderer {
    private imgLevel: eui.Image;
    private labLimit: eui.Label;
    private labOnlineCount: eui.Label;
    private lblName: eui.Label;
    private lblTips: eui.Label;
    private grpTips: eui.Group;
    createChildren(): void {
        super.createChildren();
    }

    $onAddToStage(stage: egret.Stage, nestLevel: number): void {
        super.$onAddToStage(stage, nestLevel);
        this.runTipScale();
    }

    private runTipScale(): void {
        this.stopTipsScale();
        egret.Tween.get(this.grpTips).set({ scaleX: 0, scaleY: 0, alpha: 0 }).wait(500).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300);
    }

    private stopTipsScale(): void {
        egret.Tween.removeTweens(this.grpTips);
    }

    protected dataChanged(): void {
        super.dataChanged();

        let data = this.data;
        this.scaleX = this.scaleY = data.scale;
        if (data.showDownApp) {
            this.currentState = "justBg";
            return;
        } else {
            this.currentState = "all";
        }
        this.imgLevel.source = CCDDZPageNormalChannel.roomWordImg[data.roomID];
        let sType = "金豆";
        let bShowDia = false;
        let sIconImg = "cc_room_bean";
        let bShowNewDia = false;
        if (data.roomFlag == 2) {
            sType = "钻石";
            sIconImg = "cc_room_diamond";
            bShowDia = true;
            if (data.roomID == 1000) {
                bShowNewDia = true;
            }
        }
        this["newDiaImg"].visible = bShowNewDia;
        this["diaFlagImg"].visible = bShowDia;
        this["imgIcon"].source = sIconImg;
        if (data.maxScore >= 99999999) {
            this.labLimit.text = lang.format(lang.id.roomLimit2, CCDDZUtils.roomScoreFormat(CCDDZUtils.currencyRatio(data.baseScore)), CCDDZUtils.roomScoreFormat(CCDDZUtils.currencyRatio(data.minScore)), sType);
        } else {
            this.labLimit.text = lang.format(lang.id.roomLimit1, CCDDZUtils.roomScoreFormat(CCDDZUtils.currencyRatio(data.baseScore)), CCDDZUtils.roomScoreFormat(CCDDZUtils.currencyRatio(data.minScore)), CCDDZUtils.roomScoreFormat(CCDDZUtils.currencyRatio(data.maxScore)), sType);
        }

        this["grpName"].visible = false;

        let amount: number = data.amount || 0;

        let bShowCnt = CCGlobalGameConfig.getCfgByField("custom.onLineCnt");
        if (!bShowCnt) {
            if (data.roomid2maxredcoin) {
                this.labOnlineCount.text = data.roomid2maxredcoin;
            }
        } else {
            this.labOnlineCount.text = CCalien.StringUtils.format(lang.roomAmount, amount);
        }
        if (data.roomflagname) {
            this.grpTips.visible = true;
            this.lblTips.text = data.roomflagname;
        } else {
            this.grpTips.visible = false;
        }
    }
}