hc.graphic.Rectangle = function() {
	hc.graphic.Drawable.call(this);
	this.x = 0;
	this.y = 0;
	this.w =1;
	this.h=1;
	this.path = function(ctx2d) {
		ctx2d.rect(this.x, this.y, this.w, this.h);
	};
	this.getCtrlPts=function(ctx){
		
		return [];
	};
};

hc.graphic.Rectangle.creator = {
	onMousedown : function(ctx) {
		this.x=ctx.crd.x;
		this.y=ctx.crd.y;
		this.rect=new hc.graphic.Rectangle();
	},
	onDrag : function(ctx) {
		if(!this.x)
			return;
		var p=ctx.crd;
		var e=this.rect;
		e.x=Math.min(this.x, p.x);
		e.y=Math.min(this.y, p.y);
		e.w=Math.abs(this.x-p.x);
		e.h=Math.abs(this.y-p.y);
		ctx.transformTop();
		e.draw(ctx.topContext2d);
		ctx.topContext2d.restore();
	},
	onMouseup:function(){
		delete this.startPt;
		ctx.commit(this.rect);
	}
};

