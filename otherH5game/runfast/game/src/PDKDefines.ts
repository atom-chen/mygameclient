/**
 * Created by rockyl on 2016/11/8.
 */

let PDKversion: string = '1808141525';

if (PDKalien.Native.instance.isNative) {
    if (egret.Capabilities.os == "iOS") {   // ios
        PDKversion = PDKversion + 'i';
    } else if (egret.Capabilities.os == "Android") { // android
        PDKversion = PDKversion + 'a';
    } else {    // native
        PDKversion = PDKversion + 'n';
    }
}