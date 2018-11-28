(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash')) :
  typeof define === 'function' && define.amd ? define(['lodash'], factory) :
  (global.PropFilter = factory(global._));
}(this, (function (_) { 'use strict';

  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /* @flow */

  // Prepare
  const isClassRegex = /^class\s|^function\s+[A-Z]/;
  const isConventionalClassRegex = /^function\s+[A-Z]/;
  const isNativeClassRegex = /^class\s/;

  // -----------------------------------
  // Values

  /**
   * Get the object type string
   * @param {*} value
   * @returns {string}
   */
  function getObjectType (value) {
  	return Object.prototype.toString.call(value)
  }

  /**
   * Checks to see if a value is an object
   * @param {*} value
   * @returns {boolean}
   */
  function isObject (value) {
  	// null is object, hence the extra check
  	return value !== null && typeof value === 'object'
  }

  /**
   * Checks to see if a value is an object and only an object
   * @param {*} value
   * @returns {boolean}
   */
  function isPlainObject (value) {
  	/* eslint no-proto:0 */
  	return isObject(value) && value.__proto__ === Object.prototype
  }

  /**
   * Checks to see if a value is empty
   * @param {*} value
   * @returns {boolean}
   */
  function isEmpty (value) {
  	return value == null
  }

  /**
   * Is empty object
   * @param {*} value
   * @returns {boolean}
   */
  function isEmptyObject (value /* :Object */) {
  	// We could use Object.keys, but this is more effecient
  	for (const key in value) {
  		if (value.hasOwnProperty(key)) {
  			return false
  		}
  	}
  	return true
  }

  /**
   * Is ES6+ class
   * @param {*} value
   * @returns {boolean}
   */
  function isNativeClass (value) {
  	// NOTE TO DEVELOPER: If any of this changes, isClass must also be updated
  	return typeof value === 'function' && isNativeClassRegex.test(value.toString())
  }

  /**
   * Is Conventional Class
   * Looks for function with capital first letter MyClass
   * First letter is the 9th character
   * If changed, isClass must also be updated
   * @param {*} value
   * @returns {boolean}
   */
  function isConventionalClass (value) {
  	return typeof value === 'function' && isConventionalClassRegex.test(value.toString())
  }

  // There use to be code here that checked for CoffeeScript's "function _Class" at index 0 (which was sound)
  // But it would also check for Babel's __classCallCheck anywhere in the function, which wasn't sound
  // as somewhere in the function, another class could be defined, which would provide a false positive
  // So instead, proxied classes are ignored, as we can't guarantee their accuracy, would also be an ever growing set


  // -----------------------------------
  // Types

  /**
   * Is Class
   * @param {*} value
   * @returns {boolean}
   */
  function isClass (value) {
  	return typeof value === 'function' && isClassRegex.test(value.toString())
  }

  /**
   * Checks to see if a value is an error
   * @param {*} value
   * @returns {boolean}
   */
  function isError (value) {
  	return value instanceof Error
  }

  /**
   * Checks to see if a value is a date
   * @param {*} value
   * @returns {boolean}
   */
  function isDate (value) {
  	return getObjectType(value) === '[object Date]'
  }

  /**
   * Checks to see if a value is an arguments object
   * @param {*} value
   * @returns {boolean}
   */
  function isArguments (value) {
  	return getObjectType(value) === '[object Arguments]'
  }

  /**
   * Checks to see if a value is a function but not an asynchronous function
   * @param {*} value
   * @returns {boolean}
   */
  function isSyncFunction (value) {
  	return getObjectType(value) === '[object Function]'
  }

  /**
   * Checks to see if a value is an asynchronous function
   * @param {*} value
   * @returns {boolean}
   */
  function isAsyncFunction (value) {
  	return getObjectType(value) === '[object AsyncFunction]'
  }

  /**
   * Checks to see if a value is a function
   * @param {*} value
   * @returns {boolean}
   */
  function isFunction (value) {
  	return isSyncFunction(value) || isAsyncFunction(value)
  }

  /**
   * Checks to see if a value is an regex
   * @param {*} value
   * @returns {boolean}
   */
  function isRegExp (value) {
  	return getObjectType(value) === '[object RegExp]'
  }

  /**
   * Checks to see if a value is an array
   * @param {*} value
   * @returns {boolean}
   */
  function isArray (value) {
  	return (typeof Array.isArray === 'function' && Array.isArray(value)) || getObjectType(value) === '[object Array]'
  }

  /**
   * Checks to see if a valule is a number
   * @param {*} value
   * @returns {boolean}
   */
  function isNumber (value) {
  	return typeof value === 'number' || getObjectType(value) === '[object Number]'
  }

  /**
   * Checks to see if a value is a string
   * @param {*} value
   * @returns {boolean}
   */
  function isString (value) {
  	return typeof value === 'string' || getObjectType(value) === '[object String]'
  }

  /**
   * Checks to see if a valule is a boolean
   * @param {*} value
   * @returns {boolean}
   */
  function isBoolean (value) {
  	return value === true || value === false || getObjectType(value) === '[object Boolean]'
  }

  /**
   * Checks to see if a value is null
   * @param {*} value
   * @returns {boolean}
   */
  function isNull (value) {
  	return value === null
  }

  /**
   * Checks to see if a value is undefined
   * @param {*} value
   * @returns {boolean}
   */
  function isUndefined (value) {
  	return typeof value === 'undefined'
  }

  /**
   * Checks to see if a value is a Map
   * @param {*} value
   * @returns {boolean}
   */
  function isMap (value) {
  	return getObjectType(value) === '[object Map]'
  }

  /**
   * Checks to see if a value is a WeakMap
   * @param {*} value
   * @returns {boolean}
   */
  function isWeakMap (value) {
  	return getObjectType(value) === '[object WeakMap]'
  }

  // -----------------------------------
  // General

  /**
   * The interface for methods that test for a particular type.
   * @typedef {function} TypeTester
   * @param {*} value the value that will have its type tested
   * @returns {boolean} `true` if the value matches the type that the function tests against
   */

  /**
   * The interface for a type mapping (key => function) to use for {@link getType}.
   * The key represents the name of the type. The function represents the {@link TypeTester test method}.
   * The map should be ordered by testing preference, with more specific tests first.
   * If a test returns true, it is selected, and the key is returned as the type.
   * @typedef {Object<string, TypeTester>} TypeMap
   */


  /**
   * The default {@link TypeMap} for {@link getType}.
   * AsyncFunction and SyncFunction are missing, as they are more specific types that people can detect afterwards.
   * @readonly
   * @type {TypeMap}
   */
  const typeMap = Object.freeze({
  	array: isArray,
  	boolean: isBoolean,
  	date: isDate,
  	error: isError,
  	class: isClass,
  	function: isFunction,
  	null: isNull,
  	number: isNumber,
  	regexp: isRegExp,
  	string: isString,
  	'undefined': isUndefined,
  	map: isMap,
  	weakmap: isWeakMap,
  	object: isObject
  });

  /**
   * Cycle through the passed {@link TypeMap} testing the value, returning the first type that passes, otherwise `null`.
   * @param {*} value the value to test
   * @param {TypeMap} [customTypeMap] defaults to {@link typeMap}
   * @returns {string|null}
   */
  function getType (value, customTypeMap = typeMap) {
  	// Cycle through our type map
  	for (const key in customTypeMap) {
  		if (customTypeMap.hasOwnProperty(key)) {
  			if (customTypeMap[key](value)) {
  				return key
  			}
  		}
  	}

  	// No type was successful
  	return null
  }

  // Export
  var source = {
  	getObjectType,
  	isObject,
  	isPlainObject,
  	isEmpty,
  	isEmptyObject,
  	isNativeClass,
  	isConventionalClass,
  	isClass,
  	isError,
  	isDate,
  	isArguments,
  	isSyncFunction,
  	isAsyncFunction,
  	isFunction,
  	isRegExp,
  	isArray,
  	isNumber,
  	isString,
  	isBoolean,
  	isNull,
  	isUndefined,
  	isMap,
  	isWeakMap,
  	typeMap,
  	getType
  };

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var phpTrimPlus = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, '__esModule', { value: true });

  var commonjsGlobal$$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal$$1 == 'object' && commonjsGlobal$$1 && commonjsGlobal$$1.Object === Object && commonjsGlobal$$1;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  var isArray_1 = isArray;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var stringTag = '[object String]';

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a string, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' ||
      (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag);
  }

  var isString_1 = isString;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
  }

  var isSymbol_1 = isSymbol;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  var _arrayPush = arrayPush;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */
  var objectProto$2 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
    return isObjectLike_1(value) && hasOwnProperty$1.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  var isArguments_1 = isArguments;

  /** Built-in value references. */
  var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */
  function isFlattenable(value) {
    return isArray_1(value) || isArguments_1(value) ||
      !!(spreadableSymbol && value && value[spreadableSymbol]);
  }

  var _isFlattenable = isFlattenable;

  /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;

    predicate || (predicate = _isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          _arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  var _baseFlatten = baseFlatten;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /**
   * Recursively flattens `array`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Array
   * @param {Array} array The array to flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flattenDeep([1, [2, [3, [4]], 5]]);
   * // => [1, 2, 3, 4, 5]
   */
  function flattenDeep(array) {
    var length = array == null ? 0 : array.length;
    return length ? _baseFlatten(array, INFINITY) : [];
  }

  var flattenDeep_1 = flattenDeep;

  var isArray$1 = Array.isArray;
  /**
   * default white space char list
   *
   *    @see http://php.net/manual/en/function.trim.php
   *
   *    " " (ASCII 32 (0x20)), an ordinary space.
   *    "\t" (ASCII 9 (0x09)), a tab.
   *    "\n" (ASCII 10 (0x0A)), a new line (line feed).
   *    "\r" (ASCII 13 (0x0D)), a carriage return.
   *    "\0" (ASCII 0 (0x00)), the NUL-byte.
   *    "\x0B" (ASCII 11 (0x0B)), a vertical tab.
   */

  var DefaultWhitespace = [' ', '\n', '\r', '\t', '\f', '\0', '\x0b', '\xa0', "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006", "\u2007", "\u2008", "\u2009", "\u200A", "\u200B", "\u2028", "\u2029", "\u3000"].join('');
  var TrimBoth = 0;
  var TrimLeft = 1;
  var TrimRight = -1;
  var PlusCharList = true;
  var ReplaceCharList = false;
  /** Used as references for various `Number` constants. */

  var INFINITY$1 = 1 / 0;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = Symbol ? Symbol.prototype : undefined;
  var symbolToString = symbolProto ? symbolProto.toString : undefined;
  /**
   * 将给定值转换为安全字符串
   *
   * @param {*} value
   * @param {string} spr
   * @return {string}
   */

  function toSafeString(value) {
    var spr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (typeof value === 'undefined' || value === null) {
      return '';
    } // Exit early for strings to avoid a performance hit in some environments.


    if (isString_1(value)) {
      return value.normalize(); // 增加 normalize : http://www.ruanyifeng.com/blog/2014/12/unicode.html
    }

    if (isArray$1(value)) {
      // @todo 这里仍有待优化，这个也不算是最好的方案
      if (value.length <= 0) return '';
      return flattenDeep_1(value).join(spr).normalize(); // 这里，选择 flattenDeep ，然后join
    }

    if (isSymbol_1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }

    var result = "".concat(value); // 改用回 lodash 原来的写法

    return result === '0' && 1 / value === -INFINITY$1 ? '-0' : result;
  }
  /**
   * 转换字符列表，只将数组和字符串输出，其他返回空白字符串
   *
   * @param {string|array} charList
   * @return {string}
   */


  function convertCharList(charList) {
    if (isArray$1(charList)) charList = charList.join('');
    if (isString_1(charList) && charList !== '') return toSafeString(charList);
    return '';
  }
  /**
   * PHP的字符串截取函数
   *
   * @see http://locutus.io/php/strings/trim/
   * @see http://php.net/manual/en/function.trim.php
   *
   * @param {string} str 要截取的字符串
   * @param {string|null|undefined|array} charList 要截取的字符列表
   * @param {boolean} isPlus 字符列表是否为追加模式，默认为True，即以追加模式进行截取。默认PHP的模式，为指定了charlist后，就会替换掉默认的charlist
   * @param {number} mode 截取模式，是两边截取，还是只截取左边 或 右边。
   * @returns {string}
   */


  function trim(str) {
    var charList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var isPlus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PlusCharList;
    var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : TrimBoth;
    var whitespace = DefaultWhitespace;
    var l = 0;
    var i = 0; // @todo how about 0xD800 ~ 0xDBFF ?

    str = toSafeString(str);
    charList = convertCharList(charList);

    if (charList !== '') {
      charList = charList.replace(/([[\]().?/*{}+$^:])/g, '$1'); // 这里进行了修改，isPlus = true时为追加模式

      if (!!isPlus) {
        whitespace += charList;
      } else {
        whitespace = charList;
      }
    } // 0 or > 0


    l = str.length;

    if (mode >= TrimBoth && l > 0) {
      for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
          str = str.substring(i);
          break;
        }
      }
    }

    l = str.length;

    if (mode <= TrimBoth && l > 0) {
      for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
          str = str.substring(0, i + 1);
          break;
        }
      }
    }

    if (mode >= TrimBoth) return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
    return whitespace.indexOf(str.charAt(str.length - 1)) === -1 ? str : '';
  }

  trim.Replace = ReplaceCharList;
  trim.Plus = PlusCharList;
  /**
   * 左截取
   *
   * @see http://php.net/manual/en/function.rtrim.php
   * @param {string} str 要截取的字符串
   * @param {string|null|undefined|array} charList 要截取的字符列表
   * @param {boolean} isPlus 字符列表是否为追加模式，默认为True，即以追加模式进行截取。默认PHP的模式，为指定了charlist后，就会替换掉默认的charlist
   * @return {string}
   */

  function ltrim(str) {
    var charList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var isPlus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PlusCharList;
    return trim(str, charList, isPlus, TrimLeft);
  }
  /**
   * 右截取
   *
   * @see http://php.net/manual/en/function.ltrim.php
   * @param {string} str 要截取的字符串
   * @param {string|null|undefined|array} charList 要截取的字符列表
   * @param {boolean} isPlus 字符列表是否为追加模式，默认为True，即以追加模式进行截取。默认PHP的模式，为指定了charlist后，就会替换掉默认的charlist
   * @return {string}
   */


  function rtrim(str) {
    var charList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var isPlus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PlusCharList;
    return trim(str, charList, isPlus, TrimRight);
  }
  /**
   * 是否为空字符串
   *
   * @param value
   * @return {boolean}
   */


  function isEmptyString(value) {
    if (value === null || typeof value === 'undefined') return true;
    if (!isString_1(value)) return false;
    return value.length <= 0;
  }
  /**
   * 是否空白文字，或者纯粹的空格字符串
   *
   * @param value
   * @return {boolean}
   */


  function isEmptyStringOrWhitespace(value) {
    if (isEmptyString(value)) return true;
    if (!isString_1(value)) return false;
    return trim(value) === '';
  }

  exports.isString = isString_1;
  exports.isEmptyString = isEmptyString;
  exports.isEmptyStringOrWhitespace = isEmptyStringOrWhitespace;
  exports.isSymbol = isSymbol_1;
  exports.toSafeString = toSafeString;
  exports.trim = trim;
  exports.ltrim = ltrim;
  exports.rtrim = rtrim;

  });

  unwrapExports(phpTrimPlus);
  var phpTrimPlus_1 = phpTrimPlus.isString;
  var phpTrimPlus_2 = phpTrimPlus.isEmptyString;
  var phpTrimPlus_3 = phpTrimPlus.isEmptyStringOrWhitespace;
  var phpTrimPlus_4 = phpTrimPlus.isSymbol;
  var phpTrimPlus_5 = phpTrimPlus.toSafeString;
  var phpTrimPlus_6 = phpTrimPlus.trim;
  var phpTrimPlus_7 = phpTrimPlus.ltrim;
  var phpTrimPlus_8 = phpTrimPlus.rtrim;

  var isMergeableObject = function isMergeableObject(value) {
  	return isNonNullObject(value)
  		&& !isSpecial(value)
  };

  function isNonNullObject(value) {
  	return !!value && typeof value === 'object'
  }

  function isSpecial(value) {
  	var stringValue = Object.prototype.toString.call(value);

  	return stringValue === '[object RegExp]'
  		|| stringValue === '[object Date]'
  		|| isReactElement(value)
  }

  // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
  var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
  var REACT_ELEMENT_TYPE$1 = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

  function isReactElement(value) {
  	return value.$$typeof === REACT_ELEMENT_TYPE$1
  }

  function emptyTarget(val) {
  	return Array.isArray(val) ? [] : {}
  }

  function cloneUnlessOtherwiseSpecified(value, options) {
  	return (options.clone !== false && options.isMergeableObject(value))
  		? deepmerge(emptyTarget(value), value, options)
  		: value
  }

  function defaultArrayMerge(target, source, options) {
  	return target.concat(source).map(function(element) {
  		return cloneUnlessOtherwiseSpecified(element, options)
  	})
  }

  function mergeObject(target, source, options) {
  	var destination = {};
  	if (options.isMergeableObject(target)) {
  		Object.keys(target).forEach(function(key) {
  			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
  		});
  	}
  	Object.keys(source).forEach(function(key) {
  		if (!options.isMergeableObject(source[key]) || !target[key]) {
  			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
  		} else {
  			destination[key] = deepmerge(target[key], source[key], options);
  		}
  	});
  	return destination
  }

  function deepmerge(target, source, options) {
  	options = options || {};
  	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  	options.isMergeableObject = options.isMergeableObject || isMergeableObject;

  	var sourceIsArray = Array.isArray(source);
  	var targetIsArray = Array.isArray(target);
  	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  	if (!sourceAndTargetTypesMatch) {
  		return cloneUnlessOtherwiseSpecified(source, options)
  	} else if (sourceIsArray) {
  		return options.arrayMerge(target, source, options)
  	} else {
  		return mergeObject(target, source, options)
  	}
  }

  deepmerge.all = function deepmergeAll(array, options) {
  	if (!Array.isArray(array)) {
  		throw new Error('first argument should be an array')
  	}

  	return array.reduce(function(prev, next) {
  		return deepmerge(prev, next, options)
  	}, {})
  };

  var deepmerge_1 = deepmerge;

  var getProp = _.get;
  var setProp = _.set;
  var hasProp = _.has;
  var _isArray = Array.isArray;

  var PropFilter =
  /*#__PURE__*/
  function () {
    function PropFilter(filters, target) {
      _classCallCheck(this, PropFilter);

      if (typeof this.filters === 'undefined' || !this.isObject(this.filters)) this.filters = {};
      if (typeof this.target === 'undefined' || !this.isValidTarget(this.target)) this.target = null;
      if (target) this.attach(target);
      if (filters) this.setFilters(filters);
    }

    _createClass(PropFilter, [{
      key: "setFilters",
      value: function setFilters(filters) {
        if (this.isFunction(filters)) filters = filters.call(this, this);
        if (!this.isEmptyObject(filters)) this.filters = deepmerge_1(this.filters, filters);
        return this;
      }
    }, {
      key: "isValidTarget",
      value: function isValidTarget(target) {
        return this.isObject(target);
      }
    }, {
      key: "verifyTarget",
      value: function verifyTarget() {
        if (!this.isAttached()) throw new Error('filter is not attached to a target!');
        return this.target;
      }
    }, {
      key: "attach",
      value: function attach(target) {
        if (this.isValidTarget(target)) this.target = target;
        return this;
      }
    }, {
      key: "unattach",
      value: function unattach() {
        this.target = null;
        return this;
      }
    }, {
      key: "isAttached",
      value: function isAttached(target) {
        if (target) return this.target === target;
        return this.isValidTarget(this.target);
      }
    }, {
      key: "convertPropName",
      value: function convertPropName(prop) {
        if (this.isArray(prop)) prop = prop.join('.');
        if (!this.isString(prop)) throw new Error('filter prop should be an array or a string!');
        return prop.replace(/\[([^\[\]]+)\]/g, function (all, inner) {
          return '.' + inner;
        });
      }
    }, {
      key: "filter",
      value: function filter(target, method, prop) {
        var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
        var filter = this.filters[this.convertPropName(prop)];

        switch (method.toLowerCase()) {
          case 'get':
            value = getProp(target, prop, value);

            if (filter && filter.get && typeof filter.get === 'function') {
              value = filter.get.call(this, value, target, prop, filter);
            }

            return value;

          case 'set':
            if (filter && filter.set && typeof filter.set === 'function') {
              value = filter.set.call(this, value, target, prop, filter);
            }

            setProp(target, prop, value);
            return this;

          case 'has':
            var has = hasProp(target, prop);

            if (filter && filter.has && typeof filter.has === 'function') {
              return !!filter.has.call(this, target[prop], has, target, prop, filter);
            }

            return has;

          default:
            throw new Error('unknown filter method!');
        }
      }
    }, {
      key: "has",
      value: function has(prop) {
        return this.filter(this.verifyTarget(), 'has', prop);
      }
    }, {
      key: "get",
      value: function get(prop) {
        var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
        return this.filter(this.verifyTarget(), 'get', prop, value);
      }
    }, {
      key: "set",
      value: function set(prop, value) {
        return this.filter(this.verifyTarget(), 'set', prop, value);
      }
    }, {
      key: "toSafeString",
      value: function toSafeString(str) {
        return phpTrimPlus_5(str);
      }
    }, {
      key: "trim",
      value: function trim(str, charList, isPlus) {
        return phpTrimPlus_6(str, charList, isPlus);
      }
    }, {
      key: "ltrim",
      value: function ltrim(str, charList, isPlus) {
        return phpTrimPlus_7(str, charList, isPlus);
      }
    }, {
      key: "rtrim",
      value: function rtrim(str, charList, isPlus) {
        return phpTrimPlus_8(str, charList, isPlus);
      }
    }, {
      key: "getType",
      value: function getType(value) {
        return source.getType(value);
      }
    }, {
      key: "isNothing",
      value: function isNothing(value) {
        return typeof value === 'undefined' || value === null;
      }
    }, {
      key: "isNotNothing",
      value: function isNotNothing(value) {
        return !this.isNothing(value);
      }
    }, {
      key: "isUndefined",
      value: function isUndefined(value) {
        return typeof value === 'undefined';
      }
    }, {
      key: "isNotUndefined",
      value: function isNotUndefined(value) {
        return !this.isUndefined(value);
      }
    }, {
      key: "isFunction",
      value: function isFunction(value) {
        // return typechecker.isSyncFunction(value);
        return typeof value === 'function';
      }
    }, {
      key: "isObject",
      value: function isObject(value) {
        return source.isObject(value);
      }
    }, {
      key: "isPlainObject",
      value: function isPlainObject(value) {
        return source.isPlainObject(value);
      }
    }, {
      key: "isEmptyObject",
      value: function isEmptyObject(value) {
        return source.isEmptyObject(value);
      }
    }, {
      key: "isArray",
      value: function isArray(value) {
        return _isArray(value);
      }
    }, {
      key: "isEmptyArray",
      value: function isEmptyArray(value) {
        if (!this.isArray(value)) return false;
        return value.length <= 0;
      }
    }, {
      key: "isString",
      value: function isString(value) {
        return phpTrimPlus_1(value);
      }
    }, {
      key: "isEmptyString",
      value: function isEmptyString(value) {
        return phpTrimPlus_2(value);
      }
    }, {
      key: "isEmptyStringOrWhitespace",
      value: function isEmptyStringOrWhitespace(value) {
        return phpTrimPlus_3(value);
      }
    }, {
      key: "isNumber",
      value: function isNumber(value) {
        return source.isNumber(value);
      }
    }, {
      key: "isStringNumber",
      value: function isStringNumber(value) {
        if (this.isNumber(value)) return true;
        return !!(!this.isEmptyString(value) && value.match(/^\-?([\d]*\.?[\d]+|(0x)?[a-f0-9]+)$/i));
      }
    }, {
      key: "isBoolean",
      value: function isBoolean(value) {
        return source.isBoolean(value);
      }
    }, {
      key: "isRegExp",
      value: function isRegExp(value) {
        return source.isRegExp(value);
      }
    }, {
      key: "isError",
      value: function isError(value) {
        return source.isError(value);
      }
    }]);

    return PropFilter;
  }();

  return PropFilter;

})));
//# sourceMappingURL=prop-filter.lodash-standalone.umd.js.map
