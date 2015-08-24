/**
 * 一个功能类，目标是逐步替代jQuery
 * 再者是用简单直观的方式提供了解Javascript的用法
 */

; (function () {
    'use strict';
    //#region 变量
    var NODE_TYPE_ELEMENT = 1;
    var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
    var psycho = {};
    var slice = [].slice;
    //#endregion
    //#region 测试数据的类型
    /**
     * 测试参数是否为对象类型
     * @param {any}:value 任何值
     */
    function isObject(value) {
        return value !== null && typeof value === 'object';
    }
    /**
     * 测试参数是否未定义
     * @param {any}:value 任何值
     */
    function isUndefined(value) { return typeof value === void 0; }
    /**
     * 测试参数是否为字符串类型
     *  @param {any}:value 任何值
     */
    function isString(value) {
        return typeof value === 'string';
    }
    /**
     * 测试参数是否为数值类型
     *  @param {any}:value 任何值
     */
    function isNumber(value) {
        return typeof value === 'number';
    }
    function isDate(value) {
        return toString.call(value) === '[object Date]';
    }
    function isRegExp(value) {
        return toString.call(value) === '[object RegExp]';
    }
    function isWindow(obj) {
        return obj && obj.window === obj;
    }
    function isElement(node) {
        return !!(node &&
          (node.nodeName
          || (node.prop && node.attr && node.find)));
    }
    /**
     * 测试参数是否为数组类型
     * @param {any}:value 任何值
     */
    function isArray(value) {
        if (Array.isArray) {
            return Array.isArray(value);
        }
        else {
            return Object.prototype.toString.call(value) === '[object Array]';
        }
    }
    function isArrayLike(obj) {
        if (obj == null || isWindow(obj)) {
            return false;
        }

        // Support: iOS 8.2 (not reproducible in simulator)
        // "length" in obj used to prevent JIT error (gh-11508)
        var length = "length" in Object(obj) && obj.length;

        if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
            return true;
        }

        return isString(obj) || isArray(obj) || length === 0 ||
               typeof length === 'number' && length > 0 && (length - 1) in obj;
    }
    //#endregion
    //#region 测试
    function except(value, exceptedValue, failuredMessage) {
        var v, passed;

        if (typeof value === 'function') {
            v = value();
        } else {
            v = value;
        }
        if (isArray(v)) {
            passed = equalArray(v, exceptedValue);

        }
        else {
            passed = (v === exceptedValue);

        }
        if (passed) {
            console.log('Passed');
        }
        else {
            console.log(failuredMessage);
        }
    }
    //#endregion
    //#region 数组
    /**
     * 比较2个数组是否相等
     */
    function equalArray(a, b) {
        if (every(function (v) {
               return isArray(v)
        }, a, b)) {

            var al = a.length;
            if (al != b.length)
                return false;
            else {
                for (var i = 0; i < al; i++) {
                    if (a[i] !== b[i])
                        return false;
                }
                return true;
            }
        }
    }
    /**
     * 模仿Array.every
     */
    function _every(callbackFn) {
        var array = slice.call(arguments, 1);
        for (var i = 0, ii = array.length; i < ii; i++) {
            if (!callbackFn(array[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     * forEach模仿Array.forEach
     * 避免兼容性的问题
     * 
     * @param {Array|Object} obj：待循环访问的对象。
     * @param {Object Function} obj：每次循环调用的函数
     * @param {Object} ctx:thisArg
     */
    function _forEach(obj, fn, ctx) {
        var hasOwn = Object.prototype.hasOwnProperty;

        if (Object.prototype.toString.call(fn) !== '[object Function]') {
            throw new TypeError('迭代器必须是个函数');
        }
        var l = obj.length;
        if (l === +l) {
            for (var i = 0; i < l; i++) {
                fn.call(ctx, obj[i], i, obj);
            }
        } else {
            for (var k in obj) {
                if (hasOwn.call(obj, k)) {
                    fn.call(ctx, obj[k], k, obj);
                }
            }
        }
    }

    function _group(value, key, sortKey) {
        var result = {};
        if (Array.isArray(value)) {
            Array.prototype.forEach.call(value, function (v) {
                if (!result[v[key]]) result[v[key]] = [];
                result[v[key]].push(v);
            })
        }
        if (sortKey) {
            var keys = Object.keys(result);
            for (var i = 0, ii = keys.length; i < ii; i++) {
                result[keys[i]] = result[keys[i]].sort(function (a, b) {
                    if (a[sortKey] > b[sortKey]) return 1;
                    if (a[sortKey] < b[sortKey]) return -1;
                    return 0;
                })
            }
        }
        return result;
    }
    //#endregion

    //#region 对象

    /**
     * 模仿Object.keys
     * 避免兼容性的问题
     * 
     * @param {Object} obj：对象
     */
    function keys(obj) {
        var result = [], prop;
        for (prop in obj) {
            result.push(prop);
        }
        return result;
    }
    /**
    * 合并多个对象，比如说，设计一个组件,
    * 允许使用者传入一个参数'options'
    * 然后和默认的配置defaults合并
    * 
    * @param:{Object} target:合并的目标对象
    * @param:{Object|Array} objs：待合并的对象和对象数组
    * @param：{Boolean} deep：是否递归合并
    * 
    */
    function extend(target, objs, deep) {
        for (var i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i], typeObj = typeof obj;
            //如果obj非对象和函数,忽略继续
            if (obj !== 'object' || obj !== 'function') continue;
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j], src = obj[key];

                if (deep && isObject(src)) {
                    if (isDate(src)) {
                        target[key] = new Date(src.valueOf());
                    } else if (isRegExp(src)) {
                        target[key] = new RegExp(src.valueOf());

                    } else {
                        if (!isObject(target[key])) target[key] = isArray(src) ? [] : {};
                        extend(dst[key], [src], true);
                    }
                } else {
                    target[key] = src;
                }
            }
        }
        return target;

    }
    //#endregion

    function merge(dst) {
        return extend(dst, slice.call(arguments, 1), true);
    }
    function inherit(parent, extra) {
        return extend(Object.create(parent), slice.call(arguments, 1), false);
    }
    //#region 其他
    /**
     * https://github.com/bevacqua/fuzzysearch/blob/master/index.js
     */
    function fuzzysearch(needle, haystack) {
        var hlen = haystack.length;
        var nlen = needle.length;
        if (nlen > hlen) {
            return false;
        }
        if (nlen === hlen) {
            return needle === haystack;
        }
        outer: for (var i = 0, j = 0; i < nlen; i++) {
            var nch = needle.charCodeAt(i);
            while (j < hlen) {
                if (haystack.charCodeAt(j++) === nch) {
                    continue outer;
                }
            }
            return false;
        }
        return true;
    }
    //#endregion
    //#region math
    function clamp(val, max) {
        return Math.min(max, Math.max(0, val));
    }

    //#endregion

    //#region string
    function __trim(value, direction) {
        direction = direction || 0;
        if (direction === 0)
            return value.replace(/^\s+/, '').replace(/\s+$/, '');
        if (direction === 1)
            return value.replace(/\s+$/, '');
        if (direction === -1)
            return value.replace(/^\s+/, '');
    }
    function __padding(value, length, direction, paddingChar) {
        direction = direction || -1;
        paddingChar = paddingChar || '0';
        var gap = length - value;
        if (gap < 1) return value;

        for (var i = 0, ii = gap; i < length; i++) {
            if (direction === -1)
                value = paddingChar + value;
            else
                value = value + paddingChar;
        }
        return value;
    }
    function __IsNullOrWhiteSpace(value) {
        return (value === null) || (__trim(value).length < 1);
    }
    function __getExtension(value) {
        var pos = value.lastIndexOf('.');
        if (~pos)
            return value.substring(pos);
        return false;
    }
    //#endregion

    //#region DOM
    /**
     * 测试DOM元素是否包含指定的CSS类名 
     * @param {DOM} element:DOM元素
     * @param {string} 字符串 
     */
    function $hasClass(element, className) {
        if (!element.getAttribute) return false;
        return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
      indexOf(" " + selector + " ") > -1);
    }
    function $parent(element) {
        var parent = element.parentNode;
        return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
    }
    function $next(element) {
        return element.nextElementSibling;
    }
    function $find(elemnt, selector, considerCompatible) {
        considerCompatible = considerCompatible || 0;
        if (considerCompatible) {
            var cssSelectorMark = selector.substring(0, 1);
            if (cssSelectorMark === '.') {
                return elemnt.getElementsByClassName(selector.substring(1));
            }
            else {
                return elemnt.getElementsByTagName(selector);
            }
        } else {
            //支持IE8
            return elemnt.querySelectorAll(selector);
        }
    }
    function $computedStyle(elemnt) {
        var view = elemnt.ownerDocument.defaultView;
        if (!view.opener) {
            view = window;
        }
        return view.getComputedStyle(elemnt);
    }
    /**
     * 最大高度，包括margin
     * 注意只能获取整数
     * 
     */
    function $maxHeight(elemnt) {
        var style = $computedStyle(elemnt);
        if (parseInt(style['height'], 10) === 0) {
            return 0;
        }
        return elemnt.scrollHeight + parseInt(style['marginBottom'], 10) + parseInt(style['marginTop'], 10);
    }
    function $(callback) {
        document.addEventListener("readystatechange", function () {
            if (document.readyState == "complete") {
                callback();
            }
        });
    }
    function $html(element, value) {
        if (arguments.length > 1) {
            element.innerHTML = value;
            return;
        }
        return element.innerHTML;
    }

    //#endregion

    psycho._every = _every;
    psycho.except = except;
    psycho._forEach = _forEach;
    psycho.keys = keys;
    psycho_group = _group;

    psycho.$next = $next;
    psycho.$find = $find;
    psycho.$hasClass = $hasClass;
    psycho.$parent = $parent;
    psycho.$maxHeight = $maxHeight;
    psycho.$ = $;
    psycho.$computedStyle = $computedStyle;


    if ((typeof window !== 'undefined') && isWindow(window))
        window.psycho = psycho;
    if (typeof exports !== 'undefined') {
        exports.psycho = psycho;
    }
})();

