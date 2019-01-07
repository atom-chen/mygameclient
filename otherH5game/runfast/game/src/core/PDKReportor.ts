/**
 * Created by rockyl on 16/1/30.
 *
 * 错误报告
 */

class PDKReportor {
	private static _instance:PDKReportor;
	public static get instance():PDKReportor {
		if (this._instance == undefined) {
			this._instance = new PDKReportor();
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
			PF: PDKalien.Native.instance.platformId,
			OS: os,
			PID: 1,
			MSG: url + '[' + row + ',' + col + ']\n' + msg
		};
		if(error){
			body.MSG += " stack:" + error.stack;
		}
		if(PDKGameConfig.gameId){
			body.RID = PDKGameConfig.gameId;
		}

		//console.log("error===>",JSON.stringify(body));
		//PDKalien.Ajax.POSTDirectory(PDKGameConfig.REPORT_URL, JSON.stringify(body));;
		PDKwebService.postError(PDKErrorConfig.REPORT_ERROR,JSON.stringify(body));
		return bNotShow;
	}

	/**
	 * 上报代码逻辑中不用该出现的数据错误
	 */
	reportCodeError(msg:string):void{
		let os:string = egret.Capabilities.os;
		let body:any = {
			PF: PDKalien.Native.instance.platformId,
			OS: os,
			PID: 1,
			MSG: "pdk------->" + msg
		};
		if(PDKGameConfig.gameId){
			body.RID = PDKGameConfig.gameId;
		}

		PDKwebService.postError(PDKErrorConfig.REPORT_ERROR,JSON.stringify(body));
	}

	/**
	 * 在线反馈页面
	 */
	toReportPage():void{
		let _url = PDKGameConfig.reportUrl;
		_url = _url + "?uid="+pdkServer.uid;
		if(_pdk_nativeBridge.isNative){
			_url = _url + "&app=" +egret.Capabilities.os;
			_pdk_nativeBridge.openUrlBySys(_url)
		}else{
			window.top.location.href = _url;
		}
	}
}