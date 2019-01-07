declare module wxApi {
    /**
     *  zhu H5初始化微信参数
     * callback({code:xxx}) 0:成功 1:取消 2:失败
     */
    function config (response);
    /**
     * H5微信支付
     * callback({code:xxx}) 0:成功 1:取消 2:失败
     */
     function recharge(response,callback);
     /**
      * H5微信分享
      */
     function share(response,callback);

     /**
      * h5 初始化微信Bridge
      */
     function initBridge();
}
   
