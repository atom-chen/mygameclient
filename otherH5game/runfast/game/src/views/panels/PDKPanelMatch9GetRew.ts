/**
 * Created by zhu on 2017/09/18.
 * 9 人钻石赛领取奖励（计算界面）
 */

class PDKPanelMatch9GetRew extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelMatch9GetRew;
    private getRew_img:eui.Image;

	/**
	 * 玩家1的昵称
	 */
	private name1_label:eui.Label;
	/**
	 * 玩家1的第1局积分
	 */
	private turn1_1label:eui.Label;
	/**
	 * 玩家1的第2局积分
	 */
	private turn2_1label:eui.Label;
	/**
	 * 玩家1的第3局积分
	 */
	private turn3_1label:eui.Label;
	/**
	 * 玩家1的总积分
	 */
	private turn4_1label:eui.Label;

	/**
	 * 玩家2的昵称
	 */
	private name2_label:eui.Label;
	/**
	 * 玩家2的第1局积分
	 */
	private turn1_2label:eui.Label;
	/**
	 * 玩家2的第2局积分
	 */
	private turn2_2label:eui.Label;
		/**
	 * 玩家2的第3局积分
	 */
	private turn3_2label:eui.Label;
		/**
	 * 玩家2的第四局积分
	 */
	private turn4_2label:eui.Label;
	/**
	 * 玩家3的昵称
	 */
	private name3_label:eui.Label;
	/**
	 * 玩家3的第1局积分
	 */
	private turn1_3label:eui.Label;
	/**
	 * 玩家3的第2局积分
	 */
	private turn2_3label:eui.Label;
	/**
	 * 玩家3的第3局积分
	 */
	private turn3_3label:eui.Label;
	/**
	 * 玩家3的总积分
	 */
	private turn4_3label:eui.Label;

	/**
	 * 排名
	 */
	private rank_bitmap:eui.BitmapLabel;
	/**
	 * 奖励
	 */
	private get_label:eui.Label;

	/**
	 * 是否正在显示结算奖励
	 */
	private _isShow:boolean = false;

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.PDKPanelMatch9GRew;
	}

	createChildren():void {
		super.createChildren();		
		this._initDefaut();
		this._initEvent();
	}


	/**
	 * 初始化默认数据
	 */
	private _initDefaut():void{
		let idx = 0;
		this.rank_bitmap.text = "";
		this.get_label.text = "";
		for(let i=0;i<3;++i){
			idx = i+1;
			this["name" + idx + "_label"].text = "";
			this["turn1_" + idx + "label"].text = "";
			this["turn2_" + idx + "label"].text = "";
			this["turn3_" + idx + "label"].text = "";
			this["turn4_" + idx + "label"].text = "";
		}
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
        this.getRew_img["addClickListener"](this._onClickGetRew, this);
		this._enableEvent(true);
        let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
        //e.registerOnObject(this,PDKalien.Dispatcher,PDKEventNames.MY_USER_INFO_UPDATE,this._userinfoUpdate,this);
	}


	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
	}
	/**
	 * 	加入舞台
	 */
	private _onAddToStage():void{
		PDKEventManager.instance.enableOnObject(this);
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        PDKalien.PDKEventManager.instance.disableOnObject(this);
		PDKPanelMatch9GetRew._instance = null;
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
     * 点击领取奖励
     */
    private _onClickGetRew():void{
		PDKAlert.show('领取奖励：'+ this.get_label.text +' 成功',0,function(){
			if(!pdkServer.playing){
				if(PDKalien.PDKSceneManager.instance.currentSceneName != PDKSceneNames.ROOM){
					PDKalien.PDKSceneManager.show(PDKSceneNames.ROOM, null, PDKalien.sceneEffect.Fade, null, null, false, PDKSceneNames.LOADING);
				}
			}
		});
		this.dealAction();
		PDKBagService.instance.refreshBagInfo();
	}

	/**
	 *  初始化界面的数据
	 */
	private _initByData(roomInfo,_data):void{
		if(_data){
			let idx = 0;
			let _name = "";
			let _total = 0;
			let _result = _data.resultInfo;
			let _rank = _data.params[0];
			this.rank_bitmap = _rank;
			let reward = PDKMatchService.getRewardStringByRank(roomInfo, _rank, '');
			this.get_label.text = reward;

			for(let i =0;i<_result.length;++i){
				idx = i+1;
				_total = _result[i].params[0] + _result[i].params[1] + _result[i].params[2];
				_name =  PDKBase64.decode(_result[i].nickname);
				this["name" + idx + "_label"].text = _name.substr(0,4);
				this["turn1_" + idx + "label"].text = _result[i].params[0];
				this["turn2_" + idx + "label"].text = _result[i].params[1] ;
				this["turn3_" + idx + "label"].text = _result[i].params[2];
				this["turn4_" + idx + "label"].text = _total;
			}
		}
	}
	/**
	 * 显示9人钻石赛结算
	 */
	public show(roomInfo,_data):void{
		this.popup(null,true,{alpha:0});
		this._isShow = true;
		this._initByData(roomInfo,_data);
	}
	/**
	 * 是否正在显示领奖励
	 */
	public isShow():boolean{
		return this._isShow;
	}
	/**
	 * 获取9人钻石赛结算单例
	 */
    public static getInstance(): PDKPanelMatch9GetRew {
        if(!PDKPanelMatch9GetRew._instance) {
            PDKPanelMatch9GetRew._instance = new PDKPanelMatch9GetRew();
        }
        return PDKPanelMatch9GetRew._instance;
    }


	/**
	 * 移除9人钻石赛结算面板
	 */
	public static remove():void{
		if(PDKPanelMatch9GetRew._instance){
			PDKPanelMatch9GetRew._instance.close();
		}
	}
}