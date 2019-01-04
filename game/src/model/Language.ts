/**
 * Created by rockyl on 16/3/31.
 */

class Language extends LanguagePack{
	id:LanguageIds;

	constructor(data:any){
		super();

		this.id = new LanguageIds;
		alien.Utils.injectProp(this, data);
	}

	splitCache:any = {};
	split(name:string, index:number):string{
		let line = this.splitCache[name];
		if(!line){
			line = this.splitCache[name] = lang[name].split(',');
		}
		return line[index];
	}

	format(id:string, ...params):string{
		return alien.StringUtils.formatApply(this[id], params);
	}
}