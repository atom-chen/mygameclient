/**
 * zhu 2017/09/19
 * 聊天记录中的ItemRender
 */
class HornTalkItem extends eui.ItemRenderer {
   
	constructor() {
		super();
        this._enableEvent(true);
    }

    /**
     *  喇叭消息
     */
    private text_label:eui.Label;

    /**
     * 使能事件
     */
    private _enableEvent(bEnable:boolean):void{
        let _func = "addEventListener";
		if(!bEnable){
			_func = "removeEventListener"
		}
        this[_func](egret.Event.REMOVED_FROM_STAGE,this._onRemoveFromStage,this);
    }

    /**
     * 移除舞台
     */
    private _onRemoveFromStage(){
        this._enableEvent(false);
    }

    /**
     * 数据变化
     */
    protected dataChanged(): void {
        super.dataChanged();
        if(this.data) {
            this._initByData();
        }
    }

    /**
     * 初始化聊天数据
     */
    private _initByData():void{
        let data = this.data;
        let str = "";
        if(data.isUser){ //是玩家喇叭消息
            let name = data.name.substr(0,9);
            str = "<font color='#ffffff'>【" + name + "】:</font>" + " <font color='#654116'>" + data.msg + "</font>";
        }
        else{
            str = "<font color='#FFEA00'>【 系统 】</font>" + "<font color='#FFEA00'>" + data.msg + "</font>";
        }
        let textFlow = new egret.HtmlTextParser().parser(str);
        this.text_label.textFlow = textFlow;
    }
}

