/**
 * Created by rockyl on 16/1/30.
 *
 * 错误报告
 */

class CCDDZReportor {
	private static _instance:CCDDZReportor;
	public static get instance():CCDDZReportor {
		if (this._instance == undefined) {
			this._instance = new CCDDZReportor();
		}
		return this._instance;
	}

	start():void {
		window.onerror = this.onWindowError;
	}

	stop():void {
		window.onerror = null;
	}

	onWindowError(msg, url, row, col,error) {
		let bNotShow = RELEASE; //发布版浏览器不要打印错误
		if(msg.indexOf('gif') >= 0){
			return bNotShow;
		}

		let os:string = egret.Capabilities.os;
		let body:any = {
			PF: CCalien.Native.instance.platformId,
			OS: os,
			PID: 1,
			MSG: url + '[' + row + ',' + col + ']\n' + msg
		};
		if(error){
			body.MSG += " stack:" + error.stack;
		}
		if(CCGlobalGameConfig.gameId){
			body.RID = CCGlobalGameConfig.gameId;
		}

		//console.log("error===>",JSON.stringify(body));
		//CCalien.Ajax.POSTDirectory(CCGlobalGameConfig.REPORT_URL, JSON.stringify(body));;		
		let _info = JSON.stringify(body);
		let params: any = CCalien.Native.instance.getUrlArg();
		if(params.alertErr == 1 || DEBUG){
			CCDDZAlert.show(_info,0,function(){
				CCGlobalGameConfig.copyText(null, _info,"错误日志",true);
			});
		}
		if(bNotShow){
			ccddzwebService.postError(CCGlobalErrorConfig.REPORT_ERROR,_info);
		}
		return bNotShow;
	}

	/**
	 * 上报代码逻辑中不用该出现的数据错误
	 */
	reportCodeError(msg:string):void{
		let os:string = egret.Capabilities.os;
		let body:any = {
			PF: CCalien.Native.instance.platformId,
			OS: os,
			PID: 1,
			MSG: msg
		};
		if(CCGlobalGameConfig.gameId){
			body.RID = CCGlobalGameConfig.gameId;
		}
		let params: any = CCalien.Native.instance.getUrlArg();
		if(params.alertErr == 1 || DEBUG){
			console.error(msg,arguments.callee.caller);
			CCDDZAlert.show(msg,0,function(){
				CCGlobalGameConfig.copyText(null, msg,"错误日志",true);
			});
		}
		ccddzwebService.postError(CCGlobalErrorConfig.REPORT_ERROR,JSON.stringify(body));
	}

	/**
	 * 在线反馈页面
	 */
	toReportPage():void{
		let _url = CCGlobalGameConfig.getCfgByField("urlCfg.reportUrl");
		_url = _url + "?uid="+ccserver.uid;
		if(CCalien.Native.instance.isNative){
			_url = _url + "&app=" +egret.Capabilities.os;
			CCalien.Native.instance.openUrlBySys(_url)
		}else{
			window.top.location.href = _url;
		}
	}
}