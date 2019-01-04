package cn.htgames.doudizhu;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by rockyl on 16/9/11.
 */
public class GameInfo {
	public String uid;
	public String serverType;
	public String token;

	public void update(JSONObject data){
		try {
			uid = data.getString("uid");
			serverType = data.getString("serverType");
			token = data.getString("token");
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}

	private static GameInfo _instance;
	public static GameInfo getInstance(){
		if(_instance == null){
			_instance = new GameInfo();
		}
		return _instance;
	}
}
