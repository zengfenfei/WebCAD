define(function (require) {
	var Cross = require('../drawables/Cross');

	function TouchIndicator (paintPanel) {
		this.paintPanel = paintPanel;
		this.touchDrawables = [];
		this.showTouches = null;	// function
		this.showPanelSize = null;	//function

		init(this);
	}

	function init (self) {
		setTimeout(function () {
			showPanelSize(self);
		}, 0);
	}

	function showPanelSize (self) {
		var c = self.paintPanel.volatileLayer.context.canvas;
		self.showPanelSize && self.showPanelSize(c.width, c.height);
	}

	TouchIndicator.prototype.onTouchMove = function(pts) {
		var volatileLayer = this.paintPanel.volatileLayer;
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

	TouchIndicator.prototype.onTouchStart = TouchIndicator.prototype.onTouchMove;

	TouchIndicator.prototype.onResize = function() {
		showPanelSize(this);
	};

	return TouchIndicator;
});
