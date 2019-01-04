/**
 * Created by rockyl on 15/11/25.
 *
 * 用户信息展示类
 */

class UserInfoView extends eui.Component {
	public labNickName:eui.Label;
	public gold:Gold;
    public diamond:Gold;
	public avatar:Avatar;

	private _globalPos:egret.Point;
    
    private grpGRLight:eui.Group;
    private grpAnimate:eui.Group;
    
    private light: eui.Image;
    
	update(data:UserInfoData):void{
        this.updateHeadImage(data.imageid);
        this.updateNickname(data);
        if(!isNaN(data.gold)){
            this.updateGold(data.gold);
        }
	}

    /**
     * 更新昵称
     */
    updateNickname(data:any):void{
        let _selfData = MainLogic.instance.selfData;
        if(data.uid == _selfData.uid){
            if(_selfData.nickname) {
                    let _nameStr = _selfData.nickname.substr(0,10);
                    this.labNickName.text =  _nameStr + "(" + _selfData.fakeuid + ")";
                }
        }else{
            this.labNickName.text = data.nickname;
        }
    }

    /**
     * 更新玩家的图像id
     */
    updateHeadImage(imageid:string):void{
        if(imageid ){
            if(imageid != this.avatar.imageId){
                this.avatar.imageId = imageid;
            }
        }
    }

	/**
	 * 清理现场
	 */
	clean():void{
		this.avatar.clean();
		this.labNickName.text = '';
		this.gold.setEmpty();
	}

	/**
	 * 获取头像的全局坐标
	 */
	getAvatarPos():egret.Point{
		if(!this._globalPos){
			this._globalPos = this.localToGlobal(this.avatar.x + this.avatar.width / 2 - 20, this.avatar.y + this.avatar.height / 2 - 20);
		}
		return this._globalPos;
	}

	updateGold(gold:number):void{
		this.gold.updateGold(gold);
	}
	
    /**
     * 更新钻石(钻石栏和金豆栏用的是一个控件Gold)
     */
    updateDiamond(nDiamond:number):void{
        this.diamond.updateGold(nDiamond);
    }

    /**
     * 游戏过程中更新钻石数量
     */
    updateDiamondNum(nDiamond: number, self: boolean): void {
        if (self == true) {
            this.diamond.updateDiamondNum(nDiamond, self);
        }
        else {
            this.gold.updateDiamondNum(nDiamond, self);
        }
    }
    hideGuessRight() {
        this.grpGRLight.visible = false;
    }
    
    playWinGoldAnimate() {
        this.grpGRLight.visible = true;
        this.grpAnimate.visible = true;

        this['star0'].visible = false;
        this['star1'].visible = false;
        this['star2'].visible = false;
        
        egret.Tween.get(this.light).set({
            loop: true,
            visible:true,
            rotation: 0
        }).to({
            rotation: 360
        }, 2000).to({visible:false}).wait(1700).call(this.hideGuessRight,this);
        
        egret.Tween.get(this['star0']).set({
            alpha: 0.3,
            x:40,
            y:40,
            scale:1,
            visible: true,
        }).to({
            alpha: 1,
            x: 17,
            y: -9,
            scale: 1.3
        },800).to({
            alpha:0
        },100).///section 2
        to({
            alpha: 0.3,
            x:40,
            y:40,
            scale:1,
        }).to({
            alpha: 1,
            x: 34,
            y: -11,
            scale: 1.3
        },1000).to({
            alpha:0
        },100);
        
        egret.Tween.get(this['star1']).set({
            alpha: 0.3,
            x: 40,
            y: 40,
            scale:1,
            visible: true,
        }).wait(200).to({
            alpha: 1,
            x: 5,
            y: 74,
            scale: 1.3
        },1000).to({
            alpha: 0
        },100).// section 2
        to({
            alpha: 0.3,
            x:40,
            y:40,
            scale:1,
        }).to({
            alpha: 1,
            x: 8,
            y: 86,
            scale: 1.3
        },1000).to({
            alpha:0
        },100);
        
        egret.Tween.get(this['star2']).set({
            alpha: 0.3,
            x: 40,
            y: 40,
            scale:1,
            visible: true,
        }).wait(300).to({
            alpha: 1,
            x: 85,
            y: 28,
            scale: 1.3
        },1000).to({
            alpha: 0
        },100). // section 2
        to({
            alpha: 0.3,
            x:40,
            y:40,
            scale:1,
        }).to({
            alpha: 1,
            x: 70,
            y: 74,
            scale: 1.3
        },1000).to({
            alpha:0
        },100);
    }
}
window["UserInfoView"]=UserInfoView;