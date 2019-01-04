package cn.htgames.doudizhu.authenticate;

import org.json.JSONObject;

/**
 * Created by rockyl on 2017/1/6.
 */

public interface BindDelegate {
	void onBindResult(JSONObject response);
	void onBindCancel();
}
