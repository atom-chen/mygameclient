/**
 * 
 *
 * 
 */

class PDKInviteListItem extends eui.ItemRenderer {
	protected bg:eui.Image;
	protected status:eui.Image;
	protected lbName:eui.Label;
    protected lbTime:eui.Label;

	protected dataChanged():void{
		super.dataChanged();
		if(this.itemIndex %2 == 0){
			this.bg.visible = true;
		}else{
			this.bg.visible = false;
		}
		if(this.data.status == "0"){
			this.status.source = 'invite_6';
		}else{
			this.status.source = 'invite_5';
		}
		// var ss:string = 'sdfsadfsdafsdaf';
		// ss.substring
        if(this.data.nickname.length > 9){
			this.data.nickname = this.data.nickname.substr(0, 6);
			this.data.nickname = this.data.nickname + '...';
			// this.data.nickname.
		}
		this.lbName.text = this.data.nickname;//PDKGameConfig.matchConfig[this.data.matchID].time;
		this.lbTime.text = this.data.add_time;
	}
}