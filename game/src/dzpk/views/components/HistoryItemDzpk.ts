/**
 * identity 身份
0="";
1="小盲注";
2="大盲注";
3="庄";
 */
class HistoryItemDzpk extends eui.ItemRenderer {
	private winGoldLabel;
	private msakImg;
	private headImg;
	private cardImg;

	private cardImg00;
	private cardImg01;
	private cardImg10;
	private cardImg11;
	private cardImg12;
	private cardImg20;
	private cardImg30;

	private opLabel0;
	private opLabel1;
	private opLabel2;
	private opLabel3;
	private cardTypeLabel;
	private cardBodyGrp:eui.Group;

	private flagImg;
	private flagImgSrc = {
		[1]:"play_sm",
		[2]:"play_dm",
		[3]:"play_master1"
	}

	private _reset():void{
		this.opLabel0.visible = false;
		this.opLabel1.visible = false;
		this.opLabel2.visible = false;
		this.opLabel3.visible = false;
		this.cardImg00.visible = false;
		this.cardImg01.visible = false;
		this.cardImg10.visible = false;
		this.cardImg11.visible = false;
		this.cardImg12.visible = false;
		this.cardImg20.visible = false;
		this.cardImg30.visible = false;
		this.cardTypeLabel.visible= false;
	}

    protected createChildren(): void {
        super.createChildren();
	}

	dataChanged():void{
		super.dataChanged();
		this._reset();
		let data = this.data;
		this.headImg.mask = this.msakImg;
		this.headImg.source = data.header_url;

		if(data.identity >=1 && data.identity <= 3){
			this.flagImg.visible = true;
			this.flagImg.source = this.flagImgSrc[data.identity];
		}else{
			this.flagImg.visible = false;
		}
		let winStr;
		if(data.winlost >0){
			winStr = "+" +data.winlost;
			this.winGoldLabel.textColor = 0xFFE17A;
		}else{
			winStr = "" + data.winlost
			this.winGoldLabel.textColor = 0x46C4FF;
		}
		this.winGoldLabel.text = winStr;
		let player ;
		let card:CardDzpk;
		let imgName;
		let parent = this.parent;
		let pubCards = data.publiccards;
		let ops = data.info;
		let opsCardIdx = [[0,1],[2,3,4],[5],[6]];
		let cardsLen = pubCards.length;
		let opCardLen;
		let cardIdx; 
		if(cardsLen >= 5 && pubCards[0] != 0 && pubCards[1] != 0){
			let cardTypes = DzpkCardType.getMaxCardTypeFromPub(null,pubCards,true);
			this.cardTypeLabel.text = CARD_TYPE_INFO[cardTypes.type];
			this.cardTypeLabel.visible = true;
		}
		let children = this.cardBodyGrp.$children;
		let len = children.length;
		for(let i=0;i<len;++i){
			CardDzpk.recycle(children[i]);
		}
		this.cardBodyGrp.removeChildren();

		for(let j = 0;j<ops.length;++j){
			if(ops[j] != ""){
				this["opLabel" + j].text = ops[j];
				this["opLabel" + j].visible = true;
			}
			opCardLen = opsCardIdx[j].length;
			for(let k = 0;k<opCardLen;++k){
				cardIdx = opsCardIdx[j][k];
				if(cardIdx<cardsLen){
					card = CardDzpk.create({pid:pubCards[cardIdx]});
					card.scaleX = card.scaleY = 0.4;
					imgName = "cardImg" + j + k;
					card.x = this[imgName].x;
					card.y = this[imgName].y;
					this.cardBodyGrp.addChild(card);
				}
			}
		}
	}
}