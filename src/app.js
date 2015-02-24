require.config({
    baseUrl:'src',
    paths: {
        // Core Libraries
        Hammer: '../lib/hammer.min',
        appbase: '../lib/appbase'
    },
    shim: {
        Hammer: {
            exports: "Hammer"
        }
    }
});

require(["graphic/PaintPanel", 'Hammer'], function (PaintPanel, Hammer) {
	var paintPanel = new PaintPanel(document.getElementById('main-scene'));
	var ctrlEls = document.querySelectorAll('#ctrl i');
	var selectedCtrlEl;
	for (var i = ctrlEls.length - 1; i >= 0; i--) {
		var ctrlEl = ctrlEls[i];
		var ctrlName = ctrlEl.dataset.ctrlName;
		if (ctrlName) {
			var hammertime = new Hammer(ctrlEl);
			hammertime.on('tap', function (evt) {
				selectedCtrlEl && selectedCtrlEl.classList.remove('selected');
				selectedCtrlEl = evt.target;
				selectedCtrlEl.classList.add('selected');
				var ctrlName = selectedCtrlEl.dataset.ctrlName;
				paintPanel.setInteractor(ctrlName);
			});
		}
	};

	var coordsEl = document.querySelector('#status #coords');
	paintPanel.touchIndicator.showTouches = function(pts) {
		coordsEl.innerHTML = '';
		for (var i = pts.length - 1; i >= 0; i--) {
			coordsEl.innerHTML += pts[i].x + ', ' + pts[i].y + '<br>';
		};
	};

	var sizeEl = document.querySelector('#status #size');
	paintPanel.touchIndicator.showPanelSize = function (w, h) {
		sizeEl.innerHTML = w + ', ' + h;
	};
});


/*

var ctx = new hc.graphic.DrawingContext(document.getElementById('canvas'));
		var crdLabel=document.getElementById('crd');
		crdLabel.innerHTML='';
		var crdText=document.createTextNode('000.00, 000.00');
		crdLabel.appendChild(crdText);
		ctx.onCursorMove=function(x,y){
			var n=5;//n digits
			crdText.nodeValue=x.toPrecision(n)+', '+y.toPrecision(n);
		}

		var scale=document.getElementById('scale');
		scale.min=ctx.scaleRange.min;
		scale.max=ctx.scaleRange.max;
		scale.onchange=function(){
			ctx.scale=this.value;
			ctx.modelContext2d.lineWidth=1/ctx.scale;
			ctx.repaint();
			this.title=(this.value*100).toFixed(1)+'%';
		}
		ctx.onScale=function(sc){
			scale.value=sc;
			scale.title=(sc*100).toFixed(1)+'%';
		}

		var picker = new hc.widget.ColorPicker();
		var fce=document.getElementById('fillColor');//fill color element
		var sce=document.getElementById('strokeColor');//stroke color element
		picker.regist(fce);
		picker.regist(sce);
		fce.onchange = function() {
			for(var i in ctx.selected){
			ctx.selected[i].style.fillStyle=this.value;
			}
			ctx.repaintTop();
		}
		sce.onchange = function() {
			for(var i in ctx.selected){
				ctx.selected[i].style.strokeStyle=this.value;
			}
		}
		function clearFill(){
			for(var i in ctx.selected){
				delete ctx.selected[i].style.fillStyle;
				}
				ctx.repaintTop();
		}
		function clearStroke(){
			for(var i in ctx.selected){
				delete ctx.selected[i].style.strokeStyle;
				}
		}
*/
