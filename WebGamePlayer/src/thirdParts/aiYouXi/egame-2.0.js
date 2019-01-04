! function(w) {
    var hrefSearch = getQueryObject(location.href);
    w.egame_channel_code = hrefSearch.channel_code;
    var channel_id = hrefSearch.channel_id;
    var date = new Date().getTime();
    var address = {
        charge: 'http://h5.play.cn/static/js/charge/charge-3.0.js' + '?time=' + date,
        user: 'http://h5.play.cn/static/js/charge/user-3.0.js' + '?time=' + date,
        toobar: 'http://h5.play.cn/egameOut/toobar.js' + (channel_id ? '?channel_id=' + channel_id : '')
    };
    var chargeParam, userParam, toobarParam;
    w.egame = {
        init: function(param) {
            // debugger
            if (param.chargeUse) addScript(address.charge, this.chargeCallback);
            if (param.userUse) addScript(address.user, this.userCallback);
            if (param.toobarUse) {
                var toobarAddress = address.toobar + (param.share ? ((channel_id ? '&' : '?') + 'summary=' + param.share.summary + '&pic=' + param.share.pic) : '');
                addScript(toobarAddress, this.toobarCallback);
            }
        },
        chargeInit: function(param) {
            //if(param)chargeParam=param;
        },
        userInit: function(param) {
            if (param) {
                param.channel_code = egame_channel_code;
                userParam = param;
                // egame_user_login(userParam);
                // userParam='';
            }
        },
        chargeCallback: function() {

        },
        userCallback: function() {
            var userInterval = setInterval(function() {
                if (userParam) {
                    window.clearInterval(userInterval);
                    egame_user_login(userParam);
                    userParam = '';
                }
            }, 10)
        },
        toobarCallback: function() {

        }
    };

    function addScript(src, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        head.appendChild(script);
        script.onreadystatechange = function() {
            if (this.readyState == 'complete') callback();
        }
        script.onload = function() {
            callback();
        }
    }

    function getQueryObject(url) {
        url = url == null ? window.location.href : url;
        var search = url.substring(url.lastIndexOf("?") + 1);
        var obj = {};
        var reg = /([^?&=]+)=([^?&=]*)/g;
        search.replace(reg, function(rs, $1, $2) {
            var name = decodeURIComponent($1);
            var val = decodeURIComponent($2);
            val = String(val);
            obj[name] = val;
            return rs;
        });
        return obj;
    }
}(window)
