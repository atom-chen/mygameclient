/**
 * Created by eric.liu on 17/11/06.
 *
 * 用户信息
 */

class FishUserInfo extends eui.Component {
    private fish_img_avatar:eui.Image;
    private fish_label_nickname:eui.Label;
    private fish_label_id:eui.Label;
    private fish_label_gold:eui.Label;
    private fish_label_diamond:eui.Label;
    private fish_label_redcoin:eui.Label;
    constructor() {
        super();
        let self:FishUserInfo = this;
        self.addEventListener(eui.UIEvent.COMPLETE, self.uiCompHandler, self);
        self.addEventListener(egret.Event.RESIZE, self.uiResizeHandler, self);
        self.skinName = FishUserInfoSkin;
    }

    private uiCompHandler():void {
        let self:FishUserInfo = this;
        self.currentState = "wait";
    }

    private uiResizeHandler():void {
    }

    protected createChildren():void {
        super.createChildren();
    }

    public SetUserInfo(id:number, nick:string='', gold:number=0, diamond:number=0, avatar:string='', redcoin:number=0) {
        let self:FishUserInfo = this;
        //avatar = 'http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIRdRic7Jujz7ZolD7IKyGrqlBDib9VpPwdEYaDezeyntXoq56HzJnsbCOEpcl6icqPIsHs3yYnwQ3rw/64';
        if (id == 0) {
            self.currentState = "wait";
        } else if (id == fishServer.uid) {
            //自己
            self.currentState = "normal";
            self.fish_label_nickname.text = nick;
            self.fish_label_id.text = 'ID:'+id;
            self.fish_label_gold.text = gold+'';
            self.fish_label_diamond.text = diamond+'';
            self.fish_label_redcoin.text = redcoin+'';
            if (avatar == null || avatar == '') {
                self.fish_img_avatar.source = 'fish_touxiang';
            } else {
                self.fish_img_avatar.source = avatar;
            }
        } else {
            //别人
            self.currentState = "other";
            self.fish_label_nickname.text = nick;
            self.fish_label_id.text = 'ID:'+id;
            self.fish_label_gold.text = gold+'';
            if (avatar == null || avatar == '') {
                self.fish_img_avatar.source = 'fish_touxiang';
            } else {
                self.fish_img_avatar.source = avatar;
            }
        }
    }

    public UpdateGold(gold:number) {
        let self:FishUserInfo = this;
        self.fish_label_gold.text = gold+'';
    }

    public UpdateDiamond(diamond:number) {
        let self:FishUserInfo = this;
        if (self.currentState != "normal") return;
        self.fish_label_diamond.text = diamond+'';
    }

    public UpdateRedcoin(redcoin:number, add:boolean=false) {
        let self:FishUserInfo = this;
        if (self.currentState != "normal") return;
        if (add) {
            self.fish_label_redcoin.text = (parseFloat(self.fish_label_redcoin.text)+redcoin).toFixed(2)+'';
        } else {
            self.fish_label_redcoin.text = redcoin.toFixed(2)+'';
        }
    }
};