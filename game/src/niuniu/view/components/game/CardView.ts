/**
 *
 * @author zhanghaichuan
 *
 */
/**
 * 炸弹
 */
let CARD_TYPE_4 = 7; 
/**
 * 三带对
 */
let CARD_TYPE_3_2 = 6;
/**
 * 顺子
 */
let CARD_TYPE_6_7_8 = 5;
/**
 * 三带一
 */
let CARD_TYPE_3_1 = 4;
/**
 * 连对
 */
let CARD_TYPE_66_77 = 3;
/**
 * 对子
 */
let CARD_TYPE_66 = 2;
/**
 * 单张
 */
let CARD_TYPE_6 = 1;

var CardTypeInfo = {
        [CARD_TYPE_4]:{png:"niu_card_6" ,text:"炸弹"}, 
        [CARD_TYPE_3_2]:{png:"niu_card_5" ,text:"三带对"},
        [CARD_TYPE_6_7_8]:{png:"niu_card_0" ,text:"顺子"},
        [CARD_TYPE_3_1]:{png:"niu_card_4" ,text:"三带一"},
        [CARD_TYPE_66_77]:{png:"niu_card_3" ,text:"连对"},
        [CARD_TYPE_66]:{png:"niu_card_2" ,text:"对子"},
        [CARD_TYPE_6]:{png:"niu_card_1" ,text:"单张"}
    };

class CardView extends eui.Component {
    private card1: CardUI;
    private card2: CardUI;
    private card3: CardUI;
    private card4: CardUI;
    private card5: CardUI;
    private niu:NiuUI;
    private finish:eui.Image;
    private choosing:eui.Image;
    
    private isSendCardOver:Boolean;
    private sendCardDelay:number = 50;  
    private isOpen:Boolean;
    private selectIds:Array<number>;
    private selectValues: Array<number>;
    private openIds: Array<number>;
    private handCards: Array<number>;
    private hasChangeLayer:Boolean;
    private niuX:number;
    private cardType:number;
    private fourthCard:number;
	public constructor() {
    	super();
	}
	
    private ajustCardPos(nCardNum:number):void{
        let cardW = GameConfigNiu.myCardDistance;
        let width = this.width;
        let madding = GameConfigNiu.armyCardDistance;
        if(this.index == 1){
            madding = cardW;
        }
        let left = (width - nCardNum * madding ) * 0.5 * 0.7
        this.card1.x= left;
        this.card2.x = this.card1.x + madding;
        this.card3.x = this.card2.x + madding;
        this.card4.x = this.card3.x + madding;
        this.card5.x = this.card4.x + madding;
        //console.log("ajustCardPos==============>",this.index,width,nCardNum,this.card1.x,this.card2.x,this.card3.x,this.card4.x,this.card5.x);
    }

    private init():void
	{
        this.Choosing=false;
        this.setChildIndex(this.card1,0);
        this.setChildIndex(this.card2,1);
        this.setChildIndex(this.card3,2);
        this.setChildIndex(this.card4,3);
        this.setChildIndex(this.card5,4);     
        this.niuX=0;
    	
        this.selectIds = [];
        this.selectValues = [];
        this.openIds = [];
        this.handCards=[];
        this.finish.visible=false;
        
        if (this.niu.parent)
            this.niu.parent.removeChild(this.niu);
    }
    
    private index:number;
    public set Index(value:number)
    {
        this.index=value;
    }
    
    public get Index():number
    {
        return this.index;
    }
	
    public sendCard(isReconnect: Boolean):void
	{
    	this.isOpen=false;    	
	    this.isSendCardOver=false;
	    var i:number;
	    var cardUI:CardUI;
        for(i = 0;i < 5;i++) 
        {
            cardUI = this["card"+(i+1)] as CardUI;
            cardUI.Selected = false;
            cardUI.visible = false;
            if(this.Index == 1 )
                cardUI.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
            
            if(i == 4){
                this.onSendCardOver();
            }
            if(isReconnect)
            {
                cardUI.sendCard2();
            }
            else 
            {               
                var t: number = this.sendCardDelay * i + (this.Index - 0) * this.sendCardDelay * 5;    //     playerIndex - 1      
                cardUI.sendCard(t);                
            }
        }
	}

    public Send4Card(isReconnect: Boolean, delay:number): void {
        this.isOpen = false;
        this.isSendCardOver = false;
        var i: number;
        var cardUI: CardUI;

        cardUI = this.card5;
        cardUI.Selected = false;
        cardUI.visible = false;
        for(i = 0;i < 4;i++){
            cardUI = this["card" + (i + 1)] as CardUI;
            cardUI.Selected = false;
            cardUI.visible = false;

            if(i == 3)
                this.onSendCardOver();

            if(isReconnect) {
                cardUI.sendCard2();
            }else {
                var t: number = delay * i + 1000;
                egret.setTimeout(GameSoundManagerNiu.playSoundCardEffect,this, t);
                cardUI.sendCard(t);
            }
        }
    }

    public SendLastCard(isReconnect: Boolean): void {
        this.isOpen = false;
        this.isSendCardOver = false;
        // var i: number;
        var cardUI: CardUI;
        cardUI = this.card5;
        cardUI.Selected = false;
        cardUI.visible = false;
        this.onSendCardOver();
        
//        this.playCardSound(5, 1000);
        
        if(isReconnect) {
            cardUI.sendCard2();
        }else {
            cardUI.sendCard(10);
            setTimeout(GameSoundManagerNiu.playSoundCardEffect, 10);
        }
    }

    public qznnSendCard1(isReconnect: Boolean): void {
        this.isOpen = false;
        this.isSendCardOver = false;
        var i: number;
        var cardUI: CardUI;
        for(i = 0;i < 5;i++) {
            cardUI = this["card" + (i + 1)] as CardUI;
            cardUI.Selected = false;
            cardUI.visible = false;

            if(i == 3)
                cardUI.once("complete",this.onSendCardOver,this);
            if(isReconnect) {
                if(i < 4) {
                    cardUI.sendCard2();
                }
            }
            else {
                if (i<4)
                {
                    var t: number = this.sendCardDelay * i + (this.Index - 0) * this.sendCardDelay * 4;    //     playerIndex - 1      
                    cardUI.sendCard(t);                    
                }
            }
        }
    }
    
    public qznnSendCard2(isReconnect: Boolean): void {
        this.isOpen = false;
        this.isSendCardOver = false;
        var i: number;
        var cardUI: CardUI=this.card5;       
        cardUI.Selected = false;
        cardUI.visible = false;
        if(this.Index == 1)
        {
            this.card1.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
            this.card2.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
            this.card3.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
            this.card4.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
            cardUI.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        }
        
        
            if(isReconnect && this.Finish==true) {
                //cardUI.once("complete",this.onSendCardOver,this);
                this.onSendCardOver();
                cardUI.sendCard2();
            }           
        
    }
    
    public qznnSendFifthCard(value:Array<number>=null): void
    {
        if(this.Index == 1) {
            var p:egret.Point=this.globalToLocal(value[0],value[1]);
            //this.card5.once("complete",this.onSendCardOver,this);
            this.onSendCardOver();
            this.card5.qznnSendFifthCard2(p.x,p.y);
            this.Finish=true;
        }
        else
        {
            this.card5.qznnSendFifthCard();
        }
    }
    
    public set Choosing(value:boolean)
    {
        if (GameConfigNiu.qznnMode==2)
        {
            if (this.choosing)
                this.choosing.visible=value;
        }
    }
    
    public get Choosing():boolean
    {
        if(this.choosing)
            return this.choosing.visible;
        else
            return false;
    }
	
    private onSendCardOver():void
	{
        this.isSendCardOver = true;
        this.dispatchEvent(new egret.Event("complete"));
    }
	
    private cards:Array<number>;
	public set Cards(val:Array<number>)
	{
    	this.init();
        this.setCards(val);
        this.ajustCardPos(val.length);
	}	
	
    private setCards(val:Array<number>):void{
        val.sort(function(a,b){
            return b-a;
        })
    	this.cards=val;
	    this.card1.Card = val[0];
        this.card2.Card = val[1];
        this.card3.Card = val[2];
        this.card4.Card = val[3];
        this.card5.Card = val[4];
    }

    public get Cards():Array<number>
    {
        return this.cards;
    }
	
	public set LastCards(value:number)
	{
	    this.card5.Card=value;
	}
	
    public set Finish(value: boolean) {
        this.finish.visible = value;
        if (value)
            this.Choosing=false;
    }
    
    public get Finish():boolean {
        if(this.finish)
            return this.finish.visible;
        else
            return false;
    }
	
    private onTap(e:egret.TouchEvent):void
    {
        if(this.isSendCardOver && !this.isOpen) 
        {
            var cardUI: CardUI = e.currentTarget as CardUI;
            if(cardUI.Selected) {
                cardUI.Selected = false;
                this.dispatchEvent(new egret.Event(EventNamesNiu.SET_NUM_TEXT,false,false,[EventNamesNiu.NUM_TYPE_DELETE,cardUI.CardValue]));
                this.selectIds.splice(this.selectIds.indexOf(cardUI.Card),1);
                this.selectValues.splice(this.selectValues.indexOf(cardUI.CardValue),1);
            }
            else {
                if(this.checkCard()) {
                    cardUI.Selected = true;
                    this.dispatchEvent(new egret.Event(EventNamesNiu.SET_NUM_TEXT,false,false,[EventNamesNiu.NUM_TYPE_ADD,cardUI.CardValue]));
                    this.selectIds.push(cardUI.Card);
                    this.selectValues.push(cardUI.CardValue);
                }
                else {

                }
            }
            this.checkAutoStart();
        }			
    }
    
    /**
		 *判断是否能选取该卡牌
		 * @return 
		 * 
		 */
    private checkCard():Boolean
	{
        var selectCount: number=0;
        var i: number;
        for(i = 0;i < 5;i++) {
            if((this["card"+(i+1)] as CardUI).Selected) {
                selectCount++;
            }
        }
        if(selectCount < 3) {
            return true;
        }
    
        return false;
    }
    
    private checkAutoStart():void
	{
        if(this.selectValues && this.selectValues.length == 3 && (this.selectValues[0] + this.selectValues[1] + this.selectValues[2])%10==0)
        {
            this.dispatchEvent(new egret.Event(EventNamesNiu.AUTO_START));
        }
	}
	
    public brnnShowCard():void
    {
        var time:number=0.2;
        this.card2.Run(this.card1.x,this.card1.y,-1,-1,time,this.brnnShowCardStep1.bind(this));
        this.card3.Run(this.card1.x,this.card1.y,-1,-1,time);
        this.card4.Run(this.card1.x,this.card1.y,-1,-1,time);
        this.card5.Run(this.card1.x,this.card1.y,-1,-1,time);
    }
    
    private brnnShowCardStep1():void
    {
        this.card4.Card=this.fourthCard;
        var time: number = 0.2;
        var tmp: number;
        if(this.index == 4)
            tmp = GameConfigNiu.brnnMasterCardDistance;
        else
            tmp = GameConfigNiu.brnnNormalCardDistance;
        this.card2.Run(tmp,this.card1.y,-1,-1,time,this.brnnShowCardStep2.bind(this));
        this.card3.Run(tmp*2,this.card1.y,-1,-1,time);
        this.card4.Run(tmp*3,this.card1.y,-1,-1,time);
        this.card5.Run(tmp*4,this.card1.y,-1,-1,time);  
    }
    
    private brnnShowCardStep2(): void
    {
        this.showCard(this.cards);
    }
	
    /**
     * 显示自己的牌和牌型
     */
    public showSelfCardsAndType():void{
        if(this.index == 1){
            if(this.card5.Card && this.cards.length == 4){ //选完牌立刻显示牌型
                this.cards.push(this.card5.Card);
            }
            this.showCard(this.cards);
        }
    }

    public showAllCards(bShow:boolean):void{
        this.card1.visible = bShow;
        this.card2.visible = bShow;
        this.card3.visible = bShow;
        this.card4.visible = bShow;
        this.card5.visible = bShow;
    }

	public showCard(cards:Array<number>):void
	{   
        if(!cards || cards.length < 1) return;
        
        this.hasChangeLayer=false;
        if (!this.niu.parent)
            this.addChild(this.niu);

        let info = this.getCardType(cards);
        this.setCards(cards);
        this.cardType = info.nt;
        this.showAllCards(true);
        this.ajustCardPos(5);
        console.log("showCard===============>",this.index,CardTypeInfo[info.nt].text,cards);
        this.niu.Niu=this.cardType; 
        if(1){
            return;
        }
        this.niuX = this.getNiu(cards);
    	var needNiu:Boolean=false;
        if(this.niuX >= 1 && this.niuX<=10)
        	needNiu=true;  
        
            if (this.index==1){
                if(this.niuX >0 && this.niuX < 10){
                    let _voiceStr = MainLogic.instance.selfData.sexVoiceStr;
                    GameSoundManager.playCardType(_voiceStr,4,this.niuX);
                }
            }
                //GameSoundManagerNiu.playSoundNiuEffect(this.niuX);
        var i:number;
        var ui: CardUI;
        var row1: number = 0;
        var row2: number = 0;
        if(this.index == 1)
        {
            if(this.selectValues && this.selectValues.length == 3 && (this.selectValues[0] + this.selectValues[1] + this.selectValues[2]) % 10 == 0) {
//                console.log("已有最优解");
            }
            else
                this.findBestKey();
            for(i = 0;i < 5;i++) {
                ui = this["card"+(i+1)] as CardUI;	
                ui.alpha=1;
                ui.visible=true;
                if(needNiu) 
                {
                    //3张的
                    if(this.selectIds.indexOf(ui.Card) != -1) {
                        ui.Index = 2 + row2;
                        row2++;
                    }
                    //2张的
                    else {
                        ui.Index = row1;
                        row1++;
                    }
                }
                else {
                    ui.Index = i;
                }
                ui.addEventListener(EventNamesNiu.RUN_STEP2,this.changeLayer,this);
                if (i==4)
                    ui.addEventListener(EventNamesNiu.COMBO_COMPLETE,this.comboComplete,this);
                ui.finish1(needNiu);
            }
        }
        else
        {
            this.card1.CardId=cards[0];
            this.card2.CardId = cards[1];
            this.card3.CardId = cards[2];
            this.card4.CardId = cards[3];
            this.card5.CardId = cards[4];
            this.findBestKey();
            var j: number = 0
            for(i = 0;i < 5;i++) {
                ui = this["card" + (i + 1)] as CardUI;	
                ui.alpha=1;
                ui.visible=true;
                ui.Index=i;
                if (i<=2)
                {
                    ui.CardId=this.selectIds[i];
                }
                else
                {
                    for (;j<5;j++)
                    {
                        if(this.selectIds.indexOf(cards[j]) == -1)
                        {
                            ui.CardId=cards[j];
                            j++;
                            break;
                        }
                    }
                }
                if(i == 4)
                    ui.addEventListener(EventNamesNiu.COMBO_COMPLETE,this.comboComplete,this);
                ui.finish2(needNiu,this.Index);
            }
        }
	}
	
    private changeLayer(e:egret.Event):void
	{
        if(!this.hasChangeLayer) {
            (e.target as CardUI).removeEventListener(EventNamesNiu.RUN_STEP2,this.changeLayer,this);
            this.hasChangeLayer = true;
            var cardUI: CardUI;
            var i: number;
            var layer: number = 0;
            var start: number = 2;
            
            for(i = 0;i < 5;) {
                if(this.getChildAt(i)) {
                    cardUI = this.getChildAt(i) as CardUI;
                    if(cardUI.Index == layer) {
                        this.setChildIndex(cardUI,layer);
                        layer++;
                        i = layer;
                    }
                    else {
                        i++;
                    }
                }
            }
            
        }
    }
    
    private comboComplete(e: egret.Event): void {
        (e.target as CardUI).removeEventListener(EventNamesNiu.COMBO_COMPLETE,this.comboComplete,this);
//        console.log(EventNamesNiu.COMBO_COMPLETE);
        if (!this.niu.parent)
            this.addChild(this.niu);
        this.niu.Niu=this.niuX;       
      
            if(this.Index == 2) {
                if(this.niuX == 0)
                    this.niu.x = 4;
                else
                    this.niu.x = -7;
            }
            else if(this.Index == 3) {
                if(this.niuX == 0)
                    this.niu.x = 12;
                else
                    this.niu.x = 3;
            }
            else if(this.Index == 4 || this.Index == 5) {
                if(this.niuX == 0)
                    this.niu.x = -2;
                else
                    this.niu.x = 3;
            }
        
    }
    
    public removeTap():void
    {        
        for(var i:number = 0;i < 5;i++) {
            var cardUI:CardUI = this["card" + (i + 1)] as CardUI;
            cardUI.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTap,this);
        }
    }
	
    /**
		 *寻找最优解 
		 * 
		 */
    public findBestKey():void
	{
        this.selectIds = [this.card1.Card,this.card2.Card,this.card3.Card];
      
    
        var nums: Array<number> = [this.card1.CardValue,this.card2.CardValue,this.card3.CardValue,this.card4.CardValue,this.card5.CardValue];
        var cards: Array<number> = [this.card1.Card,this.card2.Card,this.card3.Card,this.card4.Card,this.card5.Card];
        
    
        this.getResult(nums[0],nums[1],nums[2],nums[3],nums[4],cards[0],cards[1],cards[2],cards[3],cards[4]);
        this.getResult(nums[0],nums[1],nums[3],nums[2],nums[4],cards[0],cards[1],cards[3],cards[2],cards[4]);
        this.getResult(nums[0],nums[1],nums[4],nums[2],nums[3],cards[0],cards[1],cards[4],cards[2],cards[3]);
        this.getResult(nums[0],nums[2],nums[3],nums[1],nums[4],cards[0],cards[2],cards[3],cards[1],cards[4]);
        this.getResult(nums[0],nums[2],nums[4],nums[1],nums[3],cards[0],cards[2],cards[4],cards[1],cards[3]);
        this.getResult(nums[0],nums[3],nums[4],nums[1],nums[2],cards[0],cards[3],cards[4],cards[1],cards[2]);
        this.getResult(nums[1],nums[2],nums[3],nums[0],nums[4],cards[1],cards[2],cards[3],cards[0],cards[4]);
        this.getResult(nums[1],nums[2],nums[4],nums[0],nums[3],cards[1],cards[2],cards[4],cards[0],cards[3]);
        this.getResult(nums[1],nums[3],nums[4],nums[0],nums[2],cards[1],cards[3],cards[4],cards[0],cards[2]);
        this.getResult(nums[2],nums[3],nums[4],nums[0],nums[1],cards[2],cards[3],cards[4],cards[0],cards[1]);
    }
    		
    /**
     * 
     * @param key1
     * @param key2
     * @param key3
     * @param key4
     * @param key
     * 返回两位数，第一位表示是否有牛，第二位表示牛几
     * 
     */		
    private getResult(key1: number,key2: number,key3: number,key4: number,key5: number,id1: number,id2: number,id3: number,id4: number,id5: number): void {
        var num1: number = (key1 + key2 + key3) % 10 == 0 ? 1 : 0;
        var num2: number = (key4 + key5) % 10;
        if(num2 == 0)
            num2 = 10;
    
       
        //（当前有牛&&当前最优解无牛） || （当前有牛 &&当前最优解有牛&&当前牛>当前最优牛）
        if(num1 == 1) {           
            this.selectIds = [id1,id2,id3];
        }
    }
    
    public get NiuX():number
    {
        return this.niuX;
    }
    
    //炸弹7 三带对6 顺子5 三张4 连对3 对子2 单牌1
	private getCardType(cardids:Array<number>):any{
        let cardType = {nt:CARD_TYPE_6,v:0}
        let hash = {}
        let _arrs = [];
        let len = cardids.length;
        let key = 0;
        for(let i=0;i<len;++i){
            key = Math.floor(cardids[i]/10);
            hash[key] = hash[key] ||0;
            hash[key] = hash[key] + 1;
            _arrs.push(key);
        }

        let tsets = [] //三张
        let tpairs = [] //对子
        let v = 0;
        for(let k in hash){
            v = hash[k];
            if (v == 4) {
                cardType.nt = CARD_TYPE_4;
                return cardType;
            }
            else if (v == 2) 
                tpairs.push(k);
            else if (v == 3) 
                tsets.push(k);
        }

        if(tsets.length >0){
            if(tpairs.length >0){
                cardType.nt = CARD_TYPE_3_2;
            }else{
                cardType.nt = CARD_TYPE_3_1;
            }
        }else if(tpairs.length >0){
            if(tpairs.length == 2){
                cardType.nt = CARD_TYPE_66_77;
            }else{
                cardType.nt = CARD_TYPE_66;
            }
        }else{
            cardType.nt = CARD_TYPE_6;
            _arrs.sort(function(a,b){
                return a-b;
            });
            for(let i=0;i<4; ++i){
                if(_arrs[i]+1 != _arrs[i+1] || _arrs[i] >= 13 ||_arrs[i+1] >= 13){
                    return cardType;
                }
            }
            cardType.nt = CARD_TYPE_6_7_8;
        }

        return cardType;
    }

    private getNiu(cardids:Array<number>):number
	{
        var temp: Array<number> = cardids.concat();
        temp.sort();
    			
        //五小牛
        if(temp[0] <= 53 && temp[1] <= 53 && temp[2] <= 53 && temp[3] <= 53 && temp[4] <= 53 && (Math.floor(temp[0] / 10) + Math.floor(temp[1]/10) + Math.floor(temp[2]/10) + Math.floor(temp[3]/10) + Math.floor(temp[4]/10)) <= 10) {
            return 14;
        }
        //炸弹
        if(Math.floor(temp[0] / 10) == Math.floor(temp[1] / 10) && Math.floor(temp[0] / 10) == Math.floor(temp[2] / 10) && Math.floor(temp[0] / 10) == Math.floor(temp[3] / 10)) {
            return 13;
        }
        else if(Math.floor(temp[0] / 10) == Math.floor(temp[1] / 10) && Math.floor(temp[0] / 10) == Math.floor(temp[2] / 10) && Math.floor(temp[0] / 10) == Math.floor(temp[4] / 10)) {
            return 13;
        }
        else if(Math.floor(temp[0] / 10) == Math.floor(temp[1] / 10) && Math.floor(temp[0] / 10) == Math.floor(temp[3] / 10) && Math.floor(temp[0] / 10) == Math.floor(temp[4] / 10)) {
            return 13;
        }
        else if(Math.floor(temp[0] / 10) == Math.floor(temp[2] / 10) && Math.floor(temp[0] / 10) == Math.floor(temp[3] / 10) && Math.floor(temp[0] / 10) == Math.floor(temp[4] / 10)) {
            return 13;
        }
        else if(Math.floor(temp[1] / 10) == Math.floor(temp[2] / 10) && Math.floor(temp[1] / 10) == Math.floor(temp[3] / 10) && Math.floor(temp[1] / 10) == Math.floor(temp[4]) / 10) {
            return 13;
        }
        //5花牛
        if(temp[1] >= 110 && temp[2] >= 110 && temp[3] >= 110 && temp[4] >= 110 && temp[0] >= 110) {
            return 12;
        }
        //4花牛
        if(temp[1] >= 110 && temp[2] >= 110 && temp[3] >= 110 && temp[4] >= 110 && temp[0] >= 100 && temp[0] <= 103) {
            return 11;
        }
    
        var sum: number = 0;
        var i: number;
        var j: number;
        for(i = 0;i <= 4;++i) 
        {
            var n: number = Math.floor(cardids[i] / 10);
            if(n > 10) {
                n = 10;
            }
            sum += n;
        }
        
        //			var k:int;
        for(i = 0;i < 4;++i) {
            for(j = i + 1;j < 5;++j) {
                var a: number = Math.floor(cardids[i] / 10);
                var b: number = Math.floor(cardids[j] / 10);
                if(a > 10) {
                    a = 10;
                }
                if(b > 10) {
                    b = 10;
                }
                if((sum - a - b) % 10 == 0) {
                    if((a + b) % 10==0)
                        return 10;
                    else
                        return (a+b)%10;
                }
            }
        }
    
        return 0;
    }
}

window["CardView"]=CardView;