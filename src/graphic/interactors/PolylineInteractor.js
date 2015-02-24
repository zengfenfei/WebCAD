define(function (require) {
	var Polyline = require('../drawables/Polyline');

	function PolylineInteractor (paintPanel) {
		this.paintPanel = paintPanel;
		this.polyline = null;
		this.moved = null;
	}

	PolylineInteractor.prototype.id = 'polyline';

	PolylineInteractor.prototype.onTouchStart = function  () {
		if (!this.polyline) {
			this.polyline = new Polyline();
			this.paintPanel.volatileLayer.addDrawable(this.polyline);
		}
		this.moved = false;
	};

	PolylineInteractor.prototype.onTouchMove = function(pts) {
		if (this.moved) {
			this.polyline.points.pop();
		}
		this.moved = true;
		this.polyline.points.push(pts[0]);
	};

	PolylineInteractor.prototype.onTap = function() {
		console.log('tapp');
		if (this.polyline.points.length >= 2) {
			this.paintPanel.commit(this.polyline);
			this.polyline = null;
		}
	};

	return PolylineInteractor;
});
