define(function (require) {
	var raf = require('appbase/polyfill/requestAnimationFrame');
	var bind = require('appbase/polyfill/bind');

	function DrawableLayer(canvas) {
		this.context = canvas.getContext('2d');
		this.drawables = [];
		this.paintingId = null;
		this._paint = bind(this._paint, this);

		this.updateSize();
	}

	DrawableLayer.prototype.updateSize = function() {
		var canvas = this.context.canvas;
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
	};
	DrawableLayer.prototype.addDrawable = function(d) {
		if (this.drawables.indexOf(d) != -1) {
			console.warn('Drawable already in the layer.');
			return;
		}
		this.drawables.push(d);
	};

	DrawableLayer.prototype.removeDrawable = function(d) {
		var i = this.drawables.indexOf(d);
		if (i === -1) {
			return;
		}
		this.drawables.splice(i, 1);
	};

	DrawableLayer.prototype.repaint = function() {
		if (this.paintingId) {
			console.warn('Already painting...');
			return;
		}
		this.paintingId = raf(this._paint);
	};

	// Draw the frame
	DrawableLayer.prototype._paint = function() {
		var c = this.context.canvas;
		c.width = c.width;	//Force clear canvas
		//this.context.clearRect(0, 0, c.width, c.height);
		for(var i = 0, len = this.drawables.length; i < len; i++) {
			this.context.save();
			this.drawables[i].onDraw(this.context);
			this.context.restore();
		}
		this.paintingId = null;
	};

	return DrawableLayer;
});
