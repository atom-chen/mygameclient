/**
 * Created by rockyl on 16/3/29.
 *
 * 房间频道页
 */

class CCDDZPageChannels extends CCalien.NavigationPage {
	static defName:string = 'CCDDZPageChannels';

    private static _ins:CCDDZPageChannels = null;
	// public list:eui.List;
	private redRank:CCDDZRedRank;

    // private matchtest:any;
    private enter_normal:eui.Button;
    private enter_match:eui.Button;
    private enter_lottery:eui.Image;
    private enter_diy:eui.Button;
    private enter_red:eui.Button;
    private enter_gold:eui.Button;
    private enter_niu:eui.Button;
    private enter_pdk:eui.Button;
    private _nToGame:number;

    private goldRooms:any;
    private diamondRooms:any;

	constructor() {
		super();

        this.goldRooms = CCGlobalGameConfig.getCfgByField("goldRooms");
        this.diamondRooms =  CCGlobalGameConfig.getCfgByField("diamondRooms");
		this.init();
	}

	private init():void {
		this.skinName = pages.CCDDZPageChannelSkin;
        CCDDZPageChannels._ins = this;
	}

	createChildren():void {
		super.createChildren();
        this.addEventListener(egret.Event.RESIZE,this.onResize,this); 
        this.onResize(null);
        CCDDZMainLogic.instance.resetChannelClick();
	}

    private _initFish():void{
        let png = "cc_room_center1";
        let _info = CCGlobalGameConfig.getCfgByField("webCfg.fish");
        if(_info && _info.status == 1){
            png = "cc_room_fish";
        }else {
            _info = CCGlobalGameConfig.getCfgByField("webCfg.dzpk");
            if(_info && _info.status == 1){
                png = "cc_room_center";
            }
        }
        this.enter_lottery.source = png;
    }
    
    /**
     *  zhu 牌里的下载页面
     */
    private _showPaiLiDownload():void{
        let self = this;

        let copyString = CCGlobalGameConfig.wxService;
        let alertContent = "招募推广员,加微信:" + copyString + "\n(点击确定即可复制微信号)";
        //CCGlobalGameConfig.copyText(this.parent,copyString,"微信号");

        CCDDZPanelAlert3.instance.show(alertContent,0,function() {
            CCGlobalGameConfig.copyText(this.parent,copyString,"微信号(" + copyString +")");
        })
        //window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.htgames.chess&from=groupmessage&isappinstalled=1";
    }

    /**
     * 去普通场
     */
    private onToNewGold():void{
        CCalien.CCDDZPopUpManager.removeAllPupUp();
     
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_NGOLD);
        ccserver.checkReconnect();
        //this.navigation.push(CCDDZPageNormalChannel);
    }

    /**
     * 去极速场
     */
    private onToRedNormal(bShowRevive:boolean = true):void{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_DIAMOND);
        ccserver.checkReconnect();
    }

    /**
     * 金豆大师场
     */
    private onToGoldGame():void{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_GOLD);
        ccserver.checkReconnect();
    }

    /**
     * 去德州扑克
     */
    private onToDzpk():void{        
        CCDDZMainLogic.instance.checkPoker(()=>{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_DZPK);
            ccserver.checkReconnect();
        });
    }

    private onToFish():void{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_FISH);
        ccserver.checkReconnect();
    }

    private toGoldPage():void{
        let rooms = [].concat(this.diamondRooms,this.goldRooms);
        this.navigation.push(CCDDZPageNormalChannel,true,{roomList:rooms,scale:0.8,colNum:3,gapV:50});
    }

    public toDiamondPage():void{
        this.navigation.push(CCDDZPageNormalChannel,true,{roomList:this.diamondRooms,scale:1,colNum:2,gapV:40});
    }

    public toPdk():void{
        CCDDZMainLogic.instance.setWillToGame(CCDDZ_T_G_P_DK);
        ccserver.checkReconnect();
    }

	private onSelectChannel(event:egret.Event):void{
        var name = event.currentTarget.name;
        CCDDZMainLogic.instance.resetChannelClick();

        switch(name){
            case 'enter_pdk':
                this.toPdk();
                break;

            case 'normal':
                //this.onToNewGold();
                this.toGoldPage();
                break;
            case 'match':
                this.navigation.push(CCDDZPageMatchChannel);
                break;
            case 'diy':
                this.navigation.push(CCDDZPersonalGame);
                // CCDDZAlert.show('暂未开放敬请期待');
                /*if(CCGlobalGameConfig.testers && CCGlobalGameConfig.testers[CCDDZMainLogic.instance.selfData.uid]){
                    this.navigation.push(CCDDZPersonalGame);
                }else{
                   CCDDZAlert.show('暂未开放敬请期待');
                }*/
                break;
            case 'lottery':
                let png = event.currentTarget.source ;
                if(png == "cc_room_fish"){
                    this.onToFish();
                }else if(png == "cc_room_center"){
                    this.onToDzpk();
                }else if(png == "cc_room_center1"){
                    CCDDZPanelLottery.instance.show();
                }
                break;
            case 'red':
                //this._showPaiLiDownload();
                //this.onToRedNormal();
                this.toDiamondPage();
                break;
            case 'niu':
                //this.onToNiu();
                this.onToSmallGame();
                break;
            case 'gold':
                this.onToGoldGame();
                break;
        }

		// let channel:any = this.list.selectedItem;
        // if (this.list.selectedIndex==1){
        //     this.list.selectedIndex = -1;
        //     this.navigation.push(channel.pageDef);
        //     // if(this.matchtest[String(ccserver.uid)]){
        //     //     this.navigation.push(channel.pageDef);
        //     // }else{
        //     //     CCDDZAlert.show("暂未开启",0);
        //     // }
        // }else{
        //     this.list.selectedIndex = -1;
        //     this.navigation.push(channel.pageDef);
        // }
	}

    public onToSmallGame():void{
        CCDDZPanelSmallGame.instance.show();
    }

	beforeShow(params:any):void {
        this.enter_pdk["addClickListener"](this.onSelectChannel,this);
        this.enter_normal["addClickListener"](this.onSelectChannel,this);
        this.enter_match["addClickListener"](this.onSelectChannel,this);;
        this.enter_diy["addClickListener"](this.onSelectChannel,this);
        this.enter_niu["addClickListener"](this.onSelectChannel,this);
        this.enter_lottery["addClickListener"](this.onSelectChannel,this);
        this.enter_red["addClickListener"](this.onSelectChannel,this);
        CCDDZEventManager.instance.enableOnObject(this);
        CCDDZMainLogic.instance.hideIndexDownAndRefresh();
        this._initFish();
	}
	

    beforeHide():void{
        CCDDZEventManager.instance.disableOnObject(this);
    }

    onResize(e:egret.Event):void
	{
        // this.list.layout["gap"] = (CCalien.CCDDZStageProxy.width - this.redRank.x - this.redRank.width - 50) / 2 - 283;
	}
}

class CCDDZIRChannel extends eui.ItemRenderer{
	public imgIcon:eui.Image;
	public imgLabel:eui.Image;
    public openFlag:eui.Image;
	protected dataChanged():void {
		super.dataChanged();

		this.imgIcon.source = 'room_channel_icon_' + this.data.id;
		this.imgLabel.source = 'room_channel_lab_' + this.data.id;
        if(this.data.id == 1){
            //this.playOpenAnimate();
        }else{
            // this.removeChild(this.openFlag);
            // this.openFlag.removefromm
        }
	}

    public playOpenAnimate():void{
        this.openFlag.visible = true;
        egret.Tween.get(this.openFlag).set({
            visible:true,
            // loop:true,
            y:87,
        })
        .to({ 
            y:77,
        }, 446).
        to({ 
            y:87,
        }, 446).
        call(this.playOpenAnimate, this);
    }
}