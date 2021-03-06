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

var array = $('tr').slice(1).map(function() {
	var td = $(this).children('td');

	return {
		hall: +td.eq(6).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim().replace('Павильон № ', ''),
		path: td.eq(4).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),

		title: td.eq(0).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
		description: td.eq(1).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
		museum: td.eq(2).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
		year_place: td.eq(3).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),
		complex: td.eq(5).text().replace(/\t+/g, '').replace(/\n/g, ' ').trim(),

	};
}).toArray();

var halls = array.map(function(item) {
	return item.hall;
});

uniq(halls).forEach(function(item) {
	var items = array.filter(function(check_item) { return (check_item.hall == item && check_item.path != ''); });

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
		hall: item,
		base_path: 'main',
		blocks: complex_items
	};

	fs.writeFile('./data/halls/' + item + '.json', JSON.stringify(hall, null, 2), 'utf8', function(err) {
		if (err) throw err;

		console.log('json item ' + item + ' saved');
	});
});