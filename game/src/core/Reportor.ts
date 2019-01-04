/**
 * Created by rockyl on 16/1/30.
 *
 * 错误报告
 */

class Reportor {
	private static _instance:Reportor;
	public static get instance():Reportor {
		if (this._instance == undefined) {
			this._instance = new Reportor();
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
			PF: alien.Native.instance.platformId,
			OS: os,
			PID: 1,
			MSG: url + '[' + row + ',' + col + ']\n' + msg
		};
		if(error){
			body.MSG += " stack:" + error.stack;
		}
		if(GameConfig.gameId){
			body.RID = GameConfig.gameId;
		}

		//console.log("error===>",JSON.stringify(body));
		//alien.Ajax.POSTDirectory(GameConfig.REPORT_URL, JSON.stringify(body));;		
		let _info = JSON.stringify(body);
		let params: any = alien.Native.instance.getUrlArg();
		if(params.alertErr == 1 || DEBUG){
			Alert.show(_info,0,function(){
				GameConfig.copyText(null, _info,"错误日志",true);
			});
		}
		if(bNotShow){
			webService.postError(ErrorConfig.REPORT_ERROR,_info);
		}
		return bNotShow;
	}

	/**
	 * 上报代码逻辑中不用该出现的数据错误
	 */
	reportCodeError(msg:string):void{
		let os:string = egret.Capabilities.os;
		let body:any = {
			PF: alien.Native.instance.platformId,
			OS: os,
			PID: 1,
			MSG: msg
		};
		if(GameConfig.gameId){
			body.RID = GameConfig.gameId;
		}
		let params: any = alien.Native.instance.getUrlArg();
		if(params.alertErr == 1 || DEBUG){
			console.error(msg,arguments.callee.caller);
			Alert.show(msg,0,function(){
				GameConfig.copyText(null, msg,"错误日志",true);
			});
		}
		webService.postError(ErrorConfig.REPORT_ERROR,JSON.stringify(body));
	}

	/**
	 * 在线反馈页面
	 */
	toReportPage():void{
		let _url = GameConfig.getCfgByField("urlCfg.reportUrl");
		_url = _url + "?uid="+server.uid;
		if(alien.Native.instance.isNative){
			_url = _url + "&app=" +egret.Capabilities.os;
			alien.Native.instance.openUrlBySys(_url)
		}else{
			window.top.location.href = _url;
		}
	}
}