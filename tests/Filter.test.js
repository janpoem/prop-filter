import Filter from '../src/Filter.mjs';

test('filter using trait test', () => {

	const o = {
		a: function () {
			console.log(this);
		}
	}

	const f = new Filter();
	f.using(o);

	f.a();
});