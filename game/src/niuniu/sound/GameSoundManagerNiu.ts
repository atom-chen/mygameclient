/**
 *
 * @author 
 *
 */
class GameSoundManagerNiu {
	public constructor() {
	}
	
    public static playSoundBetOverEffect(): void {
        SoundManager.instance.playEffect("betOver" + "_mp3");
    }
	
    public static playSoundCircleEffect(): void {
        SoundManager.instance.playEffect("circle" + "_mp3");
    }
    
    public static playSoundCard2Effect(): void {
        SoundManager.instance.playEffect("card2" + "_mp3");
    }
	
    public static playSoundCardEffect(): void {
        SoundManager.instance.playEffect("card" + "_mp3");
    }
	
    public static playSoundBetEffect(): void {
       
        SoundManager.instance.playEffect("bet" + "_mp3");
    }
	
    public static playSoundMasterEffect(): void {
        SoundManager.instance.playEffect("master" + "_mp3");
    }
	
    public static playSoundWinEffect(): void {
        SoundManager.instance.playEffect("win" + "_mp3");
    }
	
    public static playSoundStartEffect(): void {
        SoundManager.instance.playEffect("start" + "_mp3");
    }
	
    public static playSoundMissionEffect(): void {
        SoundManager.instance.playEffect("mission" + "_mp3");
    }
    
    public static playSoundSignEffect(): void {
        SoundManager.instance.playEffect("sign" + "_mp3");
    }
    
    public static playSoundMatchReward(): void {
        SoundManager.instance.playEffect("matchReward" + "_mp3");
    }
    
    public static playSoundJingJi(): void {
        SoundManager.instance.playEffect("jingji" + "_mp3");
    }
    
  
    
    public static playSoundReadyEffect():void
	{
        SoundManager.instance.playEffect("ready" + "_mp3");
	}
	
    public static playSoundNiuEffect(niuX: number): void {
        SoundManager.instance.playEffect("n"+niuX+"_mp3");
    }
    
    public static playTouchEffect(): void {
        //SoundManagerNiu.instance.playEffect("touch_mp3");
    }
	
    private static currentBgm:number=0;
	public static playBGM():void
	{       
        if(GameSoundManagerNiu.currentBgm != 1) {            
            if(GameSoundManagerNiu.currentBgm == 0) {
                GameSoundManagerNiu.playBgmNow(1);
            }
            else {
                GameSoundManagerNiu.playBgmNow(1);
            }

        }
    }
	
    public static playBGM2(): void {
       
        if(GameSoundManagerNiu.currentBgm != 2) {          
            GameSoundManagerNiu.playBgmNow(2);
        }
    }
    
    public static playBgmNow(type:number=0):void
    {
        if (type!=0)
            GameSoundManagerNiu.currentBgm=type;
        if(GameSoundManagerNiu.currentBgm==1)
            SoundManager.instance.playMusic("music" + "_mp3");
        else if(GameSoundManagerNiu.currentBgm == 3) 
            SoundManager.instance.playMusic("juesai" + "_mp3");
        else 
            SoundManager.instance.playMusic("music2" + "_mp3");
    }
    
    public static playBGMJueSai(): void {
        if(GameSoundManagerNiu.currentBgm != 3) {  
            GameSoundManagerNiu.playBgmNow(3);
        }
    }
	
    public static stopBGM(): void {       
        SoundManager.instance.stopMusic();
    }
}
