(function (w, d) {

    /* cross browser event registration */
    function addEvent(obj,type,fn) {

        if (obj.addEventListener) {
            obj.addEventListener(type,fn,false);
            return true;
        } else if (obj.attachEvent) {
            obj['e'+type+fn] = fn;
            obj[type+fn] = function() { obj['e'+type+fn]( w.event );};
            var r = obj.attachEvent('on'+type, obj[type+fn]);
            return r;
        } else {
            obj['on'+type] = fn;
            return true;
        }
    
    } //addEvent
    
    /* dynamically load external script and call a callback when loaded */
    var callStack = [];
    var loadCount = 0;
    var loadCheck = function () {
        loadCount--;
        while (loadCount <= 0 && callStack.length > 0) {
            var callback = callStack.pop();
            callback();
        } //if
    } //loadcheck()

    function require(href, callback, async) {
        var loadStack = [];
        if (typeof href === 'string') {
            loadStack.push(href);
            loadCount += 1;
        } else {
            for (var i = 0; i < href.length; i++) {
                loadStack.push(href[i]);
            } //for
            loadCount += href.length;
        } //if

        if (callback) {
            callStack[callStack.length] = callback;
        } else {
            callStack[callStack.length] = function () {};
        } //if

        if (async !== false) {
            async = true;
        } //if

        var h = d.getElementsByTagName('HEAD')[0];
        while (loadStack.length > 0) {
            var src = loadStack.shift();
            var ext = src.split('.').pop().toLowerCase();
            var e;

            if (ext === 'css') {
                e = d.createElement('link');
                e.rel = 'stylesheet'
                e.type = 'text/css';
                e.href = src;
            }  else {
                e = d.createElement('script');
                e.type = 'text/javascript';
                e.async = async;
                e.src = src;
            } //if

            if (d.all) { // IE 6
                e.onreadystatechange = function() {
                    if (e.readyState == 'complete' || e.readyState == 'loaded') {
                        e.onreadystatechange = null;
                        loadCheck();
                    } //if
                };
            } else {
                addEvent(e,'load', loadCheck);
            } //if

            h.appendChild(e);
        } // while

    } //require

    var script = document.currentScript || (function() {
        var scripts = document.getElementsByTagName("script");
        return scripts[scripts.length - 1];
    })();

    if (script) {
        var scriptToLoad = script.getAttribute('data-script');
        if (scriptToLoad) {
            require(script.dataset.script);
        } //if
    } //if

    w.tbox = {
        console: console,
        require: require
    }
})(window, document);
