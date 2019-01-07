/**
 * Created by cyj on 16/5/9.
 */

class CCDDZInviteService extends CCService {
	private static _instance: CCDDZInviteService;
	public static get instance(): CCDDZInviteService {
		if (this._instance == undefined) {
			this._instance = new CCDDZInviteService();
		}
		return this._instance;
	}

	private _loadCount: number = 8;
	private _source: any[];
	private _reqAmount: number;
	private _haveMore: boolean;
	// private _timer: egret.Timer;
	private _total_page:number;
	private _complete_amount:number;
	// private _lastId:number;
	// private _firstId:number = 0;

	protected init(): void {
		this._source = [];
		this._reqAmount = 0;
		this._total_page = 0;
		this._complete_amount = 0;
		// this._timer = new egret.Timer(10000);

		// let e: CCalien.CCDDZEventManager = CCalien.CCDDZEventManager.instance;
		// let name = egret.getQualifiedClassName(this);
		// e.register(name, this._timer, egret.TimerEvent.TIMER, this.onCheckTimer, this);
	}

    getData(callback: Function = null,params: any = null,method: string = 'get'): void {
        if(!params) {
            params = {};
        }

        params.uid = ccserver.uid;
		

		params.token = CCGlobalUserData.instance.getToken();;
		params.limit = this._loadCount;

		// let url: string = 'http://pl.ddz.htgames.cn:18998//user/sharelist';
        let url: string = CCGlobalGameConfig.WEB_SERVICE_URL + '/user/sharelist';

        let m: Function = method == 'post' ? CCalien.Ajax.POST : CCalien.Ajax.GET;

        m.call(CCalien.Ajax,url,params,(content: any) => {
            if(CCGlobalGameConfig.DEBUG) {
                console.log('get:' + content);
            }
            if(callback) {
                let response: any = JSON.parse(content);
                if(response.code > 0) {
                    if(CCGlobalGameConfig.DEBUG) {
                        console.log(url,response.code,response.message);
                    }
                }
                callback(response);
            }
        });
    }

	clearInvitePlayersList() {
		this._source = [];
		this._reqAmount = 0;
		this._total_page = 0;
		// this._complete_amount = 0;
	}

	getInvitePlayersList(page = 0) {
		if(page == 0){
			page = this._reqAmount + 1;
		}
		if(this._reqAmount >= page || this._reqAmount > this._total_page) return;
		let params: any = {page:page};
		
		this.getData((response: any)=> {
			if (response.code == 0) {
				this._reqAmount = page > this._reqAmount? page: this._reqAmount;
				let data = response.data || [];
				if(data){
					this._complete_amount = data.total_items_finished;
					CCDDZInviteService.instance.source = this._source.concat(data.current_items);
					CCDDZInviteService.instance.total_page = data.total_page;
				}
				this.dispatchEventWith(CCGlobalEventNames.INVITE_DATA_REFRESH, false, this._source);
			}
		}, params)
	}

	getInviteRankList():void{
		ccddzwebService.getInviteRankList((data)=>{
			this.dispatchEventWith("INVITE_RANK_LIST", false, data);
		})
	}

	set total_page(data:any){
		this._total_page = data;
	}

	set source(data:any){
		this._source = data;
	}

	get source(): any {
		return this._source;
	}

	get complete_amount(): number {
		return this._complete_amount;
	}

	/**
	 * 是否还有更多
	 * @returns {boolean}
	 */
	get haveMore(): boolean {
		return this._haveMore;
	}
}