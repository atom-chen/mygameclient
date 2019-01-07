/**
 * Created by rockyl on 2016/11/8.
 */

let ccddz_version: string = '07260900';

if (CCalien.Native.instance.isNative) {
    if (egret.Capabilities.os == "iOS") {   // ios
        ccddz_version = ccddz_version + 'i';
    } else if (egret.Capabilities.os == "Android") { // android
        ccddz_version = ccddz_version + 'a';
    } else {    // native
        ccddz_version = ccddz_version + 'n';
    }
}