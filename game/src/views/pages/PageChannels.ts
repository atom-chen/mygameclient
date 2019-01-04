/**
 * Created by rockyl on 16/3/29.
 *
 * 房间频道页
 */

class PageChannels extends alien.NavigationPage {
	static defName:string = 'PageChannels';

    private static _ins:PageChannels = null;
	// public list:eui.List;
	private redRank:RedRank;

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
    private enter_bj:eui.Image;
    private enter_more:eui.Image;
    private enter_fish:eui.Button;
    private goldRooms:any;
    private diamondRooms:any;

	constructor() {
		super();

        this.goldRooms = GameConfig.getCfgByField("goldRooms");
        this.diamondRooms =  GameConfig.getCfgByField("diamondRooms");
		this.init();
	}

	private init():void {
		this.skinName = pages.PageChannelSkin;
        PageChannels._ins = this;
	}

	createChildren():void {
		super.createChildren();
        this.addEventListener(egret.Event.RESIZE,this.onResize,this); 
        this.onResize(null);
        MainLogic.instance.resetChannelClick();
	}

    private _initFish():void{
        let png = "room_center1";
        let newFish = GameConfig.getCfgByField("custom.newFish");
        if (newFish && newFish.status == 1){
                this.enter_fish.visible = true;
        }else{
            this.enter_fish.visible = false;
            let _info = GameConfig.getCfgByField("webCfg.fish");
            if(_info && _info.status == 1){
                png = "room_fish";
            }else {
                _info = GameConfig.getCfgByField("webCfg.dzpk");
                if(_info && _info.status == 1){
                    png = "room_center";
                }
            }
        }
        this.enter_lottery.source = png;
    }
    
    /**
     *  zhu 牌里的下载页面
     */
    private _showPaiLiDownload():void{
        let self = this;

        let copyString = GameConfig.wxService;
        let alertContent = "招募推广员,加微信:" + copyString + "\n(点击确定即可复制微信号)";
        //GameConfig.copyText(this.parent,copyString,"微信号");

        PanelAlert3.instance.show(alertContent,0,function() {
            GameConfig.copyText(this.parent,copyString,"微信号(" + copyString +")");
        })
        //window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.htgames.chess&from=groupmessage&isappinstalled=1";
    }

    /**
     * 去普通场
     */
    private onToNewGold():void{
        alien.PopUpManager.removeAllPupUp();
     
        MainLogic.instance.setWillToGame(T_G_NGOLD);
        server.checkReconnect();
        //this.navigation.push(PageNormalChannel);
    }

    /**
     * 去极速场
     */
    private onToRedNormal(bShowRevive:boolean = true):void{
        MainLogic.instance.setWillToGame(T_G_DIAMOND);
        server.checkReconnect();
    }

    /**
     * 金豆大师场
     */
    private onToGoldGame():void{
        MainLogic.instance.setWillToGame(T_G_GOLD);
        server.checkReconnect();
    }

    /**
     * 去德州扑克
     */
    private onToDzpk():void{        
        MainLogic.instance.checkPoker(()=>{
        MainLogic.instance.setWillToGame(T_G_DZPK);
            server.checkReconnect();
        });
    }

    private onToFish():void{
        let cfg = GameConfig.getCfgByField("custom.newFish");
        if(cfg.status == 1){
            GameConfig.toUrl(cfg.url);
            return;
        }
        
        MainLogic.instance.setWillToGame(T_G_FISH);
        server.checkReconnect();
    }

    private toGoldPage():void{
        let rooms = [].concat(this.diamondRooms,this.goldRooms);
        this.navigation.push(PageNormalChannel,true,{roomList:rooms,scale:0.8,colNum:3,gapV:50});
    }

    public toDiamondPage():void{
        this.navigation.push(PageNormalChannel,true,{roomList:this.diamondRooms,scale:1,colNum:2,gapV:40});
    }

    public toMatchPage(): void {
        this.navigation.push(PageMatchChannel);
    }

    public toPdk():void{
        MainLogic.instance.setWillToGame(T_G_P_DK);
        server.checkReconnect();
    }

	private onSelectChannel(event:egret.Event):void{
        var name = event.currentTarget.name;
        MainLogic.instance.resetChannelClick();

        switch(name){
            case 'enter_pdk':
                this.toPdk();
                break;

            case 'normal':
                //this.onToNewGold();
                this.toGoldPage();
                break;
            case 'match':
                this.toMatchPage();
                break;
            case 'diy':
                this.navigation.push(PersonalGame);
                // Alert.show('暂未开放敬请期待');
                /*if(GameConfig.testers && GameConfig.testers[MainLogic.instance.selfData.uid]){
                    this.navigation.push(PersonalGame);
                }else{
                   Alert.show('暂未开放敬请期待');
                }*/
                break;
            case 'lottery':
                let png = event.currentTarget.source ;
                if (png == "room_fish_1"){
                    this.onToFish();
                }else if(png == "room_fish"){
                    this.onToFish();
                }else if(png == "room_center"){
                    this.onToDzpk();
                }else if(png == "room_center1"){
                    PanelLottery.instance.show();
                }
                break;
            case 'fish':
                this.onToFish();
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
            case 'bj':
                this.onToBJ();
                break;            
            case 'more':
                Toast.show("更多游戏，敬请期待！");
                break;
        }

		// let channel:any = this.list.selectedItem;
        // if (this.list.selectedIndex==1){
        //     this.list.selectedIndex = -1;
        //     this.navigation.push(channel.pageDef);
        //     // if(this.matchtest[String(server.uid)]){
        //     //     this.navigation.push(channel.pageDef);
        //     // }else{
        //     //     Alert.show("暂未开启",0);
        //     // }
        // }else{
        //     this.list.selectedIndex = -1;
        //     this.navigation.push(channel.pageDef);
        // }
	}
    public onToBJ(): void {
        MainLogic.instance.setWillToGame(T_G_BJ);
        server.checkReconnect();       
        // alien.SceneManager.show(SceneNames.RUNFASTPLAY, { roomID: 401}, alien.sceneEffect.Fade);   
    }
    public onToSmallGame():void{
        PanelSmallGame.instance.show();            
    }

	beforeShow(params:any):void {
        this.enter_pdk["addClickListener"](this.onSelectChannel,this);
        this.enter_normal["addClickListener"](this.onSelectChannel,this);
        this.enter_match["addClickListener"](this.onSelectChannel,this);;
        this.enter_diy["addClickListener"](this.onSelectChannel,this);
        this.enter_niu["addClickListener"](this.onSelectChannel,this);
        this.enter_lottery["addClickListener"](this.onSelectChannel,this);
        this.enter_red["addClickListener"](this.onSelectChannel,this);
        this.enter_bj["addClickListener"](this.onSelectChannel,this);
        this.enter_more["addClickListener"](this.onSelectChannel,this);
        this.enter_fish["addClickListener"](this.onSelectChannel,this);
        EventManager.instance.enableOnObject(this);
        MainLogic.instance.hideIndexDownAndRefresh();
        this._initFish();
	}
	

    beforeHide():void{
        EventManager.instance.disableOnObject(this);
    }

    onResize(e:egret.Event):void
	{
        // this.list.layout["gap"] = (alien.StageProxy.width - this.redRank.x - this.redRank.width - 50) / 2 - 283;
	}
}

class IRChannel extends eui.ItemRenderer{
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