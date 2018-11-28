const PropFilter = require('../index');

describe('PropFilter test', () => {
	
	it('isStringNumber', () => {
		const f = new PropFilter();
		expect(f.isStringNumber('-1.5')).toBe(true);
		expect(f.isStringNumber('-.232')).toBe(true);
		expect(f.isStringNumber('.4362342134')).toBe(true);
		expect(f.isStringNumber('12351234.12351234.213512341234')).toBe(false);
		expect(f.isStringNumber(1.212123)).toBe(true);
		expect(f.isStringNumber(1235123512341234)).toBe(true);
		expect(f.isStringNumber(-0xf1)).toBe(true);
		expect(f.isStringNumber('FC')).toBe(true);
	});
	
	it('filter - attach', () => {
		const filter = new PropFilter();
		const ok = {};
		const notOk = {};
		
		expect(filter.isAttached()).toBe(false);
		
		filter.attach(ok);
		
		expect(filter.isAttached()).toBe(true);
		expect(filter.isAttached(ok)).toBe(true);
		expect(filter.isAttached(notOk)).toBe(false);
		
		filter.unattach();
		
		expect(filter.isAttached()).toBe(false);
		expect(filter.isAttached(ok)).toBe(false);
		
		filter.attach('what');
		
		expect(filter.isAttached()).toBe(false);
		
		const another = {};
		
		filter.attach(another);
		
		expect(filter.isAttached(another)).toBe(true);
		expect(filter.isAttached()).toBe(true);
		expect(filter.isAttached(ok)).toBe(false);
	});
	
	it('filter - has', () => {
		
		const filter = new PropFilter((f) => ({
			a               : {
				has: function (hasKey, data, key) {
					return false; // 强制不存在
				}
			},
			e               : {
				has: f.isNotUndefined
			},
			f               : {
				has: f.isNotUndefined
			},
			g               : {
				has: f.isNotNothing
			},
			'deep.0.deep2.5': {
				has: function (value, data, key) {
					return true;
				}
			}
		}));
		const obj = {
			a   : 'aa',
			b   : 'bb',
			c   : 'cc',
			d   : {
				d1: 'd1',
				d2: 'd2'
			},
			e   : undefined,
			f   : null,
			g   : null,
			deep: [
				{
					deep1: 'deep1',
					deep2: [0, 2, 3]
				}
			]
			
		};
		
		expect(() => {
			filter.has('a');
		}).toThrow('filter is not attached to a target');
		
		filter.attach(obj);
		
		expect(filter.has('a')).toBe(false);
		expect(filter.has('b')).toBe(true);
		expect(filter.has('e')).toBe(false);
		expect(filter.has('f')).toBe(true);
		expect(filter.has('g')).toBe(false);
		expect(filter.has('not_exists')).toBe(false);
		expect(filter.has('deep.0.deep2.5')).toBe(true);
	});
	
	it('filter - get', () => {
		const filter = new PropFilter((f) => ({
			a               : {
				get: function (value, data, key) {
					return value + '-';
				}
			},
			e               : {
				get: function (value, data, key) {
					return f.isNothing(value) ? '' : this.trim(value);
				}
			},
			f               : {
				get: f.trim
			},
			g               : {
				get: f.trim
			},
			'deep.0.deep2.2': {
				get: function (value, data, key) {
					return 'so deep?';
				}
			}
		}));
		const obj = {
			a   : 'aa',
			b   : 'bb',
			c   : 'cc',
			d   : {
				d1: 'd1',
				d2: 'd2'
			},
			e   : undefined,
			f   : null,
			g   : '   Hello World    ',
			deep: [
				{
					deep1: 'deep1',
					deep2: [0, 2, 3]
				}
			]
		};
		
		filter.attach(obj);
		
		expect(filter.get('a')).toBe('aa-');
		expect(filter.get('e')).toBe('');
		expect(filter.get('f')).toBe('');
		expect(filter.get('g')).toBe('Hello World');
		expect(filter.get('deep.0.deep2.2')).toBe('so deep?');
	});
	
	it('filter - set', () => {
		const filter = new PropFilter((f) => ({
			a       : {
				set: function (value, data, key) {
					return value + ' is ok';
				}
			},
			e       : {
				set: f.trim
			},
			f       : {
				set: Math.round
			},
			g       : {
				get: f.trim
			},
			'deep.0': {
				set: function (value, data, key) {
					return Object.assign({}, this.get(key), value);
				}
			}
		}));
		const obj = {
			a   : 'aa',
			b   : 'bb',
			c   : 'cc',
			d   : {
				d1: 'd1',
				d2: 'd2'
			},
			e   : undefined,
			f   : null,
			g   : '   Hello World    ',
			deep: [
				{
					deep1: 'deep1',
					deep2: [0, 2, 3]
				}
			]
		};
		
		filter.attach(obj);
		
		filter.set('a', 'a');
		expect(obj.a).toBe('a is ok');
		
		filter.set('e', '        so?        ');
		expect(obj.e).toBe('so?');
		
		filter.set('f', 15.22);
		expect(obj.f).toBe(15);
		
		filter.set('deep.0', {newItem: 'newItem'});
		expect(filter.get('deep.0')).toEqual({
			deep1  : 'deep1',
			deep2  : [0, 2, 3],
			newItem: 'newItem'
		});
		
	});
	
	async function asyncFunction() {
	
	}
	
	it('isFunction', () => {
		const f = new PropFilter();
		
		const a = () => {
		
		};
		
		const b = async () => {
		
		};
		
		expect(f.isFunction(a)).toBe(true);
		expect(f.isFunction(b)).toBe(true);
	});
	
	it('isObject, isEmptyObject, isPlainObject', () => {
		const f = new PropFilter();
		
		const a = () => {
		
		};
		
		const b = {};
		const c = [];
		
		const d = {a: 'a'};
		
		expect(f.isObject(a)).toBe(false);
		expect(f.isObject(b)).toBe(true);
		expect(f.isEmptyObject(b)).toBe(true);
		expect(f.isObject(c)).toBe(true);
		expect(f.isEmptyObject(c)).toBe(true);
		expect(f.isEmptyObject(d)).toBe(false);
		
		expect(f.isPlainObject(b)).toBe(true);
		expect(f.isPlainObject(c)).toBe(false);
		expect(f.isPlainObject(f)).toBe(false);
	});
	
	it('isArray', () => {
		const f = new PropFilter();
		
		const a = () => {
		
		};
		
		const b = {};
		const c = [];
		
		const d = {a: 'a'};
		
		const e = [1, 2, 3];
		
		expect(f.isArray(a)).toBe(false);
		expect(f.isArray(b)).toBe(false);
		expect(f.isArray(c)).toBe(true);
		expect(f.isEmptyArray(c)).toBe(true);
		expect(f.isArray(d)).toBe(false);
		
		expect(f.isArray(e)).toBe(true);
		expect(f.isEmptyArray(e)).toBe(false);
		
		expect(f.isEmptyArray(b)).toBe(false);
	});
	
	it('other is functions', () => {
		const f = new PropFilter();
		
		let a = true, b = false, c = null, d = undefined;
		
		expect(f.isBoolean(a)).toBe(true);
		expect(f.isBoolean(b)).toBe(true);
		expect(f.isBoolean(c)).toBe(false);
		expect(f.isBoolean(d)).toBe(false);
		
		a = /a/, b = new RegExp('ok'), c = null, d = undefined;
		
		expect(f.isRegExp(a)).toBe(true);
		expect(f.isRegExp(b)).toBe(true);
		expect(f.isRegExp(c)).toBe(false);
		expect(f.isRegExp(d)).toBe(false);
		
		class AnyError extends Error {
		}
		
		a = new Error, b = new AnyError('ok'), c = null, d = undefined;
		
		expect(f.isError(a)).toBe(true);
		expect(f.isError(b)).toBe(true);
		expect(f.isError(c)).toBe(false);
		expect(f.isError(d)).toBe(false);
	});
});
