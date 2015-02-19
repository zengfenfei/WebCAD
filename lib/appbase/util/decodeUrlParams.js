define(function() {
    function decodeUrlParams(str) {
        if (str.trim() === '') {
            return {};
        }
        var parts = str.split('&');
        var paramObj = {};
        for (var i = 0, l = parts.length; i < l; i++) {
            var keyValueAr = parts[i].split('=');
            paramObj[keyValueAr[0]] = decodeURIComponent(keyValueAr[1] || '');
        }
        return paramObj;
    }

    return decodeUrlParams;
});
