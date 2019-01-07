/**
 * Created by rockyl on 16/3/31.
 */

class PDKLanguage extends PDKLanguagePack{
	id:PDKLanguageIds;

	constructor(data:any){
		super();

		this.id = new PDKLanguageIds;
		PDKalien.PDKUtils.injectProp(this, data);
	}

	splitCache:any = {};
	split(name:string, index:number):string{
		let line = this.splitCache[name];
		if(!line){
			line = this.splitCache[name] = PDKlang[name].split(',');
		}
		return line[index];
	}

	format(id:string, ...params):string{
		return PDKalien.StringUtils.formatApply(this[id], params);
	}
}