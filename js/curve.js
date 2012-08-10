hc.graphic.QuadraticCurve=function(){
	hc.graphic.Drawable.call(this);
	this.from={x:0,y:0};
	this.to={x:0,y:0};
	this.cp={x:0, y:0}; //control point
	this.path=function(ctx2d){
		//start, end, control point
		var s=this.from, e=this.to, c=this.cp;
		ctx2d.moveTo(s.x, s.y);
		ctx2d.quadraticCurveTo(c.x, c.y, e.x, e.y);
	};
};

hc.graphic.QuadraticCurve.creator={
		onMousedown:function(ctx){
			if(this.phase==1){
				this.curve.cp=ctx.crd;
			}else{
				this.curve=new hc.graphic.QuadraticCurve();
				this.curve.from={x:ctx.crd.x, y:ctx.crd.y};
				this.curve.cp=this.curve.from;
				this.curve.to=ctx.crd;
				this.phase=0;
			}
		},
		onMousemove:function(ctx){
			if(this.curve){
				ctx.transformTop();
				this.curve.draw(ctx.topContext2d);
				ctx.topContext2d.restore();
			}
		},
		onMouseup:function(ctx){
			if(this.phase==0){
				this.curve.to={x:ctx.crd.x, y:ctx.crd.y};
			}else{
				this.curve.cp={x:ctx.crd.x, y:ctx.crd.y}
				ctx.commit(this.curve);
			}
			this.phase++;
		}
};