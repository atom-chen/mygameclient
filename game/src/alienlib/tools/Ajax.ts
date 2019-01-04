/**
 * Created by rockyl on 15/12/24.
 *
 * Ajax异步请求
 */

module alien{
	export class Ajax{
		static callNet(url:string, params:any = null, method:string = egret.HttpMethod.GET, header:any = null, onSuccess:Function = null, onError:Function = null, parseUrl:Function = null, parseBody:Function = null):void {
			let finalUrl:string = parseUrl ? parseUrl() : url;
			console.log("callNet===1==>",finalUrl);
			let request:egret.HttpRequest = new egret.HttpRequest();
			request.addEventListener(egret.Event.COMPLETE, function (event:egret.Event):void {
				if (onSuccess) {
					onSuccess(request.response);
				}
			}, this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event:egret.Event):void {
				if (onError) {
					onError(request.response);
				}
			}, this);
			request.open(finalUrl, method);
			request.responseType = egret.HttpResponseType.TEXT;

			for(let k in header){
				request.setRequestHeader(k, header[k]);
			}

			let data:any = null;
			if(parseBody){
				data = parseBody();
			}else{
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				data = alien.Utils.obj2query(params);
				console.log("callNet===2==>",data);
			}
			if (data) {
				request.send(data);
			} else {
				request.send();
			}
		}

		static GET(url:string, params:any = null, onSuccess:Function = null, onError:Function = null, header:any = null):void{
			this.callNet(url, params, egret.HttpMethod.GET, header, onSuccess, onError, ():string=>{
				if(params){
					let data = alien.Utils.obj2query(params);
					url += (url.indexOf('?') < 0 ? '?' : '') + data;
				}
				return url;
			}, ()=>null);
		}

		static POST(url:string, params:any = null, onSuccess:Function = null, onError:Function = null, header:any = null):void{
			this.callNet(url, params, egret.HttpMethod.POST, header, onSuccess, onError);
		}

		static POSTDirectory(url:string, params:any = null, onSuccess:Function = null, onError:Function = null, header:any = null):void{
			this.callNet(url, params, egret.HttpMethod.POST, header, onSuccess, onError, null, ():any=>{return params});
		}
	}
}