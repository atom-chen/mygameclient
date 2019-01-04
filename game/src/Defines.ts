/**
 * Created by rockyl on 2016/11/8.
 */

let version: string = '07260900';

if (alien.Native.instance.isNative) {
    if (egret.Capabilities.os == "iOS") {   // ios
        version = version + 'i';
    } else if (egret.Capabilities.os == "Android") { // android
        version = version + 'a';
    } else {    // native
        version = version + 'n';
    }
}