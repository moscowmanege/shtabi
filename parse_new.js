var fs = require('fs');
var cheerio = require('cheerio');
var rimraf = require('rimraf');
var async = require('async');

var uniq = function(a) {
	return a.sort().filter(function(item, pos, ary) {
		return !pos || item != ary[pos - 1];
	});
};

rimraf.sync('./data/halls/*');

var parseFile = function($, base_path) {

	var array = $('tr').slice(1).map(function() {
		var td = $(this).children('td');

		return {
			path: td.eq(4).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),

			title: td.eq(0).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
			description: td.eq(1).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
			museum: td.eq(2).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
			year_place: td.eq(3).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
			complex: td.eq(5).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),

		};
	}).toArray();

	var items = array.filter(function(check_item) { return (check_item.path != ''); });

	var complexes = items.map(function(cx_item) {
		return cx_item.complex;
	});

	var complex_items = uniq(complexes).map(function(complex) {
		var elems = items.filter(function(c_item) { return c_item.complex == complex; });

		return {
			title: elems[0].complex,
			elems: elems
		};
	});

	var hall = {
		hall: base_path,
		base_path: base_path,
		blocks: complex_items
	};

	fs.writeFile('./data/halls/' + base_path + '.json', JSON.stringify(hall, null, 2), 'utf8', function(err) {
		if (err) throw err;

		console.log('json item ' + base_path + ' saved');
	});
};

async.parallel([

	function(callback) {
		var $ = cheerio.load(fs.readFileSync('./data/raw/1.html', 'utf8'), { decodeEntities: false });
		callback(null, $);
	},
	function(callback) {
		var $ = cheerio.load(fs.readFileSync('./data/raw/2.html', 'utf8'), { decodeEntities: false });
		callback(null, $);
	},
	// function(callback) {
	// 	var $ = cheerio.load(fs.readFileSync('./data/raw/3.html', 'utf8'), { decodeEntities: false });
	// 	callback(null, $);
	// },
	// function(callback) {
	// 	var $ = cheerio.load(fs.readFileSync('./data/raw/4.html', 'utf8'), { decodeEntities: false });
	// 	callback(null, $);
	// },
	// function(callback) {
	// 	var $ = cheerio.load(fs.readFileSync('./data/raw/5.html', 'utf8'), { decodeEntities: false });
	// 	callback(null, $);
	// },
	// function(callback) {
	// 	var $ = cheerio.load(fs.readFileSync('./data/raw/6.html', 'utf8'), { decodeEntities: false });
	// 	callback(null, $);
	// },
	// function(callback) {
	// 	var $ = cheerio.load(fs.readFileSync('./data/raw/7.html', 'utf8'), { decodeEntities: false });
	// 	callback(null, $);
	// },
	// function(callback) {
	// 	var $ = cheerio.load(fs.readFileSync('./data/raw/8.html', 'utf8'), { decodeEntities: false });
	// 	callback(null, $);
	// }

], function(err, results) {
	async.parallel([
		async.apply(parseFile, results[0], 1),
		async.apply(parseFile, results[1], 2),
		// async.apply(parseFile, results[2], 3)
		// async.apply(parseFile, results[3], 4),
		// async.apply(parseFile, results[4], 5),
		// async.apply(parseFile, results[5], 6)
		// async.apply(parseFile, results[6], 7),
		// async.apply(parseFile, results[7], 8),
	]);
});