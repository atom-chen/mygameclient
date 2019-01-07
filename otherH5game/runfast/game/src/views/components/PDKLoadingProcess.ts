/**
 *
 * @author 
 *
 */
class PDKLoadingProcess extends eui.Component{
	public constructor() {
    	super();
      this.group=new eui.Group();
      this.group.width=584;
      this.group.height=93;
      this.addChild(this.group);
      
//      <e:Image y= "71" width= "584" scale9Grid= "38,6,231,7" x= "0" source= "loding_image_23" />
//          <e:Image source= "loding_image_24" x= "0" y= "71" width= "584" scale9Grid= "38,7,231,6" />
//              <e:Image source= "loding_image_26" x= "0" y= "70" scale9Grid= "51,6,200,2" width= "584" />
//                  <e:Image source= "loding_image_27" x= "0" y= "72" scale9Grid= "38,11,231,3" width= "584" />
//                      <e:Image source= "loding_image_28" x= "365" y= "76" />
//                          <e:Image source= "loding_image_25" x= "12" y= "76" />
//                              <e:Image source= "loding_image_25" y= "76" x= "25" />
//                                  <e:Image source= "loding_image_29" x= "233" y= "29" />
//                                      <e:Label text= "标签" y= "7" textColor= "0x056746" size= "18" fontFamily= "微软雅黑" horizontalCenter= "0" />
      
      this.back = new eui.Image(RES.getRes("loding_image_23"));
      this.back.scale9Grid = new egret.Rectangle(38,6,231,7);
      this.back.x=0;
      this.back.y=71;
      this.back.width=584;
      this.group.addChild(this.back);
      
      this.scroller1=new eui.Scroller();
      this.scroller1.width=0;
      this.scroller1.height=21;
      this.scroller1.x=0;
      this.scroller1.y=71;    
      
      var g1:eui.Group=new eui.Group();
      this.scroller1.viewport = g1;
      
      this.pro = new eui.Image(RES.getRes("loding_image_24"));
      this.pro.scale9Grid = new egret.Rectangle(38,7,231,6);
      this.pro.width=584;
      g1.addChild(this.pro);
      
      for (var i:number=18;i<560;i+=18)
      {
          var img: eui.Image = new eui.Image(RES.getRes("loding_image_25"));
          img.x=i;
          img.y=5;
          g1.addChild(img);
      }
      
      var up: eui.Image = new eui.Image(RES.getRes("loding_image_26"));
      up.scale9Grid = new egret.Rectangle(51,6,200,2);
      up.width = 584;
      g1.addChild(up);
      
      var down: eui.Image = new eui.Image(RES.getRes("loding_image_27"));
      down.scale9Grid = new egret.Rectangle(38,11,231,3);
      down.width = 584;
      g1.addChild(down);
      
      this.group.addChild(this.scroller1);
      
      
//      this.scroller2 = new eui.Scroller();
//      this.scroller2.width = 656;
//      this.scroller2.height = 21;
//      this.scroller2.x = 0;
//      this.scroller2.y = 71;
//
//
//      var g2: eui.Group = new eui.Group();
//      this.scroller2.viewport = g2;
      
      this.light = new eui.Image(RES.getRes("loding_image_28"));
      this.light.x = 0;
      this.light.y = 76;
      this.group.addChild(this.light);
      
//      this.group.addChild(this.scroller2);      
     
      
      this.plane = new eui.Image(RES.getRes("loding_image_29"));
      this.plane.x = 0;
      this.plane.y = 29;
      this.group.addChild(this.plane);
      
      this.lab1 = new eui.Label();
      this.lab1.size = 18;
      this.lab1.text = "加载中...";
      this.lab1.fontFamily = "微软雅黑";
      this.lab1.horizontalCenter=0;
      this.lab1.y = 7;
      this.lab1.textColor = 0x056746;
      this.group.addChild(this.lab1);
      
//      var i:number=1;
//      var timer:egret.Timer=new egret.Timer(300);
//      timer.addEventListener(egret.TimerEvent.TIMER,()=>{
//          this.setProcess(i++,100);
//          },this);
//      timer.start();
	}
	
    private static instance: PDKLoadingProcess;
    public static getInstance(): PDKLoadingProcess {
        if(!this.instance)
            this.instance = new PDKLoadingProcess();
        return this.instance;
    }
    
    private group:eui.Group;
    private title: eui.Image;
    
    private scroller1:eui.Scroller;
    private scroller2: eui.Scroller;
    private pro:eui.Image;
    private back:eui.Image;
    private plane:eui.Image;
    private light: eui.Image;
    private lab1:eui.Label;
   
    public setProcess(currentValue:number,maxValue:number):void
    {
        if (currentValue>maxValue)
            currentValue=maxValue;
        this.scroller1.width=currentValue/maxValue*this.pro.width;
        this.light.x=this.scroller1.width-this.light.width+4;
        if(this.light.x > (this.pro.width-this.light.width-4))
            this.light.x = this.pro.width - this.light.width - 4;
//        this.light.visible=false;
        this.plane.x = this.scroller1.width-this.plane.width+17;
        this.lab1.text=currentValue+"/"+maxValue;
    }
}
