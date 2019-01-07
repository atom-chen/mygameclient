/**
 * Created by rockyl on 16/3/9.
 *
 * 场景管理
 */

module CCalien {
	export class CCDDZSceneManager {
		private static _instance:CCDDZSceneManager;
		public static get instance():CCDDZSceneManager {
			if (this._instance == undefined) {
				this._instance = new CCDDZSceneManager();
			}
			return this._instance;
		}

		static init(root:eui.Group, loadingSceneName:string = "loading"):void {
			CCDDZSceneManager.instance.init(root, loadingSceneName);
		}

		static addMostTopScene(name:string, sceneDef:any):void{
			CCDDZSceneManager.instance.addMostTopScene(name, sceneDef);
		}

		static addTopScene(name:string, sceneDef:any):void{
			CCDDZSceneManager.instance.addTopScene(name, sceneDef);
		}

		static addEffectScene(name:string, sceneDef:any):void{
			CCDDZSceneManager.instance.addEffectScene(name, sceneDef);
		}

		static addBottomScene(name:string, sceneDef:any):void{
			CCDDZSceneManager.instance.addBottomScene(name, sceneDef);
		}

		static register(name:string, scene:Object, resGroup:string = null):void {
			CCDDZSceneManager.instance.register(name, scene, resGroup);
		}

		static show(name:string, params:any = null, effectDef:any = null, effectParams:any = null, callback:Function = null, back:boolean = false, setLastSceneName:string = null):void {
			CCDDZSceneManager.instance.show(name, params, effectDef, effectParams, callback, back, setLastSceneName);
		}

		static back(params:any = null, effectDef:any = null, effectParams:any = null, callback:Function = null):boolean {
			return CCDDZSceneManager.instance.back(params, effectDef, effectParams, callback);
		}

		/**
		 * 第三方游戏的显示容器加入舞台
		 * 调用之前确保已经创建topLayer
		 */
		static addOtherContainer(container:any):void{
			if(!container) return;
			CCDDZSceneManager.instance.topLayer.addChild(container);
		}

		/**
		 * 需要移除其他第三方游戏的显示容器
		 */
		static removeOtherContainer(container:any):void{
			if(container){
				CCDDZSceneManager.instance.topLayer.removeChild(container);
			}
		}

		/**
		 * 运行第三方游戏需要移除斗地主的显示容器
		 */
		static removeDDZContainer():void{
			let ins = CCDDZSceneManager.instance;
			let _middleLayer:eui.Group = ins.middleLayer;
			let itemScene:CCalien.CCDDZSceneBase;
			_middleLayer.$children.forEach((item)=>{
				itemScene = <CCalien.CCDDZSceneBase>item;
				if(!(itemScene instanceof CCDDZSceneLoading)){
					ins.mapScene.remove(itemScene.name);
					CCalien.CCDDZEventManager.instance.disableOnObject(itemScene);
					ins.middleLayer.removeChild(itemScene);
				}
			})
			
			ins.currentScene = null;
			ins.currentSceneName = null;
		}

		/*static showLoading(bShow:boolean):void{
			let _ins = CCDDZSceneManager.instance;
			if(_ins.loadingSceneName){
				let _scene:CCDDZSceneLoading = _ins.mapScene.get(_ins.loadingSceneName);
				if(_scene){
					_scene.showLoading(bShow);
				}
			}
		}
		*/
		root:eui.Group;
		popLayer:eui.Group;
		effectLayer:eui.Group;
		mostTopLayer:eui.Group;
		topLayer:eui.Group;
		middleLayer:eui.Group;
		bottomLayer:eui.Group;
		background:egret.Shape;

		private _backgroundColor:number;

		loadingSceneName:string;

		mapSceneDef:HashMap;
		mapScene:HashMap;
		currentSceneName:string;
		lastSceneName:string;
		currentScene:CCDDZSceneBase;

		currentLoadGroup:string;

		nextShowEntity:ShowEntity;

		constructor() {
			this.mapSceneDef = new HashMap();
			this.mapScene = new HashMap();

			RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
			RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
		}

		init(root:eui.Group, loadingSceneName:string = "loading"):void{
			this.root = root;
			this.loadingSceneName = loadingSceneName;

			this.root.addChild(this.background = new egret.Shape());
			this.root.addChild(this.bottomLayer = new eui.Group());
			this.root.addChild(this.middleLayer = new eui.Group());
			this.root.addChild(this.topLayer = new eui.Group());
			this.root.addChild(this.popLayer = new eui.Group());
			this.root.addChild(this.effectLayer = new eui.Group());
			this.root.addChild(this.mostTopLayer = new eui.Group());

			this.bottomLayer.touchEnabled = false;
			this.middleLayer.touchEnabled = false;
			this.topLayer.touchEnabled = false;
			this.popLayer.touchEnabled = false;
			this.effectLayer.touchEnabled = false;
			this.mostTopLayer.touchEnabled = false;

			this.backgroundColor = 0xFFFFFF;

			CCalien.CCDDZStageProxy.stage.addEventListener(egret.Event.RESIZE, this.onStageResize, this);
		}

		private onStageResize(event:egret.Event = null):void{
			CCalien.CCDDZUtils.enumChildren(this.root, (child:egret.DisplayObject)=>{
				child.width = CCDDZStageProxy.stage.stageWidth;
				child.height = CCDDZStageProxy.stage.stageHeight;
			});
			this.reDrawBG();
		}

		get backgroundColor():number {
			return this._backgroundColor;
		}

		set backgroundColor(value:number) {
			this._backgroundColor = value;

			this.reDrawBG();
		}

		reDrawBG(){
			let g:egret.Graphics = this.background.graphics;
			g.beginFill(this._backgroundColor);
			g.drawRect(0, 0, CCalien.CCDDZStageProxy.width, CCalien.CCDDZStageProxy.height);
			g.endFill();
		}

		private onResourceLoadComplete(event:RES.ResourceEvent):void {
    		console.log("111RES LOAD COMPLETE:"+event.groupName);
			if (event.groupName == this.currentLoadGroup) {
				if (this.nextShowEntity) {
					this.show(this.nextShowEntity.name, this.nextShowEntity.params, this.nextShowEntity.effectDef, this.nextShowEntity.effectParams, this.nextShowEntity.callback, this.nextShowEntity.back);
					this.currentLoadGroup = null;
					this.nextShowEntity = null;
				}
			}
		}

		private onResourceProgress(event:RES.ResourceEvent):void {
			if (event.groupName == this.currentLoadGroup) {
				CCalien.CCDDZDispatcher.dispatch('loadingProgress', {
					itemsLoaded: event.itemsLoaded,
					itemsTotal: event.itemsTotal
				});
			}
		}
		
        private onResourceLoadError(event: RES.ResourceEvent): void {
            ccddzwebService.postError(CCGlobalErrorConfig.RESOURCE_LOAD_ERROR,event.groupName);
        }

		addMostTopScene(name:string, sceneDef:any):void{
			let scene:CCDDZSceneBase = new sceneDef();
			this.mostTopLayer.addChild(scene);
			scene._beforeShow(null);
		}

		addTopScene(name:string, sceneDef:any):void{
			let scene:CCDDZSceneBase = new sceneDef();
			this.topLayer.addChild(scene);
			scene._beforeShow(null);
		}

		addEffectScene(name:string, sceneDef:any):void{
			let scene:CCDDZSceneBase = new sceneDef();
			this.effectLayer.addChild(scene);
			scene._beforeShow(null);
		}

		addBottomScene(name:string, sceneDef:any):void{
			let scene:CCDDZSceneBase = new sceneDef();
			this.bottomLayer.addChild(scene);
			scene._beforeShow(null);
		}

		register(name:string, scene:Object, resGroup:string = null):void {
			this.mapSceneDef.put(name, new SceneConfig(scene, resGroup));
		}

		show(name:string, params:any = null, effectDef:any = null, effectParams:any = null, callback:Function = null, back:boolean = false, setLastSceneName:string = null):void {
			if (this.currentSceneName == name) {
				this.currentScene._beforeShow(params, false);
				this.currentScene._onShow(params, false);
			}else{
				let effect;
				let scene2:any;

				let sceneConfig:SceneConfig = this.mapSceneDef.get(name);
				if (sceneConfig.resGroup && !RES.isGroupLoaded(sceneConfig.resGroup)) {
					this.nextShowEntity = new ShowEntity(name, params, effectDef, effectParams, callback, back);

					this.currentLoadGroup = sceneConfig.resGroup;
					egret.setTimeout(()=>{
						RES.loadGroup(sceneConfig.resGroup);
					}, this, 100);

					name = this.loadingSceneName;
					scene2 = this.mapScene.get(name);
					scene2.resetDesc();
					effectDef = null;
				} else {
					if (this.mapScene.containsKey(name)) {
						scene2 = this.mapScene.get(name);
					}else{
						let scene2Def:any = sceneConfig.sceneDef;
						scene2 = new scene2Def();
						scene2.name = name;
						this.mapScene.put(name, scene2);
					}
				}

				if (!effect && this.currentSceneName) {
					if (!effectDef) {
						effect = new CCDDZsceneEffect.None();
					} else {
						effect = new effectDef();
					}
					this.currentScene._beforeHide(params, back);
				} else {
					effect = new CCDDZsceneEffect.None();
				}

				if(this.currentScene){
					egret.Tween.removeTweens(this.currentScene);
					this.currentScene.touchChildren = false;
				}
				egret.Tween.removeTweens(scene2);
				effect.handover(this.currentScene, scene2, this.middleLayer, effectParams, function(scene1:CCDDZSceneBase, scene2:CCDDZSceneBase):void{
					if(scene1){
						/*if(scene1.name != this.loadingSceneName){
							let sceneConfig:SceneConfig = this.mapSceneDef.get(scene1.name);
							if(sceneConfig.resGroup){
								RES.destroyRes(sceneConfig.resGroup);
							}
						}*/
						scene1._onHide(params, back);
					}
					scene2.touchChildren = true;
					scene2._onShow(params, back);
					if(callback){
						callback();
					}
				}.bind(this, this.currentScene, scene2));

				this.currentScene = scene2;
				this.currentSceneName = name;
				
				if(back){
					this.lastSceneName = name;
				}else if(name != this.loadingSceneName){
					this.currentScene.lastSceneName = setLastSceneName != null ? setLastSceneName : this.lastSceneName;
					this.lastSceneName = name;
				}
				this.currentScene._beforeShow(params, back);
			}
		}

		back(params:any = null, effectDef:any = null, effectParams:any = null, callback:Function = null):boolean{
			if(this.currentScene.lastSceneName && this.currentScene.lastSceneName != ''){
				this.show(this.currentScene.lastSceneName, params, effectDef, effectParams, callback, true);

				return true;
			}
			return false;
		}
	}

	export class SceneConfig {
		sceneDef:any;
		resGroup:string;

		constructor(scene:any, resGroup:string = null) {
			this.sceneDef = scene;
			this.resGroup = resGroup;
		}
	}

	export class ShowEntity {
		name:string;
		params:any = null;
		effectDef:any = null;
		effectParams:any = null;
		callback:Function = null;
		back:boolean = null;

		constructor(name:string, params:any = null, effectDef:any = null, effectParams:any = null, callback:Function = null, back:boolean = false) {
			this.name = name;
			this.params = params;
			this.effectDef = effectDef;
			this.callback = callback;
			this.back = back;
		}

	}
}