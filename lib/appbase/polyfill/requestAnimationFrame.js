define(function () {
	return window.requestAnimationFrame
		|| window.webkitRequestAnimationFrame
		|| function (cb) {
			return setTimeout(cb, 1000 / 45);
		}
});
