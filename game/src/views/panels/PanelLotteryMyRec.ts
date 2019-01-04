/**
 * Created by zhu on 2018/01/31.
 * 我的夺宝记录
 */

class PanelLotteryMyRec extends alien.PanelBase {
    private static _instance: PanelLotteryMyRec;

	private detailGroup:eui.Group;

	private btn_close:eui.Button;
	/**
	 * 记录为空的提示
	 */
	private emptyGroup:eui.Group;
	/**
	 * 滚动容器
	 */
	private recScroller:eui.Scroller;

	/**
	 * 记录列表UI
	 */
	private recList:eui.List;

	/**
	 * 记录列表
	 */
	private _dataProvider:eui.ArrayCollection;

	/** 
	 * 记录 id 和 phase 数据
	*/
	private _recList:any;

	/**
	 * 所有活动id和期数的详细数据记录
	 */
	private _recIdPhaseList:any;

	/**
	 * 是否正在请求记录列表
	 */
	private _isReqRecList:boolean;
	/**
	 * 共多少页
	 */
	private _totalPage:number;
	/**
	 * 当前多少页
	 */
	private _curPage:number;

	constructor() {
		super(alien.popupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, alien.popupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

    init():void {
		this.skinName = panels.PanelLotteryMyRecSkin;
		this._isReqRecList = false;
		this._recList = [];
		this._recIdPhaseList= {};
		this._curPage = 0;
	}
	
	createChildren():void {
		super.createChildren();
		this._initUI();
		this._enableEvent(true);
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this.btn_close["addClickListener"](this._onTouchClose,this,false);
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		this.recList.dataProvider = this._dataProvider = new eui.ArrayCollection();
		this.recList.itemRenderer = MyLottryRecItem;
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction();
	}


	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
		this.recScroller[_func](egret.Event.CHANGE,this._onListScroll,this)
    	this[_func](egret.Event.ADDED_TO_STAGE,this._onAddToStage,this);
		this[_func](egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	private _onAddToStage(e:egret.Event):void{
		this._initEvent();
	}
	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        alien.EventManager.instance.disableOnObject(this);
		PanelLotteryMyRec._instance = null;
	}

	/**
	 * 
	 */
	public show():void{
		this.popup();
		this._showEmptyTip(false);
		this._reqRecHistory();
	}

	/**
	 * 显示空的提示
	 */
	private _showEmptyTip(_bShow:boolean):void{
		this.emptyGroup.visible = _bShow;
	}

    /**
     * 记录滚动
     */
    private _onListScroll(e:egret.Event):void{
		let _offset = this.recScroller.viewport.scrollV + this.recScroller.height;
        if( _offset >= this.recScroller.viewport.contentHeight){
			if(this._totalPage > this._curPage){
				this._reqRecHistory(this._curPage +1);
			}
        }
    }

	/**
	 * 添加记录数据
	 */
	private _addRecItem(_one:any):void{
		let _id = _one.id;
		let _phase = _one.phase;
		this._recIdPhaseList[_id] = this._recIdPhaseList[_id] ||{};
		let _list = this._recList;
		let _len = _list.length;
		let _idx = 0;
		if(!this._recIdPhaseList[_id][_phase]){
			_idx = _len;
			this._recIdPhaseList[_id][_phase] = {idx:_idx};
			_list.push(_one);
		}else{
			_idx = this._recIdPhaseList[_id][_phase].idx;
			if(_len< _idx+1) return;
			_list[_idx] = _one;
		}
	}

	private _reqRecHistory(page:number =0):void{
		if(this._isReqRecList) return;
		this._isReqRecList = true;
		let _uid = MainLogic.instance.selfData.uid;
		webService.getDoLotteryRec(_uid,page,(response)=>{
			this._isReqRecList = false;
			if(response.code == 0 ){
				let _data = response.data;
				let _items = _data.items;
				let _len = _items.length;
				if(_len < 1) {
					if(this._recList.length < 1){
						this._showEmptyTip(true);
					}
					return;
				}

				this._curPage = _data.page;
				this._totalPage = _data.total_pages;
				for(let i=0;i<_len;++i){
					_items[i].id = _items[i].lotteryid;
					this._addRecItem(_items[i]);
				}
				this._updateMyRec();
			}
		})
	}

	private _updateMyRec():void{
		let _len = this._recList.length;
		if(_len < 1 ){
			this._showEmptyTip(true);
			return;
		}else{
			this._showEmptyTip(false);
		}
		this.recScroller.stopAnimation();
		this._dataProvider.source = this._recList;
		this._dataProvider.refresh();
	}

	/**
	 * 获取我的夺宝记录
	 */
    public static getInstance(): PanelLotteryMyRec {
        if(!PanelLotteryMyRec._instance) {
            PanelLotteryMyRec._instance = new PanelLotteryMyRec();
        }
        return PanelLotteryMyRec._instance;
    }

	/**
	 * 移除我的夺宝记录
	 */
	public static remove():void{
		if(PanelLotteryMyRec._instance){
			PanelLotteryMyRec._instance.close();
		}
	}

	/**
	 * 更新某条记录
	 */
	public static updateOneInfo(data:any):void{
		let _ins = PanelLotteryMyRec._instance;
		if(_ins){
			if(data.statusCode == 1){ //流拍
				data.status_cn = "流拍";
			}
			let _source = _ins._dataProvider.source;
			let _len = _source.length;
			for(let i=0;i<_len;++i){
				if(_source[i].id == data.id && _source[i].phase == data.phase){
					_ins._recIdPhaseList[data.id][data.phase] = data;
					_ins._dataProvider.source[i] = data;
					_ins._dataProvider.itemUpdated(data);
					return;
				}
			}
		}
	}
}

/**
 * 我的夺宝记录
 */
class MyLottryRecItem extends eui.ItemRenderer {
	/**
	 * 
	 */
	private recItemGroup:eui.Group;
	/**
	 * 开奖时间
	 */
	private timeLabel:eui.Label;
	/**
	 * 开奖期数
	 */
	private titLabel:eui.Label;

	/**
	 * 我的夺宝码背景
	 */
	private haveBgImg:eui.Label;

	/**
	 * 我有多少夺宝码
	 */
	private haveLabel:eui.Label;
	/**
	 * 状态
	 */
	private statusLabel:eui.Label;
	/**
	 * 中奖者背景
	 */
	private luckBgImg:eui.Image;
	/**
	 * 箭头
	 */
	private arrImg:eui.Image;
	/**
	 * 中奖码
	 */
	private luckCodeLabel:eui.Label;
	/**
	 * 中奖者昵称
	 */
	private luckUserLabel:eui.Label;


	createChildren():void {
		super.createChildren();
        this.recItemGroup["addClickListener"](this._onClickItem,this,false);
		this.haveBgImg["addClickListener"](this._onClickHaveCode,this,false);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
	}

	private _onClickItem():void{
	}

    private _onRemovedToStage():void{
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedToStage, this);
    }

	private _showHaveCode(_bShow:boolean):void{
		this.haveBgImg.visible = _bShow;
		this.haveLabel.visible = _bShow;
	}

	private _onClickHaveCode():void{
		PanelLotteryCode.getInstance().show(1,this.data.code_list);
	}

	private _showLuck(_bShow:boolean):void{
		this.luckBgImg.visible = _bShow;
		this.arrImg.visible = _bShow;
		this.luckUserLabel.visible = _bShow;
		this.luckCodeLabel.visible = _bShow;
	}

    protected dataChanged(): void {
        super.dataChanged();
		
		let _cfgInfo = GameConfig.getCfgByField("red_coin_lottery_config");
		
		let _data = this.data;
		this.statusLabel.text = _data.status_cn;
		this.timeLabel.text = _data.enddate + "结束";
		this.titLabel.textFlow = (new egret.HtmlTextParser).parse("<font color='#BA2E2E'size=24>"+_data.c_rewarddes + "</font>【第" + _data.phase +"期】");
		if(_data.code_list&& _data.code_list.length>0){
			this.haveLabel.text = "我有" + _data.code_list.length + "个夺宝码>>";
			this._showHaveCode(true);
		}else{
			this._showHaveCode(false);
		}
		if(_data.winningcode && _data.winninguid_nick){
			this.luckCodeLabel.text =  "幸运码:"+_data.winningcode;
			this.luckUserLabel.text = _data.winninguid_nick;
			this._showLuck(true);
		}else{
			this._showLuck(false);
		}
	}
}