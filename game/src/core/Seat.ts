/**
 * Created by rockyl on 15/11/26.
 *
 * 座位
 */

class Seat extends eui.Component {
	protected handCardGroup:CardGroup;
	protected deskCardGroup:CardGroup;
	protected labChange:eui.BitmapLabel;

	protected _userInfoData:UserInfoData;
	userInfoView:UserInfoView;
	offline_img:eui.Image; //离线图标
	seatid:number;
	_avatarglobalPos:any;
	constructor() {
		super();

		this.init();
	}

	protected init():void {

	}

	/**
	 * 设置用户是否离线 
	 */
	public setUserOffline(bOffline:boolean):void{
		this.offline_img.visible = bOffline;
	}

	/**
	 * 点击玩家头像回调 zhu
	 */
	private _onTouchHead():void{
		if(!this._userInfoData) return ;
		let data:any = this._userInfoData;
		if(this._userInfoData.uid == server.uid){
			data = MainLogic.instance.selfData;
		}
		let _data:any = data;
		let _rate = (100* data.getWinRate()).toFixed(0); 
		_data.game = _data.totalwincnt + _data.totallosecnt + _data.totaldrawcnt;
		_data.winRate = _rate;
		_data.isMatch = server.isMatch;
		_data.isPlaying = server.playing;
		PanelPlayerInfo.getInstance().show(_data);
	}

	/**
	 * 设置头像是否可以点击 zhu
	 */
	public setHeadTouch(bEnable:boolean):void{
		this.userInfoView.avatar.setHeadTouch(bEnable);
		this.userInfoView.avatar.setHeadTouchFunc(this._onTouchHead.bind(this))
	}

	/**
	 * 重置
	 */
	reset(keepCards:boolean = false):Seat{
		this.labChange.visible = false;
		this.setUserOffline(false);
		this.stopCD();
		if(!keepCards){
			this.cleanHand();
			this.cleanDesk();
		}

		return this;
	}

	/**
	 * 清空位子
	 */
	clean(keepCards:boolean,cleanUserInfo:boolean):Seat {
		this.reset(keepCards);
		if(cleanUserInfo){
			this.userInfoView.clean();
		}

		return this;
	}

	/**
	 * 添加牌
	 * @param cardids
	 * @param animation
	 */
	addCards(cardids:number[], animation:boolean = true):void {

	}

	/**
	 * 出牌
	 * @param cardids
	 */
	useCards(cardids:number[]):void{

	}

	/**
	 * 开始CD
	 * @param cd
	 */
	startCD(cd:number):void {

	}

	/**
	 * 隐藏CD
	 */
	stopCD():void {

	}
	
	/**
	 * 清理桌面上的牌
	 */
	cleanDesk():void {
		this.deskCardGroup.clean();
	}

	/**
	 * 清理桌面上的牌
	 */
	cleanHand():void {
		this.handCardGroup.clean();
	}

	/**
	 * 播放聊天气泡
	 * @param content
	 */
	playChat(content:string):void {
		//this.chatBubble.play(content);
	}

	/**
	 * 播放得分动画
	 * @param score
	 * @param delay
	 */
	playChangeEffect(score:number, delay:number = 0):void {
		let lab:eui.BitmapLabel = this.labChange;
		lab.font = RES.getRes(score > 0 ? 'font_num_1' : 'font_num_2');
		let s:string = Utils.currencyRatio(Math.abs(score));
		lab.text = (score > 0 ? '+' + s : '-' + s);
		lab.y += 50;
		lab.alpha = 0;
		lab.visible = true;
		egret.Tween.get(lab).wait(delay).to({y: lab.y - 50, alpha: 1}, 1000, egret.Ease.cubicOut);
	}

	set userInfoData(userInfoData:UserInfoData){
		this._setUserInfoData(userInfoData);
	}

	protected _setUserInfoData(userInfoData:UserInfoData){
		this._userInfoData = userInfoData;

		if(!this._userInfoData){
			this.userInfoView.clean();
		}
	}

	get userInfoData():UserInfoData{
		return this._userInfoData;
	}

	updateUserInfoData(data:any):void{
		this._userInfoData.initData(data);
		this.userInfoView.update(this._userInfoData);
	}

	setQuitFlagVisible(v:boolean){
		this.userInfoView.avatar.setQuitFlagVisible(v);
	}

	setOwnerFlagVisible(v:boolean){
		this.userInfoView.avatar.setOwnerFlagVisible(v);
	}

	playWinGoldAnimate(){
		this.userInfoView.playWinGoldAnimate();
	}

	/**
	 * 获取玩家头像的中心点
	 */
	getHeadCenterPos():egret.Point{
		return this.userInfoView.avatar.getHeadCenGlobalPos();
	}
	getAvatarPos():egret.Point{
		if(!this._avatarglobalPos){

			// this.validateNow();
			// this.userInfoView.validateNow();
			// this.userInfoView.avatar.validateNow();

			this._avatarglobalPos = this.userInfoView.localToGlobal(this.userInfoView.avatar.x, this.userInfoView.avatar.y);//
			this._avatarglobalPos.x += (this.userInfoView.avatar.width) * 0.65 / 2
			this._avatarglobalPos.y += (this.userInfoView.avatar.height) * 0.65 / 2
		}
		return this._avatarglobalPos;
	}
	
}