/**
 * The script to help you draw 2d graphics on the canvas element with mouse and
 * keys
 */
package('hc.graphic');

// !!! hc.graphic.DrawableGraphic.proto=proto; Problem will occur to this
// kind of inheritance all sub class will share the same 'styles' array in the

/**
 * param div element that hold the canvas
 * the drawing context is a drawing evironment, argument canvas may be canvas
 * html element or canvas id DrawingContext states: basic editing drawing, each
 * state has corresponding listener
 */
hc.graphic.DrawingContext = function(canvasContainer) {
	//preprocess
	canvasContainer.addEventListener('selectstart',function(evt){
		//console.log(evt.type,evt.timeStamp);
		evt.preventDefault();
		evt.stopPropagation();
		},true);
	var canvases=canvasContainer.getElementsByTagName('canvas');
	var tcv=canvases[0];	//top canvas
	var mcv=canvases[1]; //model canvas
	tcv.context=this;
	mcv.context=this;
	tcv.style.zIndex=2;
	mcv.style.zIndex=1;
	tcv.width=tcv.clientWidth;
	tcv.height=tcv.clientHeight;
	mcv.width=mcv.clientWidth;
	mcv.height=mcv.clientHeight;
	
	// memembers
	this.topContext2d=tcv.getContext('2d');	//temp canvas to draw the meter, location cross and drawable on creating
	this.modelContext2d=mcv.getContext('2d'); //model canvas to draw the stored drawables
//	this.tmpContext2d=tmcv.getContext('2d');
	this.drawables = []; // c:Drawble; holds all the 
	this.selected = []; // c:Drawble; the current focused drawable
	this.ctrlRings = []; // c:ControlRing subclass of Circle set of circles,// exist when editing
	this.lstns =[hc.graphic.DrawingContext.lstn.coordProvider, hc.graphic.DrawingContext.lstn.scaler,hc.graphic.DrawingContext.lstn.mover, hc.graphic.DrawingContext.lstn.editor];//!!! only the last listener is changable, this.constructor.lstn.viewer;
	this.drawLstnIndex=this.lstns.length-1;
	this.editStyle={strokeStyle:'green'};
	//this.dragStartLoc = null; // dragging start position stored in canvas html element
	this.scale = 1;// translate and scale
	this.scaleRange={min:0.2, max:20};
	this.translate = {x : 0, y : 0	};
	this.loc = {x : 0,y : 0};	//The mouse location in original UI coordination, reference will not be modified
	this.crd = {x : 0,y : 0};	//The coordinate after transformed, reference will not be modified
//	this.updateModel=false;	//request to repaint model
//	this.updateTop=false;	//request to repaint top canvas
	//hooks
	this.onCursorMove=function(x,y){
		console.log('Current coordination:'+x+','+y);
	};
	this.onScale=function(sc){
		console.log('Scale to:'+sc);
	};
	// member functions
	/**
	 * will be called when moving, usually not to be called explicitly
	 */
	this.repaintTop=function(){//console.log("paint top");
		var c = this.topContext2d;
		var cv=c.canvas;
		c.clearRect(0, 0, cv.width, cv.height);//alert('cleared');
		c.strokeStyle = 'rgba(255,255,255,0.6)';
		// draw meter
		var len = 15;
		var dist = 25;
		dist*=this.scale;
		c.beginPath();
		for ( var x = 0; x <= cv.width; x += dist) {
			c.moveTo(x, 0);
			c.lineTo(x, len);
		}
		//1 draw the vertical meter
		for ( var y = 0; y <= cv.height; y += dist) {
			c.moveTo(0, y);
			c.lineTo(len, y);
		}
		//console.log('stroke meter:'+c.gloabalAlpha);
		c.stroke();

		//2 draw the current location with cross
		var l = this.loc;
		c.beginPath();
		c.moveTo(0, l.y);
		c.lineTo(cv.width, l.y);
		c.moveTo(l.x, 0);
		c.lineTo(l.x, cv.height);
		c.stroke();
		
		var sc=this.selected.length;//selected count
		//console.log(sc);
		if(sc>0){
			this.transformTop();
			for(var i=0; i < sc;i++){
				this.selected[i].draw(c,this.editStyle);
			}
			c.restore();
		}
		
		//3 draw control rings
		for ( var i in this.ctrlRings) {
			this.ctrlRings[i].draw(c);
		}
	};
	
	this.transformTop=function(){
		var c=this.topContext2d;
		c.save();
		var t = this.translate;
		c.translate(0,c.canvas.height);
		c.scale(1, -1);
		c.translate(t.x, t.y);
		c.scale(this.scale, this.scale);
		c.lineWidth=1/this.scale;
	};
	
	this.repaintModel = function() {
		var c = this.modelContext2d;
		var cv=c.canvas;
		c.clearRect(0, 0, cv.width, cv.height);
		c.save();
		var t = this.translate;
		c.translate(t.x, t.y);
		c.scale(this.scale, this.scale);
		// 1 paint the drawables
		for ( var i in this.drawables) {
			this.drawables[i].draw(c);
		}
		
		//2 paint origin location
		var len=80;
	//	var off=10;
	//	c.translate(off, off); //console.log('translating..');
		c.beginPath();
		c.moveTo(0,len);
		c.lineTo(0,0);
		c.lineTo(len,0);
		c.strokeStyle='rgba(251,232,211,0.5)';
		c.stroke();
		
		c.restore();
	};

	// pt is in the ui
	this.scaleBy = function(x, y, fac) {
		var s=this.scale*fac;
		if(s<this.scaleRange.min || s>this.scaleRange.max)
			return;
		this.scale = s;
		// new translate
		var t = this.translate;
		t.x = x - (x - t.x) * fac;
		t.y = y - (y - t.y) * fac;
		this.modelContext2d.lineWidth = 1 / s;
		this.repaint();
		this.onScale(s);
	};
	
	this.restore=function(){
		this.scale=1;
		var t=this.translate;
		t.x=0;
		t.y=0;
		this.modelContext2d.lineWidth=1;
		this.repaint();
	};
	
	this.repaint=function(){
		this.repaintModel();
		this.repaintTop();
	};

	// transform the coordinate in the drawable to the ui point
	this.toUILoc = function(crd) {
		var x = crd.x;
		var y = crd.y;
		x = x * this.scale + this.translate.x;
		y = y * this.scale + this.translate.y;
		y = this.canvas.height - y;
		return {
			x : x,
			y : y
		};
	};

	/**
	 * 1 Drawing context state transform To drawinging pass drawable constructor
	 * as the argument
	 */
	this.drawUsing = function(lstn) {
		this.exitEdit();
		this.lstns[this.drawLstnIndex]=lstn;
		//delete this.lstns.
		delete tcv.title;
		if(lstn.onCreate)
			lstn.onCreate(this);
	};
	
	this.commit=function(d){
		this.drawables.push(d);
		this.repaintModel();
		this.lstns[this.drawLstnIndex]=hc.graphic.DrawingContext.lstn.editor;
	};

	this.setMode = function(mode) {
		switch (mode) {
		case 'view':
			this.lstn = this.constructor.lstn.viewer;
			if (this.drawable)
				delete this.drawable.altStyle;
			break;
		case 'select':
			this.lstn = this.constructor.lstn.selector;
			break;
		}
		;
		this.ctrlRings = [];
		this.repaintModel();
	};

	// 2 modes
	this.getMode = function() {
		switch (this.lstn) {
		case this.constructor.lstn.editor:
			return 'editing';
		default:
			return 'drawing';
		}
	};
	
	this.exitEdit=function(){
		if(this.selected.length==0)
			return;
		Array.prototype.push.apply(this.drawables,this.selected);
		this.selected=[];
		this.repaint();
	};

	/**
	 * 3 Drawing context state transform To editing pass drawable constructor as
	 * the argument
	 */
	this.edit = function(d) {
		this.lstn = this.constructor.lstn.editor;
		this.ctrlRings = d.getCtrlPts(this);
		this.drawable = d;
		d.altStyle = hc.graphic.Drawable.styles.editing;
		this.repaintModel();
	};
	
	//**********************************************************
	//init
	this.modelContext2d.translate(0, mcv.height);
	this.modelContext2d.scale(1, -1);
	this.repaintTop();
	this.repaintModel();
	/**
	 * Calculate the cursor position on the UI and in the canvas drawing
	 * context(after transformed), emphasize the location with cross
	 * 
	 * @param event
	 */
	tcv.onmousemove = function(evt) {//console.log('moving...');
		if(this.moving){
			console.warn('Already moving...');
			return;
		}
		this.moving=true;
		evt.preventDefault();
		//evt.stopPropagation();
		
		var ctx = this.context;
		ctx.repaintTop();
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];//console.log(l.onMousemove);
			if(l.onMousemove)
				l.onMousemove(ctx,evt);
			if(ctx.dragStartLoc && l.onDrag)
				l.onDrag(ctx, evt);
		}
		// update the coordinate label
		ctx.onCursorMove(ctx.crd.x, ctx.crd.y);
		this.moving=false;
	};

	tcv.onmousedown = function(evt) {
		var ctx = this.context;
		var l=ctx.loc;
		ctx.dragStartLoc={x:l.x, y:l.y};
		
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];
			if(l.onMousedown)
				l.onMousedown(ctx,evt);
		}
		//ctx.updateUI();
	};

	tcv.onmouseup = function(evt) {
		var ctx=this.context;
		delete ctx.dragStartLoc;
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];
			if(l.onMouseup)
				l.onMouseup(ctx,evt);
		}
		//ctx.updateUI();
	};

	// not support in Firefox
	tcv.onmousewheel = function(evt) {
		evt.preventDefault();
		
		var ctx = this.context;
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];
			if(l.onWheel)
				l.onWheel(ctx, evt.wheelDelta > 0);
		}
		//ctx.updateUI();
	};
	
	// not supported in chrom opera
	tcv.addEventListener('DOMMouseScroll', function(evt) {
		evt.preventDefault();
		
		var ctx = this.context;
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];
			if(l.onWheel)
				l.onWheel(ctx, evt.detail > 0);
		}
		//ctx.updateUI();
	}, false);

	tcv.onmouseover = function(evt) {
		this.cursorIn = true;
		
		var ctx = this.context;
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];
			if(l.onMouseover)
				l.onMouseover(ctx, evt);
		}
	};

	tcv.onmouseout = function(evt) {
		this.cursorIn = false;
		
		var ctx = this.context;
		delete ctx.dragStartLoc;
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];
			if(l.onMouseout)
				l.onMouseout(ctx, evt);
		}
		//ctx.updateUI();
	};

	window.addEventListener('keydown', function(evt) {
		if (!tcv.cursorIn)
			return;
	
		var ctx = tcv.context;
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];
			if(l.onKeydown)
				l.onKeydown(ctx, evt);
		}
		//ctx.updateUI();
	}, false);

	window.addEventListener('keyup', function(evt) {
		if (!tcv.cursorIn)
			return;
	
		var ctx = tcv.context;
		var lts=ctx.lstns;
		var l;
		for(var i in lts){
			l=lts[i];
			if(l.onKeyup)
				l.onKeyup(ctx, evt);
		}
		//ctx.updateUI();
	}, false);

};

// The listener for different state of the drawing context
// general listener for canvas when not drawing
// used when canvas is not drawing, not selected
hc.graphic.DrawingContext.lstn = {
	//Help move the view
	mover : {
		// for translating the whole canvas
		onMousedown : function(ctx, evt) {
			if(!evt.ctrlKey)
				return;
			var t = ctx.translate;
			this.sT = {
				x : t.x,
				y : t.y
			};// start position
			//console.log('start drag');
		},
		onDrag : function(ctx) {  //console.log(this.sT);
			if(!this.sT)
				return;//console.log('translating..');
			// Set the new translation
			var t = ctx.translate;
			var o = ctx.dragStartLoc;// original
			var n = ctx.loc; // new location
			t.x = this.sT.x + n.x - o.x;
			t.y = this.sT.y + o.y - n.y;

			ctx.repaintModel();
			
			var ctx2d = ctx.topContext2d;// console.log(ctx2d);
			ctx2d.beginPath();
			ctx2d.moveTo(o.x, o.y);
			ctx2d.lineTo(n.x, n.y);
			ctx2d.stroke();
		},
		onKeydown:function(ctx, evt){
			if (17 == evt.keyCode){//press ctrl key, change the cursor
				this.prvCursor=evt.target.style.cursor;
				ctx.topContext2d.canvas.style.cursor='move';
			}
		},
		onKeyup:function(ctx, evt){
			if (17 == evt.keyCode){//ctrl key, restore the cursor
				ctx.topContext2d.canvas.style.cursor=this.prvCursor;//console.log('ctrl');
			}
		},
		onMouseup:function(ctx, evt){
			delete this.sT;
		}
	},
	scaler:{
		onWheel:function(ctx, up){
			var fac = 0.1;
			if (up)
				fac += 1;
			else
				fac = 1 - fac;
			var l = ctx.loc;
			ctx.scaleBy(l.x,ctx.topContext2d.canvas.height - l.y, fac);
		}
	},
	
	editor : {
		hoverStyle:{strokeStyle:'blue'},
		hovered:null,
		onMousemove : function(ctx) {
			/**
			 * find the drawble under the mouse if not drawing and change the
			 * style of this drawable
			 */
			var ctx2d = ctx.topContext2d;
			delete this.hovered;
			var ds = ctx.drawables;
			
			for ( var i in ds) {
				if (ds[i].isPointIn(ctx.crd, ctx2d)) {
					ctx.transformTop();
					ctx2d.lineWidth=2/ctx.scale;
					this.hovered=i;
					ds[i].draw(ctx2d, this.hoverStyle);
					ctx2d.restore();
					break;
				}
			}
			
		},
		onMousedown : function(ctx) {
			if(!this.hovered)
				return;
			ctx.selected.push(ctx.drawables[this.hovered]);
			delete ctx.drawables[this.hovered];
			ctx.repaint();
			this.onMousemove(ctx);
		},
		onKeyup:function(ctx,evt){
			if(evt.keyCode==27){//Esc key
				ctx.exitEdit();
			}
		}
	},
	//calculte the coordination from ui location and update ctx.crd, ctx.loc.
	coordProvider:{
		onMousemove:function(ctx, evt){
			var src=evt.target; //console.log(evt, {e:src});
			//1 calculate the current mouse position for app use
			var l=ctx.loc;
			l.x=evt.layerX || evt.offsetX;
			l.y=evt.layerY || evt.offsetY;
			
			//2 the current mouse location in the drawable coordinate
			var crd=ctx.crd;
			crd.x=l.x;
			crd.x -= ctx.translate.x;
			crd.x /= ctx.scale;
			crd.y = src.height - l.y;
			crd.y -= ctx.translate.y;
			crd.y /= ctx.scale;
		}
	},
	editor2 : {
		onMousemove : function(ctx) {
			/**
			 * find the drawble under the mouse if not drawing and change the
			 * style of this drawable
			 */
			var ctx2d = ctx.canvas.getContext('2d');
			var prv = ctx.hoverRing;
			delete ctx.hoverRing;
			var nHover;
			var rings = ctx.ctrlRings;
			for ( var i in rings) {// console.log(ctx.drawables[i],'contains',ctx.loc,':',ctx.drawables[i].isPointIn(ctx.loc,
									// ctx2d));
				if (rings[i].isPointIn(ctx.loc, ctx2d)) {
					nHover = rings[i];
					break;
				}
			}
			ctx.hoverRing = nHover;
			// hover the drawable or not
			if (nHover != prv) {
				if (prv)
					delete prv.altStyle;
				if (nHover)
					nHover.altStyle = hc.graphic.ControlRing.styles.hover;
				ctx.repaint();
			}
		},
		onDrag : function(ctx) {
			// control points
			var rings = ctx.ctrlRings;
			var hoverR = ctx.hoverRing;
			if (hoverR) {
				// ctx.canvas.style.cursor='cursor'; to fix chrome cursor on
				// dragging
				var rc = hoverR.center
				var lc = ctx.loc;
				rc.x = lc.x;
				rc.y = lc.y;
				hoverR.move(ctx);
				ctx.repaint();
			}
		},
		onMousedown : function(ctx) {
			var ctx2d = ctx.canvas.getContext('2d');
			if (!ctx.drawable.isPointIn(ctx.crd, ctx2d) && !ctx.hoverRing) {
				ctx.setMode('view');
			}
		},
		onMouseup : function(ctx) {
			var hRing = ctx.hoverRing;
			if (hRing && hRing.onCtrlEnd) {
				hRing.onCtrlEnd();
			}
		}
	}
};

// The abstract graphic object which can be drawn to the canvas directly
// !important class
hc.graphic.Drawable = function() {
	this.style = {
		strokeStyle : 'pink'
	};
	//this.altStyle = {}; // not to stored
	this.styles = hc.graphic.Drawable.styles;
	// called by sub
	this.draw = function(ctx2d,altStyle) {//console.log(this);
		ctx2d.beginPath();
		this.path(ctx2d);
		//ctx2d.closePath();
		this.styles.apply(this.style, ctx2d, altStyle);
		if (this.style.strokeStyle) {
			//console.log('stroke '+this.constructor.name+' :'+ctx2d.strokeStyle);
			ctx2d.stroke();
		}

		if (this.style.fillStyle)
			ctx2d.fill();
	};

	this.isPointIn = function(pt, ctx2d) {
		ctx2d.beginPath();
		this.path(ctx2d);// console.log(JSON.stringify(pt),ctx2d.isPointInPath(pt.x,
							// pt.y));
		ctx2d.closePath();
		return ctx2d.isPointInPath(pt.x, pt.y);
	};

	this.path = function(ctx2d) {
		throw new Error('This method should always be overriden');
	};

	this.getCtrlPts = function() {
		return [];
	};
};

// style control system
hc.graphic.Drawable.styles = {
	dft : {// the default style
		// compositing
		globalAlpha : 1.0,
		globalCompositeOperation : 'source-over',

		// colors and styles
		strokeStyle : '#fff',
		fillStyle : 'yellow',

		// line styles
		// lineWidth : 1,
		lineCap : 'round',// butt, round, square
		lineJoin : 'round',// round, bevel, miter
		miterLimit : 10
	},
	hover : {
		strokeStyle : 'blue',
		lineWidth : 1
	},
	editing : {
		strokeStyle : 'green'
	},
	/**
	 * apply this custom style to the 2d context
	 * 
	 * @param custom
	 * @param ctx2d
	 */
	apply : function(custom, ctx2d, alt) {
		var s;
		for (s in this.dft) {
			ctx2d[s] = custom[s] || this.dft[s];
		}
		if (alt)
			for (s in alt) {
				ctx2d[s] = alt[s];
			}
	}
};




/**
 * this drawable is drawn on the UI coordination center is in the ui coordinate
 */
hc.graphic.ControlRing = function(target, center) {
	this.target = target;// may be a point by default, or a drawable
	hc.graphic.Circle.call(this, center, 6, this.constructor.styles.dft);
	this.move = function(ctx) {// default consider the target as a point to
								// control
		var t = this.target;
		var c = ctx.crd;
		t.x = c.x;
		t.y = c.y;
	};
};
//
hc.graphic.ControlRing.styles = {
	dft : {
		globalAlpha : 0.8,
		strokeStyle : 'pink'
	},
	hover : {
		strokeStyle : 'blue'
	}
};
