/**
 * Created by rockyl on 15/12/28.
 *
 * 提示面板类
 * 通过Alert.show()来调用
 */

class ImgToast extends eui.Component {
	private static _instance:ImgToast;
	public static get instance():ImgToast {
		if (this._instance == undefined) {
			this._instance = new ImgToast();
		}
		return this._instance;
	}

	private bgImg:eui.Image;
	private lb:eui.Label;

	protected init():void {
		this.skinName = personal.ToastSkin;
	}

	constructor() {
		super();
        this.init();
	}

	createChildren():void {
		super.createChildren();
	}

	/**
	 * 是否允许改界面的点击事件
	 */
	public enableTouch(bEnable:boolean):void{
		this.touchEnabled = bEnable;
		this.lb.touchEnabled = bEnable;
		this.bgImg.touchEnabled = bEnable;
	}
	show(parent, content):void {
        if(parent.contains(this)){
            parent.removeChild(this);
        }
        
        parent.addChild(this);
        this.x = parent.width / 2 - this.width / 2;
        this.y = parent.height / 2 - this.height / 2;
        
        this.lb.text = content;
        this.alpha = 0;
        egret.Tween.get(this, null, null, true).to({alpha: 1}, 300).wait(1500).to({alpha: 0}, 300).call(()=>{
             if(parent.contains(this)){
                parent.removeChild(this);
            }
        });
	}
}