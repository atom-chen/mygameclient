

module FishUtils {
    class langFishuagePack {
        loading:string;
        config_url:string;
        debug:string;
        config_url_1:string;
        first_alert_title:string;
        first_alert_buttons:any[];
        service_provision_url:string;
        service_provision:string;
        health_game_advise:string;
        loginError:any;
        joinPGameErr:any;
        guessCardsNotice:any;
        createPGameErr:any;
        login_waiting:string;
        disconnect_kick_out:any;
        disconnect_server:string;
        auto_reconnect:string;
        waiting_for_getting_information:string;
        backAlert:string;
        backAlert1:string;
        roomLimit1:string;
        roomLimit2:string;
        roomAmount:string;
        quick_join_error:any;
        upload_avatar:string;
        no_more_desk:string;
        noMoreGold:string;
        noMoreGold2:string;
        noMoreGold3:string;
        browNoGold:string;
        reportSucc:string;
        repeatReport:string;
        gameResult:string;
        sex:any[];
        sexVoice:any[];
        people:string;
        second:string;
        gold:string;
        score:string;
        year:string;
        month:string;
        day:string;
        sky:string;
        format_y_m_d:string;
        format_m_d:string;
        currency:string;
        play_turn:string;
        no_ranking:string;
        confirm:string;
        reconnect:string;
        history:string;
        chatList:any[];
        free_pay:string;
        match_sign_up_result:any;
        match_jikai_limit:string;
        match_jikai_reward:string;
        match_title_reward_intro:string;
        match_title_match_intro:string;
        match_play_info:string;
        match_result_match_name:string;
        match_waiting_other_desk_1:string;
        match_waiting_other_desk_2:string;
        match_get_in:string;
        match_result_praise:any[];
        match_cancel_alert:string;
        match_turn_name:any[];
        match_top_info_1:string;
        match_top_info_2:string;
        match_top_info_3:string;
        match_top_notify:string;
        match_notice_alert:string;
        modify_profile_success:string;
        modify_profile_failed:string;
        modify_profile_err:any;
        set_password_error:any;
        bank_operate:any[];
        bank_operate_error:any;
        bind_phone_notice:string;
        download_client_notice:string;
        alms_success:string;
        alms_success_continue:string;
        alms_success_exit:string;
        version_content:string;
        version_content_notice:any[];
        recharge_scale:string;
        recharge_addition:string;
        recharge_waiting:string;
        recharge_failed:string;
        recharge_cancel:string;
        recharge_success_simple:string;
        recharge_success:string;
        get_code_error:any;
        bind_phone_error:any;
        bind_third_part:any;
        exchange_redcoin: any;
        exchange_roomid: any;
        match_reward:any;
        exchange_redcoin_gold:string;
        exchange_redcoin_red:string;
        kickback_str: string;
        timeout: string;
        exchange_succ1:string;
        exchange_succ2: string;
        back_to_official:string;
        share_succ:string;
        win_cut:string;
        wx_service:string;
        ddz_gz:string;
        thirdPartWxMp:any;
        thirdPartQunHei:any;
        thirdPartHaiWanWan:any;
        thirdPartGame8868:any;
        thirdPartGame1905:any;
        thirdPartGameAiYouXi:any;
        dayTaskOne:any;
        dayTaskTwo:any;
        recordCardHour:any;
        recordCardDay:any;
        redCoin:any;
        taskNotExist:any;
        taskNotOver:any;
        taskHasGetRew:any
    }

    class langFishuageIds {
        loading:string = 'loading';
        config_url:string = 'config_url';
        config_url_1:string = 'config_url_1';
        first_alert_title:string = 'first_alert_title';
        first_alert_buttons:string = 'first_alert_buttons';
        service_provision_url:string = 'service_provision_url';
        service_provision:string = 'service_provision';
        health_game_advise:string = 'health_game_advise';
        loginError:string = 'loginError';
        login_waiting:string = 'login_waiting';
        disconnect_kick_out:string = 'disconnect_kick_out';
        disconnect_server:string = 'disconnect_server';
        auto_reconnect:string = 'auto_reconnect';
        waiting_for_getting_information:string = 'waiting_for_getting_information';
        backAlert:string = 'backAlert';
        roomLimit1:string = 'roomLimit1';
        roomLimit2:string = 'roomLimit2';
        roomAmount:string = 'roomAmount';
        quick_join_error:string = 'quick_join_error';
        upload_avatar:string = 'upload_avatar';
        no_more_desk:string = 'no_more_desk';
        noMoreGold:string = 'noMoreGold';
        noMoreGold2:string = 'noMoreGold2';
        noMoreGold3:string = 'noMoreGold3';
        browNoGold:string = 'browNoGold';
        reportSucc:string = 'reportSucc';
        repeatReport:string = 'repeatReport';
        gameResult:string = 'gameResult';
        sex:string = 'sex';
        sexVoice:string = 'sexVoice';
        people:string = 'people';
        second:string = 'second';
        gold:string = 'gold';
        score:string = 'score';
        year:string = 'year';
        month:string = 'month';
        day:string = 'day';
        sky:string = 'sky';
        format_y_m_d:string = 'format_y_m_d';
        format_m_d:string = 'format_m_d';
        currency:string = 'currency';
        play_turn:string = 'play_turn';
        no_ranking:string = 'no_ranking';
        confirm:string = 'confirm';
        reconnect:string = 'reconnect';
        history:string = 'history';
        chatList:string = 'chatList';
        free_pay:string = 'free_pay';
        match_sign_up_result:string = 'match_sign_up_result';
        match_jikai_limit:string = 'match_jikai_limit';
        match_jikai_reward:string = 'match_jikai_reward';
        match_title_reward_intro:string = 'match_title_reward_intro';
        match_title_match_intro:string = 'match_title_match_intro';
        match_play_info:string = 'match_play_info';
        match_result_match_name:string = 'match_result_match_name';
        match_waiting_other_desk_1:string = 'match_waiting_other_desk_1';
        match_waiting_other_desk_2:string = 'match_waiting_other_desk_2';
        match_get_in:string = 'match_get_in';
        match_result_praise:string = 'match_result_praise';
        match_cancel_alert:string = 'match_cancel_alert';
        match_turn_name:string = 'match_turn_name';
        match_top_info_1:string = 'match_top_info_1';
        match_top_info_2:string = 'match_top_info_2';
        match_top_info_3:string = 'match_top_info_3';
        match_top_notify:string = 'match_top_notify';
        match_notice_alert:string = 'match_notice_alert';
        modify_profile_success:string = 'modify_profile_success';
        modify_profile_failed:string = 'modify_profile_failed';
        modify_profile_err:string = 'modify_profile_err';
        set_password_error:string = 'set_password_error';
        bank_operate:string = 'bank_operate';
        bank_operate_error:string = 'bank_operate_error';
        bind_phone_notice:string = 'bind_phone_notice';
        download_client_notice:string = 'download_client_notice';
        alms_success:string = 'alms_success';
        alms_success_continue:string = 'alms_success_continue';
        alms_success_exit:string = 'alms_success_exit';
        version_content:string = 'version_content';
        version_content_notice:string = 'version_content_notice';
        recharge_scale:string = 'recharge_scale';
        recharge_addition:string = 'recharge_addition';
        recharge_waiting:string = 'recharge_waiting';
        recharge_failed:string = 'recharge_failed';
        recharge_cancel:string = 'recharge_cancel';
        recharge_success_simple:string = 'recharge_success_simple';
        recharge_success:string = 'recharge_success';
        get_code_error:string = 'get_code_error';
        bind_phone_error:string = 'bind_phone_error';
        bind_third_part:string = 'bind_third_part';
        exchange_redcoin: string = 'exchange_redcoin';
        exchange_roomid: string = 'exchange_roomid';
        kickback_str: string = 'kickback_str';
        dayTaskOne:string = 'dayTaskOne';
        dayTaskTwo:string = 'dayTaskTwo';
        recordCardHour:string ='recordCardHour';
        recordCardDay:string ='recordCardDay';
        redCoin:string = 'redCoin';
        taskNotExist:string = 'taskNotExist';
        taskNotOver:string = 'taskNotOver';
        taskHasGetRew:string = 'taskHasGetRew'
    }

    export class Utils {
		static injectProp(target:Object, data:Object = null, callback:Function = null, ignoreMethod:boolean = true, ignoreNull:boolean = true):boolean {
			if (!data) {
				return false;
			}

			let result = true;
			for (let key in data) {
				let value:any = data[key];
				if((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null)){
					if(callback){
						callback(target, key, value);
					}else{
						target[key] = value;
					}
				}
			}
			return result;
		}
		static obj2query(obj:any):string{
			if(!obj){
				return '';
			}
			let arr:string[] = [];
			for(let key in obj){
				arr.push(key + '=' + obj[key]);
			}
			return arr.join('&');
		}
		static getUrlParams():any {
			let params:any = {};
			let href:string = window.location.href;
			let index:number = href.indexOf("?");
			if (index < 0) {
				return params;
			}
			let hashes = href.substr(index + 1).split('&');
			for (let i = 0; i < hashes.length; i++) {
				let arr:Array<string> = hashes[i].split('=');
				params[arr[0]] = arr[1];
			}
			return params;
		}
    }

    export class langFishuage extends langFishuagePack {
        id:langFishuageIds;

        constructor(data:any){
            super();
			
            this.id = new langFishuageIds;
            FishUtils.Utils.injectProp(this, data);
        }

        splitCache:any = {};
        split(name:string, index:number):string{
            let line = this.splitCache[name];
            if(!line){
                line = this.splitCache[name] = langFish[name].split(',');
            }
            return line[index];
        }

        format(id:string, ...params):string{
            return FishUtils.StringUtils.formatApply(this[id], params);
        }
    }

    export class MathUtils {
		/**
		 * 计算距离
		 * @param p1
		 * @param p2
		 * @returns {number}
		 */
		static distancePoint(p1: any, p2: any): number {
			return this.distance(p1.x, p1.y, p2.x, p2.y);
		}

		/**
		 * 计算距离
		 * @param x1
		 * @param y1
		 * @param x2
		 * @param y2
		 * @returns {number}
		 */
		static distance(x1: number, y1: number, x2: number, y2: number): number {
			return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		}

		/**
		 * 计算两点直线的斜率
		 * @param p1
		 * @param p2
		 * @returns {number}
		 */
		static angle(p1: any, p2: any): number {
			return Math.atan2(p2.y - p1.y, p2.x - p1.x);
		}

		/**
		 * 获取一个随机整数
		 * @param max
		 * @param min
		 * @returns {number}
		 */
		static makeRandomInt(max: number, min: number = 0): number {
			return Math.floor(Math.random() * (max - min)) + min;
		}

		/**
		 * 获取一个随机浮点数
		 * @param max
		 * @param min
		 * @returns {number}
		 */
		static makeRandomFloat(max: number, min: number = 0): number {
			return Math.random() * (max - min) + min;
		}

		/**
		 * 生成一个基于value的range偏移的随机数
		 * @param value
		 * @param range
		 * @returns {number}
		 */
		static makeRandomByRange(value: number, range: number): number {
			return value + (Math.random() * range * 2 - range);
		}

		/**
		 * 生成一个随机整数数组
		 * @param len
		 * @returns {string}
		 */
		static makeRandomIntArr(len: number, max: number, min: number = 0): number[] {
			let target: number[] = [];
			for (let i: number = 0; i < len; i++) {
				target.push(this.makeRandomInt(max));
			}

			return target;
		}

		/**
		 * 生成一个范围数组
		 * @param to
		 * @param from
		 * @param step
		 * @returns {Array<number>}
		 */
		static makeOrderIntArray(to: number, from: number = 0, step: number = 1): Array<number> {
			let result: Array<number> = [];
			for (let i: number = from; i <= to; i += step) {
				result.push(i);
			}

			return result;
		}

		/**
		 * 打乱一个数组
		 * @param arr
		 * @returns {any}
		 */
		static mixArray(arr: any): Array<any> {
			for (let i: number = 0, len: number = Math.round(arr.length / 2); i < len; i++) {
				let a: number = this.makeRandomInt(arr.length);
				let b: number = this.makeRandomInt(arr.length);
				let temp = arr[a];
				arr[a] = arr[b];
				arr[b] = temp;
			}

			return arr;
		}

		/**
		 * 打乱一个二维数组
		 * @param arr
		 * @returns {Array<Array<any>>}
		 */
		static mixArray2(arr: Array<Array<any>>): Array<Array<any>> {
			let cH: number = arr[0].length;
			let cV: number = arr.length;
			let pos0: number[];
			let pos1: number[];
			for (let i: number = 0, len: number = Math.round(cH * cV / 2); i < len; i++) {
				pos0 = [this.makeRandomInt(cH), this.makeRandomInt(cV)];
				pos1 = [this.makeRandomInt(cH), this.makeRandomInt(cV)];
				let temp = arr[pos0[0]][pos0[1]];
				arr[pos0[0]][pos0[1]] = arr[pos1[0]][pos1[1]];
				arr[pos1[0]][pos1[1]] = temp;
			}

			return arr;
		}

		/**
		 * 随机从一个数组中取出一项
		 * @param arr
		 * @returns {*}
		 */
		static getRandomFromArray(arr: any): any {
			return arr[this.makeRandomInt(arr.length)];
		}

		/**
		 * 根据范围阻隔
		 * @param value
		 * @param lower
		 * @param upper
		 * @returns {number}
		 */
		static fixRange(value: number, lower: number, upper: number): number {
			if (value < lower) {
				value = lower;
			} else if (value > upper) {
				value = upper;
			}

			return value;
		}

		/**
		 * 根据范围补足
		 * @param value
		 * @param max
		 * @param min
		 * @returns {number}
		 */
		static roundFix(value: number, max: number, min: number = 0): number {
			if (value < min) {
				value += max - min;
			} else if (value >= max) {
				value -= max - min;
			}

			return value;
		}

		/**
		 * 弧度转角度
		 * @param radius
		 * @returns {number}
		 */
		static radiusToAngle(radius: number): number {
			return radius * 180 / Math.PI;
		}

		/**
		 * 角度转弧度
		 * @param angle
		 * @returns {number}
		 */
		static angleToRadius(angle: number): number {
			return angle * Math.PI / 180;
		}

		/**
		 * 数组向右旋转
		 * @param arr
		 * @returns {Array}
		 */
		static turnRight(arr) {
			let temp = [];
			for (let t = 0, tl = arr.length; t < tl; t++) {
				temp.push([]);
			}
			for (let i = 0, il = arr.length; i < il; i++) {
				for (let j = 0, jl = arr[i].length; j < jl; j++) {
					temp[i][j] = arr[jl - j - 1][i];
				}
			}
			return temp;
		}

		/**
		 * 数组向左旋转
		 * @param arr
		 * @returns {Array}
		 */
		static turnLeft(arr) {
			let temp = [];
			for (let t = 0, tl = arr.length; t < tl; t++) {
				temp.push([]);
			}
			for (let i = 0, il = arr.length; i < il; i++) {
				for (let j = 0, jl = arr[i].length; j < jl; j++) {
					temp[i][j] = arr[j][jl - i - 1];
				}
			}
			return temp;
		}

		/**
		 * 根据两点计算量化方向,用于手势识别
		 * @param x0
		 * @param y0
		 * @param x1
		 * @param y1
		 * @returns {number}
		 */
		static calDir(x0: number, y0: number, x1: number, y1: number): number {
			if (x0 == x1 && y0 == y1) {
				return -1;
			}

			let r: number = Math.atan2(y1 - y0, x1 - x0);
			let d: number;
			if (Math.abs(r) < Math.PI / 4) {
				d = 0;
			} else if (Math.abs(r) > Math.PI / 4 * 3) {
				d = 2;
			} else if (r > 0) {
				d = 1;
			} else {
				d = 3;
			}
			return d;
		}

		/**
		 * 数值正负计算
		 * @param num
		 * @returns {number}
		 */
		static sign(num: number): number {
			return num == 0 ? 0 : (num > 0 ? 1 : -1);
		}

		/**
		 * 把一个正整数分割成若干个整数
		 * @param total
		 * @param count
		 * @returns {Array}
		 */
		static split(total, count) {
			let result = [];
			for (let i = 0; i < count; i++) {
				result[i] = 0;
			}
			for (let i = 0; i < total; i++) {
				result[this.makeRandomInt(count)]++;
			}
			return result;
		}

		static bezierPoints(points, count) {
			let result = [];
			let t = 0;
			let arr2;

			let perT = 1 / (count - 1);
			for(let i = 0; i < count; i++){
				let arr = points.concat();
				for(let k = arr.length - 1; k > 0; k--){
					arr2 = [];
					for(let j = 0, lj = arr.length; j < lj - 1; j++){
						arr2.push(unit(arr[j], arr[j + 1], t));
					}
					arr = arr2;
				}

				result.push(arr[0]);

				t += perT;
			}

			function unit(a, b, t){
				return {
					x: (b.x - a.x) * t + a.x,
					y: (b.y - a.y) * t + a.y,
				};
			}

			return result;
		}
	}

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

    export class TimeUtils {
		static timelangFish = ['sky', 'hour', 'minutes', 'second'];
		static timeFormat(second:number, format:string = '{1}:{0}', placeZero:boolean = true, hideEmpty:boolean = false):string {
			let ss:any = second % 60;
			let mm:any = Math.floor(second / 60) % 60;
			let hh:any = Math.floor(second / 3600) % 24;
			let dd:any = Math.floor(second / 3600 / 24);

			if (placeZero) {
				ss = StringUtils.supplement(ss, 2);
				mm = StringUtils.supplement(mm, 2);
				hh = StringUtils.supplement(hh, 2);
				dd = StringUtils.supplement(dd, 2);
			}

			if(hideEmpty){
				let result = '';
				[dd, hh, mm, ss].forEach((item, index)=>{
					if(item > 0){
						result += item + langFish[this.timelangFish[index]];
					}
				});
				return result;
			}else{
				return StringUtils.format(format, ss, mm, hh, dd);
			}
		}
        static timeFormatForEx(date: Date):string { 
         let year = date.getFullYear();
         let month =   date.getMonth()+1;
         let day =  date.getDate();
         let hours = StringUtils.supplement(date.getHours(), 2);
         let minutes = StringUtils.supplement(date.getMinutes(), 2);
         return year + "年" + month + "月" + day + "日" + " " + hours + ":" + minutes;
        }
		static parseFromString(str:string):Date {
			return new Date(str.replace('T', ' ').replace(/-/g, '/'));
		}

		static parseFromStringScope(str:string[]):Date[] {
			return str.map((item)=>this.parseFromString(item));
		}

		static dateTimeToString(date:Date):string{
			return this.dateToString(date, langFish.format_y_m_d) + ' ' + this.dateToTimeString(date, '{2}:{1}');
		}

		static tsToDate(ts:number):Date {
			let newDate:Date = new Date();
			newDate.setTime(ts * 1000);
			return newDate;
		}

		static parseTime(str:string):number {
			let t:string[] = str.split(':');
			return parseInt(t[0]) * 3600 + parseInt(t[1]) * 60 + parseInt(t[2]);
		}

		static tsToDateString(ts:number, format:string = '{0}/{1}/{2}'):string {
			return this.dateToString(this.tsToDate(ts));
		}

		static dateToString(date:Date, format:string = '{0}/{1}/{2}'):string{
			return StringUtils.format(format, date.getFullYear(), StringUtils.supplement(date.getMonth() + 1, 2), StringUtils.supplement(date.getDate(), 2))
		}

		static dateToTimeString(date:Date, format:string = '{2}:{1}:{0}'):string{
			return StringUtils.format(format, StringUtils.supplement(date.getSeconds(), 2), StringUtils.supplement(date.getMinutes(), 2), StringUtils.supplement(date.getHours(), 2))
		}

		static dateToTs(date:Date):number{
			return Math.floor(date.valueOf() / 1000);
		}

		static dateCut(date:Date):Date{
			let h = date.getHours();
			let m = date.getMinutes();
			let s = date.getSeconds();

			return this.tsToDate(this.dateToTs(date) - h * 3600 - m * 60 - s);
		}

		static tsToMonthDayString(ts:number):string {
			let date:Date = this.tsToDate(ts);
			return StringUtils.format('{0}' + langFish.month + '{1}' + langFish.day, StringUtils.supplement(date.getMonth() + 1, 2), StringUtils.supplement(date.getDate(), 2))
		}

		static scopeToDateString(scope:Date[], format:string):string{
			return this.dateToString(scope[0], format) + '-' +
				this.dateToString(scope[1], format);
		}

		static scopeToTimeString(scope:Date[], format:string):string{
			let ts1 = this.dateToTimeString(scope[0], format);
			let ts2 = this.dateToTimeString(scope[1], format);

			return ts1 + '-' + ts2;
		}

		static scopeToDateTimeString(scope:Date[], dateFormat:string, timeFormat:string, combine:boolean = false):string{
			let t1 = scope[0];
			let t2 = scope[1];
			if(combine && t1.getDate() == t2.getDate()){
				return this.dateToString(t1, dateFormat) + ' ' +
					this.dateToTimeString(t1, timeFormat) + '-' +
					this.dateToTimeString(t2, timeFormat);
			}else{
				return this.dateTimeToString(t1) + ' - ' + this.dateTimeToString(t2);
			}
		}

		/**
		 * zhu not use
		 */
		static remainDays(time1, time2, include = false):number{
			/*if(time1 instanceof Date){
				time1 = this.dateToTs(time1);
			}else if(typeof time1 == 'string'){
				time1 = this.dateToTs(time1)
			}
			if(time2 instanceof Date){
				time2 = this.dateToTs(time2);
			}else if(typeof time2 == 'string'){
				time2 = this.dateToTs(time2)
			}

			return (time1 - time2 + (include ? 1 : 0)) / 24 / 3600;
			*/
			return 0;
		}

		static compareScope(scope, time):number{
			let t1 = this.dateToTs(scope[0]);
			let t2 = this.dateToTs(scope[1]);
			if(time < t1){
				return time - t1;
			}else if(time >= t1 && time <= t2){
				return 0;
			}else{
				return time - t2;
			}
		}

		static getWeekIndex(ts:number) {
			let dateObj = this.tsToDate(ts);
			let firstDay = this.getFirstWeekBegDay(dateObj.getFullYear());
			if (dateObj < firstDay) {
				firstDay = this.getFirstWeekBegDay(dateObj.getFullYear() - 1);
			}
			let d = Math.floor((dateObj.valueOf() - firstDay.valueOf()) / 86400000);
			return Math.floor(d / 7) + 1;
		}

		static getFirstWeekBegDay(year) {
			let tempdate = new Date(year, 0, 1);
			let temp = tempdate.getDay();
			if (temp == 1)
				return tempdate;
			temp = temp == 0 ? 7 : temp;
			let t = tempdate.setDate(tempdate.getDate() + (8 - temp));
			return new Date(t);
		}
	}

	export class Native extends egret.EventDispatcher {
        private static _instance: Native;
		private _urlParams:any = {};
        public static get instance(): Native {
            if(this._instance == undefined) {
                this._instance = new Native();
            }
            return this._instance;
        }

		public getUrlArg():any{
            return this._urlParams;
        }

		public get isNative(): boolean {
            return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        }

		private _dicCall: any = {};
        //private bridge: Bridge;
        private _wxApi:any;
        constructor() {
            super();
            //this.bridge = Bridge.getInstance();
            //console.log('Bridge.enabled: ' + this.bridge.enabled);
            egret.ExternalInterface.addCallback('nativeCall',this.nativeCall.bind(this));
            this._initDefaultWX();
			this._urlParams = Utils.getUrlParams();
        }

		private _isWXMP: boolean;
        public set isWXMP(value: boolean) {
            this._isWXMP = value;
        }

		public get isWXMP(): boolean {
            return this._isWXMP
        }

		public wxConfig():void
        {
            fishWebService.getWxConfig((response: any) => {
				//alert(JSON.stringify(response));
                this._wxApi.config(response);
            });
            /*zhu 去壳 if(this.bridge.enabled) {
                webService.getWxConfig((response: any) => {
                    this.bridge.call('wxConfig',response);
                });
            }
            */
        }

		public initWXFunc():void{
            if(this.isNative) return;

            if(window.top && window.top['wxApi']){
                this._wxApi = window.top['wxApi'];
            }else{
				alert('debug');
                //webService.postError(ErrorConfig.REPORT_ERROR,"Native _initWXFunc=>"+ version + "|uuid" + webService.uuid +"wxApi error");
            }
        }

		/**
         * 初始化默认的空的微信接口
         */
        private _initDefaultWX():void{
           this._wxApi = {
                initBridge:function(callback){

                },
                config:function(response){

                },
                share:function(params,callback){

                },
                recharge:function(response,callback){

                },
                getLocation:function(callback){

                }
            }
        }

		private nativeCall(str: string): void {
            console.log('nativeCall:' + str);
            let params: any = JSON.parse(str);
            let id: string = params.id;
            let method: string = params.method;
            this.dispatchEventWith(method,false,params);

            let callback = this._dicCall[id];
            if(callback) {
                callback(params.args);

                delete this._dicCall[id];
            }
        }

		/**
		 *
		 * @returns {string}
		 */
        get platform(): string {
            let pf: string;
            if(this.isNative) {
                pf = egret.Capabilities.os;
            } else {
                pf = 'web';
            }
            return pf;
        }

		/**
		 *
		 * @returns {number}
		 */
		get platformId(): number {
            return Native.instance.isNative ? (egret.Capabilities.os == 'iOS' ? 2 : 3) : 4;
        }

		/**
		 * 登录后更新用户信息
		 * @param uid 用户id
		 */
        userLogin(uid: number, token: string): void {
            // if (this.isNative) {
            //     this.call('userLogin',{ uid: uid, serverType: GameConfig.SERVER_URL_TAIL, token: token });
            // } else {
                this.call('putInfo',{ uid: uid });
            //}
        }

		/**
		 * 直接调用native方法
		 * @param method
		 * @param args
		 * @param callback
		 */
        call(method: string,args: any = null,callback: Function = null): void {
            args = args || {};
            let params: any = {
                id: StringUtils.makeRandomIntString(10),
                method,
                args
            };

            if(callback) {
                this._dicCall[params.id] = callback;
            }
            egret.ExternalInterface.call('egretCall',JSON.stringify(params));
        }

		/**
		 * 充值
		 */
        recharge(id: string, callback: Function = null): boolean {
            //console.log('pay');
            if(this.isNative) {
                this.call('recharge',{ id },callback);
            } else {
                alert('sorry, can not recharge.');
            }

            return this.platformId != 4;
        }

		/**
		 * 充值 微信公众号
		 */
        rechargeInWXMP(response: any,callback: Function = null): void 
        {
            if (response.code==0)
            {
                this._wxApi.recharge(response.data,function(ret){
                    console.log("rechargeInWXMP=============>",ret.code);
					if (callback) {
						callback(ret.code);
					}
                });
            }
            else
            {
                if(response.code == 7005){
                    //Alert.show("您已参加过此活动,感谢您的支持!");
                }else{
                    //Alert.show("支付失败,错误码:" + response.code);
					alert("支付失败,错误码:" + response.code);
                }
            }
        }

		/**
		 * 分享
		 * @param type
		 * @param params
		 * @param callback
		 */
        share(type: string,params: any,callback: Function = null): void {
            //console.log('share');
            if(this.isNative) {
                this.call('share',{ type,params },callback);
            } else {
				//alert('set share param');
                this._wxApi.share(params,callback);
                //zhu 去壳this.bridge.call("wxShareTimeline",params,callback);
            }
        }

		setShareParam(): void {
			let userData: FishUserData = FishUserData.instance;
			var sk: string = userData.getItem('sk');
			if(!sk)
				sk = "";
			//link1:分享到朋友圈
			//link2：分享给朋友
			//imgUrl：图片链接
			//title1：分享到朋友圈标题
			//title2：分享给朋友标题
			//desc1：分享到朋友圈描述
			//desc2：分享给朋友描述
			var shareParams:any={};       
			shareParams.imgUrl = GameConfig.RESOURCE_URL + "shareicon.jpg";
			shareParams.title1 = langFish.thirdPartWxMp.title2;
			shareParams.link1 = GameConfig.WX_LOGIN_URL + "?state=3&"+"share_sk=" + sk;
			shareParams.title2 = langFish.thirdPartWxMp.title2;
			shareParams.desc2 = langFish.thirdPartWxMp.desc2;
			shareParams.link2 =  GameConfig.WX_LOGIN_URL  + "?state=3&"+"share_sk=" + sk;//langFish.thirdPartWxMp.share_app_url + "?share_sk=" + sk;
			this.share('', shareParams, (response) => {});
		}
	}

	export class Dispatcher {
		static instance:egret.EventDispatcher;

		static init():void {
			Dispatcher.instance = new egret.EventDispatcher();
		}

		static dispatch(eventName:string, params:any = null):void {
			if (params) {
				Dispatcher.instance.dispatchEventWith(eventName, false, params);
			} else {
				Dispatcher.instance.dispatchEvent(new egret.Event(eventName));
			}
		}

		static addEventListener(eventName:string, callback:Function, thisObj:any):void {
			Dispatcher.instance.addEventListener(eventName, callback, thisObj);
		}

		static removeEventListener(eventName:string, callback:Function, thisObj:any):void {
			Dispatcher.instance.removeEventListener(eventName, callback, thisObj);
		}
	}

	export class Ajax{
		static callNet(url:string, params:any = null, method:string = egret.HttpMethod.GET, header:any = null, onSuccess:Function = null, onError:Function = null, parseUrl:Function = null, parseBody:Function = null):void {
			let finalUrl:string = parseUrl ? parseUrl() : url;

			let request:egret.HttpRequest = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.addEventListener(egret.Event.COMPLETE, function (event:egret.Event):void {
				if (onSuccess) {
					onSuccess(request.response);
				}
			}, this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, function (event:egret.Event):void {
				if (onError) {
					onError(request.response);
				}
			}, this);
			request.open(finalUrl, method);

			for(let k in header){
				request.setRequestHeader(k, header[k]);
			}

			let data:any = null;
			if(parseBody){
				data = parseBody();
			}else{
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				data = FishUtils.Utils.obj2query(params);
			}
			if (data) {
				request.send(data);
			} else {
				request.send();
			}
		}

		static GET(url:string, params:any = null, onSuccess:Function = null, onError:Function = null, header:any = null):void{
			this.callNet(url, params, egret.HttpMethod.GET, header, onSuccess, onError, ():string=>{
				if(params){
					let data = FishUtils.Utils.obj2query(params);
					url += (url.indexOf('?') < 0 ? '?' : '') + data;
				}
				return url;
			}, ()=>null);
		}

		static POST(url:string, params:any = null, onSuccess:Function = null, onError:Function = null, header:any = null):void{
			this.callNet(url, params, egret.HttpMethod.POST, header, onSuccess, onError);
		}

		static POSTDirectory(url:string, params:any = null, onSuccess:Function = null, onError:Function = null, header:any = null):void{
			this.callNet(url, params, egret.HttpMethod.POST, header, onSuccess, onError, null, ():any=>{return params});
		}
	}

	export class GameConfig {
		static gameId:number = 1;
		static roomList:any;
		static SERVER_URL:string = 'ws://129.211.1.47:9001/ws';
		static SERVER_URL_TAIL:string;
		static WX_LOGIN_URL: string = 'http://www.htgames.cn/zhanghaichuan';
		static WEB_SERVICE_URL: string = 'http://iamendless.cn/';
		static REPORT_URL:string = 'http://120.27.162.46:8866/_.gif';
		static RESOURCE_URL:string = 'http://192.168.0.81/laoqifeng/platform/';
		static RECHARGE_URL:string = 'http://pay.exunsoul.com:8998/index/pay?account=';
		static REGISTER_URL:string = 'http://reg.gamebode.com/regist.html';
		static PASSWORD_URL:string = 'http://reg.gamebode.com/motify.html';
		static HOME_PAGE_URL:string = 'http://reg.gamebode.com/index.html';
		static DOWNLOAD_PAGE_URL:string = 'http://reg.gamebode.com/index.html';
		static LOBBY_PAGE_URL:string = 'http://reg.gamebode.com/game_list_1.html';
		static EXCHANGE_URL: string = 'http://192.168.0.86:8998/coin/index';

		static init():void{
			var res = RES.getRes('langFish');
			if (null == res) {
				console.log('load langFish.json error.');
				return;
			}
			langFish = new langFishuage(res);
		}
		// static init_SERVER_URL_TAIL():void{
		// 	var spos:number;
		// 	var epos:number;
		// 	var temp:number = 0;
		// 	for(var i = 0; i < GameConfig.SERVER_URL.length; ++i){
		// 		if(GameConfig.SERVER_URL[i] == '.'){
		// 			++temp;
		// 			if(temp == 3){
		// 				spos = i + 1;
		// 			}
		// 		}else if(temp == 3 && GameConfig.SERVER_URL[i] == ':'){
		// 			epos = i;
		// 			break;
		// 		}
		// 	}
		// 	if(spos && epos && epos > spos){
		// 		GameConfig.SERVER_URL_TAIL = GameConfig.SERVER_URL.substr(spos, epos - spos);
		// 		console.log('SERVER_URL_TAIL:' + GameConfig.SERVER_URL_TAIL);
		// 	}
		// }
		static init_SERVER_URL_TAIL():void{
			if (!GameConfig.SERVER_URL) return;
			let s = GameConfig.SERVER_URL;
			let arr = s.split('.');
			let _s1 = arr[0];
			let _b = _s1.substr(_s1.length - 1);    
			GameConfig.SERVER_URL_TAIL =_b;
			console.log('SERVER_URL_TAIL===>', GameConfig.SERVER_URL_TAIL);
		}
		static loadConfigs(callback:Function):void {
			FishUtils.Ajax.GET(langFish.config_url + 'config.php', {id: this.gameId}, (response:any)=>{
				let data:any = JSON.parse(response);
				this.roomList = data.game.rooms;
				this.roomList.sort((r1:any, r2:any):number=>{
					return r1.roomID - r2.roomID;
				});
				callback(data);
			});
		}
		static getRoomConfig(id:number):any{
			let room:any = this.getRoomConfigById(id);
			if(!room){
				room = this.getRoomConfigByMatchId(id);
			}
			return room;
		}
		static getRoomConfigById(id:number):any{
			let ret;
			this.roomList.forEach((room:any)=>{
				if(room.roomID == id){
					ret = room;
					return true;
				}
			});
			return ret;
		}
		static getRoomConfigByMatchId(id:number):any{
			for(var i = 0; i < this.roomList.length; ++i){
				if(this.roomList[i].matchId == id){
					return this.roomList[i];
				}
			}
		}
		static urlData:any;
		static getUrl(callback:Function):void{
			console.log(langFish.config_url);
			Ajax.GET(langFish.config_url + 'geturl.php', {}, (response:any)=>{
				let data:any = JSON.parse(response);
				GameConfig.WEB_SERVICE_URL = data.WEB_SERVICE_URL;
				GameConfig.WX_LOGIN_URL = data.WX_LOGIN_URL;
				GameConfig.RESOURCE_URL = data.RESOURCE_URL;
				GameConfig.RECHARGE_URL = data.RECHARGE_URL;
				GameConfig.REGISTER_URL = data.REGISTER_URL;
				GameConfig.PASSWORD_URL = data.PASSWORD_URL;
				GameConfig.HOME_PAGE_URL = data.HOME_PAGE_URL;
				GameConfig.DOWNLOAD_PAGE_URL = data.DOWNLOAD_PAGE_URL;
				GameConfig.LOBBY_PAGE_URL = data.LOBBY_PAGE_URL;
				GameConfig.urlData = data;
				GameConfig.SERVER_URL = FISH_SERVER_TEST;
				GameConfig.init_SERVER_URL_TAIL();
				callback();
			},()=>{
				console.log('geturl.php' + ' error.');
			});
		}
	}

	export class Environment {
		static channel_id = 1;
	}

	export class WebService {
		uuid: string = StringUtils.makeRandomString(32);

		/**
		 * 登录
		 * @param username
		 * @param password
		 * @param callback
		 */
		login(username: string,password: string,callback: Function): void {
			this.callApi('index','login',(response) => {
				callback(response.data);
			},{ username,password });
		}

		/**
		 * 快速登录
		 * @param callback
		 */
		fastLogin(callback: Function): void {
			this.callApi('index','guest',(response) => {
				callback(response.data);
			},{ device: this.uuid });
		}

		/**
		 * 调用API
		 * @param module
		 * @param action
		 * @param callback
		 * @param params
		 * @param method
		 */
		callApi(module: string,action: string,callback: Function = null,params: any = null,method: string = 'post'): void {
			if(!params) {
				params = {};
			}
			params.pf = Native.instance.platformId;
			let url: string = GameConfig.WEB_SERVICE_URL + module + '/' + action;
			let m: Function = method == 'post' ? Ajax.POST : Ajax.GET;
			m.call(Ajax,url,params,(content: any) => {
				if(callback) {
					let response: any = JSON.parse(content);
					if(response.code > 0) {
						//alert(JSON.stringify(response));
					}
					callback(response);
				}
			});
		}

		/**
		 * 获取验证码
		 * @param phone
		 * @param callback
		 */
		getCode(phone,callback): void {
			this.callApi('user','getYunCode',(response) => {
				callback(response.code);
			},{ phone,action: 1 },'get');
		}

		bindPhone(phone,code,callback):void {
			this.callApi('user','bindMobile',(response) => {
				callback(response);
			},{uid:fishServer.selfData.uid, phone:phone, code:code},'post');
		}

		loginByWxFromWeb(code,callback): void {
			this.callApi('index','login',(response) => {
				callback(response);
			},{ type: 1,package: "cn.htgames.buyu.web",code: code },'post');
		}

		loginByWxFromWechat(code,sk,callback): void {
			//alert("loginByWxFromWechat:"+code);
			this.callApi('index','login',(response) => {
				callback(response);
			},{ type: 1,package: "cn.htgames.buyu.wechat",code: code,sk: sk},'post');
		}

		bindByWx(code,callback): void {
			this.callApi('user','bindByUid',(response) => {
				callback(response);
			},{ type: 1,package: "cn.htgames.buyu.web",wxcode: code,uid: fishServer.selfData.uid },'post');
		}

		rechagre(id,callback=null): void {
			if(FishUtils.Native.instance.isWXMP) {
				this.callApi('shop','wechatpayOrder',(response) => {
					Native.instance.rechargeInWXMP(response, callback);
				},{ product_id: id,os: 1,uid: fishServer.selfData.uid,type:GameConfig.SERVER_URL_TAIL},'post');
			}
		}

		buyCardsRecorder(id): void {
			if(FishUtils.Native.instance.isWXMP) {
				this.callApi('shop','wechatpayOrder',(response) => {
					Native.instance.rechargeInWXMP(response);
				},{ product_id: id,os: 1,uid: fishServer.selfData.uid,type:GameConfig.SERVER_URL_TAIL},'post');
			}
		}

		getWxConfig(callback): void {
			this.callApi('wechat','jsConfig',(response) => {
				if(response.code == 0)
					callback(response.data);
				else
					alert(''+response.code);
			},{url:encodeURIComponent(window.top.location.href)},'post');
		}
	}

	export class localStorage {
		static ID:string = '';

		static init(ID:string):void{
			this.ID = ID;
		}

		static getName(key:string, prefix:string = null):string{
			return (prefix || !this.ID || this.ID == '' ? prefix : this.ID) + '_' + key;
		}

		static getItem(key:string, prefix:string = null):string{
			return egret.localStorage.getItem(this.getName(key, prefix));
		}

		static setItem(key:string, value:string, prefix:string = null):boolean{
			return egret.localStorage.setItem(this.getName(key, prefix), value);
		}

		static getItemObj(key:string, defaultObj:any = null, prefix:string = null):any{
			let result:any;
			try{
				result = JSON.parse(this.getItem(key, prefix));
			}catch(e){

			}
			if(!result){
				result = defaultObj;
			}
			return result;
		}

		static setItemObj(key:string, itemObj:any, prefix:string = null):boolean{
			return this.setItem(key, JSON.stringify(itemObj), prefix);
		}
	}

	export class DataStorage {
		name:string = 'save';
		save:any;
		prefix:string;

		/**
		 * 加载存储数据
		 */
		loadData():void{
			this.save = localStorage.getItemObj(this.name, {}, this.prefix);
		}

		/**
		 * 清空存储数据
		 */
		clearData(exclude:string[] = null):void{
			if(exclude){
				for(let key in this.save){
					if(exclude.indexOf(key) < 0){
						delete this.save[key];
					}
				}
			}else{
				this.save = {};
			}

			this.saveData();
		}

		/**
		 * 保存存储数据
		 */
		saveData():void{
			localStorage.setItemObj(this.name, this.save, this.prefix);
		}

		/**
		 * 获取数据项
		 * @param key
		 * @param defaultValue  默认数据
		 * @returns {*}
		 */
		getItem(key:string, defaultValue:any = null):any{
			let item = this.save[key];
			if(item === null){
				item = defaultValue;
			}
			return item;
		}

		/**
		 * 设置数据项
		 * @param key
		 * @param value
		 * @param autoSave  是否自动保存(false)
		 * @returns {*}     旧的数据
		 */
		setItem(key:string, value:any, autoSave:boolean = false):any{
			let oldValue = this.save[key];
			this.save[key] = value;

			if(autoSave){
				this.saveData();
			}

			return oldValue;
		}

		/**
		 * 改变数值
		 * @param key
		 * @param value
		 * @param autoSave
		 * @returns {*}
		 */
		changeItem(key:string, value:any, autoSave:boolean = false):any{
			let oldValue = this.save[key];
			this.save[key] = oldValue + value;

			if(autoSave){
				this.saveData();
			}

			return oldValue;
		}
	}

	export class EventManager {
		private static _instance:EventManager;
		public static get instance():EventManager {
			if (this._instance == undefined) {
				this._instance = new EventManager();
			}
			return this._instance;
		}

		private _groups:any = {};

		register(groupName:string, target:any, eventName:string, callback:Function, thisObj:any, priority:number = 0):void{
			let item:RegisterItem = new RegisterItem();
			Utils.injectProp(item, {target, eventName, callback, thisObj, priority}, null, false);

			let group:any = this._groups[groupName];
			if(!group){
				group = this._groups[groupName] = {enable: false, items: []};
			}
			group.items.push(item);
		}

		registerOnObject(obj:any, target:any, eventName:string, callback:Function, thisObj:any, priority:number = 0):void{
			this.register(obj['__class__'], target, eventName, callback, thisObj, priority);
		}

		enable(groupName:string):void{
			let group:any = this._groups[groupName];
			if(group && !group.enable){
				group.enable = true;
				group.items.forEach((item:RegisterItem)=>{
					item.target['addEventListener'](item.eventName, item.callback, item.thisObj, false, item.priority);
				});
			}
		}

		enableOnObject(obj:any):void{
			this.enable(obj['__class__']);
		}

		disable(groupName:string):void{
			let group:any = this._groups[groupName];
			if(group && group.enable){
				group.enable = false;
				group.items.forEach((item:RegisterItem)=>{
					item.target['removeEventListener'](item.eventName, item.callback, item.thisObj);
				});
			}
		}

		disableOnObject(obj:any):void{
			this.disable(obj['__class__']);
		}

		dump(groupName:string = null):void{
			for(let key in this._groups){
				let group:any = this._groups[key];
				console.log(key + '[' + group.items.length + ']: ' + (group.enable ? '● enable' : '○ disable'));
				console.log(group.items.map((item:RegisterItem)=>{return item.eventName;}).join(','));
			}
		}
	}

	export class RegisterItem{
		target:any;
		eventName:string;
		callback:Function;
		thisObj:any;
		priority:number;
	}

	let _base64key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	export class Base64 {
		static encode(input) {
			if(!input){
				return '';
			}

			let output = "";
			let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			let i = 0;
			input = this._utf8_encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if (isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
						_base64key.charAt(enc1) + _base64key.charAt(enc2) +
						_base64key.charAt(enc3) + _base64key.charAt(enc4);
			}
			return output;
		}

		static decode(input) {
			if(!input){
				return '';
			}
			let output = "";
			let chr1, chr2, chr3;
			let enc1, enc2, enc3, enc4;
			let i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length) {
				enc1 = _base64key.indexOf(input.charAt(i++));
				enc2 = _base64key.indexOf(input.charAt(i++));
				enc3 = _base64key.indexOf(input.charAt(i++));
				enc4 = _base64key.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if (enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = this._utf8_decode(output);
			return output;
		}

		static _utf8_encode(string) {
			/*string = string.replace(/\r\n/g,"\n");
			let utftext = "";
			for (let n = 0; n < string.length; n++) {
				let c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}
			return utftext;*/
			
			return window["unescape"](encodeURIComponent(string));
		}

		// private method for UTF-8 decoding
		static _utf8_decode(utftext) {
			/*let string = "";
			let i = 0;
			let c = 0, c1 = 0, c2 = 0, c3 = 0;
			while ( i < utftext.length ) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i+1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i+1);
					c3 = utftext.charCodeAt(i+2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;*/

			return decodeURIComponent(window["escape"](utftext));
		}
	}
}

FishUtils.Dispatcher.init();
let langFish:FishUtils.langFishuage;
let fishWebService = new FishUtils.WebService();