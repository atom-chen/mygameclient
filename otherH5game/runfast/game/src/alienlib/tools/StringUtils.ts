/**
 * Created by rockyl on 16/3/9.
 */


module PDKalien {
    export class StringUtils {

        static chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        static makeRandomString(len: number): string {
            let s: string = "";
            let cl: number = this.chars.length;
            for(let i: number = 0;i < len;i++) {
                s += this.chars.charAt(MathUtils.makeRandomInt(cl));
            }

            return s;
        }

        static makeRandomIntString(len: number): string {
            let s: string = "";
            for(let i: number = 0;i < len;i++) {
                s += MathUtils.makeRandomInt(10);
            }

            return s;
        }

        static stringCut(str: string,len: number,fill: string = '...'): string {
            let result: string = str;
            if(str.length > len) {
                result = str.substr(0,len) + fill;
            }
            return result;
        }

        static zeros: Array<string> = [
            "0",
            "00",
            "000",
            "0000",
            "00000",
            "000000",
            "0000000",
            "00000000",
            "000000000",
            "0000000000"
        ];

        static supplement(value: number,count: number): string {
            let index = count - value.toString().length - 1;
            if(index < 0) {
                return value.toString();
            }
            return this.zeros[index] + value;
        }

        static format(formatStr: string,...params): string {
            return this.formatApply(formatStr,params);
        }

        static formatApply(formatStr: string,params: any[]): string {
            let result: string = formatStr;
            for(let i = 0,len = params.length;i < len;i++) {
                result = result.replace("{" + i + "}",params[i]);
            }

            return result;
        }

        static getStrFromObj(data: any,connect:string="&"): string {
            var str: string = "";
            for(var a in data) {
                if (str!="")
                    str += connect;
                str += a + "=" + data[a];
            }
            return str;
        }
        
        public static getColor(content: any,color: number,size:number=0): string {
            if (size==0)
                return "<font color='#" + color.toString(16) + "'>" + content + "</font>";
            else
                return "<font size="+size+" color='#" + color.toString(16) + "'>" + content + "</font>";
        }

    }
}