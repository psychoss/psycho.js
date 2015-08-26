/**
 * 一个功能类，目标是逐步替代jQuery
 * 再者是用简单直观的方式提供了解Javascript的用法
 */

;
(function () {
    'use strict';
    //#region 变量
    var NODE_TYPE_ELEMENT = 1;
    var NODE_TYPE_DOCUMENT_FRAGMENT = 11;
    var psycho = {};
    var slice = [].slice;
    var ajax = {};
    var events = [];


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
    function isUndefined(value) {
        return typeof value === void 0;
    }

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

    /**
     * 测试参数是否为某个类型
     * @param {String} type
     * @param {Object} obj
     */
    function isType(type, obj) {
        return Object.prototype.toString.call(obj) === '[object {0}]';
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
        (node.nodeName || (node.prop && node.attr && node.find)));
    }

    /**
     * 测试参数是否为数组类型
     * @param {any}:value 任何值
     */
    function isArray(value) {
        if (Array.isArray) {
            return Array.isArray(value);
        } else {
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

        } else {
            passed = (v === exceptedValue);

        }
        if (passed) {
            console.log('Passed');
        } else {
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

    function _form(values) {
        var results = [];
        var l = values.length;
        for (var i = 0; i < l; i++) {
            results.push(values[i]);
        }
        console.log(results);
        return results;
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

    /**
     * 查找数组中指定元素的索引位置
     * @param {Array} array ：数组
     * @param {Object} value ：要查找的值
     */
    function _indexOf(array, value) {
        if (array.indexOf) return array.indexOf(value);
        else {
            var l = array.length;
            while (l--) {
                if (array[l] === value) return l;
            }
        }
        return -1;
    }

    /**
     * 移除数组中指定的元素
     * @param {Array} array ：数组
     * @param {Object} value ：要查找的值
     */
    function _remove(array, value) {
        var pos = _indexOf(array, value);
        if (~pos) {
            array.splice(pos, 1);
        }
    }

    //#endregion

    //#region 对象
    /**
     * 转换字符串到Javascript对象
     * @param {any} value
     */
    function castType(value) {
        var r
        if (value === null || value === 'null') {
            r = null;
        } else if (value === 'true') {
            r = true;
        } else if (value === 'false') {
            r = false;
        } else if (value === 'undefined') {
            r = void 0;
        } else if (value === '' || isNaN(value)) {
            r = value;
        } else {
            r = parseFloat(value);
        }
        return r;
    }

    /**
     * 模仿Object.keys
     * 避免兼容性的问题
     *
     * @param {Object} obj：对象
     */
    function keys(obj) {
        var result = [],
            prop;
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
        if (!isArray(objs))
            objs = [objs];
        for (var i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i],
                typeObj = typeof obj;
            //如果obj非对象和函数,忽略继续


            if (typeObj !== 'object' && typeObj !== 'function') continue;
            var keys = Object.keys(obj);

            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j],
                    src = obj[key];

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

    function emit(eventName, obj) {

        for (var i = 0; i < events.length; i++) {

            if (events[i][0] === eventName) {
                return events[i][1](obj);
            }
        }

    }

    function on(eventName, callback) {
        for (var i = 0; i < events.length; i++) {
            if (events[i][0] === eventName) {
                new Error('此事件已定义');
            }
        }
        events.push([eventName, callback]);
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

    /**
     * 模板化字符串
     * eg: psycho.__format('{0}{1}{2}',1,2,3);
     *
     * @param {string} value：字符串
     * @param {any,...anys} 像ES6的Tag Template可以传入任意数量的参数
     */
    function __format(value) {
        var paramters = slice.call(arguments, 1);
        for (var i = 0, ii = paramters.length; i < ii; i++) {

            value = value.replace(new RegExp('\\{' + i + '\\}', 'g'), paramters[i]);
        }
        return value;
    }

    //#endregion


    //#region ajax

    //从服务器get数据
    /* eg:
     psycho.ajax.query({
     url: BASE_URL + '/post',
     err: function () {
     console.log('错误');
     }
     }, function (v) {
     v.onreadystatechange = function () {
     if (v.readyState === 4) {
     psycho.$repeat(JSON.parse(v.responseText));
     }
     };

     });
     */
    ajax.query = function (settings, callbak) {
        var request = new XMLHttpRequest();
        request.timeout = settings.timeout || 5000;
        callbak(request);
        request.onerror = settings.err;
        request.ontimeout = settings.err;
        request.open('GET', settings.url);
        request.send();
    }
    ajax.save = function (settings, callback) {

        var request = new XMLHttpRequest();
        var file = settings.file || '';
        request.timeout = settings.timeout || 5000;


        request.ontimeout = settings.err;
        request.open('POST', settings.url);


        request.setRequestHeader("Content-type", "application/json");
        if (settings.headers) {
            ajax.setHeaders(request, settings.headers);
        }
        callback(request);
        request.send(JSON.stringify(settings.data));
    }
    ajax.setHeaders = function (request, headers) {

        _forEach(keys(request), function (v) {
            request.setRequestHeader(v, headers[v]);
        })
    }

    //#endregion

    //#region DOM

    /**
     * 获取指定元素的子元素，
     * 如果递归将遍历返回所有子元素
     * 如果非递归，仅返回第一级子元素
     * @param {DOM} element:DOM元素
     * @param {Boolean} isRecursive:是否递归获取
     */
    function $children(element, isRecursive, array) {
        isRecursive = isRecursive || 0;
        if (isRecursive) {
            array = array || [];
            var es = element.children, n = es.length;
            while (n--) {
                array.push(es[n]);
                if (es[n].children.length > 0) {
                    $children(es[n], true, array);
                }
            }

            return array;
        }
        else
            return element.children;
    }
    /**
     * 测试DOM元素是否包含指定的CSS类名
     * @param {DOM} element:DOM元素
     * @param {string} 字符串
     */
    function $hasClass(element, className) {
        if (!element.getAttribute) return false;
        return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").indexOf(" " + selector + " ") > -1);
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
            } else {
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

    /**
     * 绑定一个在文档加载完成执行的函数
     * @param {Type} callback
     */
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

    /**
     * 以HTML模板生成重复的HTML代码片段
     * 使用||键名||绑定数据
     * @param {Object}:values：对象
     */
    /*eg
     <div repeat>||goodsTitle||</div>
     psycho.$repeat([{goodsTitle:1},{goodsTitle:1}]);
     */
    function $$findTemplateMark(text) {
        var re = /\|\|([a-zA-Z0-9_]+)\|\|/g, r = [], m;
        while ((m = re.exec(text)) !== null) {
            if (r.indexOf(m[1]) === -1) {
                r.push(m[1]);
            }
        }
        return r;

    }

    function $form(element) {
        var child = $children(element, true);
        var re = /(input)|(select)|(textarea)/i;
        var reType = /(text)|(file)|(hidden)|(password)|(number)|(select)/i;
        var n = child.length;
        var r = {};
        while (n--) {
            if (re.test(child[n].tagName)) {
                var c = child[n];
                var name = c.getAttribute('name');
                if (name == null) continue;
                if (reType.test(c.type)) {
                    r[name] = c.value;
                }
            }
        }
        return r;
    }
    function $show(element, value) {
        value = value || 'block';
        element.style.display = value;
    }
    function $bind(elemnt, value) {
        var htm = $html(elemnt);
        var marks = $$findTemplateMark(htm);

        for (var i = 0, ii = marks.length; i < ii; i++) {
            htm = htm.replace(new RegExp('\\|\\|' + marks[i] + '\\|\\|', 'g'), value[marks[i]]);
        }

        $html(elemnt, htm);

    }
    function $repeat(values) {
        var query = psycho.$find(document, '[repeat]')[0];
        var re = /\|\|([a-zA-Z0-9_]+)\|\|/g,
            h = query.outerHTML,
            rs = [],
            res = [],
            m, content = h,
            result = '';
        while ((m = re.exec(h)) !== null) {
            if (rs.indexOf(m[1]) === -1) {
                rs.push(m[1]);
                res.push(new RegExp('\\|\\|' + m[1] + '\\|\\|', 'g'));
            }
        }
        ;
        for (var i = 0, ii = values.length; i < ii; i++) {
            for (var j = 0, jj = rs.length; j < jj; j++) {
                content = content.replace(res[j], values[i][rs[j]]);
            }
            result += content;
            content = h;

        }
        psycho.$html(psycho.$parent(query), result);
    }
    function $hide(element) {
        element.style.display = 'none';
    }
    function $click(element, callback) {
        if (element === null) {
            console.log('element is null.');
            return;
        }
        if ('ontouchstart' in document.documentElement)
            element.addEventListener('touchstart', callback);
        else
            element.addEventListener('click', callback);
    }
    function $validator(element, regexRule, errorSummary, showElement) {
        var validate = function () {
            if (regexRule.test(element.value)) {
                $hide(showElement);
            } else {
                $show(showElement);
                $html(showElement, errorSummary);
            }
        }
        element.addEventListener('blur', validate);
        element.addEventListener('keyup', validate);
    }
    //#endregion
    psycho.$validator = $validator;
    psycho.$ = $;
    psycho.$bind = $bind;
    psycho.$click = $click;
    psycho.$computedStyle = $computedStyle;
    psycho.$find = $find;
    psycho.$form = $form;
    psycho.$hasClass = $hasClass;
    psycho.$hide = $hide;
    psycho.$html = $html;
    psycho.$maxHeight = $maxHeight;
    psycho.$next = $next;
    psycho.$parent = $parent;
    psycho.$repeat = $repeat;
    psycho.__format = __format;
    psycho.__padding = __padding;
    psycho.__trim = __trim;
    psycho._every = _every;
    psycho.$show = $show;
    psycho._forEach = _forEach;
    psycho._form = _form;
    psycho._group = _group;
    psycho._indexOf = _indexOf;
    psycho.ajax = ajax;
    psycho.emit = emit;
    psycho.except = except;
    psycho.isRegExp = isRegExp;
    psycho.keys = keys;
    psycho.on = on;
    psycho.inherit = inherit;
    psycho.extend = extend;

    if ((typeof window !== 'undefined') && isWindow(window))
        window.psycho = psycho;
    if (typeof exports !== 'undefined') {
        exports.psycho = psycho;
    }
})();
