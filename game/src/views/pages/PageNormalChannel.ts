/**
 * Created by rockyl on 16/3/29.
 *
 * 普通房间频道
 */

class PageNormalChannel extends PageChannelBase {
    static defName: string = 'PageNormalChannel';
    //private wxMp: eui.Image;

    static roomWordImg: any = {
        [1000]: "room_word_0", //3人钻石初级场
        [1001]: "room_word_0", //3人金豆休闲场
        [1002]: "room_word_1",   //3人金豆初级场
        [1006]: "room_word_1",   //3人组钻石中级场
        [8000]: "room_word_1",  //2人钻石中级场
        [8001]: "room_word_2",  //2人金豆中级场
        [8002]: "room_word_2",  //2人金豆高级场
        [8003]: "room_word_2",  //2人钻石高级场
        [8004]: "room_word_2"   //2人钻石高级场
    }

    protected init(): void {
        this.skinName = pages.PageNormalChannelSkin;
    }

    createChildren(): void {
        super.createChildren();

        this.list.itemRenderer = IRNormalRoom;
    }

    protected addListeners(): void {
        super.addListeners();

        server.addEventListener(EventNames.USER_PLAYERS_AMOUNT_REP, this.onPlayersAmount, this);
        //this.wxMp.addEventListener(egret.TouchEvent.TOUCH_TAP,this.navigateToUrl,this);

    }

    protected removeListeners(): void {
        super.removeListeners();

        server.removeEventListener(EventNames.USER_PLAYERS_AMOUNT_REP, this.onPlayersAmount, this);
        //this.wxMp.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.navigateToUrl,this);
    }

    protected selectRoom(event: egret.Event): void {
        super.selectRoom(event);
        if (this.selectedRoom && this.selectedRoom.showDownApp) {
            PanelActAndNotice.getInstance().showAPPAct();
            return;
        }
        console.log("selectRoom-------------->", event);
        server.checkReconnect();
    }


	/**
	 * 获取到房间人数
	 * @param event
	 */
    protected onPlayersAmount(event: egret.Event): void {
        let data: any = event.data;
        let bShowCnt = GameConfig.getCfgByField("custom.onLineCnt");
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
				server.checkReconnect();
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
        if (params) {
            let roomList = this._foramtRoomList(params);
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
        server.getPlayersAmount(1);
        server.getPlayersAmount(8);
    }

    followCourse(): void {
        PanelFollowCourse.instance.show();
    }

    beforeHide(action: string, params: any = null): void {
        this.removeListeners();
    }
}

class IRNormalRoom extends eui.ItemRenderer {
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
        this.imgLevel.source = PageNormalChannel.roomWordImg[data.roomID];
        let sType = "金豆";
        let bShowDia = false;
        let sIconImg = "icon_room_2";
        let bShowNewDia = false;
        if (data.roomFlag == 2) {
            sType = "钻石";
            sIconImg = "room_diamond_person";
            bShowDia = true;
            if (data.roomID == 1000) {
                bShowNewDia = true;
            }
        }
        this["newDiaImg"].visible = bShowNewDia;
        this["diaFlagImg"].visible = bShowDia;
        this["imgIcon"].source = sIconImg;
        if (data.maxScore >= 99999999) {
            this.labLimit.text = lang.format(lang.id.roomLimit2, Utils.roomScoreFormat(Utils.currencyRatio(data.baseScore)), Utils.roomScoreFormat(Utils.currencyRatio(data.minScore)), sType);
        } else {
            this.labLimit.text = lang.format(lang.id.roomLimit1, Utils.roomScoreFormat(Utils.currencyRatio(data.baseScore)), Utils.roomScoreFormat(Utils.currencyRatio(data.minScore)), Utils.roomScoreFormat(Utils.currencyRatio(data.maxScore)), sType);
        }
        //this.lblName.text = data.roomflagname;
        this["grpName"].visible = false;

        let amount: number = data.amount || 0;


        let bShowCnt = GameConfig.getCfgByField("custom.onLineCnt");
        if (!bShowCnt) {
            if (data.roomid2maxredcoin) {
                this.labOnlineCount.text = data.roomid2maxredcoin;
            }
            //this.labOnlineCount.visible = false;
        } else {
            //this.labOnlineCount.visible = true;
            this.labOnlineCount.text = alien.StringUtils.format(lang.roomAmount, amount);
        }
        if (data.roomflagname) {
            this.grpTips.visible = true;
            this.lblTips.text = data.roomflagname;
        } else {
            this.grpTips.visible = false;
        }
    }
}