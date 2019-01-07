/**
 * Created by rockyl on 16/3/31.
 *
 * 比赛中等待其他桌结束
 */

class CCDDZPanelMatchWaitingInner extends CCalien.CCDDZPanelBase {
	private static _instance:CCDDZPanelMatchWaitingInner;
	public static get instance():CCDDZPanelMatchWaitingInner {
		if (this._instance == undefined) {
			this._instance = new CCDDZPanelMatchWaitingInner();
		}
		return this._instance;
	}

	public lab:eui.Label;

	private _tf:any[];
	private _wave:CCalien.CCDDZWave;

	protected init():void {
		this.skinName = panels.CCDDZPanelMatchWaitingInnerSkin;

		this._tf = CCalien.CCDDZUtils.parseColorTextFlow(lang.match_get_in);
	}

	protected childrenCreated():void {
		super.childrenCreated();

		this._wave = new CCalien.CCDDZWave(this.lab, 2000, function(t):any{return {alpha: 0.3 + (Math.sin(t) + 1) * 0.5 * 0.7}}, 0, false);
	}

	show(nextPlayerCount:number = -1):void{
		console.log('CCDDZPanelMatchWaitingInner.show:' + nextPlayerCount);

		this.popup(null, false, {alpha: 0});

		if(nextPlayerCount < 0){
			this.lab.text = lang.match_waiting_other_desk_2;
		}else{
			if(nextPlayerCount == 0){//决赛
				this.lab.text = lang.match_waiting_other_desk_1;
			}else{
				this._tf[1].text = nextPlayerCount + '';
				this.lab.textFlow = this._tf;
			}
		}

		this._wave.play();
	}

	close():void {
		super.close();

		if(this._wave){
			this._wave.stop();
		}
	}
}