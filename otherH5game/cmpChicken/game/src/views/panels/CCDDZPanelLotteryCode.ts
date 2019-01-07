/**
 * Created by zhu on 2018/01/31.
 * 我的夺宝码
 */

class CCDDZPanelLotteryCode extends CCalien.CCDDZPanelBase {
    private static _instance: CCDDZPanelLotteryCode;

	private btnClose:eui.Button;

	/**
	 * 滚动容器
	 */
	private codeScroller:eui.Scroller;
	/**
	 * 我的夺宝码
	 */
	private codeList:eui.List;
	/**
	 * 我的夺宝码列表
	 */
	private _dataProvider:eui.ArrayCollection;

	/**
	 * 夺宝规则
	 */
	private ruleLabel:eui.Label;

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, {withFade: true, ease: egret.Ease.backIn});
	}

    init():void {
		this.skinName = panels.CCDDZPanelLotteryCodeSkin;
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
		this.btnClose["addClickListener"](this._onTouchClose,this,false);
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		this.codeList.itemRenderer = CCDDZCodeItem;
		this.codeList.dataProvider = this._dataProvider = new eui.ArrayCollection();
	}

	/**
	 * 点击关闭
	 */
	private _onTouchClose():void{
		this.dealAction('close');
	}


	/**
	 * 使能 事件
	 */
	private _enableEvent(bEnable:boolean):void{
		let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
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
		CCDDZPanelLotteryCode._instance = null;
	}

	/**
	 * type:1 我的夺宝码 2:夺宝规则
	 */
	public show(type:number,code:any):void{
		this.popup();
		if( type == 1){
			this._showMyCode(code);
		}else if(type ==2){
			this._showLotteryRule();
		}
	}

	/**
	 * 显示夺宝码
	 */
	private _showMyCode(code:any):void{
		let _len = code.length;
		let s = ""
		let lines = Math.floor(_len/3);
		let left = _len % 3;
		let _idx = 0;
		let _new = [];
		let _one = null;
		for(let i=0;i<lines;++i){
			_one = {1:code[_idx],2:code[_idx+1],3:code[_idx+2]};
			_new.push(_one);
			_idx += 3;
		}

		let _tmp = {};
		for(let i=_idx;i<_len;++i){
			_tmp[i-_idx+1] = code[i];
		}
		_new.push(_tmp)
		this.currentState = "code";
		this._dataProvider.source = _new;
		this._dataProvider.refresh();
	}

	/**
	 * 显示夺宝规则
	 */
	private _showLotteryRule():void{
		this.currentState = "rule";
		let s = "选择期待中奖的物品，投入一定数量的奖杯进行夺宝。玩家每一次投入都会获得1个“夺宝码”。只要最终开奖时产生的“幸运码”与自己拥有的“夺宝码”一致，该玩家就是获得该奖品的幸运儿！投入越多，中奖机会越大！\n"
		+"每一次投入最大次数限制为" + CCGlobalGameConfig.lotteryMaxNum + "次，可重复投入。\n"
		+"每期夺宝只会产生1个“幸运码”。夺宝码与幸运码为8位数字。\n"
		+"夺宝开奖方式分为3种：\n"
		+"	1）【满人次开奖】：每期达到指定次数即可开奖；\n"
		+"	2）【定时开奖】：达到指定的开奖时间即可开奖；届时，若本期未达成最低的夺宝次数，则本期奖品流拍，已投入的奖杯将通过邮件返还于您，请及时查收邮件；\n"
		+"	3）【满人次开奖】或【定时开奖】：只要达到其中一个开奖条件就会立即开奖。\n"
		+"中奖后，请尽快确认个人领奖信息；其中，中奖奖品请在邮件中领取。以免奖品过期！\n"
		+"幸运码产生方式：\n"
		+"    最后50条购买记录的时间戳总和（得出数值A），数值A+最近一次比特币交易hash码的末尾8位数（得出数值B），数值B除以购买总次数取模（得出数值C），数值C加上夺宝码起始值，最终得到幸运码。"
		this.ruleLabel.text = s;
		this._toScrollerTop();
	}

	private _toScrollerTop():void{
		this.codeScroller.stopAnimation();
		this.codeScroller.viewport.scrollV = 0;
		this.codeScroller.viewport.validateNow();
	}
	/**
	 * 获取我的夺宝码
	 */
    public static getInstance(): CCDDZPanelLotteryCode {
        if(!CCDDZPanelLotteryCode._instance) {
            CCDDZPanelLotteryCode._instance = new CCDDZPanelLotteryCode();
        }
        return CCDDZPanelLotteryCode._instance;
    }

	/**
	 * 移除我的夺宝码
	 */
	public static remove():void{
		if(CCDDZPanelLotteryCode._instance){
			CCDDZPanelLotteryCode._instance.close();
		}
	}
}


/**
 * 我的夺宝码
 */
class CCDDZCodeItem extends eui.ItemRenderer {

	createChildren():void {
		super.createChildren();
	}

    protected dataChanged(): void {
        super.dataChanged();

		let _data = this.data;
		this["code1"].text = _data[1];
		if(_data[2]){
			this["code2"].text = _data[2];
		}else{
			this["code2"].visible = false;
		}

		if(_data[3]){
			this["code3"].text = _data[3];
		}else{
			this["code3"].visible = false;
		}
	}
}
