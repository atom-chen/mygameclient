/**
 * zhu 2017/08/23
 */
class LogUtil {

    /**
     * 参数转换为字符串
     */
    static argsToString(args:any):string {
        let _space = function(num:number){
            let _str = "";
            for(let i =0;i<num;++i){
                _str += " ";
            }
            return _str;
        }
        
        let _str = "";
        let _nPre = 0;
        let _format = function(str,spaceLen,args){
            let _st = str;
            if(Utils.isArray(args)){
                _st += "[";
                for(let i =0;i<args.length;++i){
                    _st += _format("",spaceLen,args[i]) + ","; 
                }
                _st += "]";
            }
            else if(Utils.isObject(args)){
                _st +="{\n";
                spaceLen += 1;
                for(let key in args){
                    _st += _format(_space(spaceLen)+key.toString() + ":" ,spaceLen,args[key]) + ",\n";
                }

                _st += _space(spaceLen-1) + "}";
            }
            else{
                _st += "" + args;
            }
            return _st;
        }

        _str = _format(_str,0,args);
        return _str;
    }   

    /**
     * 错误信息
     */
    static error(...args):void{
        if(RELEASE) return;
        let info = "";
        for(let i =0;i<args.length;++i){
            info += LogUtil.argsToString(args[i]);
        }
        console.log("%c%s","color:red",info);
    }

    /**
     * 普通信息
     */
    static info(...args):void{
        if(RELEASE) return;        
        let info = "";
        for(let i =0;i<args.length;++i){
            info += LogUtil.argsToString(args[i]);
        }
        console.log("%c%s","color:black",info);
    }

    /**
     *  警告信息
     */
    static warn(...args):void{
        if(RELEASE) return;
        let info = LogUtil.argsToString(args);
        console.log("%c%s","color:blue",info);
    }
}