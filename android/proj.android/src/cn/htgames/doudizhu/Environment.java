package cn.htgames.doudizhu;

/**
 * Created by rockyl on 2016/10/26.
 */

public class Environment {
	public int channelId;

	private static Environment _instance;
	public static Environment getInstance(){
		if(_instance == null){
			_instance = new Environment();
		}
		return _instance;
	}
}
