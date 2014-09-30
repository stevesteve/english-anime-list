var cache = getCache();

$('.animetitle').each(function (index) {
	var oldTitle = $(this).children('span').html();
	
	if (oldTitle in cache) {
		var newTitle = cache[oldTitle];
		displayTitle(this,oldTitle,newTitle);
	} else {
		getTitleFromAPI(this,oldTitle,displayTitle);
	}

	// $.ajax({
	//   url: "http://myanimelist.net/api/anime/search.xml?q=" + encodeURIComponent(title),
	//   context: this,
	// }).done(function(content) {
	// 	var title = $(this).children('span').html();
	// 	var newTitle;
	// 	try {
	// 		var data = $.parseXML(content);

	// 		newTitle = 
	// 			data
	// 				.children[0]
	// 					.children[0]
	// 						.getElementsByTagName('english')[0]
	// 							.innerHTML;

	// 	} catch (e) {
	// 		var r = /<english>([^<]*)<\/english>/;
	// 		var m = content.match(r);
	// 		if (m.length>1) {
	// 			newTitle = m[1];
	// 		} else {
	// 			$(this).after('&nbsp;<span style="color:red;">[error loading title]</span>');
	// 		}
	// 	}
	// 	displayTitle(this,newTitle);
	// });
});

function getTitleFromAPI (target,oldTitle,callback) {
	$.ajax({
	  url: "http://myanimelist.net/api/anime/search.xml?q=" + encodeURIComponent(oldTitle),
	  context: target,
	}).done(function(content) {
		var newTitle;
		try {
			var data = $.parseXML(content);

			newTitle = 
				data
					.children[0]
						.children[0]
							.getElementsByTagName('english')[0]
								.innerHTML;

		} catch (e) {
			var r = /<english>([^<]*)<\/english>/;
			var m = content.match(r);
			if (m.length>1) {
				newTitle = m[1];
			} else {
				newTitle = null;
			}
		}
		if (newTitle !== null) {
			addToCache(oldTitle,newTitle);
		}
		callback(target,oldTitle,newTitle);
	});
}

function addToCache (oldTitle,newTitle) {
	cache[oldTitle] = newTitle;
	sessionStorage.setItem('englishanimelist_cache',JSON.stringify(cache));
}

function getCache () {
	var cache = sessionStorage.getItem('englishanimelist_cache');
	if (cache) {
		try {
			cache = JSON.parse(cache);
		} catch (e) {
			initCache();
		}
	} else {
		initCache();
	}

	return cache;

	function initCache () {
		cache = {};
		sessionStorage.setItem('englishanimelist_cache',JSON.stringify(cache));
	}
}

function displayTitle (target,oldTitle,newTitle) {
	if (newTitle === null) {
		$(this).after('&nbsp;<span style="color:red;">[error loading title]</span>');
	} else if (newTitle) {
		$(target).children('span').html(newTitle);
		$(target).after('&nbsp;<span>[' + oldTitle + ']</span>');
	}
}