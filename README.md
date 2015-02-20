WebCAD
======

Visit https://code.google.com/p/web-cad/ for more info.


<h1>WebCAD</h1>

	<div class="cad">

		<div class="control">

			<div>
				<h4>Elements</h4>
				<!-- <button onclick="ctx.setMode('view');">View</button>
				<button onclick="ctx.setMode('select');">Select</button> -->
				<button onclick="ctx.drawUsing(hc.graphic.Line.creator)" title="Draw a path, press mouse to add a point to the path. Press C to end path, alt+C to close path.">Line</button>
				<button onclick="ctx.drawUsing(hc.graphic.Circle.creator)" title="Drag to create circle">Circle</button>
				<button onclick="ctx.drawUsing(hc.graphic.Rectangle.creator)" title="Drag to create rectangle">Rectangle</button>
				<button onclick="ctx.drawUsing(hc.graphic.QuadraticCurve.creator)" title="Drag to create a line, then drag to control the curve">QuadraCurve</button>
			</div>

			<div>
				<h4>Style</h4>
				<span>Fill:</span>
				<button onclick="clearFill()">
				Clear
				</button>
				<label>Color:<input id="fillColor">
				</label><br> <span>Out line:</span>
				<button onclick="clearStroke();">
				Clear
				</button>
				<label>Color:<input id="strokeColor">
				</label>
			</div><div>
				<h4>Line Style</h4>
				Line width:<input
					onchange="ctx.drawable.style.lineWidth=this.value;" value="9"
					size="3" /> <label>Line Cap: <select
					onchange="ctx.drawable.style.lineCap=this.value;">
						<option value="butt">butt</option>
						<option value="round">round</option>
						<option value="square">square</option>
				</select> </label> <label>Line join: <select
					onchange="ctx.drawable.style.lineJoin=this.value;">
						<option value="miter">miter</option>
						<option value="round">round</option>
						<option value="bevel">bevel</option>
				</select> </label> <label>miterLimit: <input
					onchange="ctx.drawable.style.miterLimit=this.value;" value="10"
					size="3"> </label>
			</div>



			<div>
				<h4>Compositing</h4>

				<span>Alpha transparent:</span> <input type="range" min='0' max='1'
					value="1" step='0.1'
					onchange="this.title=this.value;ctx.context2d.globalAlpha=this.value;"
					id="globalAlpha" /> <br /> <label> Composite operation: <select>
						<option>source-atop</option>
						<option>source-in</option>
						<option>source-out</option>
						<option>source-over</option>
						<option>destination-atop</option>
						<option>destination-in</option>
						<option>destination-out</option>
						<option>destination-over</option>
						<option>lighter</option>
						<option>copy</option>
						<option>xor</option>
						<option>vendorName-operationName</option>
				</select> </label>
			</div>

			<div>
				<h4>Outline</h4>
				<canvas id='outline' title="Outline of the canvas."
					style="border: 1px #CF0 solid; width: 300px; height: 300px;"></canvas>
			</div>

		</div>

		<div><div id="crd"></div> <button onclick='ctx.restore()'>Restore</button> <input type=range id=scale /></div>
		<div id="canvas">
			<canvas></canvas>
			<canvas></canvas>
		</div>
	</div>
	<p>
		Scroll the wheel to scale the whole graph. Hold ctrl key and drag to move the whole graph.
	</p>
