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

var parseFile = function(base_path, html_path) {
	var $ = cheerio.load(fs.readFileSync(html_path, 'utf8'), { decodeEntities: false });

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
	async.apply(parseFile, 1, './data/raw/1.html'),
	async.apply(parseFile, 2, './data/raw/2.html'),
	// async.apply(parseFile, 3, './data/raw/3.html'),
	// async.apply(parseFile, 4, './data/raw/4.html'),
	// async.apply(parseFile, 5, './data/raw/5.html'),
	// async.apply(parseFile, 6, './data/raw/6.html'),
	// async.apply(parseFile, 7, './data/raw/7.html'),
	// async.apply(parseFile, 8, './data/raw/8.html')
]);