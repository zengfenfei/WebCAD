define(function (require) {
	var DrawableLayer = require('./DrawableLayer');
	var Cross = require('./drawables/Cross');
	var Hammer = require('Hammer');
	var Point = require('./geom/Point');
	var TouchIndicator = require('./interactors/TouchIndicator');

	function PaintPanel (holder) {
		this.holder = holder;
		this.storeLayer = new DrawableLayer(holder.querySelector('canvas.store'));
		this.volatileLayer = new DrawableLayer(holder.querySelector('canvas.volatile'));

		this.interactors = [];
		this.touchIndicator = new TouchIndicator(this);

		init(this);
	}

	function init (self) {
		self.interactors.push(self.touchIndicator);

		self.holder.addEventListener('touchstart', function (evt) {
			evt.preventDefault();
			//evt.stopPropagation();
		}, false);

		window.addEventListener('resize', function (evt) {
			self.storeLayer.resized();
			self.volatileLayer.resized();
		}, false);

		addListeners(self);
	}

	function addListeners (self) {
		self.holder.addEventListener('touchmove', function (evt) {
			var pts = [];
			var touches = evt.targetTouches;
			for (var i = touches.length - 1; i >= 0; i--) {
				var t = touches[i];
				var x = Math.floor(t.clientX) + 0.5;	//Coords in chrome is float
				var y = Math.floor(t.clientY) + 0.5;
				pts.push(new Point(x, y));
			};
			dispatchInteractEvent(self, 'onMove', [pts, self, evt]);
		}, false);

		self.holder.addEventListener('mousemove', function (evt) {
			var x = evt.offsetX + 0.5;
			var y = evt.offsetY + 0.5;
			var pts = [new Point(x, y)];
			dispatchInteractEvent(self, 'onMove', [pts, self, evt]);
		}, false);

		window.addEventListener('resize', function (evt) {
			dispatchInteractEvent(self, 'onResize', [evt]);
		}, false);
	}

	function dispatchInteractEvent (self, name, argv) {
		for (i = 0; i < self.interactors.length; i++) {
			var a = self.interactors[i];
			a[name] && a[name].apply(a, argv);
		}
	}

	return PaintPanel;
});
