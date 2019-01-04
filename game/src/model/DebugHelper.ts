/**
 *
 * @author 
 *
 */
class DebugHelper {
	public constructor() {
	}
	
	public static isAdmin():boolean
	{
        if (MainLogic.instance.selfData.nickname.substr(0,7) == "seacole")
            return true;
        else
            return false;
	}
}
