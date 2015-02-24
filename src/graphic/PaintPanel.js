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
		this.currentInteractorId = null;
		this.INTERACTORS = {};

		init(this);
	}

	PaintPanel.prototype.commit = function(d) {
		this.storeLayer.addDrawable(d);
		this.storeLayer.repaint();
		this.setInteractor(null);
	};

	PaintPanel.prototype.setInteractor = function(id) {
		if (this.currentInteractorId) {
			var it = this.INTERACTORS[this.currentInteractorId];
			var i = this.interactors.indexOf(it);
			this.interactors.splice(i, 1);
		}
		var newInteractor = this.INTERACTORS[id];
		newInteractor && this.interactors.push(newInteractor);
	};

	function init (self) {
		self.interactors.push(self.touchIndicator);
		registerInteractors(self);

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

	function registerInteractors (self) {
		var a = [require('./interactors/PolylineInteractor')];
		for (var i = a.length - 1; i >= 0; i--) {
			var it = new a[i](self);
			self.INTERACTORS[it.id] = it;
		};
	}

	function addListeners (self) {
		self.holder.addEventListener('touchstart', createTouchListener('onTouchStart', self), false);
		self.holder.addEventListener('touchmove', createTouchListener('onTouchMove', self), false);
		self.holder.addEventListener('touchend', createTouchListener('onTouchEnd', self), false);

		self.holder.addEventListener('mousemove', function (evt) {
			var x = evt.offsetX + 0.5;
			var y = evt.offsetY + 0.5;
			var pts = [new Point(x, y)];
			dispatchInteractEvent(self, 'onMove', [pts, evt]);
		}, false);

		window.addEventListener('resize', function (evt) {
			dispatchInteractEvent(self, 'onResize', [evt]);
		}, false);

		var hammertime = new Hammer(self.holder);
		hammertime.on('tap', function (evt) {
			dispatchInteractEvent(self, 'onTap');
		});
	}

	function createTouchListener (evtName, self) {
		return function (evt) {
			var pts = [];
			var touches = evt.targetTouches;
			for (var i = touches.length - 1; i >= 0; i--) {
				var t = touches[i];
				var x = Math.floor(t.clientX) + 0.5;	//Coords in chrome is float
				var y = Math.floor(t.clientY) + 0.5;
				pts.push(new Point(x, y));
			};
			dispatchInteractEvent(self, evtName, [pts, self, evt]);
		};
	}

	function dispatchInteractEvent (self, name, argv) {
		for (i = 0; i < self.interactors.length; i++) {
			var a = self.interactors[i];
			a[name] && a[name].apply(a, argv);
		}
	}

	return PaintPanel;
});
