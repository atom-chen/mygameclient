/**
 * Created by zhu on 2017/09/18.
 * 9 人钻石赛详情
 */

class PDKPanelMatch9Info extends PDKalien.PDKPanelBase {
    private static _instance: PDKPanelMatch9Info;

	/**
	 * 第1轮的标题
	 */
	private turn1_label:eui.Label; 

	/**
	 * 第1轮输赢得分
	 */
	private turn1_1label:eui.Label;
	/**
	 * 第1轮平均得分
	 */
	private turn1_2label:eui.Label;

	/**
	 * 第1轮的比赛积分
	 */
	private turn1_3label:eui.Label;

	/**
	 * 第2轮的标题
	 */
	private turn2_label:eui.Label; 
	/**
	 * 第2轮输赢得分
	 */
	private turn2_1label:eui.Label;
	/**
	 * 第2轮平均得分
	 */
	private turn2_2label:eui.Label;
	/**
	 * 第2轮的比赛积分
	 */
	private turn2_3label:eui.Label;

	/**
	 * 第3轮的标题
	 */
	private turn3_label:eui.Label;
	/**
	 * 第3轮输赢得分
	 */
	private turn3_1label:eui.Label;
		/**
	 * 第3轮平均得分
	 */
	private turn3_2label:eui.Label;
	/**
	 * 第3轮的比赛积分
	 */
	private turn3_3label:eui.Label;

	constructor() {
		super(PDKalien.popupEffect.Scale, {
			withFade: false,
			ease: egret.Ease.backOut
		}, PDKalien.popupEffect.Scale, {withFade: false, ease: egret.Ease.backIn});

	}

    init():void {
		this.skinName = panels.PDKPanelMatch9Info;
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
		for(let i=1;i<4;i++){
			this["turn" + i + "_label"].visible = false;
			this["turn" + i + "_1label"].text = "";
			this["turn" + i + "_2label"].text = "";
			this["turn" + i + "_3label"].text = "";
		}
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
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
		PDKPanelMatch9Info._instance = null;
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
	 * 显示9人钻石赛详情
	 */
	public show(_data):void{
        this.popup(this.dealAction.bind(this),true,{alpha:0});
		this._initByData(_data);
	}

	/**
	 * 初始化数组
	 */
	private _initByData(_data):void{
		if(_data){
			let _playIdx = 1; 
			for(let i=0;i<_data.length;++i){
				_playIdx = _data[i].round;

				if(_data[i].aver == -1){
					this["turn" + _playIdx + "_2label"].text = "正在统计..";
					this["turn" + _playIdx + "_3label"].text = '';
				}
				else{

					this["turn" + _playIdx + "_2label"].text = _data[i].aver ||0;
					this["turn" + _playIdx + "_3label"].text = _data[i].score ||0;
				}
				this["turn" + _playIdx + "_label"].visible = true;
				this["turn" + _playIdx + "_1label"].text = _data[i].change ||0;
			}
		}
	}

	/**
	 * 获取9人钻石赛详情单例
	 */
    public static getInstance(): PDKPanelMatch9Info {
        if(!PDKPanelMatch9Info._instance) {
            PDKPanelMatch9Info._instance = new PDKPanelMatch9Info();
        }
        return PDKPanelMatch9Info._instance;
    }


	/**
	 * 移除9人钻石赛详情面板
	 */
	public static remove():void{
		if(PDKPanelMatch9Info._instance){
			PDKPanelMatch9Info._instance.close();
		}
	}
}