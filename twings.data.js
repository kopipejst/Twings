var TWINGS = TWINGS || {};

/**
 * Create panel object where we will create all element for graph
 */
TWINGS.data = {
	storageTemp : {
		'friends' : [],
		'followers' : []
	},
	screenName : '',
	storage : {}
};

/**
 * Get all data for user since that twitter returns chunks of 100
 * 
 * @param {string}
 *            screen_name
 * @param {number}
 *            cursor
 * @param {string}
 *            ff followers or friends
 */
TWINGS.data.getData = function(screenName, cursor, ff) {

	ff = ff || 'followers';
	cursor = cursor || -1;
	this.screenName = screenName;

	if (localStorage['TWINGS_' + screenName]) {
		TWINGS.data.storage = JSON.parse(localStorage['TWINGS_' + screenName]);
		TWINGS.data.animate();
		return '';
	}

	var tUrl = "http://api.twitter.com/1/statuses/" + ff + ".json?screen_name="
			+ screenName + "&cursor=" + cursor;
	
	log(screenName);
	window.location.hash = screenName;

	$.ajax({
		url : tUrl,
		dataType : 'jsonp',
		success : function(data) {

			log('loading ' + cursor);
			log('loading next ' + data.next_cursor + ' ' + ff);

			TWINGS.data.storageTemp[ff].push(data.users);

			if (data.next_cursor > 0 && ff === 'followers') {
				TWINGS.data.getData(screenName, data.next_cursor);
			} else {
				if (data.next_cursor === 0 && ff === 'friends') {
					TWINGS.data.prepareData();
					return '';
				}
				TWINGS.data.getData(screenName, data.next_cursor, 'friends');
			}
		}

	});

	return '';

};


/**
 * Merge all data in one array
 */
TWINGS.data.prepareData = function() {

	var tempData = {
		data : {},
		count : {}
	};
	var data = this.storageTemp.friends;
	var d = '';
	var total = {
		friends : 0,
		followers : 0,
		following : 0
	};

	for ( var i = 0; i < data.length; i++) {
		for ( var j = 0; j < data[i].length; j++) {
			d = data[i][j];
			d.type = 'following';
			total.following++;
			tempData.data[d.id] = d;
		}
		log('merging data');
	}

	data = this.storageTemp.followers;

	for ( var i = 0; i < data.length; i++) {
		for ( var j = 0; j < data[i].length; j++) {
			d = data[i][j];
			if (tempData.data[d.id]) {
				d.type = 'friend';
				total.friends++;
				total.following--;
			} else {
				d.type = 'follower';
				total.followers++;
			}
			tempData.data[d.id] = d;
		}
	}

	tempData.count = total;
	tempData.count.totals = total.followers + total.friends + total.following;

	if (localStorage) {
		localStorage.clear();
		localStorage['TWINGS_' + this.screenName] = JSON.stringify(tempData);
	}

	TWINGS.data.storage = tempData;
	TWINGS.data.animate();

	return tempData;

};

/**
 * Get Twitter id from DOM elem id
 * 
 * @param {String}
 *            id
 * @return {String}
 */
TWINGS.data.getId = function(id) {

	return id.split("_")[1];

};

/**
 * Show rings with animation
 */
TWINGS.data.animate = function(){
	var cnt = 10;
	var e = setInterval( function(){
		TWINGS.panel.create(cnt);
		cnt--;
		if (cnt < 1){
			clearInterval(e);
		}
	}, 50);	
};

/**
 * Get screen_name by id
 * 
 * @param {String}
 *            id
 * @return {String}
 */
TWINGS.data.getScreenName = function(id) {
	return TWINGS.data.storage.data[id].screen_name;
};