# prop-filter - 对象属性读写代理

[![Npm version](https://img.shields.io/npm/v/prop-filter.svg)](https://www.npmjs.com/package/prop-filter)
[![Build Status](https://img.shields.io/travis/janpoem/prop-filter/master.svg)](https://travis-ci.org/janpoem/prop-filter)
[![Dependencies Status](https://img.shields.io/david/janpoem/prop-filter.svg)](https://david-dm.org/janpoem/prop-filter)

一个羽量级、非侵入式的对象属性读写过滤器代理，能轻松、写意的与任何项目环境结合，瞬间提升你的编程效率，更好的提升你的代码的重用性。

写 Javascript 代码时经常伴随着大量的对象属性的读写，常常需要针对特定范围的对象实例，编写特定的 get/set 的方法。这些方法不但让一个类设计变得臃肿，往往实际情况是，费劲巴拉的写了一大堆 get/set ，真正被用到的可能只有那么一两个，一个项目写下来，总会思考，有没有可能将 set/get 方法可以作为独立模块或者 Class ，进行统一的管理和升级，但同时又不破坏原生类的业务逻辑呢？

经过很长时间的思考和总结，将属性读写（get/set）作为代理，是最佳的模式，最终呈现为 `prop-filter` 这个类库。

虽然基于 ES 的 `Object.definedProperties` 属性可以很好实现 get/set ，但他某种程度上，让你的实际代码变得非可预期性，后来者需要花更多的精力去理解、调试你的代码，或者依赖于你的文档，去解释和说明那些属性有 getter 或 setter ，这样并不能让一个项目变得更加直观。

如无意外，所有本人发布的项目统一优先发布在 [码云](https://gitee.com/janpoem/prop-filter) 。

并且，再如无意外，都是基于面向对象的方式继承重载，也不会再去写什么原型链，forget it, embrace the future!

## 项目依赖类库

- [deepmerge](https://www.npmjs.com/package/deepmerge)，[lodash.merge](https://lodash.com/docs/4.17.11#merge) 的行为方式已经改为和 [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 一样，但 `deepmerge` 现存一个问题，就是如果 `deepmerge([], {})`，第一个参数为数组 `[]` 时候，合并的返回的结果也会转为一个对象结构 `{}` ，其他方面还是符合对 deepmerge 行为的需求，所以继续使用这个类库。
- [lodash](https://www.npmjs.com/package/lodash)，这里使用的是 [_.has](https://lodash.com/docs/4.17.11#has) 、 [_.get](https://lodash.com/docs/4.17.11#get) 、 [_.set](https://lodash.com/docs/4.17.11#set) 这三个方法，一直在别的项目使用这一组方法，非常合用，也就没必要单独再造轮子了。
- [typechecker](https://www.npmjs.com/package/typechecker)，[API DOC](http://master.typechecker.bevry.surge.sh/docs/)，主要用于变量类型判定，这个库的判断结果，基本与 javascript 原生的 `typeof` 的结果一致。npm上用于判定类型的库很多，但很多库自己导入了一些新的设定，你需要花时间去理解和消化那些新的设定和返回结果，这样非常不好，典型自造轮子。
- [php-trim-plus](https://www.npmjs.com/package/php-trim-plus)，自己的类库，主要用于强化字符串的处理、空字符的检查和强化JS `trim` 函数。

## 打包说明

`index.js` - 不合并依赖库，采用 commonjs 风格，作为 nodejs 环境引入的推荐。

`PropFilter.js` - 作为引入 src/PropFilter.mjs 的入口，不合并依赖库，采用 mjs 风格（ import / export ），用于需要使用 mjs 环境下。 lodash 方法使用 `import getProp from "lodash/get"` 方式引入

`PropFilter.lodash-standalone.js` - 区别在于直接引入 `import _ from "lodash"` ，一些项目可能存在 lodash 作为外部包，没有和 webpack 项目一起打包合并。

`dist/prop-filter.bundle.js` - 全部依赖库合并打包（采用 rollup.js ），使用 commonjs 风格。

`dist/prop-filter.bundle.umd.js` - 全部依赖库合并打包（采用 rollup.js ），使用 umd 风格，全局变量名称 `PropFilter`。

`dist/prop-filter.lodash-standalone.js` - lodash 作为项目的独立包存在，只有 lodash 使用 `require('lodash')`

`dist/prop-filter.lodash-standalone.umd.js` - lodash 作为全局对象存在（注意是 `_` ），没有合并打包

## 安装说明

```shell
npm install prop-filter
// or
yarn add prop-filter
```

## 基础使用示例

### 基础三连星 `has` `get` `set`

```javascript
const Filter = require('prop-filter');

let firstFilter = new Filter({
	key1: {
		/**
		 * 对象属性 getter 过滤器
		 * @param {*} value 从取值的对象的 key 中所取得到的值
		 * @param {{}} data 要取值的对象
		 * @param {string} key 要取值的 key
		 * @return {*} 返回的结果，为到 filter.get 方法所返回的值。
		 */
		get: (value, data, key) => { // getter
			return value; // 返回 get 的值
		},
		/**
		 * 对象属性 setter 过滤器
		 * @param {*}      value 要向对象的 key 写入的值
		 * @param {{}}     data  要写入属性的对象
		 * @param {string} key   要写入值的 key
		 * @return {*}           返回的结果，为最终要写入到对象属性上的值。
		 */
		set: (value, data, key) => { // setter
			return value; // 返回 要写入 的值
		},
		/**
		 * 判定对象的某个 key 是否有定义值
		 * @param {*}       value 从取值的对象的 key 中所取得到的值
		 * @param {boolean} has   判定该值是否存在的初步结果
		 * @param {{}}      data  要取值的对象
		 * @param {string}  key   要判断值是否存在的 key
		 * @return {boolean}      返回的结果，最终输出 filter.has 的结果。
		 */
		has: (value, has, data, key) => { // has
			return has;
		}
	}
});

// 目标对象
let target = {key1: 'value1'};
let anotherTarget = {key1: 'another-value1'};

filter.attach(target); // 将 filter 附着到目标对象上
if (filter.has('key1')) { // exists ?
	let key1Value = filter.get('key1'); // getter
    filter.set('key1', `changed-${key1Value}`); // setter
}

filter.unattach(target); // 解除附着
// or
filter.attach(anotherTarget); // 直接附着另外一个目标
```

__基础三连星 - 特别说明：__

1、因为使用了 `_.has` 作为 `has` 的判定基础，形成基础的 `has` 值，而 lodash 的 `_.has` ，某程度上，更应该叫做 existsKey 或 containKey ，即他返回的结果，是以目标对象是否存在这个 key 为判定基础，所以，如下情况： 

```javascript
let obj = {key: undefined};

_.has(obj, 'key'); // 这里会返回 true ，因为是 existsKey 或 containKey 的逻辑，而不是检查 key 的值是否为 undefined
```

所以，如果对应到 filter 的使用上，如果要过滤掉 undefined 和 null 的话：

```javascript
let filter = new Filter({
	key1: {
		has: (value, has, data, key) => {
			if (typeof value === 'undefined' || value === null)
				return false;
			return has;
		}
	}
});
```

2、三连星的方法声明区别，箭头函数 vs function。箭头函数，默认是不绑定 this 上下文的，所以当你需要使用到 filter 一些自带的类型判定时，则应该清楚知道 箭头函数 和 function 的区别。如果在箭头函数希望引用回当前 filter ，可在参数声明添加一个参数。

```javascript
let filter1 = new Filter({
	key1: {
		get: (value, data, key, filter) => { 
			// 这里的 this 不是当前的 filter ，而是全局对象。
			if (filter.isEmptyString(value))
				return "hello world!";
			return value;
		}
	}
});

let filter2 = new Filter({
	key1: {
		get: function(value, data, key) { 
			// 这里的 this 指向了 filter。
			if (this.isEmptyString(value))
				return "hello world!";
			return value;
		}
	}
});
```

当然，你也可以这样写：

```javascript
let filter2 = new Filter((filter) => {
	key1: {
        get: (value, data, key) => { 
            // 这里的 this 指向了 filter。
            if (filter.isEmptyString(value))
                return "hello world!";
            return value;
        }
    }
});
```

### 三连星的实现本体 `filter` 方法

实际上实现三连星的本体，是 Filter.filter ，所以如果你需要有自定义的 filter ，请尽情在你自己的子类中重载这个方法：

```javascript
// 实现1：前置重载
class MyFilter1 extends Filter {
	
	// override
	filter(target, method, prop, value = undefined) {
		
		if (method === 'get') {
			// do something
			return 'anything';
		}
		return super.filter(target, method, prop, value);
	}
}
// 实现1：后置重载
class MyFilter1 extends Filter {
	
	// override
	filter(target, method, prop, value = undefined) {
		try {
			return super.filter(target, method, prop, value);
		} catch (e) { // 未知的处理 method 默认会抛出一个异常，这里先接住这个异常
			switch (method) { // 开始加入自己的一些后置方法处理
				case 'hello' :
					// do something
					return '...';
					break;
			}
			throw e; // 其他未知的处理方法，继续抛出异常。
		}
		
	}
}
```

### 多层级属性的读写过滤代理

是的，这也是引入 lodash 的根本原因。

```javascript
let obj = {
	key: {
		subkey: ['a']
	}
}

let filter1 = new Filter({
	'key.subkey.0': { // 
		get: (value, data, key, filter) => { 
			// 这里的 this 不是当前的 filter ，而是全局对象。
			if (filter.isEmptyString(value))
				return "hello world!";
			return value;
		}
	}
});
```

`Filter.convertPropName` 这个方法，是对属性名的过滤的实现，因为 lodash 的 `_.get` 支持两种多层级的 key 访问 `key.subkey.0` or `key.subkey[0]` ，`Filter.convertPropName` 主要为了统一属性名的访问，可根据自己喜欢，重载这个方法，默认的行为将 `[]` 替换为了 `.` 操作符。 

### 基础构成方法

`filter.setFilters(filters)`

设置绑定更多的 filters ，filters 必须为非空对象（ object ）。

`filter.isValidTarget(target)`

判定目标是否为有效的可附着目标，当前这个目标必须是一个 object。

`filter.verifyTarget()`

检查当前 filter 是否附着了有效的目标，如果没有，会直接抛出异常，正常则返回目前附着的目标。

`filter.attach(target)` 和 `filter.unattach(target)`

附着目标 和 解除附着

`filter.isAttached(target = undefined)`

判定当前 filter 是否已经附着了有效的目标，如果指定了 target 参数，则判定 filter 附着的目标是否为 target。

### 其他辅助工具方法

php-trim-plus 系列，请参考 [使用说明](https://www.npmjs.com/package/php-trim-plus#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)

```javascript
filter.toSafeString(str);              // 转换为安全字符串
filter.trim(str, charList, isPlus);    // trim
filter.ltrim(str, charList, isPlus);   // trimStart
filter.rtrim(str, charList, isPlus);   // trimEnd
filter.isString(str);                  // 是否字符串
filter.isEmptyString(str);             // 是否空字符
filter.isEmptyStringOrWhitespace(str); // 是否空字符，或 空格
```

```javascript
filter.isNothing(value);      // 是 undefined or null
filter.isNotNothing(value);   // 非 undefined or null
filter.isUndefined(value);    // 是 undefined
filter.isNotUndefined(value); // 非 undefined
filter.isArray(value);        // 是 数组
filter.isEmptyArray(value);   // 是 空数组
filter.isStringNumber(value); // 是 字符串数值
filter.isFunction(value);     // 是 函数，目前版本使用的是 typeof value === 'function' ，目前发现，typechecker.isSyncFunction 和 typechecker.isAsyncFunction 判定失效，部分 js 环境无法识别出来。
```

typechecker 系列，请参考 [API DOC](http://master.typechecker.bevry.surge.sh/docs/)

```javascript
filter.getType(value);       // 获取变量基础类型
filter.isObject(value);      // 是 对象
filter.isPlainObject(value); // 是 纯 object
filter.isEmptyObject(value); // 是 空 object
filter.isNumber(value);      // 是 数值类型
filter.isRegExp(value);      // 是 正则表达式
filter.isError(value);       // 是 异常错误对象
```