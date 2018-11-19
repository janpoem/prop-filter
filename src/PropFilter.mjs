'use strict';

import tc from 'typechecker';
import * as trim from 'php-trim-plus';
import getProp from 'lodash/get';
import setProp from 'lodash/set';
import hasProp from 'lodash/has';
import deepmerge from 'deepmerge';

const isArray = Array.isArray;

export default class PropFilter {
	
	constructor(filters, target) {
		if (typeof this.filters === 'undefined' || !this.isObject(this.filters))
			this.filters = {};
		if (typeof this.target === 'undefined' || !this.isValidTarget(this.target))
			this.target = null;
		
		if (target)
			this.attach(target);
		
		if (filters)
			this.setFilters(filters);
	}
	
	setFilters(filters) {
		if (this.isFunction(filters)) filters = filters.call(this, this);
		if (!this.isEmptyObject(filters))
			this.filters = deepmerge(this.filters, filters);
		return this;
	}
	
	isValidTarget(target) {
		return this.isObject(target);
	}
	
	verifyTarget() {
		if (!this.isAttached())
			throw new Error('filter is not attached to a target!');
		return this.target;
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
	
	convertPropName(prop) {
		if (this.isArray(prop))
			prop = prop.join('.');
		if (!this.isString(prop))
			throw new Error('filter prop should be an array or a string!');
		return prop.replace(/\[([^\[\]]+)\]/g, (all, inner) => {
			return '.' + inner;
		});
	}
	
	filter(target, method, prop, value = undefined) {
		const filter = this.filters[this.convertPropName(prop)];
		switch (method.toLowerCase()) {
			case 'get' :
				value = getProp(target, prop, value);
				if (filter && filter.get && typeof filter.get === 'function') {
					value = filter.get.call(this, value, target, prop);
				}
				return value;
			case 'set' :
				if (filter && filter.set && typeof filter.set === 'function') {
					value = filter.set.call(this, value, target, prop);
				}
				setProp(target, prop, value);
				return this;
			case 'has' :
				const has = hasProp(target, prop);
				if (filter && filter.has && typeof filter.has === 'function') {
					return !!filter.has.call(this, target[prop], has, target, prop);
				}
				return has;
			default :
				throw new Error('unknown filter method!');
		}
	}
	
	has(prop) {
		return this.filter(this.verifyTarget(), 'has', prop);
	}
	
	get(prop, value = undefined) {
		return this.filter(this.verifyTarget(), 'get', prop, value);
	}
	
	set(prop, value) {
		return this.filter(this.verifyTarget(), 'set', prop, value);
	}
	
	toSafeString(str) {
		return trim.toSafeString(str);
	}
	
	trim(str, charList, isPlus) {
		return trim.trim(str, charList, isPlus);
	}
	
	ltrim(str, charList, isPlus) {
		return trim.ltrim(str, charList, isPlus);
	}
	
	rtrim(str, charList, isPlus) {
		return trim.rtrim(str, charList, isPlus);
	}
	
	isNothing(value) {
		return typeof value === 'undefined' || value === null;
	}
	
	isNotNothing(value) {
		return !this.isNothing(value);
	}
	
	isUndefined(value) {
		return typeof value === 'undefined';
	}
	
	isNotUndefined(value) {
		return !this.isUndefined(value);
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
		if (!this.isArray(value)) return false;
		return value.length <= 0;
	}
	
	isString(value) {
		return trim.isString(value);
	}
	
	isEmptyString(value) {
		return trim.isEmptyString(value);
	}
	
	isEmptyStringOrWhitespace(value) {
		return trim.isEmptyStringOrWhitespace(value);
	}
	
	isNumber(value) {
		return tc.isNumber(value);
	}
	
	isStringNumber(value) {
		if (this.isNumber(value)) return true;
		return !!(!this.isEmptyString(value) && value.match(/^\-?([\d]*\.?[\d]+|(0x)?[a-f0-9]+)$/i));
	}
	
	isBoolean(value) {
		return tc.isBoolean(value);
	}
	
	isRegExp(value) {
		return tc.isRegExp(value);
	}
	
	isError(value) {
		return tc.isError(value);
	}
}