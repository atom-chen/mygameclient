/**
 * Created by rockyl on 15/11/22.
 */

class Utils {
	static mapping:number[] = [1, 2, 14, 15];
	static _sensitive:string[];

	static pid2poker(pid) {
		let num = Math.floor(pid / 10);
		if(num <= 11){
			num += 2;
		}else{
			num = this.mapping[num - 12];
		}
		let sign = pid % 10;
		let signColor;
		if(num == 14){
			signColor = 'black';
		}else if(num == 15){
			signColor = 'red';
		}else{
			signColor = pid % 2 == 0 ? 'red' : 'black';
		}

		return {num, sign, signColor};
	}

	static pidDzpkpoker(pid) {
		let num = Math.floor(pid / 10);
		if(num <= 13){
			num += 1;
		}
		let signColor = pid % 2 == 0 ? 'red' : 'black';
		let sign = pid % 10;
		return {num, sign,signColor};
	}
	/**
	 * 回收卡牌
	 * @param container
	 * @param removeFunc
	 */
	static recycleCards(container:egret.DisplayObjectContainer, removeFunc:Function = null):void{
		let card:Card;
		if(removeFunc){
			for(let i = 0, li = container.numChildren; i < li; i++){
				card = <Card>container.getChildAt(i);
				removeFunc(card);
			}
		}else{
			while(container.numChildren > 0){
				card = <Card>container.removeChildAt(0);
				Card.recycle(card);
			}
		}
	}

	/**
	 * 排序
	 * @param pokers
	 */
	static order(pokers):void{
		pokers.sort((p1, p2):number=>{
			return p2 - p1;
		});
	}

	/**
	 * 货币比率
	 * @param old
	 * @param putZero
	 */
	static currencyRatio(old:any, putZero:boolean = false):string{
		if(old === null){
			return '';
		}
		let v:number = typeof old == 'string' ? parseInt(old) : old;
		v /= GameConfig.currencyRatio;
		let ret:string = v.toString();
		let pIndex:number = ret.indexOf('.');

		if(putZero){
			if(pIndex < 0){
				ret += '.00';
			}else{
				if(ret.length - ret.indexOf('.') == 2){
					ret += '0';
				}
			}
		}

		return ret;
	}
    /**
         * 红包兑换比率
         * @param old
         * @param putZero
         */
    static exchangeRatio(old: any, putZero: boolean = false): string {
        if (old === null)
        {
            return '';
        }
        let v: number = typeof old == 'string' ? parseInt(old) : old;
        v /= GameConfig.exchangeRatio;
        let ret: string = v.toString();
        let pIndex: number = ret.indexOf('.');

        if (putZero)
        {
            if (pIndex < 0)
            {
                ret += '.00';
            } else
            {
                if (ret.length - ret.indexOf('.') == 2)
                {
                    ret += '0';
                }
            }
        }

        return ret;
    }
    
    static roomScoreFormat(old: any): string {
        var t: number = Number(old);
        if (t>9999)
        {
            t=Math.floor(t/10000);
            var k: number = Math.floor((old-t*10000)/1000);
            if (k>0)
                return t+"万"+k;
            else
                return t + "万";
        }
        else
        {
            return t.toString();
        }
    }
    
	static countDown(time:number, renderFunc:Function, onComplete:Function = null, step:number = 1000):number{
		let total:number = time;
		let repeat:number = Math.floor(time / step);
		return alien.repeat(()=>{
			total -= step;

			renderFunc(total / step);
		}, step, repeat, onComplete, true);
	}

	/**
	 * 物品列表转字符串s
	 * @param items
	 * @param countLimit
	 * @constructor
	 */
	static goodsListToString(items:any[], countLimit:number = 0,bNumberFront:boolean = false):string{
		let arr:string[] = [];
		let len = countLimit == 0 ? items.length : Math.min(items.length, countLimit);
		for (let i = 0; i < len; i++) {
			let item = items[i];
			let _str = "";
			if(bNumberFront){
				_str = item.count + GoodsManager.instance.getGoodsById(item.id).name;
			}else{
				_str = GoodsManager.instance.getGoodsById(item.id).name + 'x' + item.count;
			}
			arr.push(_str);
		}

		return arr.join(' ');
	}

	/**
	 * 转换物品信息为物品数组
	 * @param str
	 * @returns {any[]}
	 */
	static parseGoodsString(str:string):any[]{
		let result:any[] = [];

		if(str){
			let arr:string[] = str.split('|');
			arr.forEach((item:string)=>{
				let arr2:string[] = item.split(':');
				let id:number = parseInt(arr2[0]);
				let count:number = parseInt(arr2[1]);
				if(id == 1){count /= 100;}
				if(!isNaN(id)){
					result.push({id, count});
				}
			});
		}

		return result;
	}

	static regNickname(nickname){
		return !nickname.match(/^[0-9a-zA-Z\u4e00-\u9fa5_]*$/);
	}

	/**
	 * 判断是否是函数 zhu
	 */
	static isFunction(o:any):boolean {
        return Object.prototype.toString.call(o) === '[object Function]';
    }

	/**
	 * 判断是否是数组 zhu
	 */
	static isArray(o:any):boolean { 
		return Object.prototype.toString.call(o) === '[object Array]';  
	}
		
	/**
	 * 判断是否是对象 zhu
	 */
	static isObject(o:any):boolean{
		return Object.prototype.toString.call(o) === '[object Object]';  
	}

	/**
	 * 用html方式设置文本样式
	 */
	static getHtmlText(str: string) {
		return (new egret.HtmlTextParser).parser(str);
	}

	/**
	 * 设置敏感词
	 */
	static setSensitiveWord(_arr):void{
		Utils._sensitive = _arr;
	}
	/**
	 * 获取敏感词
	 */
	static getSensitiveWord():Array<any>{
		return Utils._sensitive;
	}

	/**
     * 替换敏感词
     */
    static replaceBySensitive(_srcStr):string{
		let _allTxts = Utils.getSensitiveWord();
        let _newTxt = _srcStr;
        for(let i =0;i < _allTxts.length;++i){
			_newTxt = _newTxt.replace(new RegExp(_allTxts[i],"g"),"*");
        }
        return _newTxt;
	}

	/**
	 * 十万只显示一位小数
	 * 百万不显示小数部分
	 */
	static getFormatGold(gold,str:string = "万" ):any{
		gold = gold || 0;
		let _str = "" + gold;
		if(gold >= 10000){
			if(gold >= 100000){ 
				if(gold >= 1000000){
					_str = _str.substring(0,_str.length - 4) + str;
				}
				else{
					_str = _str.substr(0,2) + "." + _str.substr(2,1) + str;
				}
			}else{
				if(gold %10000 == 0){
					_str = _str.substring(0,_str.length - 4) + str;
				}else{
					_str = _str.substr(0,1) + "." + _str.substr(1,1) + str;
				}
			}
		}
		return _str;
	}

	/**
	 * 将时间戳(毫秒)转换成 format格式的时间 
	 */
	static formatDate(time, format) {
		//"1528 3477 68"	
		
		var timeStr = time.toString();		
		if (timeStr.length > 13) {
			timeStr.substring(0, 14);
		}
		else if (timeStr.length < 13) {
			let len = timeStr.length;
			while (len < 13) {
				timeStr = timeStr + "0"
				len++;
			}
		}
		var dateTime = new Date(Number(timeStr));
		var date = {
			"y+": dateTime.getFullYear(),
			"M+": dateTime.getMonth() + 1,
			"d+": dateTime.getDate(),
			"h+": dateTime.getHours(),
			"m+": dateTime.getMinutes(),
			"s+": dateTime.getSeconds(),
			"q+": Math.floor((dateTime.getMonth() + 3) / 3),
			"S+": dateTime.getMilliseconds()
		};
		if (/(y+)/i.test(format)) {
			format = format.replace(RegExp.$1, (dateTime.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		for (var k in date) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1
					? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			}
		}
		return format;
	}

	// 跑得快转换牌id
	static transformCards(cards: number[]): number[] {
		for (var i = 0, length = cards.length; i < length; i++) {
			if (cards[i] >= 30) {
				cards[i] -= 20;
			} else {
				cards[i] += 110;
			}
		}
		return cards;
	}

	// 跑得快
	static unTransformCards(cards: number[]): number[] {
		if (cards.length == 0) return [];
		for (var i = 0, length = cards.length; i < length; i++) {
			if (cards[i] < 120) {
				cards[i] += 20;
			} else {
				cards[i] -= 110;
			}
		}
		return cards;
	}

}