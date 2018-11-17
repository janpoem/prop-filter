'use strict';

import tc from 'typechecker';
import trim from 'php-trim-plus';
import deepmerge from 'deepmerge';

const isArray = Array.isArray;
const isObject = tc.isObject;
const isString = tc.isString;

const TraitsFlag = '__traits__';

function parseMixInTraitName(name) {
	let result = {
		from: '',
		as: ''
	};
	if (isString(name) && name !== '') {
		if (/=\>/.test(name))
			name = name.split(/[\s\t]+=\>[\s\t]+/);
		else {
			result.from = name;
			result.as = name;
		}
	}
	if (isArray(name) && name.length >= 1) {
		result.from = name[0];
		result.as = name.length >= 2 ? name[1] : name[0];
	}
	return result;
}

/**
 * 
 * ```js
 * mixInTrait({}, anyObject, [
 * 		'method1',
 * 		{
 * 			'name': 'method2',
 * 			'as' : 'asMethodName2',
 * 		},
 * 		['method3', 'asMethodName3'],
 * 		'method4 => asMethondName4'
 * ])
 * ```
 * 
 * @param {{}} source 
 * @param {{}} trait 
 * @param {array} keys 
 */
function mixInTrait(source, trait, keys = [], isReplace = false) {
	if (!isObject(source))
		throw new Error('mixIn source should be an object!');
	if (typeof source[TraitsFlag] === 'undefined' || !isArray(source[TraitsFlag]))
		source[TraitsFlag] = [];
	let traits = source[TraitsFlag];
	if (traits.indexOf(trait) > -1) return source;

	if (!isArray(keys)) {
		isReplace = !!keys;
		keys = [];
	}

	if (keys.length <= 0) keys = Object.getOwnPropertyNames(trait);

	keys.forEach(key => {
		let parse = parseMixInTraitName(key);
		if (typeof trait[parse.from] === 'function' && (typeof source[parse.as] === 'undefined' || isReplace)) {
			source[parse.as] = trait[parse.from];
		}
	});
	return source;
}

export default class Filter {

	constructor(filters, target) {
		if (typeof this.filters === 'undefined' || !this.isObject(this.filters))
			this.filters = {};
		if (typeof this.target === 'undefined' || !this.isValidTarget(this.target))
			this.target = null;

		if (filters)
			this.setFilters(filters);
		if (target)
			this.attach(target);
	}

	using(trait, keys = [], isReplace = false) {
		return mixInTrait(this, trait, keys);
	}

	setFilters(filters) {
		if (this.isFunction(filters)) filters = filters();
		if (!this.isEmptyObject(filters))
			this.filters = this.merge(this.filters || {}, filters);
		return this;
	}

	isValidTarget(target) {
		return this.isObject(target);
	}

	attach(target) {
		if (this.isValidTarget(target))
			this.target = target;
		return this;
	}

	unattach() {
		this.target = null;
		return this;
	}

	isAttached(target) {
		if (target) return this.target === target;
		return this.isValidTarget(this.target);
	}

	merge(source, ...items) {
		const length = items.length;
		if (length <= 0) return source;
		return deepmerge.all(source, items);
	}

	getFilter(prop) {
		return this.filters[prop] || {};
	}

	get(prop, defaultValue) {
		if (!this.isAttached())
			throw new Error('Filter is not attach to a target!');

		const filter = this.filters[prop] || {};
		let value = this.target[prop];

		if (filter.get && this.isFunction(filter.get)) {
			value = filter.get.call(this, this.target[prop], this.target, prop);
		}
		if (typeof value === 'undefined')
			value = defaultValue;
		return value;
	}

	set(prop, value) {
		if (!this.isAttached())
			throw new Error('Filter is not attach to a target!');

		const filter = this.filters[prop] || {};

		if (filter.set && this.isFunction(filter.set)) {
			filter.set.call(this, value, this.target, prop);
		}
		return this;
	}

	toSafeString(str) {
		return trim.toString(str);
	}

	trim(str, charList, isPlus) {
		return trim(str, charList, isPlus);
	}

	ltrim(str, charList, isPlus) {
		return trim.left(str, charList, isPlus);
	}

	rtrim(str, charList, isPlus) {
		return trim.right(str, charList, isPlus);
	}

	isNothing(value) {
		return typeof value === 'undefined' || value === null;
	}

	isFunction(value) {
		return tc.isSyncFunction(value);
	}

	isObject(value) {
		return tc.isObject(value);
	}

	isPlainObject(value) {
		return tc.isPlainObject(value);
	}

	isEmptyObject(value) {
		return tc.isEmptyObject(value);
	}

	isArray(value) {
		return isArray(value);
	}

	isEmptyArray(value) {
		return this.isArray(value) && value.length > 0
	}

	isString(value) {
		return tc.isString(value);
	}

	isEmptyString(value) {
		return this.isString(value) && trim(value) !== '';
	}

	isNumber(value) {
		return tc.isNumber(value);
	}

	isStringNumber(value) {
		if (!this.isEmptyString(value) && value.match(/^\-[\d]*\.[\d]+$/)) {
			return true;
		}
		return false;
	}

	toNumber(value, defaultValue = 0) {
		if (this.isNumber(value)) return value;
		if (this.isStringNumber(value)) return parseFloat(value);
		return defaultValue;
	}

	isBoolean(value) {
		return tc.isBoolean(value);
	}

	isRegExp(value) {
		return tc.isRegExp(value);
	}
}