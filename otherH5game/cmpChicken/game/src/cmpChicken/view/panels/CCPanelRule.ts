class CCPanelRule extends CCalien.CCDDZPanelBase {
	private static _instance: CCPanelRule;
	public static get instance(): CCPanelRule {
		if (this._instance == undefined) {
			this._instance = new CCPanelRule();
		}
		return this._instance;
	}

	private lblTitle: eui.Label;
	private btnClose: eui.Button;
	private ctxScroller: eui.Scroller;
	private labContent: eui.Label;

	protected init(): void {
		this.skinName = panels.CCPanelRuleSkin;
	}

	constructor() {
		super(CCalien.CCDDZpopupEffect.Scale, {
			withFade: true,
			ease: egret.Ease.backOut
		}, CCalien.CCDDZpopupEffect.Scale, { withFade: true, ease: egret.Ease.backIn });
	}

	createChildren(): void {
		super.createChildren();
		// this.btnClose['addClickListener'](this.dealAction.bind(this, "close"), this);
		this.btnClose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClickClose, this);
	}

	private _onClickClose(e: egret.Event): void {
		this.dealAction();
	}

	show(): void {
		this.popup();
		let textFlow = CCDDZUtils.getHtmlText(
			"<font color='#1FA585' size='28'>1.三条规则\n</font>" +
			"<font color='#333333' size='24'>    1)人数：游戏支持2名玩家共同游戏。\n</font>" +
			"<font color='#333333' size='24'>    2)牌数：【10选9玩法】一副牌包含大小王，一共54张，每人发10张牌，玩家可在10张牌中任意选择9张进行摆放。\n</font>" +		
			"<font color='#333333' size='24'>    3)配牌：将10张手牌配成头道、中道、尾道三副牌，每副三张。其中三道顺序必须头道&lt;中道&lt;尾道，否则为【相公】，配牌失败！超时将由系统默认配牌。\n</font>" +
			"<font color='#333333' size='24'>    4)比牌：所有玩家都要将自己的第一道牌相互对比，按规则判定输赢，随后依次比较第二道、第三道牌，并结算积分。\n</font>" +
			"<font color='#333333' size='24'>    5)喜牌：当配置的九张牌达成指定条件后，会获得喜牌奖励。奖励为其他玩家支付给拥有喜牌的玩家指定金豆，喜牌不管输赢都有奖励，并且可以叠加。\n</font>" +
			"<font color='#333333' size='24'>    6)投降：若玩家感觉手牌差，则可以选择投降，投降后只输牌分，不扣别人的喜牌奖励分。\n</font>" +
			"<font color='#333333' size='24'>    7)比牌规则：\n</font>" +
			"<font color='#999999' size='20'>        ①首先比较牌型：三条>同花顺>同花>顺子>对子>单张。\n</font>" +
			"<font color='#999999' size='20'>        ②牌型一致时，比较点数A>K>Q>J>10>9>8>7>6>5>4>3>2。\n</font>" +
			"<font color='#999999' size='20'>        ③三张点数也一致时，最后比较花色：黑桃>红桃>梅花>方块。\n</font>" +
			"<font color='#333333' size='24'>    8)大小王：\n</font>" +
			"<font color='#999999' size='20'>        ①王当红黑：小王可百变任意种黑花色的牌，大王可百变任意红花色的牌。\n</font>" +
			"<font color='#999999' size='20'>        ②同道牌中，当出现相同牌，点数均相同则比较每张牌的花色。\n</font>" +
			"<font color='#999999' size='20'>        ③例子一：\n</font>" +
			"<font color='#999999' size='20'>            玩家1：黑桃A、方块A、大王\n</font>" +
			"<font color='#999999' size='20'>            玩家2：红桃A、梅花A、小王\n</font>" +
			"<font color='#999999' size='20'>            若王当红黑则玩家2大于玩家1，因为大王当红桃A，小王当黑桃A，在都有黑 桃A与红桃A情况下，玩家2的梅花A大于玩家1的方块。\n</font>" +
			"<font color='#999999' size='20'>        ③例子二：\n</font>" +
			"<font color='#999999' size='20'>            玩家1：方块A、大王、方块6\n</font>" +
			"<font color='#999999' size='20'>            玩家2：红桃A、红桃K、红桃7\n</font>" +
			"<font color='#999999' size='20'>            玩家1与玩家2都是同花且都有A，比对第二张牌大小时，大王可以充当方块A，大于玩家2的红桃K，即玩家1大于玩家2，可以出现同花对子，但不会以对子比大小，只会单张牌比较。\n</font>" +
			"<font color='#1FA585' size='28'>2.基本牌型\n</font>" +
			"<font color='#333333' size='24'>    牌型展示从大到小分别是\n</font>" +
			"<font color='#333333' size='24'>    1）三条：3张同种点数的牌型，例：A、A、A。\n</font>" +
			"<font color='#333333' size='24'>    2）同花顺：同一花色的顺子，例：A、K、Q（同花色）。\n</font>" +
			"<font color='#333333' size='24'>    3）同花：相同花色，例：A、J、6（同花色）。\n</font>" +
			"<font color='#333333' size='24'>    4）顺子：连续的不同花色牌型，例：K、Q、J（3张牌不是同花色），注：A~3的顺子是最小的顺子。\n</font>" +
			"<font color='#333333' size='24'>    5）对子：一个对子，例：A、A、8。\n</font>" +
			"<font color='#333333' size='24'>    6）单张：无法组成以上牌型，以点数决定大小。\n</font>" +
			"<font color='#1FA585' size='28'>3.喜牌说明\n</font>" +
			"<font color='#333333' size='24'>    1）三清：手上的三道牌型都是同花。\n</font>" +
			"<font color='#333333' size='24'>    2）全黑：9张牌全部由黑桃和梅花组成的牌型。\n</font>" +
			"<font color='#333333' size='24'>    3）全红：9张牌全部由红桃和方块组成的牌型。\n</font>" +
			"<font color='#333333' size='24'>    4）双顺清：手上有两道为同花顺的牌型。\n</font>" +
			"<font color='#333333' size='24'>    5）三顺清：手上三道牌全部为同花顺的牌型。\n</font>" +
			"<font color='#333333' size='24'>    6）双三条：手上中道和尾道都为三条的牌型。\n</font>" +
			"<font color='#333333' size='24'>    7）全三条：手中三道牌都为三条的牌型。\n</font>" +
			"<font color='#333333' size='24'>    8）四个头：手上牌里有四张一样的牌型（注：四张必须配出一个三条，才算四个头奖励。若有两个四张，并配出两个三条，则可获得两次四个头奖励，三条+王不会触发四个头奖励。）\n</font>" +
			"<font color='#333333' size='24'>    9）连顺：9张牌必须配成连贯的顺子，例：A23、456、789。（注：顺序打乱则不算连顺奖励。）\n</font>" +
			"<font color='#333333' size='24'>    10）清连顺：9张牌组成连贯的顺子，并且9张牌只有一种花色。\n</font>" +
			"<font color='#333333' size='24'>    11）通关：某玩家的三道牌，每一道都比其他玩家大，则称为通关，通关也可获得喜牌奖励。\n</font>" +
			"<font color='#1FA585' size='28'>4.结算规则\n</font>" +
			"<font color='#333333' size='24'>    1)首先比较每道牌的积分：\n</font>" +
			"<font color='#999999' size='20'>        ①二人模式下，每道牌赢家得1分，输家扣1分。\n</font>" +
			"<font color='#333333' size='24'>    2)三道分数累加后，随后看喜牌奖励：\n</font>" +
			"<font color='#999999' size='20'>        喜牌奖励积分的方式为输家为赢家贡献1分。如有多个喜牌，则每个都单独计算积分。\n</font>" +
			"<font color='#333333' size='24'>    3）投降：\n</font>" +
			"<font color='#999999' size='20'>        玩家投降后，只输牌分，不扣赢家的喜牌奖励分，若两人投降，则只扣台费。\n</font>" +
			"<font color='#333333' size='24'>    4）结算：金豆=所获积分*房间底分\n</font>");
		this.labContent.textFlow = textFlow;
	}

	static getInstance(): CCPanelRule {
		return this._instance;
	}
}