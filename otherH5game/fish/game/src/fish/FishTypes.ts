/**
 * Created by eric.liu on 17/11/15.
 *
 * 鱼类
 */

class FishTypeItem extends eui.Component {
    private fish_type_item_name:eui.Label;
    private fish_type_item_specific:eui.Label;
    private fish_type_item_multi:eui.BitmapLabel;
    private fish:FishActor = null;

    constructor() {
        super();
        let self:FishTypeItem = this;
        self.touchEnabled = false;
        self.addEventListener(eui.UIEvent.COMPLETE, self.uiCompHandler, self);
        self.addEventListener(egret.Event.RESIZE, self.uiResizeHandler, self);
        self.skinName = FishTypeItemSkin;
    }

    private uiCompHandler():void {
        let self:FishTypeItem = this;
        self.anchorOffsetX = self.width/2;
        self.anchorOffsetY = self.height/2;
    }

    private uiResizeHandler():void {
    }

    public SetFishInfo(name:string, type:number, multi:number, redpacket:number=0) {
        let self:FishTypeItem = this;
        self.currentState = (multi >= 40 || redpacket) ? 'big' : 'small';
        self.fish_type_item_name.text = name;
        if (multi > 0) {
            self.fish_type_item_multi.text = ''+multi+'倍';
            self.fish_type_item_specific.text = '';
        } else {
            self.fish_type_item_multi.text = '';
            self.fish_type_item_specific.text = '获得奖杯';
        }
        self.fish = FishManager.GetInstance().BuildFish(type, 0);
        self.fish.x = self.width/2;
        self.fish.y = self.height/2;
        if (self.fish.height > 100) {
            self.fish.scaleX = 0.5;
            self.fish.scaleY = 0.5;
        }
        self.fish.rotation = 45;
        self.fish.MoveOnly();
        self.addChild(self.fish);
    }

    public ClearFishInfo() {
        let self:FishTypeItem = this;
        if (self.fish) {
            if (self.fish.parent) self.fish.parent.removeChild(self.fish);
            FishManager.GetInstance().DestroyFish(self.fish);
        }
    }
}

class FishTypes extends FishPanelBase {
    private fish_btn_close:eui.Button;
    private fish_group_types:eui.Group;
    static typeConfigs:Array<any> = null;
    private items:Array<FishTypeItem> = [];

    private static _instance: FishTypes;
    public static get instance(): FishTypes {
        if(this._instance == undefined) {
            this._instance = new FishTypes();
        }
        return this._instance;
    }

    constructor() {
        super();
        let self:FishTypes = this;
        self.skinName = FishTypesSkin;

        if (null == FishTypes.typeConfigs) {
            FishTypes.typeConfigs = RES.getRes('fish_json');
            FishTypes.typeConfigs = FishTypes.typeConfigs.sort(self.sortFunction);
        }
    }

    private sortFunction(a:any, b:any):number {
        if (a.redpacket > 0) {
            return 1;
        }
        if (b.redpacket > 0) {
            return -1;
        }
        if (a.multiple > b.multiple) {
            return 1;
        }
        return -1;
    }

    createChildren(): void {
        super.createChildren();
        let self:FishTypes = this;
        self.fish_btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);

        //设置布局
        self.anchorOffsetX = self.width/2;
        self.anchorOffsetY = self.height/2;

        //设置网格布局
        var tLayout:eui.TileLayout = new eui.TileLayout();
        tLayout.horizontalGap = 15;
        tLayout.verticalGap = 15;
        tLayout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_WIDTH;
        tLayout.rowAlign = eui.RowAlign.JUSTIFY_USING_HEIGHT;
        tLayout.paddingTop = 10;
        tLayout.paddingRight = 15;
        tLayout.paddingLeft = 15;
        tLayout.paddingBottom = 10;
        tLayout.requestedColumnCount = 4;
        self.fish_group_types.layout = tLayout;
    }

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishTypes = this;
        switch(event.target) {
            case self.fish_btn_close:
                self.hide();
                //self.dealAction();
                break;
        }
    }

    show(parent:eui.Group): void {
        let self:FishTypes = this;

        //设置数据
        for (var i=FishTypes.typeConfigs.length-1;i>=0;i--) {
            var item = new FishTypeItem();
            var info = FishTypes.typeConfigs[i];
            item.SetFishInfo(info.name, info.typeid, info.multiple, info.redpacket);
            self.items.push(item);
            self.fish_group_types.addChild(item);
        }

        super._show(parent);
    }

    hide(): void {
        let self:FishTypes = this;
        super._hide(function(_self) {
            let self:FishTypes = _self;
            for (var i=0, length=self.items.length;i<length;i++) {
                self.items[i].ClearFishInfo();
            }
            self.items.splice(0, self.items.length);
            self.fish_group_types.removeChildren();
        }, self);
    }
}