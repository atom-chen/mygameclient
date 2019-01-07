/**
 * Created by cyj on 16/5/9.
 */

class PDKInviteService extends PDKService {
	private static _instance: PDKInviteService;
	public static get instance(): PDKInviteService {
		if (this._instance == undefined) {
			this._instance = new PDKInviteService();
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

		// let e: PDKalien.PDKEventManager = PDKalien.PDKEventManager.instance;
		// let name = egret.getQualifiedClassName(this);
		// e.register(name, this._timer, egret.TimerEvent.TIMER, this.onCheckTimer, this);
	}

    getData(callback: Function = null,params: any = null,method: string = 'get'): void {
        if(!params) {
            params = {};
        }

        params.uid = pdkServer.uid;
		

		params.token = PDKUserData.instance.getItem('token');
		params.limit = this._loadCount;

		// let url: string = 'http://pl.ddz.htgames.cn:18998//user/sharelist';
        let url: string = PDKGameConfig.WEB_SERVICE_URL + '/user/sharelist';

        let m: Function = method == 'post' ? PDKalien.Ajax.POST : PDKalien.Ajax.GET;

        m.call(PDKalien.Ajax,url,params,(content: any) => {
            if(PDKGameConfig.DEBUG) {
                console.log('get:' + content);
            }
            if(callback) {
                let response: any = JSON.parse(content);
                if(response.code > 0) {
                    if(PDKGameConfig.DEBUG) {
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
					// this._source = data.current_items || [];
					PDKInviteService.instance.source = this._source.concat(data.current_items);
					// data.current_items.forEach((item: any)=> {
					// 	this._source.push(item);
					// });
					// this._source.push(data.current_items);
					PDKInviteService.instance.total_page = data.total_page;
				}
				// this._source.sort((p1:any, p2:any):number=>{
				// 	if(p1.status != p1.status){
				// 		return p1.status.tonumber() - p2.status.tonumber();
				// 	}else{

				// 	}
				// });
				this.dispatchEventWith(PDKEventNames.INVITE_DATA_REFRESH, false, this._source);
			}
		}, params)
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