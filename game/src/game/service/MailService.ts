/**
 * Created by rockyl on 16/5/9.
 */

class MailService extends Service {
	private static _instance: MailService;
	public static get instance(): MailService {
		if (this._instance == undefined) {
			this._instance = new MailService();
		}
		return this._instance;
	}

	private _loadCount: number = 10;
	private _source: any[];
	private _unreadCount: number;
	private _haveMore: boolean;
	private _timer: number;

	private _readList:any[];//已读的列表
	private _unReadList:any[];//未读的列表

	/**
	 * 是否正在请求邮件列表
	 */
	private _isReqMailList:boolean;
	/**
	 * 共多少页
	 */
	private _totalPage:number;
	/**
	 * 当前多少页
	 */
	private _curPage:number;

	protected init(): void {
		this._source = [];
		this._unReadList =[];
		this._readList =[];
		this._curPage = 0;
		this._unreadCount = 0;
		this._timer = null;
		this._isReqMailList = false;
		let e: alien.EventManager = alien.EventManager.instance;
		let name = egret.getQualifiedClassName(this);
		//e.register(name, server, EventNames.USER_MAIL_LIST_REP, this.onMailListResponse, this);
		//e.register(name, server, EventNames.USER_MAIL_DETAIL, this.onMailNotify, this);
		//e.register(name, server, EventNames.USER_MAIL_MODIFY_REP, this.onMailModifyResponse, this);
		e.register(name, server, EventNames.USER_MailGetReward_REP, this.onMailGetRewardResponse, this);
		//e.register(name, server, EventNames.USER_MAIL_UNREAD_REP, this.onMailUnreadResponse, this);
	}

	start(cb): void {
		this._source = [];
		this._unreadCount = 0;
		this._haveMore = false;
		this.getMailList();

		this.stop()
		//this.getUnreadCount();
		alien.EventManager.instance.enable(egret.getQualifiedClassName(this));
		this._timer = alien.Schedule.setInterval(this.onCheckTimer, this,1000 * 60 * 10)
		super.start(cb);
	}

	stop(): void {
		alien.EventManager.instance.disable(egret.getQualifiedClassName(this));
		alien.Schedule.clearInterval(this._timer);
	}

	private onCheckTimer(): void {
		this.checkMail();
		webService.getRanklist();
	}

	private callMailApi(action, callback, params = null, method = 'get') {
		params = params || {};
		params.uid = server.uid;

		webService.callApi('msg', action, callback, params, method)
	}

	checkMail() {
		this._isReqMailList = false;
		// this.callMailApi('checkmail', (response: any)=> {
		// 	//console.log('checkMail: =' ,response);
		// 	if (response.code == 0) {
		// 		this._unreadCount = parseInt(response.data.unread_count);
		// 		this.getMailList();
		// 	}
		// })
	}

	/**
	 * 接口废弃不要在使用
	 */
	getUnreadCount() {
		this.callMailApi('count', (response: any)=> {
			//console.log("getUnreadCount==>",response);
			if (response.code == 0) {
				this._unreadCount = parseInt(response.data.count);
				this.updateUnreadCount();
			}
		}, {})
	}

	/**
	 * 加载更多邮件
	 */
	shouldLoadMore(){
		//console.log("MailService shouldLoadMore===========>",this._haveMore,this._curPage,this._totalPage);
		if(this._haveMore){
			this.getMailList(this._curPage + 1);
		}
	}

	getMailList(page=0) {
		if(this._isReqMailList) return;
		//console.log("getMailList===1====>",page);
		this._isReqMailList = true;
		let params: any = {page:page};
		this.callMailApi('index', (response: any)=> {
			this._isReqMailList = false;
			//console.log("getMailList=2==>",response);
			if (response.code == 0) {
				let _data = response.data;
				if(!_data || !_data.items || _data.items.length < 1) return;

				this._curPage = _data.page;
				this._totalPage = _data.total_page;
				let mails = _data.items ||[];
				let len = mails.length;
				this._unreadCount = _data.un_read_count;
				this.updateUnreadCount();
				if(len > 0){
					for(let i=0;i<len;++i){
						this.addMailItem(mails[i]);
					}
					this.checkTipMailDetail();
				}
				this._haveMore = _data.page < _data.total_page;
				//console.log("getMailList============>",this._source,"response：",mails);
				this.dispatchEventWith(EventNames.MAIL_LIST_REFRESH, false);
			}
		}, params)
	}

	//是否需要弹出邮件
	checkTipMailDetail():void{
		let _unReadList = this._unReadList;
		for(let i =0;i< _unReadList.length;++i){
			if(_unReadList[i].type == 4){//弹窗邮件
				if(_unReadList[i].status == 0){
					if(this._unreadCount >1){
						PanelMail.getInstance().show();
					}
					PanelMail.getInstance().tipOpenMailItem(_unReadList[i]);
					return;
				}
			}else if(_unReadList[i].type == 5 && _unReadList[i].status == 0){ //夺宝奖励
				PanelMail.getInstance().tipOpenMailItem(_unReadList[i]);
				return;
			}
		}
	}

	/**
	 * 如果是有附件的邮件，不要走此接口打开邮件，直接用PanelMailDetails.getInstance().show(mailData);
	 */
	openMail(id: number) {
		this.callMailApi('update', (response: any)=> {
			//console.log("openMail====>",response);
			if (response.code == 0) {
				this.updateUnreadCount(-1);
				let mailData: any;
				let index: number = -1;
				this._unReadList.some((item: any, i: number)=> {
					if (item.id == id) {
						mailData = item;
						index = i;
						return true;
					}
				});
				if (mailData) {
					this._unReadList.splice(index, 1);
					mailData.status = 1;
					this.addMailItem(mailData, true);
					this.dispatchEventWith(EventNames.MAIL_LIST_REFRESH, false);
				}
			}
		}, {id, status: 1}, 'post')
	}

	/**
	 * 领取奖励
	 * @param id
	 */
	getReward(id: number): void {
		server.reqMailGetRew(id);
	}

	get source(): any[] {
		return this._source;
	}

	private _checkListHasItem(_array:any[],item:any):any{
		let _list = _array;
		let _len = _list.length;
		for(let i=0;i<_len;++i){
			if(_list[i].id == item.id){
				return {idx:i,has:true};
			}
		}
		return  null;
	}

	private addMailItem(item: any,hasOpen:boolean = false): void {
		item.sendtime = parseInt(item.sendtime);
		item.id = parseInt(item.id);
		item.type = parseInt(item.type);
		item.status = parseInt(item.status);
		item.readtime = Number(item.readtime);
		item.gettime = Number(item.gettime);
		if (typeof item.attachment == 'string') {
			item.attachment = Utils.parseGoodsString(item.attachment);
		}
		if(item.status !=0){
			hasOpen = true;
		}

		if(hasOpen){
			let _hasObj = this._checkListHasItem(this._readList ,item);
			if(!_hasObj){
				this._readList.push(item);
			}else{
				this._readList[_hasObj.idx].gettime = item.gettime;
			}
			this._readList.sort(function (item1, item2){
				return item2.gettime - item1.gettime;
			})
		}else{
			let _hasObj = this._checkListHasItem(this._unReadList ,item);
			if(!_hasObj){
				this._unReadList.push(item);
			}else{
				this._unReadList[_hasObj.idx].gettime = item.gettime;
			}
		}
		this._source = [];
		this._source  = this._source.concat(this._unReadList,this._readList);
		//console.log("addMailItem===>",hasOpen,"unreadlist:",this._unReadList,"readlist:",this._readList,"all:",this._source);
	}

	/**
	 * 当领取奖励响应
	 * @param event
	 */
	private onMailGetRewardResponse(event: egret.Event): void {
		let data: any = event.data;

		if (data.result == 0) {
			Toast.show("领取成功！");
			let mailData: any;
			let index: number = -1;
			this._unReadList.some((item: any, i: number)=> {
				if (item.id == data.id) {
					mailData = item;
					index = i;
					return true;
				}
			});
			if (mailData) {
				this._unReadList.splice(index, 1);
				mailData.status = 2;
				this.updateUnreadCount(-1);
				this.addMailItem(mailData, true);
				this.dispatchEventWith(EventNames.MAIL_LIST_REFRESH, false);
				BagService.instance.refreshBagInfo(); //领取附件成功更新背包
				PanelMailDetails.getInstance().close();
			}
		}else{
			Toast.show("领取失败！");
		}
	}

	/**
	 * 更新未读邮件数量
	 * @param value
	 * @param dispatch
	 */
	private updateUnreadCount(value: number = 0, dispatch: boolean = true): void {
		this._unreadCount += value;
		if(this._unreadCount<0){
			this._unreadCount = 0;
		}
		//console.log("updateUnreadCount===>",this._unreadCount);
		if (dispatch) {
			this.dispatchEventWith(EventNames.MAIL_UNREAD_UPDATE, false, {count: this._unreadCount});
		}
	}

	/**
	 * 获取未读邮件数量
	 * @returns {number}
	 */
	get unreadCount(): number {
		return this._unreadCount;
	}

	/**
	 * 是否还有更多
	 * @returns {boolean}
	 */
	get haveMore(): boolean {
		return this._haveMore;
	}
}