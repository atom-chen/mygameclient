class CCObjectPool {
    public constructor(value: any) {
        this._template = value;
        this._list = new Array();
	}
	
	/**
		 * 用于存储具体对象的对象池
		 */
    private static _pool: any=[];

    private _template: any;
    private _list : Array<any>;//存储对象用
	
    		
    /**
     * 从对象池借出一个对象
     * @return 
     * 
     */
    public borrowObject(): Object {
        var obj: Object;
        while(this._list.length > 0 && !obj) {
            obj = this._list.shift();
        }
        if(!obj) {
            obj = new this._template();           
        }
    
        if(!obj) {
            return this.borrowObject();
        }
    
        return obj;
    }
    		
    /**
     * 对象池内对象数目 
     * @return 
     * 
     */
    public getPoolLength(): number {
        return this._list.length;
    }
    
    private _maxLength: number = 100;
    /**
     * 对象池容量，即最多能保存的对象的个数
     * @return 
     * 
     */
    public get maxLength():number
    {
        return this._maxLength;
    }
    		
    /**
     * 设置对象池容量，即最多能保存的对象的个数
     * @param value
     * 
     */
    public set maxLength(value:number)
        {
        if(this._maxLength != value) {
            this._maxLength = value;
            while(this._list.length > value) {
                this._list.shift();
                }
            }
        }
    		
    /**
     * 归还一个对象 
     * @param value
     * 
     */
    public returnObject(value: Object): boolean {
        if(value && this._list.length < this.maxLength) 
        {
            if(value instanceof this._template)//value is _template
            {
                this._list.push(value);
                return true;
            }
    		else
            {
                return false;
            }
        }
        return false;
    }  
    
    /**
     * 根据对象的类获得该类的对象池 
     * @param value
     * @return 
     * 
     */
    public static getInstance(value: any): CCObjectPool {
    
        if(!CCObjectPool._pool[value])
            CCObjectPool._pool[value] = new CCObjectPool(value);
        return CCObjectPool._pool[value];
    }  
}
