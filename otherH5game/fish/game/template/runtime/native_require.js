
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/eui/eui.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"libs/modules/socket/socket.js",
	"libs/modules/protobuf/protobuf.js",
	"libs/modules/md5/md5.js",
	"libs/modules/clipbord/clipbord.js",
	"libs/modules/game/game.js",
	"libs/modules/physics/physics.js",
	"libs/modules/greensock/greensock.js",
	"bin-debug/base/FishUtils.js",
	"bin-debug/base/FishUserInfoData.js",
	"bin-debug/fish/FishBase.js",
	"bin-debug/fish/FishPhysics.js",
	"bin-debug/base/FishSocket.js",
	"bin-debug/fish/FishCannon.js",
	"bin-debug/base/FishProto.js",
	"bin-debug/editor/FishEditorElement.js",
	"bin-debug/editor/FishPathEditor.js",
	"bin-debug/editor/FishPathItem.js",
	"bin-debug/editor/FishShowItem.js",
	"bin-debug/fish/FishActivity.js",
	"bin-debug/fish/FishActor.js",
	"bin-debug/fish/FishAlert.js",
	"bin-debug/fish/FishAssetAdapter.js",
	"bin-debug/FishMain.js",
	"bin-debug/fish/FishBullet.js",
	"bin-debug/fish/FishButtons.js",
	"bin-debug/fish/FishUserInfo.js",
	"bin-debug/fish/FishCaustic.js",
	"bin-debug/fish/FishCoin.js",
	"bin-debug/fish/FishConfig.js",
	"bin-debug/fish/FishEvent.js",
	"bin-debug/fish/FishInput.js",
	"bin-debug/fish/FishLoading.js",
	"bin-debug/fish/FishLogin.js",
	"bin-debug/fish/FishNet.js",
	"bin-debug/fish/FishObjectPool.js",
	"bin-debug/base/FishNativeBridge.js",
	"bin-debug/fish/FishRoom.js",
	"bin-debug/fish/FishScene.js",
	"bin-debug/fish/FishServer.js",
	"bin-debug/fish/FishShop.js",
	"bin-debug/fish/FishSound.js",
	"bin-debug/fish/FishThemeAdapter.js",
	"bin-debug/fish/FishTypes.js",
	"bin-debug/base/FishJsBridge.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "FishMain",
		frameRate: 60,
		scaleMode: "showAll",
		contentWidth: 1280,
		contentHeight: 720,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};