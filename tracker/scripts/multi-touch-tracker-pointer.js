/* multi-touch tracker with pointer events support */

var canvas,
	c, // c is the canvas' context 2D
	container;

var points = [];

function resetCanvas (e) {
	// resize the canvas - but remember - this clears the canvas too.
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//make sure we scroll to the top left.
	window.scrollTo(0,0);
}

function loop() {
	/* hack to work around lack of orientationchange/resize event */
	if(canvas.height != window.innerHeight) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	c.clearRect(0,0,canvas.width, canvas.height);
	c.strokeStyle = "#eee";
	c.lineWidth = "10";

	for (var i = 0; i<points.length; i++) {
		/* draw all circles */
		c.beginPath();
		c.arc(points[i].clientX, points[i].clientY, 50, 0, Math.PI*2, true);
		c.stroke();
	}

}

function positionHandler(e) {
	if (e.type == 'mousemove') {
		points[0] = e;
	} else if ((e.type == 'touchstart')||(e.type == 'touchmove')) {
		points = e.targetTouches;
		e.preventDefault();
	} else if ((e.type == 'pointerdown')||(e.type == 'pointermove')||(e.type == 'pointerup')
				||(e.type == 'MSPointerDown')||(e.type == 'MSPointerMove')||(e.type == 'MSPointerUp')) {
		/* fairly ugly, unoptimised approach of manually replicating the targetTouches array */
		switch (e.type) {
			case 'pointerdown':
			case 'MSPointerDown':
				points.push(e);
				break;
			case 'pointermove':
			case 'MSPointerMove':
				for (var i = 0, found = false; i<points.length; i++) {
					if (points[i].pointerId == e.pointerId) {
						points[i] = e;
						found = true;
						break;
					}
				}
				if (!found) {
					points.push(e);
				}
				break;
			case 'pointerup':
			case 'MSPointerUp':
				for (var i = 0; i<points.length; i++) {
					if (points[i].pointerId == e.pointerId) {
						points.splice(i,1);
						break;
					}
				}
				break;
		}
	}
}

function init() {
	canvas = document.createElement( 'canvas' );
	c = canvas.getContext( '2d' );
	container = document.createElement( 'div' );
	container.className = "container";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	container.appendChild(canvas);
	document.body.appendChild( container );
	c.strokeStyle = "#ffffff";
	c.lineWidth =2;
	
	/* feature detect - in this case not dangerous, as pointer is not exclusively touch */
	if ((window.navigator.msPointerEnabled)||(window.navigator.pointerEnabled)) {
		canvas.addEventListener('pointerdown',  positionHandler, false );
		canvas.addEventListener('pointermove',  positionHandler, false );
		canvas.addEventListener('pointerup',  positionHandler, false );
		canvas.addEventListener('MSPointerDown',  positionHandler, false );
		canvas.addEventListener('MSPointerMove',  positionHandler, false );
		canvas.addEventListener('MSPointerUp',  positionHandler, false );
	} else {
		canvas.addEventListener('mousemove',  positionHandler, false );
		canvas.addEventListener('touchstart', positionHandler, false );
		canvas.addEventListener('touchmove',  positionHandler, false );
	}
	setInterval(loop, 1000/35);
	
}

window.addEventListener('load',function() {
	/* hack to prevent firing the init script before the window object's values are populated */
	setTimeout(init,100);
},false);