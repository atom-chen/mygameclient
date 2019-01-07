/**
 *
 * @author 
 *
 */
class CCGlobalDebugHelper {
	public constructor() {
	}

	public static isAdmin(): boolean {
		if (CCDDZMainLogic.instance.selfData.nickname.substr(0, 7) == "seacole")
			return true;
		else
			return false;
	}
}
