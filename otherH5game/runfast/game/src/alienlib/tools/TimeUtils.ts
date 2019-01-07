/**
 * Created by rockyl on 16/3/9.
 */


module PDKalien {
	export function repeat(handler:any, timeout:any, repeat:number = -1, onComplete:Function = null, immediately:boolean = false, ...args:any[]):number {
		let c:number = 0;
		if (immediately) {
			c++;
			handler.apply(null, args);
		}

		let timer:number = egret.setInterval(()=> {
			if (repeat > 0 && c >= repeat) {
				egret.clearInterval(timer);
				if (onComplete) {
					onComplete();
				}
				return;
			}
			handler.apply(null, args);
			c++;
		}, this, timeout);
		return timer;
	}

	export class TimeUtils {
		static timeLang = ['sky', 'hour', 'minutes', 'second'];
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
						result += item + PDKlang[this.timeLang[index]];
					}
				});
				return result;
			}else{
				return StringUtils.format(format, ss, mm, hh, dd);
			}
		}
        static timeFormatForEx(date: Date,sYear:string ="年",sMonth:string ="月",sDay:string ="日",withHourSec:boolean = true):string { 
         let year = date.getFullYear();
         let month =   date.getMonth()+1;
         let day =  date.getDate();
		 let str = year + sYear + month + sMonth + day + sDay;
		 if(withHourSec){
         	let hours = StringUtils.supplement(date.getHours(), 2);
         	let minutes = StringUtils.supplement(date.getMinutes(), 2);
			return str + " " + hours + ":" + minutes;
		 }
         return str;
        }

		static parseFromString(str:string):Date {
			return new Date(str.replace('T', ' ').replace(/-/g, '/'));
		}

		static parseFromStringScope(str:string[]):Date[] {
			return str.map((item)=>this.parseFromString(item));
		}

		static dateTimeToString(date:Date):string{
			return this.dateToString(date, PDKlang.format_y_m_d) + ' ' + this.dateToTimeString(date, '{2}:{1}');
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
			return StringUtils.format('{0}' + PDKlang.month + '{1}' + PDKlang.day, StringUtils.supplement(date.getMonth() + 1, 2), StringUtils.supplement(date.getDate(), 2))
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
}