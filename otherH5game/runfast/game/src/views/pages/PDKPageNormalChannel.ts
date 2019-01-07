/**
 * Created by rockyl on 16/3/29.
 *
 * 普通房间频道
 */

class PDKPageNormalChannel extends PDKPageChannelBase {
    static defName: string = 'PDKPageNormalChannelSkin';

    protected init(): void {
        this.skinName = pages.PDKPageNormalChannelSkin;
    }

    createChildren(): void {
        super.createChildren();

        this.list.itemRenderer = PDKIRNormalRoom;
    }

    protected addListeners(): void {
        super.addListeners();

        pdkServer.addEventListener(PDKEventNames.USER_PLAYERS_AMOUNT_REP, this.onPlayersAmount, this);
    }

    protected removeListeners(): void {
        super.removeListeners();

        pdkServer.removeEventListener(PDKEventNames.USER_PLAYERS_AMOUNT_REP, this.onPlayersAmount, this);
    }

    protected selectRoom(event: egret.Event): void {
        super.selectRoom(event);
        pdkServer.checkReconnect();
    }


	/**
	 * 获取到房间人数
	 * @param event
	 */
    protected onPlayersAmount(event: egret.Event): void {
        let data: any = event.data;

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
				pdkServer.checkReconnect();
				break;
			}
		}*/
    }

    beforeShow(params: any): void {
        super.beforeShow(params);

        // pdkServer.getPlayersAmount();
        this.setRoomType(1);
        //this.wxMp.visible = true;
    }

    followCourse(): void {
        PDKPanelFollowCourse.instance.show();
    }

    beforeHide(action: string, params: any = null): void {
        this.removeListeners();
    }
}

class PDKIRNormalRoom extends eui.ItemRenderer {
    private imgBg: eui.Image;
    private imgName: eui.Image;
    private imgBottom: eui.Image;
    private imgIcon: eui.Image;
    private imgtabdia: eui.Image;
    private grpReward: eui.Group;
    private labLimit: eui.Label;
    private labOnlineCount: eui.Label;

    createChildren(): void {
        super.createChildren();

    }

    protected dataChanged(): void {
        super.dataChanged();
        //let roomtype:number = this.data.roomID - PDKGameConfig.gameId * 1000 - 6;
        //this.imgName.source = 'room_word_' + roomtype;
        console.log("PDKPageNormalChannel--------->", this.data);
        //pdk_tunvlang pdk_ico_nongmin
        this.imgtabdia.visible = false;
        this.grpReward.visible = false;
        if (this.data.roomID == 9000) {
            //金豆初级场
            this.imgIcon.source = "pdk_ico_nongmin"
            this.imgBg.source = 'pdk_gjc_bg';
            this.imgBottom.source = 'pdk_gjc_fenshubg';
            this.imgName.source = 'pdk_cjc';
        } else if (this.data.roomID == 9001) {
            //金豆中级场
            this.imgIcon.source = "pdk_ico_nongmin"
            this.imgBg.source = 'pdk_gjc_bg';
            this.imgBottom.source = 'pdk_gjc_fenshubg';
            this.imgName.source = 'pdk_zjc';
        } else if (this.data.roomID == 9003) {
            //金豆高级场
            this.imgIcon.source = "pdk_ico_nongmin"
            this.imgBg.source = 'pdk_gjc_bg';
            this.imgBottom.source = 'pdk_gjc_fenshubg';
            this.imgName.source = 'pdk_gjc';
        }
        else if (this.data.roomID == 9002) {
            //钻石初级场
            this.imgtabdia.visible = true;
            this.grpReward.visible = true;
            this["labtips"].text = "最高5奖杯"
            this.imgIcon.source = "pdk_tunvlang"
            this.imgBg.source = 'pdk_gjc_bg';
            this.imgBottom.source = 'pdk_gjc_fenshubg';
            this.imgName.source = 'pdk_cjc';
        }
        else if (this.data.roomID == 9004) {
            //钻石中级场
            this.imgtabdia.visible = true;
            this.grpReward.visible = true;
            this["labtips"].text = "最高50奖杯"
            this.imgIcon.source = "pdk_tunvlang"
            this.imgBg.source = 'pdk_gjc_bg';
            this.imgBottom.source = 'pdk_gjc_fenshubg';
            this.imgName.source = 'pdk_zjc';
        }
        else if (this.data.roomID == 9005) {
            //钻石高级场
            this.imgtabdia.visible = true;
            this.grpReward.visible = true;
            this["labtips"].text = "最高100奖杯"
            this.imgIcon.source = "pdk_tunvlang"
            this.imgBg.source = 'pdk_gjc_bg';
            this.imgBottom.source = 'pdk_gjc_fenshubg';
            this.imgName.source = 'pdk_gjc';
        }

        if (this.data.roomID == 9002 || this.data.roomID == 9004 || this.data.roomID == 9005) {
            this.labLimit.text = PDKlang.format(PDKlang.id.roomLimit2, PDKUtils.roomScoreFormat(PDKUtils.currencyRatio(this.data.baseScore)), PDKUtils.roomScoreFormat(PDKUtils.currencyRatio(this.data.minScore)));
        }
        else if (this.data.roomID == 9003) {
            this.labLimit.text = PDKlang.format(PDKlang.id.roomLimit3, PDKUtils.roomScoreFormat(PDKUtils.currencyRatio(this.data.baseScore)), PDKUtils.roomScoreFormat(PDKUtils.currencyRatio(this.data.minScore)));
        }
        else if (this.data.roomID == 9000 || this.data.roomID == 9001) {
            this.labLimit.text = PDKlang.format(PDKlang.id.roomLimit1, PDKUtils.roomScoreFormat(PDKUtils.currencyRatio(this.data.baseScore)), PDKUtils.roomScoreFormat(PDKUtils.currencyRatio(this.data.minScore)), PDKUtils.roomScoreFormat(PDKUtils.currencyRatio(this.data.maxScore)));
        }

        let amount: number = this.data.amount || 0;
        if (this.data.roomID == 9002) {
            this.labOnlineCount.text = "玩3局抽奖杯";
        }
        else if (this.data.roomID == 9001) {
            this.labOnlineCount.text = "赢3局抽奖杯";
        }
        else if (this.data.roomID == 9000) {
            this.labOnlineCount.text = "赢5局抽奖杯";
        }
        else {
            this.labOnlineCount.text = "赢1局抽奖杯";
        }
        // this.labOnlineCount.text = PDKalien.StringUtils.format(PDKlang.roomAmount, amount);
        // this.labOnlineCount.text = '';
    }
}