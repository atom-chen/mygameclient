/**
 * Created by rockyl on 16/1/6.
 *
 * 财运连连翻游戏音效管理
 */

class GameFFFSoundManager{
    static playFlip():void{
        alien.SoundManager.instance.playEffect("flip_m4a");
    }

    static playMyWin():void{
        alien.SoundManager.instance.playEffect("start_m4a");
    }

    static playStart():void{
        alien.SoundManager.instance.playEffect("win_m4a");
    }

    static playBack():void{
        alien.SoundManager.instance.stopMusic();
        //alien.SoundManager.instance.playMusic("back");
    }
}