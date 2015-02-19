define(function () {
	return window.cancelAnimationFrame
		|| window.webkitCancelAnimationFrame
		|| function (id) {
			clearTimeout(id);
		};
});
