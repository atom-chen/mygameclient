class CCGlobal {
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
}
