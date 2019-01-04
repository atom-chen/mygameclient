/**
 * Created by rockyl on 16/1/6.
 *
 * 游戏音效管理
 */

class GameDZPKSoundManager{
    static playChipToTab():void{
        alien.SoundManager.instance.playEffect("chips_to_table");
    }

    static playChipToPool():void{
        alien.SoundManager.instance.playEffect("chips_to_pot");
    }

    static playTurn():void{
        alien.SoundManager.instance.playEffect("pturn");
    }

    static playSendHand():void{
        alien.SoundManager.instance.playEffect("allocateCardSound");
    }

    static playPubThree():void{
        alien.SoundManager.instance.playEffect("dealcard");
    }
    static playPubFour():void{
        alien.SoundManager.instance.playEffect("dealcard_a");
    }
    static playWinGold():void{
        alien.SoundManager.instance.playEffect("insure_gold_02");
    }
    static playPubFive():void{
        alien.SoundManager.instance.playEffect("dealcard_b");
    }
    static playOpTimeout():void{
        alien.SoundManager.instance.playEffect("timeOverTipSound");
    }
    static playMyWin():void{
        alien.SoundManager.instance.playEffect("specialSound");
    }
    static playOpType(sexVoice,opType:number):void{
		let typeOfRes:string;
        switch(opType){
            case OP_TYPE_ADD:
				typeOfRes = 'raise';
                break;
            case OP_TYPE_ALLIN:
				typeOfRes = 'allin';
                break;
            case OP_TYPE_FOLLOW:
				typeOfRes = 'call';
                break;
            case OP_TYPE_GIVEUP:
				typeOfRes = 'fold';
                break;
            case OP_TYPE_SKIP:
                alien.SoundManager.instance.playEffect("cheackSound");
                return;
        }
        
		let resId:string = sexVoice + '_' + typeOfRes;
		alien.SoundManager.instance.playEffect(resId);
    }

    static playBack():void{
        alien.SoundManager.instance.stopMusic();
        //alien.SoundManager.instance.playMusic("back");
    }
}