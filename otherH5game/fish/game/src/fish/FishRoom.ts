/**
 * Created by eric.liu on 18/03/30.
 *
 * 房间
 */

class FishRoom extends FishPanelBase {
    private fish_btn_close:eui.Button;
    private fish_btn_room1:eui.Button;
    private fish_btn_room2:eui.Button;
    private fish_btn_room3:eui.Button;
    private fish_room_current_flag1:eui.Image;
    private fish_room_current_flag2:eui.Image;
    private fish_room_current_flag3:eui.Image;
    private callback:Function;

    private limitLabel1:eui.Label;
    private limitLabel2:eui.Label;
    private limitLabel3:eui.Label;

    private static _instance: FishRoom;
    public static get instance(): FishRoom {
        if(this._instance == undefined) {
            this._instance = new FishRoom();
        }
        return this._instance;
    }

    constructor() {
        super();
        let self:FishRoom = this;
        self.skinName = FishRoomSkin;
    }

    private _initRoomLimits():void{
        let cfg = langFish["roomCfg"];
        let oneRoom = null;
        let sLimimt = ""
        for(let i=0;i<3;++i){
            oneRoom = cfg[i];
            let min = oneRoom.minScore;
            let max = oneRoom.maxScore;
            sLimimt = "" + min;

            if (min > 10000){
                min = "" +  (min/10000) + "万"
                sLimimt = min;
            }

            if(max > 10000){
                if (max > 99999999){
                    min = min + "以上"
                    max = ""
                    sLimimt = min;
                }else{
                    max = "" +  (max/10000) + "万"
                    sLimimt = min + "-" + max;
                }
            }else{
                sLimimt = min + "-" + max;
            }

            this["limitLabel" + (i+1)].text = sLimimt; 
        }
    }

    createChildren(): void {
        super.createChildren();
        let self:FishRoom = this;

        self.fish_btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_room1.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_room2.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_btn_room3.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);

        //设置布局
        self.anchorOffsetX = self.width/2;
        self.anchorOffsetY = self.height/2;
    }

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishRoom = this;
        switch(event.target) {
            case self.fish_btn_close:
                //self.dealAction();
                break;
            case self.fish_btn_room1:
                if (self.callback) {
                    self.callback(3002);
                }
                break;
            case self.fish_btn_room2:
                if (self.callback) {
                    self.callback(3003);
                }
                break;
            case self.fish_btn_room3:
                if (self.callback) {
                    self.callback(3004);
                }
                break;
        }
        self.hide();
    }

    show(parent:eui.Group, roomId:number, callback:Function): void {
        let self:FishRoom = this;
        self.fish_room_current_flag1.visible = (roomId == 3002);
        self.fish_room_current_flag2.visible = (roomId == 3003);
        self.fish_room_current_flag3.visible = (roomId == 3004);
        self.callback = callback;
        self._initRoomLimits();
        super._show(parent);
    }

    hide() {
        let self:FishRoom = this;
        super._hide(function(arg) {
            let self:FishRoom = arg;
        }, self);
    }
}