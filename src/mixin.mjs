import tc from 'typechecker';

const isArray = Array.isArray;
const isObject = tc.isObject;
const isString = tc.isString;

const TraitsFlag = '__traits__';

function parseMixInTraitName(name) {
	let result = {
		from: '',
		as  : ''
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
 * 对一个JS的对象混入特性
 *
 * ```js
 * mixInTrait({}, anyObject, [
 *        'method1',
 *        {
 * 			'name': 'method2',
 * 			'as' : 'asMethodName2',
 * 		},
 *        ['method3', 'asMethodName3'],
 *        'method4 => asMethondName4'
 * ])
 * ```
 *
 * @param {{}} source
 * @param {{}} trait
 * @param {[]} keys
 * @param {boolean} isReplace
 * @param {array} keys
 */
export function mixin(source, trait, keys = [], isReplace = false) {
	if (!isObject(source))
		throw new Error('mixin source should be an object!');
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