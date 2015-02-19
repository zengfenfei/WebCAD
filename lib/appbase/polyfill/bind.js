define(function () {
	return function (fn, self, argv) {
		return function () {
			fn.apply(self, argv);
		}
	}
});
