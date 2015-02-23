define(function (require) {
	var Cross = require('../drawables/Cross');

	function TouchIndicator () {
		this.touchDrawables = [];
		this.showTouches = null; // function
	}

	TouchIndicator.prototype.onMove = function(pts, paintPanel) {
		var volatileLayer = paintPanel.volatileLayer;
		for(var i = 0, len = this.touchDrawables.length; i < len; i++) {
			volatileLayer.removeDrawable(this.touchDrawables[i]);
		}
		this.touchDrawables = [];
		for(i = 0, len = pts.length; i < len; i++) {
			var cross = new Cross(pts[i].x, pts[i].y);
			this.touchDrawables.push(cross);
			volatileLayer.addDrawable(cross);
		}
		volatileLayer.repaint();
		this.showTouches && this.showTouches(pts);
	};

	return TouchIndicator;
});
