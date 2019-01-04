/**
 * Created by cyj on 17/5/9.
 */

class PersonalGameHistory extends Service {
	private static _instance: PersonalGameHistory;
	public static get instance(): PersonalGameHistory {
		if (this._instance == undefined) {
			this._instance = new PersonalGameHistory();
		}
		return this._instance;
	}

	private _loadCount: number = 8;
	private _source: any[];
	private _reqAmount: number;
	private _haveMore: boolean;
	private _timer: egret.Timer;
	private _total_page:number;
	// private _complete_amount:number;
	// private _lastId:number;
	// private _firstId:number = 0;

	protected init(): void {
		this._source = [];
		this._reqAmount = 0;
		this._total_page = 0;
		// this._complete_amount = 0;
	}

    getData(callback: Function = null,params: any = null,method: string = 'get'): void {
        if(!params) {
            params = {};
        }

        params.uid = server.uid;
		params.token = UserData.instance.getToken();
		params.limit = this._loadCount;
        let url: string = GameConfig.WEB_SERVICE_URL + '/user/gamelist';
        let m: Function = method == 'post' ? alien.Ajax.POST : alien.Ajax.GET;

        m.call(alien.Ajax,url,params,(content: any) => {
            if(GameConfig.DEBUG) {
                console.log('get:' + content);
            }
            if(callback && content) {
                let response: any = JSON.parse(content);
                if(response.code > 0) {
                    if(GameConfig.DEBUG) {
                        console.log(url,response.code,response.message);
                    }
                }
                callback(response);
            }
        });
    }

	clearDataList() {
		this._source = [];
		this._reqAmount = 0;
		this._total_page = 0;
		// this._complete_amount = 0;
	}

	getDataList(page = 0) {
		if(page == 0){
			page = this._reqAmount + 1;
		}
		if(this._reqAmount >= page || this._reqAmount > this._total_page) return;
		let params: any = {page:page};
		
		this.getData((response: any)=> {
			if (response.code == 0) {
				PersonalGameHistory.instance.reqAmount = page > PersonalGameHistory.instance.reqAmount? page: PersonalGameHistory.instance.reqAmount;
				let data = response.data || [];
				if(data && data.items && data.items.length > 0){
					// this._complete_amount = data.total_items_finished;
					PersonalGameHistory.instance.source = this._source.concat(data.items);
					PersonalGameHistory.instance.total_page = data.total_page;
				}

				this.dispatchEventWith(EventNames.PGAME_RECORD_DATA_REFRESH, false, this._source);
			}
		}, params)
	}

	set reqAmount(amount:any){
		this._reqAmount = amount;
	}

	get reqAmount(): any {
		return this._reqAmount;
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
}