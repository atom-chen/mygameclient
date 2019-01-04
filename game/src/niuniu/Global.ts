/**
 *
 * @author zhanghaichuan
 *
 */
class Global {
	public constructor() {
	}
	
    public static createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    
    public static createTextureByName(name: string): egret.Texture {        
        var texture: egret.Texture = RES.getRes(name);       
        return texture;
    }
    
    public static createJsonData(name: string): any {
       return RES.getRes(name);
    }
//    
//    private onBtnPickAvatarTap(event: egret.TouchEvent): void {
//        alien.Native.instance.uploadImageFromDevice('选择头像',GameConfigNiu.LOGIN_API_ROOT + 'upload',(args: any) => {
//            //console.log('选择头像' + JSON.stringify(args));
//            var result: number = args.result;
//            switch(result) {
//                case 0:
//                    var url: string = args.url;
//                    url = url.substring(url.indexOf('avatar/') + 7);
//                    var data: any = { imageid: url };
//                    server.modifyUserInfo(data);
//                    this._submitData = data;
//                    break;
//            }
//        });
//    }
}
