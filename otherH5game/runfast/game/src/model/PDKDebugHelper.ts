/**
 *
 * @author 
 *
 */
class PDKDebugHelper {
	public constructor() {
	}
	
	public static isAdmin():boolean
	{
        if (PDKMainLogic.instance.selfData.nickname.substr(0,7) == "seacole")
            return true;
        else
            return false;
	}
}
