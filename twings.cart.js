/**
 * User cart window
 */
TWINGS.cart = {
	holder : ''
};

/**
 * Create user cart initialy
 */
TWINGS.cart.init = function() {

	var out = '';
	var div = document.createElement('div');
	this.holder = div;
	div.setAttribute('id', 'user_cart');
	div.style.position = "absolute";
	div.style.display = "none";
	div.style.zIndex = 10000;
	div.style.top = 0;
	div.style.lef = 0;

	out += "<div><span id='r_name'></span> (<span id='screen_name'></span>)</div>";
	out += "<img id='avatar' width='50' height='50' style='padding: 5px 5px 0px 0px; float: left' /><span id='description'></div>";

	div.innerHTML = out;

	document.body.appendChild(div);

};

/**
 * Populate user cart with user data
 * 
 * @param {String}
 *            id name of class of elem
 */
TWINGS.cart.show = function(id) {

	var tId = TWINGS.data.getId(id); // twitter Id
	var data = TWINGS.data.storage.data[tId];
	console.log(data);
	this.holder.style.display = "block";

	this.e("screen_name").innerHTML = data.screen_name;
	this.e("r_name").innerHTML = data.name;

	this.e("description").innerHTML = data.description;
	this.e("avatar").setAttribute('src', '');
	this.e("avatar").setAttribute('src', data.profile_image_url);

};

/**
 * Return element by id
 * 
 * @param {String}
 *            id
 * @retunr {Object}
 */
TWINGS.cart.e = function(id) {
	return document.getElementById(id);
}