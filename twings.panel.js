/**
 * Define TWINGS namespace
 * 
 * @namespace global app namespace
 */
var TWINGS = TWINGS || {};

/**
 * Data holder
 * 
 * @property {Object} data
 */
TWINGS.data = {};

/**
 * Create panel object where we will create all element for graph
 */
TWINGS.panel = {
	canvas : ''
};

/**
 * Initialization and seting panel element
 * 
 * @param {String}
 *            id
 */
TWINGS.panel.init = function(id) {

	id = id || 'canvas';
	this.canvas = document.getElementById(id);
	TWINGS.cart.init();

};

/**
 * Create image
 * 
 * @param {object}
 *            data
 */
TWINGS.panel.create = function(anim) {
	
	anim = anim || 1;
	
	$(this.canvas).empty();

this.settings.anim = anim;

	this.layer('path');
	this.layer('text');
	this.layer('circles');

};

/**
 * Setting for panel
 * 
 * @property {Object} settings
 */
TWINGS.panel.settings = {
	maxRadius : 330,
	steps : 5,
	distance : 35,
	type : {
		friend : {
			color : '#85BBFF',
			radius : 12
		},
		follower : {
			color : '#E4FF6B',
			radius : 8
		},
		following : {
			color : '#9CB239',
			radius : 10
		}
	},
	colors : {
		paths : '#CAE8E8',
		text : '#000000'
	},
	order : 1,
	center : {
		x : 450,
		y : 350
	}
};

/**
 * Draw layer by layer ( lines, text, circles )
 * 
 * @param {String}
 *            layer
 */
TWINGS.panel.layer = function(layer) {

	var dLen = TWINGS.data.storage.count.totals, // number of TWINGSs
		i = 0, // object hash (key)
		x = 0, // x coordinate
		y = 0, // y coordinate
		angle = 0, // translate angle
		t = 0, // counter
		moveR = 0,
		orderR = 0,
		datas = TWINGS.data.storage.data, // data object
		id = 0, // id of element
		order = this.settings.order,
		anim = this.settings.anim,
		r = 0; // TWINGS radius

	for (i in datas) {

		id = datas[i].id;

		t++;

		orderR = order > 0 ? t : i;

		moveR = (orderR % this.settings.steps) * this.settings.distance;
		angle += Math.PI * 2 * (1 / dLen);
		radius = this.settings.maxRadius - moveR;

		x = this.settings.center.x + radius * Math.sqrt(anim) * Math.sin(angle);
		y = this.settings.center.y + radius * Math.sqrt(anim) * -Math.cos(angle);

		switch (layer) {
			case 'circles':
				this.addCircle(x, y, this.settings.type[datas[i].type].color, id,
						this.settings.type[datas[i].type].radius);
				break;
			case 'path':
				this.addPath(this.settings.center.x, this.settings.center.y, x, y,
						id, this.settings.colors.paths);
				break;
			case 'text':
				this.addText(x - 20, y + 12, this.settings.colors.text, id,
						datas[i].screen_name);
				break;
		}

	}

};

/**
 * Preparing and draw circle element
 * 
 * @param {Number}
 *            x x-coordinate
 * @param {Number}
 *            y y-coordinate
 * @param {String}
 *            color
 * @param {String}
 *            id
 */
TWINGS.panel.addCircle = function(x, y, color, id, radius) {

	var circle = document.createElementNS('http://www.w3.org/2000/svg',
			'circle');
	radius = radius || 7;
	id = 'circle_' + id;

	circle.setAttribute('cx', x);
	circle.setAttribute('cy', y);
	circle.setAttribute('r', radius);
	circle.setAttribute('fill', color);
	circle.setAttribute('stroke', '#333333');
	circle.setAttribute('id', id);
	circle.style.cursor = 'pointer';

	circle.addEventListener('click', function() {
		window.open("http://twitter.com/intent/user?user_id="
				+ TWINGS.data.getId(this.getAttribute('id')));
	}, false);
	circle.addEventListener('mouseover', function() {
		this.setAttribute('r', this.getAttribute('r') * 1.5);
		TWINGS.cart.show(this.getAttribute('id'));
		this.style.opacity = 0.8;
	}, false);

	circle.addEventListener('mouseout', function() {
		this.setAttribute('r', radius);
		TWINGS.cart.holder.style.display = "none";
		this.style.opacity = 1;
	}, false);

	circle.addEventListener('mousemove', function(event) {
		TWINGS.cart.holder.style.top = event.pageY + 5 + 'px';
		TWINGS.cart.holder.style.left = event.pageX + 5 + 'px';

	}, false);

	this.canvas.appendChild(circle);
};

/**
 * Create and draw text SVG object
 * 
 * @param {Number}
 *            x
 * @param {Number}
 *            y
 * @param {String}
 *            color
 * @param {String}
 *            id
 * @param {String}
 *            text
 */
TWINGS.panel.addText = function(x, y, color, id, label) {

	var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	var textNode = document.createTextNode(label);
	color = color || 'black';

	text.setAttribute('x', x);
	text.setAttribute('y', y);
	text.setAttribute('fill', color);
	text.setAttribute('id', 'text_' + id);
	text.setAttribute('font-size', 11);
	text.appendChild(textNode);

	this.canvas.appendChild(text);
};

/**
 * Create and draw path SVG object
 * 
 * @param {Number}
 *            x1
 * @param {Number}
 *            y1
 * @param {Number}
 *            x2
 * @param {Number}
 *            y2
 * @param {String}
 *            color
 */
TWINGS.panel.addPath = function(x1, y1, x2, y2, id, color) {

	var line = document.createElementNS('http://www.w3.org/2000/svg', 'path');

	line.setAttribute('d', 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2);
	line.setAttribute('fill', 'none');
	line.setAttribute('id', 'path_' + id);
	line.style.stroke = color;

	line.addEventListener('click', function() {
		this.style.stroke = "red";
	}, false);

	this.canvas.appendChild(line);

};
