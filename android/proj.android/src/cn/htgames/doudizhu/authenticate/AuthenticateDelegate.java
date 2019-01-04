package cn.htgames.doudizhu.authenticate;

import org.json.JSONObject;

/**
 * Created by rockyl on 2017/1/5.
 */

public interface AuthenticateDelegate {
	void onAuthenticateResult(JSONObject response);
	void onAuthenticateCancel();
}
