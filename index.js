'use strict';

var typechecker = require('typechecker/source/index');
var _trim = require('php-trim-plus');
var deepmerge = require('deepmerge');
var getProp = require('lodash/get');
var setProp = require('lodash/set');
var hasProp = require('lodash/has');

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
      if (!this.isEmptyObject(filters)) this.filters = deepmerge(this.filters, filters);
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
      return _trim.toSafeString(str);
    }
  }, {
    key: "trim",
    value: function trim(str, charList, isPlus) {
      return _trim.trim(str, charList, isPlus);
    }
  }, {
    key: "ltrim",
    value: function ltrim(str, charList, isPlus) {
      return _trim.ltrim(str, charList, isPlus);
    }
  }, {
    key: "rtrim",
    value: function rtrim(str, charList, isPlus) {
      return _trim.rtrim(str, charList, isPlus);
    }
  }, {
    key: "getType",
    value: function getType(value) {
      return typechecker.getType(value);
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
      return typechecker.isObject(value);
    }
  }, {
    key: "isPlainObject",
    value: function isPlainObject(value) {
      return typechecker.isPlainObject(value);
    }
  }, {
    key: "isEmptyObject",
    value: function isEmptyObject(value) {
      return typechecker.isEmptyObject(value);
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
      return _trim.isString(value);
    }
  }, {
    key: "isEmptyString",
    value: function isEmptyString(value) {
      return _trim.isEmptyString(value);
    }
  }, {
    key: "isEmptyStringOrWhitespace",
    value: function isEmptyStringOrWhitespace(value) {
      return _trim.isEmptyStringOrWhitespace(value);
    }
  }, {
    key: "isNumber",
    value: function isNumber(value) {
      return typechecker.isNumber(value);
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
      return typechecker.isBoolean(value);
    }
  }, {
    key: "isRegExp",
    value: function isRegExp(value) {
      return typechecker.isRegExp(value);
    }
  }, {
    key: "isError",
    value: function isError(value) {
      return typechecker.isError(value);
    }
  }]);

  return PropFilter;
}();

module.exports = PropFilter;
//# sourceMappingURL=index.js.map
