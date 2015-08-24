/**
 * 一个功能内，目标是逐步替代jQuery
 * 再者是用简单直观的方式提供了解Javascript的用法
 */

var psycho = function () {
    //#region 变量
    var NODE_TYPE_ELEMENT = 1;
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
        if ( Array.isArray) {
            return Array.isArray;
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
    function merge(dst) {
        return extend(dst, slice.call(arguments, 1), true);
    }
    function inherit(parent, extra) {
        return extend(Object.create(parent), slice.call(arguments, 1), false);
    }
    //#region DOM
    /**
     * 测试DOM元素是否包含指定的CSS类名 
     * @param {DOM} element:DOM元素
     * @param {string} 字符串 
     */
    function hasClass(element, className) {
        if (!element.getAttribute) return true;
        return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
      indexOf(" " + selector + " ") > -1);
    }
    //#endregion
}

