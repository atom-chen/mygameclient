/**
 * Created by rockyl on 15/11/26.
 *
 * 座位
 */

class CCDDZSeat extends eui.Component {
	protected handCardGroup:CCDDZCardGroup;
	protected deskCardGroup:CCDDZCardGroup;
	protected labChange:eui.BitmapLabel;

	protected _userInfoData:CCGlobalUserInfoData;
	userInfoView:CCDDZUserInfoView;
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
		let _rate = (100* this._userInfoData.getWinRate()).toFixed(0) +"%"; 
		let _redBeg = this._userInfoData.redcoingot;
		let _nick = this._userInfoData.nickname;
		let _gold = this._userInfoData.gold;
		let _head = this._userInfoData.imageid;
		let _game = this._userInfoData.totalwincnt + this._userInfoData.totallosecnt + this._userInfoData.totaldrawcnt;
		let _seatId = this._userInfoData.seatid;
		let _uid = this._userInfoData.uid;
		let _praise = this._userInfoData.praise;
		let data = {nick:_nick,gold:_gold,head:_head,winRate:_rate,game:_game,redBeg:_redBeg,seatId:_seatId,uid:_uid,praise:_praise};
		CCDDZPanelPlayerInfo.getInstance().show(data);
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
	reset(keepCards:boolean = false):CCDDZSeat{
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
	clean(keepCards:boolean,cleanUserInfo:boolean):CCDDZSeat {
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
		lab.font = RES.getRes(score > 0 ? 'cc_font_num_1' : 'cc_font_num_2');
		let s:string = CCDDZUtils.currencyRatio(Math.abs(score));
		lab.text = (score > 0 ? '+' + s : '-' + s);
		lab.y += 50;
		lab.alpha = 0;
		lab.visible = true;
		egret.Tween.get(lab).wait(delay).to({y: lab.y - 50, alpha: 1}, 1000, egret.Ease.cubicOut);
	}

	set userInfoData(userInfoData:CCGlobalUserInfoData){
		this._setUserInfoData(userInfoData);
	}

	protected _setUserInfoData(userInfoData:CCGlobalUserInfoData){
		this._userInfoData = userInfoData;

		if(!this._userInfoData){
			this.userInfoView.clean();
		}
	}

	get userInfoData():CCGlobalUserInfoData{
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