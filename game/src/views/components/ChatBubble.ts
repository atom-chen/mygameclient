/**
 * Created by rockyl on 15/12/12.
 *
 * 聊天气泡
 */

class ChatBubble extends eui.Component {
	private labContent:eui.Label;

	/**
	 * 播放聊天气泡
	 * @param content
	 */
	play(content:string):void{
		this.labContent.text = content;

		this.visible = true;
		this.alpha = 0;
		egret.Tween.get(this, null, null, true).to({alpha: 1}, 200).wait(5000).to({alpha: 0}, 200).call(()=>{
			this.visible = false;
		});
	}
}