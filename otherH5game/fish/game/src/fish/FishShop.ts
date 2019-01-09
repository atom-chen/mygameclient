/**
 * Created by eric.liu on 17/11/15.
 *
 * 商城
 */

class FishShopItem extends eui.Component {
    private fish_shop_item_name_small:eui.Label;
    private fish_shop_item_price_small:eui.Label;
    private fish_shop_item_name_big:eui.Label;
    private fish_shop_item_price_big:eui.Label;
    private fish_shop_item_buy_small:eui.Button;
    private fish_shop_item_buy_big:eui.Button;
    private fish_shop_item_total_big:eui.BitmapLabel;
    private fish_shop_item_gift:eui.Image;
    private fish_shop_item_giftlabel:eui.Label;
    private fish_shop_item_icon_small:eui.Image;
    private fish_shop_item_icon_big:eui.Image;
    private fish_shop_item_small_top:eui.Group;
    private fish_shop_item_big_top:eui.Group;
    private fish_shop_item_hot_flag:eui.Image;
    private fish_shop_item_hot_title:eui.Image;
    private fish_shop_item_ticket_small:eui.Image;
    private fish_shop_item_ticket_big:eui.Image;

    private exchange:boolean = false;
    private fish_shop_item_id:string = '';
    private fish_shop_item_ticket:boolean = false;

    constructor() {
        super();
        let self:FishShopItem = this;
        self.touchEnabled = false;
        self.addEventListener(eui.UIEvent.COMPLETE, self.uiCompHandler, self);
        self.addEventListener(egret.Event.RESIZE, self.uiResizeHandler, self);
        self.skinName = FishShopItemSkin;
    }

    private uiCompHandler():void {
        let self:FishShopItem = this;
        self.currentState = 'small';
        self.fish_shop_item_buy_big.addEventListener(egret.TouchEvent.TOUCH_TAP, self.buyTouchHandler, self);
        self.fish_shop_item_buy_small.addEventListener(egret.TouchEvent.TOUCH_TAP, self.buyTouchHandler, self);
        self.fish_shop_item_small_top.addEventListener(egret.TouchEvent.TOUCH_TAP, self.buyTouchHandler, self);
        self.fish_shop_item_big_top.addEventListener(egret.TouchEvent.TOUCH_TAP, self.buyTouchHandler, self);
    }

    private uiResizeHandler():void {
    }

    public SetShopItemInfo(id, big, name, price, gift, icon='', total='', exchange=false, ticket=false) {
        let self:FishShopItem = this;
        self.fish_shop_item_id = id;
        self.fish_shop_item_ticket = ticket;
        self.exchange = exchange;
        if (big) {
            self.currentState = 'big';
            for (var i=0,length=8-total.length;i<length;i++) {
                total = ' ' + total;
            }
            self.fish_shop_item_total_big.text = total;
            self.fish_shop_item_name_big.text = name;
            self.fish_shop_item_price_big.text = (ticket?'   ':'')+price;
            self.fish_shop_item_icon_big.source = icon;
            self.fish_shop_item_ticket_big.visible = ticket;
        } else {
            self.currentState = 'small';
            self.fish_shop_item_name_small.text = name;
            self.fish_shop_item_price_small.text = (ticket?'   ':'')+price;
            self.fish_shop_item_icon_small.source = icon;
            self.fish_shop_item_hot_flag.visible = exchange;
            self.fish_shop_item_hot_title.visible = exchange;
            self.fish_shop_item_ticket_small.visible = ticket;
        }

        if (gift > 0) {
            self.fish_shop_item_giftlabel.visible = true;
            self.fish_shop_item_gift.visible = true;
            self.fish_shop_item_giftlabel.text = '加送\n'+gift+'%';
        } else {
            self.fish_shop_item_giftlabel.visible = false;
            self.fish_shop_item_gift.visible = false;
        }
    }

    private buyTouchHandler(event:egret.TouchEvent) {
        let self:FishShopItem = this;
        //点击购买
        if (FISH_MODE_INDEPENDENT) {
            //公众号模式
            if (self.fish_shop_item_ticket) {
                //兑换
                fishServer.redcoinExchangeGoodsReq(parseInt(self.fish_shop_item_id));
            } else {
                //购买
                fishWebService.rechagre(self.fish_shop_item_id, (code)=> {
                    if (code == 0) {
                        //请求刷新
                        fishServer.refreshUserGoldInGame();
                    }
                });
            }
        } else {
            //接入斗地主模式
            if(self.exchange){ 
                fishServer.ddzDispatchEvent(7, '', {type:7, id:self.fish_shop_item_id})
            }else{//支付
                fishServer.ddzDispatchEvent(5, '', {type:5, productID:self.fish_shop_item_id})
            }
        }
    }
}

class FishShop extends FishPanelBase {
    private fish_btn_close:eui.Button;
    private fish_shop_group:eui.Group;
    private fish_shop_group_big:eui.Group;
    private fish_shop_group_small:eui.Group;
    static itemConfigs:Array<any> = null;

    private fish_shop_type_btn_gold:FishBtnShopType;
    private fish_shop_type_btn_diamond:FishBtnShopType;
    private fish_shop_type_btn_redpacket:FishBtnShopType;
    private fish_shop_type_btn_jd:FishBtnShopType;
    private fish_shop_type_btn_alipay:FishBtnShopType;
    private fish_shop_type_btn_selected:FishBtnShopType;

    private static _instance: FishShop;
    public static get instance(): FishShop {
        if(this._instance == undefined) {
            this._instance = new FishShop();
        }
        return this._instance;
    }

    constructor() {
        super();
        let self:FishShop = this;
        self.skinName = FishShopSkin;

        if (null == FishShop.itemConfigs) {
            FishShop.itemConfigs = RES.getRes('shop_json');
        }
    }

    createChildren(): void {
        super.createChildren();
        let self:FishShop = this;

        //设置布局
        self.anchorOffsetX = self.width/2;
        self.anchorOffsetY = self.height/2;

        //设置网格布局
        var tLayout:eui.TileLayout = new eui.TileLayout();
        tLayout.horizontalGap = 15;
        tLayout.verticalGap = 0;
        tLayout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_WIDTH;
        tLayout.rowAlign = eui.RowAlign.JUSTIFY_USING_HEIGHT;
        tLayout.paddingTop = 10;
        tLayout.paddingRight = 15;
        tLayout.paddingLeft = 15;
        tLayout.paddingBottom = 10;
        tLayout.requestedColumnCount = 1;
        self.fish_shop_group.layout = tLayout;

        var tLayout:eui.TileLayout = new eui.TileLayout();
        tLayout.horizontalGap = 15;
        tLayout.verticalGap = 15;
        tLayout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_WIDTH;
        tLayout.rowAlign = eui.RowAlign.JUSTIFY_USING_HEIGHT;
        tLayout.requestedColumnCount = 2;
        self.fish_shop_group_big.layout = tLayout;

        var tLayout:eui.TileLayout = new eui.TileLayout();
        tLayout.horizontalGap = 15;
        tLayout.verticalGap = 15;
        tLayout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_WIDTH;
        tLayout.rowAlign = eui.RowAlign.JUSTIFY_USING_HEIGHT;
        tLayout.requestedColumnCount = 4;
        self.fish_shop_group_small.layout = tLayout;

        self.fish_shop_type_btn_gold.currentState = 'downAndSelected';
        self.fish_shop_type_btn_gold.fish_shoptype_label.text = '金豆';
        self.fish_shop_type_btn_diamond.currentState = 'up';
        self.fish_shop_type_btn_diamond.fish_shoptype_label.text = '钻石';
        self.fish_shop_type_btn_redpacket.currentState = 'up';
        self.fish_shop_type_btn_redpacket.fish_shoptype_label.text = '话费';
        self.fish_shop_type_btn_jd.currentState = 'up';
        self.fish_shop_type_btn_jd.fish_shoptype_label.text = '京东卡';
        self.fish_shop_type_btn_alipay.currentState = 'up';
        self.fish_shop_type_btn_alipay.fish_shoptype_label.text = '支付宝零钱';

        self.fish_btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_shop_type_btn_gold.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_shop_type_btn_diamond.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_shop_type_btn_redpacket.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_shop_type_btn_jd.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
        self.fish_shop_type_btn_alipay.addEventListener(egret.TouchEvent.TOUCH_TAP, self.btnTouchHandler, self);
    }

    private btnTouchHandler(event:egret.TouchEvent):void {
        let self:FishShop = this;
        switch(event.target) {
            case self.fish_btn_close:
                //self.dealAction();
                break;
            case self.fish_shop_type_btn_gold:
            case self.fish_shop_type_btn_diamond:
            case self.fish_shop_type_btn_redpacket:
            case self.fish_shop_type_btn_jd:
            case self.fish_shop_type_btn_alipay:
                self.selectType(event.target);
                return;
        }
        self.hide();
    }

    private selectType(btn:FishBtnShopType) {
        let self:FishShop = this;
        if (self.fish_shop_type_btn_selected)
            self.fish_shop_type_btn_selected.currentState = 'up';
        btn.currentState = 'downAndSelected';
        self.fish_shop_type_btn_selected = btn;
        self.fish_shop_group_big.removeChildren();
        self.fish_shop_group_small.removeChildren();
        switch(btn) {
            case self.fish_shop_type_btn_gold:
                //金豆
                for (var i=0,length=FishShop.itemConfigs.length;i<length;i++) {
                    var info = FishShop.itemConfigs[i];
                    if (info.itemtype == 0) {
                        var item = new FishShopItem();
                        if (info.type==1) {
                            self.fish_shop_group_big.addChild(item);
                        } else {
                            self.fish_shop_group_small.addChild(item);
                        }
                        item.SetShopItemInfo(info.itemid+'', info.type==1, info.name, info.price, info.gift, info.icon, info.total, info.exchange, info.ticket);
                    }
                }
                break;
            case self.fish_shop_type_btn_diamond:
                //钻石
                for (var i=0,length=FishShop.itemConfigs.length;i<length;i++) {
                    var info = FishShop.itemConfigs[i];
                    if (info.itemtype == 1) {
                        var item = new FishShopItem();
                        if (info.type==1) {
                            self.fish_shop_group_big.addChild(item);
                        } else {
                            self.fish_shop_group_small.addChild(item);
                        }
                        item.SetShopItemInfo(info.itemid+'', info.type==1, info.name, info.price, info.gift, info.icon, info.total, info.exchange, info.ticket);
                    }
                }
                break;
            case self.fish_shop_type_btn_redpacket:
                //红包
                for (var i=0,length=FishShop.itemConfigs.length;i<length;i++) {
                    var info = FishShop.itemConfigs[i];
                    if (info.itemtype == 2) {
                        var item = new FishShopItem();
                        if (info.type==1) {
                            self.fish_shop_group_big.addChild(item);
                        } else {
                            self.fish_shop_group_small.addChild(item);
                        }
                        item.SetShopItemInfo(info.itemid+'', info.type==1, info.name, info.price, info.gift, info.icon, info.total, info.exchange, info.ticket);
                    }
                }
                break;
            case self.fish_shop_type_btn_jd:
                //京东卡
                for (var i=0,length=FishShop.itemConfigs.length;i<length;i++) {
                    var info = FishShop.itemConfigs[i];
                    if (info.itemtype == 3) {
                        var item = new FishShopItem();
                        if (info.type==1) {
                            self.fish_shop_group_big.addChild(item);
                        } else {
                            self.fish_shop_group_small.addChild(item);
                        }
                        item.SetShopItemInfo(info.itemid+'', info.type==1, info.name, info.price, info.gift, info.icon, info.total, info.exchange, info.ticket);
                    }
                }
                break;
            case self.fish_shop_type_btn_alipay:
                //支付宝零钱
                break;
        }
    }

    show(parent:eui.Group): void {
        let self:FishShop = this;
        super._show(parent);
        self.selectType(self.fish_shop_type_btn_gold);
    }

    hide() {
        let self:FishShop = this;
        super._hide(function(arg) {
            let self:FishShop = arg;
            self.fish_shop_group_big.removeChildren();
            self.fish_shop_group_small.removeChildren();
        }, self);
    }
}