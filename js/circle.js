
// draw circle and its listener
hc.graphic.Circle = function(center, radius, style) {
	hc.graphic.Drawable.call(this);
	if (style)
		this.style = style;
	this.center = center;
	this.radius = radius;
	this.path = function(ctx2d) {
		var c = this.center;
		ctx2d.arc(c.x, c.y, this.radius, 0, Math.PI * 2, true);
		/*
		 * var cr=2; ctx2d.moveTo(c.x+cr,c.y); ctx2d.arc(c.x, c.y, cr, 0,
		 * Math.PI * 2);
		 */
	};
	this.getCtrlPts = function(ctx) {
		var c = this.center;
		var r = this.radius;
		var cRing = new hc.graphic.ControlRing(c, ctx.toUILoc(c));
		var rRing = new hc.graphic.ControlRing(this, ctx.toUILoc({
			x : c.x + r,
			y : c.y
		}));
		cRing.radiusRing = rRing;
		cRing.center.dx = r * ctx.scale;
		cRing.center.dy = 0;
		cRing.move = function(ctx) {
			var c = this.target;// center
			var n = ctx.crd; // new coord
			c.x = n.x;
			c.y = n.y;

			var cc = this.center;
			var rc = this.radiusRing.center;
			rc.x = cc.x + cc.dx;
			rc.y = cc.y + cc.dy;
			// console.log('move:',cc);
		};
		rRing.centerRing = cRing;
		rRing.move = function(ctx) {
			var t = this.target;
			t.radius = hc.geom.dist(t.center, ctx.crd);
		};
		rRing.onCtrlEnd = function() {
			var rc = this.center;
			var cc = this.centerRing.center;
			cc.dx = rc.x - cc.x;
			cc.dy = rc.y - cc.y;
			// console.log(cc);
		};
		return [ cRing, rRing ];
	};
};

hc.graphic.Circle.creator = {
	onMousedown : function(ctx) {
		var l=ctx.loc;
		this.circle = new hc.graphic.Circle({x:l.x, y:l.y}, 2);
		this.cp= new hc.graphic.Circle(this.circle.center, 2);//centerp point
		this.cp.style.fillStyle='blue';
		delete this.cp.style.strokeStyle;
		this.circle.draw(ctx.topContext2d);
		this.cp.draw(ctx.topContext2d);
		this.center={x:ctx.crd.x, y:ctx.crd.y};
	},
	onDrag : function(ctx) {//console.log('dragging');
		var c=this.circle;
		c.radius=hc.geom.dist(c.center, ctx.loc);//console.log('radius'+c.radius);
		c.draw(ctx.topContext2d);
		this.cp.draw(ctx.topContext2d);
	//	ctx.topContext2d.fillRect(ctx.loc.x, ctx.loc.y, 10, 10);
	},
	onMouseup : function(ctx) {
		var c=new hc.graphic.Circle(this.center, this.circle.radius/ctx.scale);
		ctx.commit(c);
	}
};