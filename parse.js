var fs = require('fs');
var cheerio = require('cheerio');
var rimraf = require('rimraf');

var html = fs.readFileSync('./data/raw/main.html', 'utf8');

var uniq = function(a) {
	return a.sort().filter(function(item, pos, ary) {
		return !pos || item != ary[pos - 1];
	});
};

rimraf.sync('./data/halls/*');

$ = cheerio.load(html, { decodeEntities: false });

$('table').each(function(hall_index) {
	hall_index += 1;

	var array = $(this).find('tr').slice(1).map(function() {
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

	if (array.length == 0) return true;

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
		hall: hall_index,
		base_path: 'main',
		blocks: complex_items
	};

	fs.writeFile('./data/halls/' + hall_index + '.json', JSON.stringify(hall, null, 2), 'utf8', function(err) {
		if (err) throw err;

		console.log('json item ' + hall_index + ' saved');
	});

});