

class FishShowItem extends eui.Component {
    public fishType:number = 0;
    private fish:FishActor = null;
    public static selectedItem:FishShowItem = null;

    constructor() {
        super();
        let self:FishShowItem = this;
        self.touchEnabled = true;
        self.touchChildren = false;
        self.addEventListener(eui.UIEvent.COMPLETE, self.uiCompHandler, self);
        self.addEventListener(egret.Event.RESIZE, self.uiResizeHandler, self);
        self.skinName = FishShowItemSkin;
    }

    private uiCompHandler():void {
        let self:FishShowItem = this;
        self.anchorOffsetX = self.width/2;
        self.anchorOffsetY = self.height/2;
    }

    private uiResizeHandler():void {
    }

    public SetFishInfo(type:number) {
        let self:FishShowItem = this;
        self.fishType = type;
        var fish = FishManager.GetInstance().BuildFish(type, 0);
        fish.x = self.width/2;
        fish.y = self.height/2;
        if (fish.height > 50) {
            fish.scaleX = 50/fish.height;
            fish.scaleY = 50/fish.height;
        }
        fish.rotation = 45;
        fish.MoveOnly();
        self.addChild(fish);
        self.fish = fish;
    }

    public ClearFishInfo() {
        let self:FishShowItem = this;
        if (self.fish) {
            if (self.fish.parent) self.fish.parent.removeChild(self.fish);
            FishManager.GetInstance().DestroyFish(self.fish);
        }
    }

    public Select(select:boolean) {
        let self:FishShowItem = this;
        if (select) {
            if (FishShowItem.selectedItem != null) {
                FishShowItem.selectedItem.Select(false);
            }
            FishShowItem.selectedItem = self;
            self.currentState = 'big';
        } else {
            self.currentState = 'small';
        }
    }
}