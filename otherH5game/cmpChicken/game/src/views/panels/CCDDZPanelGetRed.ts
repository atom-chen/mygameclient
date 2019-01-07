/**
 * Created by zhu on 2017/09/07
 * 赢5局抽红包面板
 */

class CCDDZPanelGetRed extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelGetRed;

    /**
     * 星星的父控件
     */
    private lightStar_group:eui.Group;

    /**
     * 第1个星星
     */
    private lightStar1_img:eui.Image;
    
    /**
     * 第2个星星
     */
    private lightStar2_img:eui.Image;
    
    /**
     * 第3个星星
     */
    private lightStar3_img:eui.Image;
    
    /**
     * 第4个星星
     */
    private lightStar4_img:eui.Image;
    
    /**
     * 第5个星星
     */
    private lightStar5_img:eui.Image;
    /**
     * 抽红包按钮
     */
    private getRed_img:eui.Image;

    /**
     * 所有的大星星的节点
     */
    private _allBigStars:any;

    /**
     *  大星星的黑底背景
     */
    private mBgStar_img:eui.Image;

    /**
     * 当前的房间
     */
    private _roomId:number;

    /**
     * 关闭按钮
     */
    private close_img:eui.Image;
	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.CCDDZPanelGetRedSkin;
	}

	createChildren():void {
		super.createChildren();
        this._initDefault();
		this._initEvent();
	}

    /**
     * 初始化默认数据
     */
    private _initDefault():void{
        this._allBigStars = [];
        for(let i = 0;i<5;++i){
            this._allBigStars[i] = this["lightStar" +(i+1)+ "_img"];
        }
        this._allBigStarHide();
        this._showGetRed(false);
        this._showStarBg(true);
    }
    /**
     * 是否显示抽红包按钮
     */
    private _showGetRed(bShow:boolean):void{
        this.getRed_img.visible = bShow;
    }

    /**
     * 是否大星星group
     */
    private _showStarGroup(bShow:boolean):void{
        this.lightStar_group.visible = bShow;
    }


    /**
     * 是显示大星星的黑底背景
     */
    private _showStarBg(bShow:boolean):void{
        this.mBgStar_img.visible = bShow;
    }

    /**
     * 所有的高亮的大星星全部隐藏
     */
    private _allBigStarHide():void{
        for(let i =0;i<5;++i){
            this._allBigStars[i].visible = false;
        }
    }

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
   }

	/**
	 * 	加入舞台
	 */
	private _onAddToStage():void{
        this.getRed_img["addClickListener"](this._onClickGetRed,this);
		this.close_img["addClickListener"](this._onTouchClose, this);
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
		CCDDZPanelGetRed._instance = null;
	}

    /**
     * 点击抽红包
     */
    private _onClickGetRed():void{
        CCDDZExchangeService.instance.doChou(this._roomId);
    }

	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
		this[_func](egret.Event.ADDED_TO_STAGE, this._onAddToStage, this);
	}

    /**
     * 所有星星的显示效果显示完毕 ,隐藏星星，显示抽红包
     */
    private _onAniStarOver():void{
        egret.Tween.get(this.lightStar_group).wait(300).to({alpha:0},100).call(()=>{
            this.lightStar_group.visible = false;
            this.lightStar_group.alpha = 1;
             egret.Tween.get(this.getRed_img).set({scaleX:0.1,scaleY:0.1,visible:true}).to({scaleX:1,scaleY:1},100);
        });
    }

    /**
     * 所有的小星星都移动到对应的位置后要执行放大的效果 
     */
    private _onAllStarMoveOver():void{
        let _tween = egret.Tween;
        egret.setTimeout(()=>{
            this._showStarBg(false);
            let i = 0;
            let _scaleAni = null;
            let self = this;
            _scaleAni = function(){
                _tween.get(self._allBigStars[i]).to({scaleX:1.5,scaleY:1.5},100).to({scaleX:1,scaleY:1},50).call(function(){
                    if(i >= 4){
                        self._onAniStarOver();
                        return;
                    }
                    i++;
                    _scaleAni();
                }); 
            }
            _scaleAni();
        }, this, 50);
    }   

    /**
     * 从右下角的小星星飞到弹出界面的大星星
     */
    private _bottomToBig(smallStar:any,idx:number):void{
        let _toStar = this._allBigStars[idx];
        let _toX = _toStar.x;
        let _toY = _toStar.y;
        smallStar.visible = false;

        let pos = smallStar.localToGlobal(smallStar.x,smallStar.y);
        pos = this.lightStar_group.globalToLocal(pos.x,pos.y);
        let _img = new eui.Image("play_star_big");
        this.lightStar_group.addChild(_img);

        let _scaleX = smallStar.width/_img.width;
        let _scaleY = smallStar.height/_img.height;
        _img.x = pos.x + smallStar.width * 0.5 ;
        _img.y = pos.y + smallStar.height * 0.5;
        _img.anchorOffsetX = _img.width * 0.5;
        _img.anchorOffsetY = _img.height * 0.5;
        _img.scaleX = _scaleX;
        _img.scaleY = _scaleY;
       egret.Tween.get(_img).to({x:_toX,y:_toY,scaleX:1,scaleY:1},500).call(()=>{
            this.lightStar_group.removeChild(_img);
            this._allBigStars[idx].visible = true;
            if(idx == 4){
                this._onAllStarMoveOver();
            }
        });
    }

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
	}

	/**
	 * 显示抽红包
	 */
	public show(roomId:number,_bottomStarArr:any):void{
        this._roomId = roomId;
        let _items = _bottomStarArr;
        //console.log("show====》",roomId,_bottomStarArr);
        this.popup(null,true);
        egret.setTimeout(()=>{
            let self = this;
            let i = 0;
            let _nInterval = 0;
            let _oneStarMoveToBig = null;
            _oneStarMoveToBig = function(){
                if(i >= _items.length){
                    if(_nInterval){
                        egret.clearInterval(_nInterval);
                        _nInterval = 0;
                    }
                }
                else{
                    self._bottomToBig(_items[i],i);
                    i++;
                }
            }
            _oneStarMoveToBig();
            _nInterval = egret.setInterval(()=>{
                _oneStarMoveToBig();
            }, this, 100)
        }, this, 500);
	}
	
	/**
	 * 获取抽红包单例
	 */
    public static getInstance(): CCDDZPanelGetRed {
        if(!CCDDZPanelGetRed._instance) {
            CCDDZPanelGetRed._instance = new CCDDZPanelGetRed();
        }
        return CCDDZPanelGetRed._instance;
    }

	/**
	 * 移除抽红包面板
	 */
	public static remove():void{
		if(CCDDZPanelGetRed._instance){
			CCDDZPanelGetRed._instance.close();
		}
	}
}