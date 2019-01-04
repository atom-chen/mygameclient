/**
 *
 * @author 
 *
 */
class GoldStr {
	public constructor() {
	}
	
    public static GoldFormat(val: string,needChinese: boolean = true,needFix2:boolean=true): string {
       
        if(val == null)
            return null;
        val = String(Math.floor(Number(val) / GameConfig.currencyRatio));
        var str: string = "";
        if(val.length >= 1 && val.substr(0,1) == "-") {
            val = val.substr(1,val.length - 1);
            str += "-";
        }
        if (needChinese)
        {
            //9990000
            //99.9999万
            if(val.length == 7) {
                str += val.substr(0,val.length - 4)   ;
                if (needFix2)
                    str += "." + val.substr(val.length - 4,1);
                str +=  "万";
            }
            //9999 9999
            else if(val.length >= 8) {
                str += val.substr(0,val.length - 4);
//                if(needFix2)
//                    str += "." + val.substr(val.length - 8,2);
                str += "万";
            }
            else
                str+=val;
        }
        else
        {
            str+=val;
        }
        return str;
    }
    
    public static ChipGoldFormat(val: string): string {
        if(val == null)
            return null;
        val = String(Math.floor(Number(val) * 100 / GameConfig.currencyRatio));
        var str: string = "";
        //-9=-0.90
        if(val.length >= 1 && val.substr(0,1) == "-") {
            val = val.substr(1,val.length - 1);
            str += "-";
        }

        if(val.length > 2 && val.length <= 4)//9999.99
            str += val.substr(0,val.length - 2) + "." + val.substr(val.length - 2,2);
        else if(val.length == 2)//99=0.99
            str += "0." + val;
        else if(val.length == 1)//9=0.09
            str += "0.0" + val;
        else if(val.length <= 3) {
            str += val.substr(0,val.length - 2) + "." + val.substr(val.length - 2,2);
        }
        else if(val.length == 5) {
            str += val.substr(0,val.length - 2) + "." + val.substr(val.length - 2,1);
        }
        else if(val.length == 6) {
            str += val.substr(0,val.length - 2);
        }
        //11 9999.99
        else if(val.length > 6 && val.length <= 10) {
            str += val.substr(0,val.length - 6) + "万";
        }
        //22 1111 9999.99
        else if(val.length >= 11) {
            str += val.substr(0,val.length - 10) + "亿";
        }
        return str;
    }
	
//    public static GoldFormat(val:string,needChinese:Boolean=true):string
//	{    	
//        if(val == null)
//            return null;
//        val = String(Math.floor(Number(val) * 100 / GameLogic.currencyRatio));
//        var str: string = "";
//        //-9=-0.90
//        if(val.length >= 1 && val.substr(0,1) == "-") {
//            val = val.substr(1,val.length - 1);
//            str += "-";
//        }
//        
//        if(val.length > 2 && val.length <= 6)//9999.99
//            str += val.substr(0,val.length - 2) + "." + val.substr(val.length - 2,2);
//        else if(val.length == 2)//99=0.99
//            str += "0." + val;
//        else if(val.length == 1)//9=0.09
//            str += "0.0" + val;
//        else if(val.length <= 6 || !needChinese) {
//            str += val.substr(0,val.length - 2) + "." + val.substr(val.length - 2,2);
//        }
//        //11 9999.99
//        else if(val.length > 6 && val.length <= 10) {
//            str += val.substr(0,val.length - 6) + "." + val.substr(val.length - 6,2) + "万";
//        }
//        //22 1111 9999.99
//        else if(val.length >= 11) {
//            str += val.substr(0,val.length - 10) + "." + val.substr(val.length - 10,2) + "亿";
//        }
//        return str;
//    }
    
//    public static ChipGoldFormat(val: string): string {
//        if(val == null)
//            return null;
//        val = String(Math.floor(Number(val) * 100 / GameLogic.currencyRatio));
//        var str: string = "";
//        //-9=-0.90
//        if(val.length >= 1 && val.substr(0,1) == "-") {
//            val = val.substr(1,val.length - 1);
//            str += "-";
//        }
//
//        if(val.length > 2 && val.length <= 4)//9999.99
//            str += val.substr(0,val.length - 2) + "." + val.substr(val.length - 2,2);
//        else if(val.length == 2)//99=0.99
//            str += "0." + val;
//        else if(val.length == 1)//9=0.09
//            str += "0.0" + val;
//        else if(val.length <= 3) {
//            str += val.substr(0,val.length - 2) + "." + val.substr(val.length - 2,2);
//        }
//        else if(val.length == 5) {
//            str += val.substr(0,val.length - 2) + "." + val.substr(val.length - 2,1);
//        }
//        else if(val.length == 6) {
//            str += val.substr(0,val.length - 2);
//        }
//        //11 9999.99
//        else if(val.length > 6 && val.length <= 10) {
//            str += val.substr(0,val.length - 6)  + "万";
//        }
//        //22 1111 9999.99
//        else if(val.length >= 11) {
//            str += val.substr(0,val.length - 10)  + "亿";
//        }
//        return str;
//    }
}
