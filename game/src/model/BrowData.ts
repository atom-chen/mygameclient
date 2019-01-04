/**
 * 2017/08/23 zhu 游戏中表情数据
 */

class BrowData{
    //表情ID 缩影
	public static BrowID:any = {
		BROW_MIN:1,
		BROW_666:1,	   //666
		BROW_TORTISE:2,//龟速
		BROW_TOMATO:3,  //番茄
		BROW_LOVE:4,    //爱心
		BROW_GOOD:5,   //好手气
		BROW_MAX:5
	}
	//表情对应的配置信息
	public static brows:any = { 
		[BrowData.BrowID.BROW_666]:{json:"brow666Ani_json",png:"brow666Ani_png",actName:"brow666",xMove:false,width:260,height:260},
		[BrowData.BrowID.BROW_TORTISE]:{json:"browTortiseAni_json",png:"browTortiseAni_png",actName:"browTortise",xMove:false,width:170,height:118},
		[BrowData.BrowID.BROW_TOMATO]:{json:"browTomatoAni_json",png:"browTomatoAni_png",actName:"browTomato",xMove:false,width:230,height:220,fStay:0.4},
		[BrowData.BrowID.BROW_LOVE]:{json:"browLoveAni_json",png:"browLoveAni_png",actName:"browLove",xMove:false,width:194,height:200},
		[BrowData.BrowID.BROW_GOOD]:{json:"browGoodAni_json",png:"browGoodAni_png",actName:"browGood",xMove:true,width:208,height:330},
	}
    //保持表情当前的可使用状态
    private _browsEnable:any = {};

    constructor(){
        this.init();
    }

    //初始化默认数据
    private init():void{
        for(let i =BrowData.BrowID.BROW_MIN;i<=BrowData.BrowID.BROW_MAX;++i){
            this._browsEnable[i]= {enable:true};
        }
    }

	/**
	 * 根据id是否可以再次发送表情
	 */
	public checkCanBuyByBrowId(nId:number):boolean {
		if(!this._browsEnable[nId]) return false;

		return this._browsEnable[nId].enable;
	}
	/**
	 * 开始特定表情Id的点击CD
	 */
	public startCDByBrowId(nId:number):void{
		if(this._browsEnable[nId]){
			this._browsEnable[nId].enable = false;
			egret.setTimeout(()=>{
				this._browsEnable[nId].enable = true;
			}, this, 200);
		}
	}

    /**
     * 获取购买表情消耗的金豆数 //目前只有金豆
     */
    public getBrowCostGold(nId:number):number{
       let info = GameConfig.getBrowCfgById(nId);
	   if(info){
		   return info.price;
	   }
	   return null;
    }

    /**
     * 获取表情的动画(moveclip)相关数据
     * 返回{json:xxx.json,png:xxx.png,actName:xxx}
     */
    public static getBrowAniDataById(nId:number):any{
        if(!BrowData.brows[nId]){
            return null;
        }
        let _json = BrowData.brows[nId].json;
        let _png = BrowData.brows[nId].png;
        let _actName = BrowData.brows[nId].actName;
        return  {json:_json,png:_png,actName:_actName};
    }

	/**
	 * 创建表情对应的moveClip
	 */
	public static createBrowMCById(nId:number):any{
		let _browAniData = BrowData.getBrowAniDataById(nId);
        if(!_browAniData) return null;
		let mcData = RES.getRes(_browAniData.json);
		let pngData = RES.getRes(_browAniData.png);
		var mcDataFactory = new egret.MovieClipDataFactory(mcData, pngData);
		var role:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData(_browAniData.actName));
		return role;
	}
	/**
	 * 判断表情是否需要在玩家头像上做左右移动,调用之前确定id存在
	 */
	public static isNeedXMoveById(nId:number):boolean{
		return BrowData.brows[nId].xMove
	}

	/**
	 * 获取动画资源的宽高,调用之前确定id存在
	 */
	public static getBrowAniWHById(nId:number):any{
		let _w = BrowData.brows[nId].width;
		let _h = BrowData.brows[nId].height;
		return {width:_w,height:_h};
	}
	/**
	 * 获取动画在最后一帧停留事件,调用之前确定id存在
	 */
	public static getBrowAniLastStayById(nId:number):number{
		return BrowData.brows[nId].fStay;
	}
}