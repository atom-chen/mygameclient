 export function addScript(src, callback) {
    console.log("addScript:"+src);
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    head.appendChild(script);
    script.onreadystatechange = function() {
        console.log("addScriptComplete:"+src);
        if (this.readyState == 'complete' && callback) 
            callback();
    }
    script.onload = function() {
        console.log("addScriptComplete:"+src);
        if (callback)
            callback();
    }
}