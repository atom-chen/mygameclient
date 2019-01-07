/**
 * Created by rockyl on 16/5/9.
 */

class PDKMailService extends PDKService {
	private static _instance: PDKMailService;
	public static get instance(): PDKMailService {
		if (this._instance == undefined) {
			this._instance = new PDKMailService();
		}
		return this._instance;
	}

	private _loadCount: number = 10;
	private _source: any[];
	private _unreadCount: number;
	private _unreadEndPos: number;
	private _haveMore: boolean;
	private _timer: egret.Timer;
	private _lastId:number;
	private _firstId:number = 0;

	protected init(): void {
		this._source = [];
		this._timer = new egret.Timer(1000 * 60 * 10);

		let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		let name = egret.getQualifiedClassName(this);
		//e.register(name, pdkServer, PDKEventNames.USER_MAIL_LIST_REP, this.onMailListResponse, this);
		//e.register(name, pdkServer, PDKEventNames.USER_MAIL_DETAIL, this.onMailNotify, this);
		//e.register(name, pdkServer, PDKEventNames.USER_MAIL_MODIFY_REP, this.onMailModifyResponse, this);
		e.register(name, pdkServer, PDKEventNames.USER_MailGetReward_REP, this.onMailGetRewardResponse, this);
		//e.register(name, pdkServer, PDKEventNames.USER_MAIL_UNREAD_REP, this.onMailUnreadResponse, this);
		e.register(name, this._timer, egret.TimerEvent.TIMER, this.onCheckTimer, this);
	}

	start(cb): void {
		this._source.splice(0);
		this._unreadCount = 0;
		this._unreadEndPos = 0;
		this._haveMore = true;
		this.getMailList();
		//this.getUnreadCount();

		PDKalien.PDKEventManager.instance.enable(egret.getQualifiedClassName(this));

		this._timer.reset();
		this._timer.start();
		egret.setTimeout(()=>{
			this.getUnreadCount();
			this.checkMail();
		}, this,3000);

		super.start(cb);
	}

	stop(): void {
		PDKalien.PDKEventManager.instance.disable(egret.getQualifiedClassName(this));

		this._timer.stop();
	}

	private onCheckTimer(event: egret.TimerEvent = null): void {
		this.checkMail();
	}

	private callMailApi(action, callback, params = null, method = 'get') {
		params = params || {};
		params.uid = pdkServer.uid;

		PDKwebService.callApi('msg', action, callback, params, method)
	}

	checkMail() {
		this.callMailApi('checkmail', (response: any)=> {
			//console.log('checkMail: =' ,response);
			if (response.code == 0) {
				this._unreadCount = parseInt(response.data.unread_count);
				this.updateUnreadCount();

				this.getMailList(1);
			}
		})
	}

	getUnreadCount() {
		this.callMailApi('count', (response: any)=> {
			//console.log("getUnreadCount==>",response);
			if (response.code == 0) {
				this._unreadCount = parseInt(response.data.count);
				this.updateUnreadCount();
			}
		}, {})
	}

	getMailList(type = 0) {
		let params: any = {limit: this._loadCount, type};
		/*zhu 暂时不要 
		if(type == 0){  //向下拉取
			if (this._source.length > 0) {
				params.id = this._lastId;
			}
		}else{          //向上拉取
			params.id = this._firstId;
		}*/
		//console.log("params---",params);
		this.callMailApi('index', (response: any)=> {
			//console.log("getMailList===>",response);
			if (response.code == 0) {
				let mails = response.data || [];
				let len = mails.length;
				if(len > 0){
					this._lastId = mails[len - 1].id;
					mails.forEach((item: any)=> {
						if(item.id > this._firstId){
							this._firstId = item.id;
						}
						this.addItem(item);
					});
				}
				this._haveMore = len >= this._loadCount;
				//console.log("getMailList============>",this._source);
				this.dispatchEventWith(PDKEventNames.MAIL_LIST_REFRESH, false, {list: this._source});
			}
		}, params)
	}

	//是否需要弹出老用户召回的奖励邮件
	checkUserBack():void{
		for(let i =0;i< this._source.length;++i){
			if(this._source[i].type == 4){//老用户召回
				if(this._source[i].status == 0){
					PDKPanelMail.getInstance().tipOpenMailItem(this._source[i]);
				}
				break;
			}
		}
	}

	openMail(id: number) {
		this.callMailApi('update', (response: any)=> {
			//console.log("openMail====>",response);
			if (response.code == 0) {
				this.updateUnreadCount(-1);
				let mailData: any;
				let index: number = -1;
				this._source.some((item: any, i: number)=> {
					if (item.id == id) {
						mailData = item;
						index = i;
						return true;
					}
				});
				if (mailData) {
					this._unreadEndPos--;
					this._source.splice(index, 1);
					mailData.status = 1;
					this.addItem(mailData, true);
					this.dispatchEventWith(PDKEventNames.MAIL_LIST_REFRESH, false);
				}
			}
		}, {id, status: 1}, 'post')
	}

	/**
	 * 领取奖励
	 * @param id
	 */
	getReward(id: number): void {
		pdkServer.reqMailGetRew(id);
	}

	get source(): any[] {
		return this._source;
	}

	private addItem(item: any, byOpen: boolean = false): void {
		item.sendtime = parseInt(item.sendtime);
		item.id = parseInt(item.id);
		item.type = parseInt(item.type);
		item.status = parseInt(item.status);
		if (typeof item.attachment == 'string') {
			item.attachment = PDKUtils.parseGoodsString(item.attachment);
		}

		if (item.status == 0) {
			this._source.splice(this._unreadEndPos, 0, item);
			this._unreadEndPos++;
		} else {
			if (byOpen) {
				this._source.splice(this._unreadEndPos, 0, item);
			} else {
				this._source.push(item);
			}
		}
	}

	/**
	 * 当领取奖励响应
	 * @param event
	 */
	private onMailGetRewardResponse(event: egret.Event): void {
		let data: any = event.data;

		if (data.result == 0) {
			PDKToast.show("领取成功！");
			let mailData: any;
			let index: number = -1;
			this._source.some((item: any, i: number)=> {
				if (item.id == data.id) {
					mailData = item;
					index = i;
					return true;
				}
			});
			if (mailData) {
				this._source.splice(index, 1);
				mailData.status = 2;
				this.addItem(mailData, true);
				this.dispatchEventWith(PDKEventNames.MAIL_LIST_REFRESH, false);
				PDKBagService.instance.refreshBagInfo(); //领取附件成功更新背包
				PDKPanelMailDetails.getInstance().close();
			}
		}else{
			PDKToast.show("领取失败！");
		}
	}

	/**
	 * 更新未读邮件数量
	 * @param value
	 * @param dispatch
	 */
	private updateUnreadCount(value: number = 0, dispatch: boolean = true): void {
		this._unreadCount += value;
		//console.log("updateUnreadCount===>",this._unreadCount);
		if (dispatch) {
			this.dispatchEventWith(PDKEventNames.MAIL_UNREAD_UPDATE, false, {count: this._unreadCount});
            //老用户召回要显示在最上层
			if(this._unreadCount>0){
            	this.checkUserBack();
			}
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