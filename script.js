var unirest = require('unirest');

var config = require('./config');

var re = /facebook.com\/\S+\?fref\=pb/igm;
var max_depth = 1;

var findFriends = function(username, depth) {
	if(depth > max_depth)
		return [];
	unirest.get('https://facebook.com/'+username+'/friends')
	.headers(config.header)
	.encoding(config.encoding)
	.end(function (response) {
		if(response && response.code == 200) {
			console.log(response.code);
			var result = response.body.match(re);
			var new_result = [];
			result.forEach(function(item) {
				var slash = item.indexOf('/');
				var question_mark = item.lastIndexOf('?');
				item = item.substring(slash+1, question_mark);
				new_result.push.apply(new_result, findFriends(item, depth+1));
			});
			result.push.apply(result, new_result);
			return result;
		} else
			return [];
	});
};

findFriends('rgf7112', 0);