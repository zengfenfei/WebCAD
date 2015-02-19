define(function() {
    function encodeUrlParams(obj) {
        var urlEncoded = [];
        for (var k in obj) {
            if (obj[k] == null || k == 'url') {
                continue;
            }
            urlEncoded.push(k + '=' + encodeURIComponent(obj[k]));
        }
        return urlEncoded.join('&');
    }
    return encodeUrlParams;
});
