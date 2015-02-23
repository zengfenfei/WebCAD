define(function (require) {
	function PolyLine () {
		this.points = [];
	}

	PolyLine.prototype.onDraw = function(ctx) {
		if (this.points.length<2) {
			return;
		}
		ctx.beginPath();
		var pt = this.points[0];
		ctx.moveTo(pt.x, pt.y);
		for (var i = 1; i < this.points.length; i++) {
			pt = this.points[i];
			ctx.lineTo(pt.x, pt.y);
		};
		ctx.stroke();
	};

	return PolyLine;
});
