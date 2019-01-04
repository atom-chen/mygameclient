/**
 * Created by zhu on 2017/10/26.
 * 公告面板
 */

class PanelNotice extends alien.PanelBase {
    private static _instance: PanelNotice;

	/**
	 * 每个标签的内容
	 */
	private info_label:eui.Label;

	/**
	 * 滚动容器
	 */
	private content_scroller:eui.Scroller;

	/**
	 * 复制客服微信号
	 */
	private wxCp_img:eui.Image;
	
	/**
	 * 复制微信公众号
	 */
	private publicCp_img:eui.Image;

	/**
	 * 内容的标题
	 */
	private noticeFlag_img:eui.Image;

	/**
	 * 左边公告按钮的列表
	 */
	private leftLabelList:eui.List;

	/**
	 * 左侧的按钮的dataProvider
	 */
	private _leftLabelsDataProvider:eui.ArrayCollection;

	/**
	 * 上一次选中的左侧的活动按钮的缩影
	 */
	private _lastSelectIdx:number = 0;

	/**
	 * 顶层的group
	 */
	private infoGroup:eui.Group;

	/**
	 * 左边的箭头指示当前选中的按钮
	 */
	private arrImg:eui.Image;

	private _labels:any = [];
	
	constructor() {
		super();
	}

    init():void {
		this.skinName = panels.PanelNoticeSkin;
	}
	
	createChildren():void {
		super.createChildren();
		this._initUI();
		this._initEvent();
		egret.setTimeout(this.setShowRedExchange,this,100);
	}

	/**
	 * 初始化事件
	 */
	private _initEvent():void{
		this._enableEvent(true);
		this.wxCp_img["addClickListener"](this._onClickCopyKeFuWX,this);
		this.publicCp_img["addClickListener"](this._onClickCopyPublicWX,this);
		this.leftLabelList.addEventListener(egret.Event.CHANGE, this._onSelectItem, this);
	}

	/**
	 * 初始化界面
	 */
	private _initUI():void{
		this._labels = [
		//zhu 先屏蔽 {tit:"红包兑换",sel:true,new:false,cb:this._onClickRedExchange.bind(this)},
		//{tit:"推广福利",sel:false,new:false,cb:this._onClickDelegate.bind(this)},
		{tit:"健康声明",sel:false,new:false,cb:this._onClickGameNotice.bind(this)}];

		this.leftLabelList.itemRenderer = ActListItem;
		this.leftLabelList.dataProvider = this._leftLabelsDataProvider = new eui.ArrayCollection(this._labels);
		//this._leftLabelsDataProvider.refresh();
	}

	/**
	 * 根据索引设置选中的按钮
	 */
	private _changeSelectByIdx(selectIdx:number):void{
		let idx = selectIdx;
		this._leftLabelsDataProvider.source[this._lastSelectIdx].sel = 0;
		this._leftLabelsDataProvider.itemUpdated(this._labels[this._lastSelectIdx]);
		this._lastSelectIdx = idx;
		let _item = this.leftLabelList.getChildAt(idx);
		let _pos:any = _item.localToGlobal(_item.width*0.5,_item.height*0.5);
		let _pos1 =  this.infoGroup.globalToLocal(_pos.x,_pos.y);
		this.arrImg.y = _pos1.y;

		for(let i=0;i<this._leftLabelsDataProvider.length;++i){
			if(i == idx){
				this._leftLabelsDataProvider.source[i].sel = true;
				this._leftLabelsDataProvider.itemUpdated(this._labels[idx]);
				break;
			}
		}

		this._labels[idx].cb();
		egret.callLater(()=>{
			this.leftLabelList.selectedIndex = -1;
		}, this);
	}
	/**
	 * 选中某个公告
	 */
	private _onSelectItem():void{
		this._changeSelectByIdx(this.leftLabelList.selectedIndex);
	}
	/**
	 * 点击复制客服微信
	 */
	private _onClickCopyKeFuWX():void{
		let _copyString = GameConfig.wxService;
		if(this.currentState == "delegate"){ //代理的微信号不同
			_copyString = GameConfig.extendWX;
		}
		GameConfig.copyText(this,_copyString,"微信号(" + _copyString +")");
	}
	/**
	 * 点击复制公众号微信 
	 */
	private _onClickCopyPublicWX():void{
        let _str = "好手气斗地主";
        GameConfig.copyText(this.parent,_str,"公众号("+_str+")");
	}
	/**
	 * 滚动到最上面
	 */
	private _onScrollTop():void{
		this.content_scroller.stopAnimation();
		this.content_scroller.viewport.scrollV = 0;
		this.content_scroller.viewport.validateNow();
	}

	/**
	 * 显示红包兑换
	 */
	private _showRedExchange():void{
		this._onScrollTop();
		this.info_label.text = "兑换流程：\n    1、在游戏商城中兑换奖励\n    2、关注\"好手气斗地主\"公众号\n    3、2)	点击、\"确定\"，直接领取 \r\r\n如有疑问请添加客服微信！";

		this.content_scroller.scrollPolicyV = "off";
		this._showCopyWX(true);
		this.noticeFlag_img.source = "notice_red_tit";
	}

	/**
	 * 设置显示红包兑换
	 */
	public setShowRedExchange():void{
		this._changeSelectByIdx(0);
	}

	/**
	 * 点击红包兑换
	 */
	private _onClickRedExchange():void{
		this._showRedExchange();
	}

	/**
	 * 显示代理赚钱
	 */
	private _showDelegate():void{
		this._onScrollTop();
		this.info_label.text = "一大波福利正在袭来！！！"
		//"奖励规则：\n    1、每邀请1个好友，得1个高级红包(游戏内抽取)。\r    2、每周邀请50个好友，得50个高级红包+30元红包。\n \r微信号:" + GameConfig.extendWX;

		this.content_scroller.scrollPolicyV = "off";
		this._showCopyWX(true);
		
		this.noticeFlag_img.source = "notice_delegate_tit";
	}

	/**
	 * 点击代理赚钱
	 */
	private _onClickDelegate():void{
		this._showDelegate();
	}

	/**
	 * 是否显示复制微信和复制公众号
	 */
	private _showCopyWX(bShow:boolean):void{
		this.wxCp_img.visible = bShow;
		this.publicCp_img.visible = bShow;
	}
	/**
	 * 显示健康忠告
	 */
	public showGameNotice():void{
		this._onScrollTop();
		this.info_label.text = "亲爱的玩家：\n    好手气斗地主一直致力于打造一个公平公正、绿色健康的游戏环境，为保证玩家的利益，好手气斗地主运营团队听取各方面意见并经过多次讨论后，郑重决定通过封号等措施，全面打击非正常游戏的行为。具体措施如下：\n一、非正常游戏的行为包括但不限于:\n    1、安装使用会影响好好手气斗地主游戏平衡的第三方软件；\n    2、利用游戏漏洞采用盗刷金豆等方式，谋取游戏利益、破坏游戏的公平秩序\n    3、对局中打伙牌、故意输赢等；\n    4、在游戏内传播宣扬淫秽、色情、赌博、暴力，或者教唆犯罪等信息。\n（好手气运营团队根据监测到的游戏数据对以上行为进行独立自主的判断，从而判定是否构成非正常游戏行为。）\r\r\n二、处罚力度包括但不限于：\n    凡是监测出非正常游戏的行为，将视情节严重程度取消该游戏账号由此获得的相关奖励，并作出暂时或永久性的禁止登陆、删除游戏账号及游戏数据等处理措施；情节严重的将移交有关行政管理机关给予行政处罚，或者追究刑事责任。\n希望玩家朋友们注意保护自己的账号安全。同时也号召大家对非正常游戏账号开展举报（游戏过程中，如发现非正常账号，则可点击对方头像，点击“举报”按钮进行举报），我们一起为净化游戏环境共同努力。\r\r\r\n                  本通知自发布之日（即2017年10月27日）起生效。\n";

		this.content_scroller.scrollPolicyV = "on";
		this._showCopyWX(false);
		
		this.noticeFlag_img.source = "notice_game_tit";
	}
	/**
	 * 点击健康游戏忠告
	 */
	private _onClickGameNotice():void{
		this.showGameNotice();
	}

	/**
	 * 从场景移除
	 */
	private _onRemovedToStage():void{
		this._enableEvent(false);
        alien.EventManager.instance.disableOnObject(this);
		PanelNotice._instance = null;
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
	}
	
	/**
	 * 获取公告单例
	 */
    public static getInstance(): PanelNotice {
        if(!PanelNotice._instance) {
            PanelNotice._instance = new PanelNotice();
        }
        return PanelNotice._instance;
    }

	/**
	 * 移除公告面板
	 */
	public static remove():void{
		if(PanelNotice._instance){
			PanelNotice._instance.close();
		}
	}
}