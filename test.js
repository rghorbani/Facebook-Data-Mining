// var http = require("http");
// var https = require("https");

// // Utility function that downloads a URL and invokes
// // callback with the data.
// function download(url, callback) {
//   https.get(url, function(res) {
//     console.log("statusCode: ", res.statusCode);
//     console.log("headers: ", res.headers);
//     var data = "";
//     res.on('data', function (chunk) {
//       data += chunk;
//     });
//     res.on("end", function(d) {
//         // process.stdout.write(d);
//         console.log('\n\n');
//       callback(data);
//     });
//   }).on("error", function(e) {
//     console.error(e);
//     callback(null);
//   });
// }

// var cheerio = require("cheerio");

// var url = "https://graph.facebook.com/v2.1/me?access_token=CAACEdEose0cBAKle0b1nVcbwgUuDx7VcsZB9JZA7W7TEYgaMyqJMfO5sSZB5OUETLUaXe3DwfnXqv3jtwl1ZBOr9ZAGj2UgO3iMmJvsMUmlz230w9sJN1WGDZBhfqrCfamL3Tvh54ZATW6NZB4HGfppaE2tWE0OTV4ZBxN0VWIqQ8dFQF12NmPVUSV9oJbBZC2o2QgNsrQOrZCqmTp3rZApEF7exrxZCU5KiEYZBcZD&format=json&method=get&pretty=0&suppress_http_code=1"

// download(url, function(data) {
//   if (data) {
//     console.log(data);

//     var $ = cheerio.load(data);
//     $("a").each(function() {
//         console.log($(this).attr("href"));
//       });
			
//     console.log("done");
//   }
//   else console.log("error");  
// });

// var webdriverjs = require('webdriverjs');
// var options = { desiredCapabilities: { browserName: 'chrome' } };

// webdriverjs
// .remote(options)
// .init()
// .url('http://www.facebook.com/sanax.sa')
// .getAttribute('a', 'href', function(err, res) {
// 	console.log('Link: ' + res);
// })
// .end();

var unirest = require('unirest');

unirest.get('https://facebook.com/rgf7112/friends')
.headers({
	'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'cookie': 'datr=eA2YU2t4S0xwo_bd4U9vCZzL; lu=gAX7qjQ6GDoIzZ3mRA_P0jgQ; c_user=100001444848425; fr=0nuwNUkWbypZGbnFG.AWVWc018_Ym-DK-z91Q0LLzR-rs.BTmA2N.BW.AAA.0.AWVKNiTm; xs=55%3All6EFNRDRF-1XQ%3A2%3A1408131195%3A11035; csm=2; s=Aa57Mit3ruCTYw7l.BT9esn; act=1410442302164%2F84; p=-2; presence=EM410443266EuserFA21B01444848425A2EstateFDsb2F0Et2F_5b_5dElm2FnullEuct2F1410422279BEtrFA2loadA2EtwF2934056443EatF1410443266207G410443266633CEchFDp_5f1B01444848425F3CC; wd=1901x670',
	'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'
})
.encoding('utf-8')
.end(function (response) {
	console.log(response.code);
	if(response.code == 200) {
		var re = /facebook.com\/\S+\?fref\=pb/igm;
		var result = response.body.match(re);
		result.forEach(function(item) {
			var slash = item.indexOf('/');
			var question_mark = item.lastIndexOf('?');
			item = item.substring(slash+1, question_mark);
			console.log(item);
		});
	}
});

// var fs = require('fs');
var unirest = require('unirest');

var header = {
	'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
	'cookie': 'datr=eA2YU2t4S0xwo_bd4U9vCZzL; lu=gAX7qjQ6GDoIzZ3mRA_P0jgQ; c_user=100001444848425; fr=0nuwNUkWbypZGbnFG.AWVWc018_Ym-DK-z91Q0LLzR-rs.BTmA2N.BW.AAA.0.AWVKNiTm; xs=55%3All6EFNRDRF-1XQ%3A2%3A1408131195%3A11035; csm=2; s=Aa57Mit3ruCTYw7l.BT9esn; act=1410442302164%2F84; p=-2; presence=EM410443266EuserFA21B01444848425A2EstateFDsb2F0Et2F_5b_5dElm2FnullEuct2F1410422279BEtrFA2loadA2EtwF2934056443EatF1410443266207G410443266633CEchFDp_5f1B01444848425F3CC; wd=1901x670',
	'user-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'
};
var re = /facebook.com\/\S+\?fref\=pb/igm;
var max_depth = 1;

var findFriends = function(username, depth) {
	if(depth > max_depth)
		return [];
	unirest.get('https://facebook.com/'+username+'/friends')
	.headers(header)
	.encoding('utf-8')
	.end(function (response) {
		if(response && response.code == 200) {
			console.log(response.code);
			var result = response.body.match(re);
			var new_result = [];
			if(result.length > 0) {
				result.forEach(function(item) {
					var slash = item.indexOf('/');
					var question_mark = item.lastIndexOf('?');
					item = item.substring(slash+1, question_mark);
					new_result.push.apply(new_result, findFriends(item, depth+1));
				});
				result.push.apply(result, new_result);
			}
			return result;
		} else
			return [];
	});
};

fs.readFile('./page.html', 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}
	var re = /facebook.com\/\S+\?fref\=pb/igm;
	var result = data.match(re);
	result = result.filter(function (e, i, arr) {
		return arr.lastIndexOf(e) === i;
	});
	var new_result = [];
	result.forEach(function(item) {
		var slash = item.indexOf('/');
		var question_mark = item.lastIndexOf('?');
		item = item.substring(slash+1, question_mark);
		new_result.push.apply(new_result, findFriends(item, 0));
		// console.log(item);
	});
});