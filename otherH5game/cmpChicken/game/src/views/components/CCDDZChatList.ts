/**
 * Created by rockyl on 15/12/14.
 *
 * 聊天内容选择
 */

class CCDDZChatList extends eui.Component {
	private grp:eui.Group;
	private list:eui.List;

	private _callback:Function;

	protected init():void {
		this.skinName = components.CCDDZChatListSkin;
	}

	createChildren():void {
		super.createChildren();

		this.list.itemRenderer = CCDDZIRUpDownIcon;
		this.list.dataProvider = new eui.ArrayCollection(lang.chatList);
		this.list.addEventListener(egret.Event.CHANGE, this.onSelectItem, this);
	}

	private onSelectItem(event:egret.Event):void{
		this._callback(this.list.selectedIndex);

		egret.callLater(()=>{
			this.list.selectedIndex = -1;
		}, this);
		this.close();
	}

	show(callback:Function):void{
		this._callback = callback;
		egret.Tween.get(this.grp, null, null, true).to({scrollV: 0}, 200, egret.Ease.cubicIn);
	}

	close(animation:boolean = true):void{
		if(animation){
			egret.Tween.get(this.grp, null, null, true).to({scrollV: -this.height}, 200, egret.Ease.cubicIn);
		}else{
			this.grp.scrollV = -this.height;
		}
	}
}