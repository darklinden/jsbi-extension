"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSBIEx = void 0;
const jsbi_1 = require("jsbi");
var JSBIEx;
(function (JSBIEx) {
    JSBIEx.precision = 10000;
    JSBIEx.bprecision = jsbi_1.default.BigInt(JSBIEx.precision);
    const jsbiCommonMapCache = new Map();
    function toJSBI(value) {
        if (typeof value == 'number') {
            let ret = null;
            const intValue = Math.round(value);
            if (Math.abs(intValue) < 1000) {
                ret = jsbiCommonMapCache.get(intValue);
                if (!ret) {
                    ret = jsbi_1.default.BigInt(intValue);
                    jsbiCommonMapCache.set(intValue, ret);
                }
            }
            return ret || jsbi_1.default.BigInt(intValue);
        }
        else
            return value;
    }
    JSBIEx.toJSBI = toJSBI;
    JSBIEx.Number_MIN_SAFE_INTEGER = jsbi_1.default.BigInt(Number.MIN_SAFE_INTEGER);
    JSBIEx.Number_MAX_SAFE_INTEGER = jsbi_1.default.BigInt(Number.MAX_SAFE_INTEGER);
    function Max(a, b) {
        const ba = toJSBI(a), bb = toJSBI(b);
        return jsbi_1.default.greaterThan(ba, bb) ? ba : bb;
    }
    JSBIEx.Max = Max;
    function Min(a, b) {
        const ba = toJSBI(a), bb = toJSBI(b);
        return jsbi_1.default.lessThan(ba, bb) ? ba : bb;
    }
    JSBIEx.Min = Min;
    function Clamp(value, min, max) {
        const bValue = toJSBI(value), bMin = toJSBI(min), bMax = toJSBI(max);
        return jsbi_1.default.lessThan(bValue, bMin)
            ? bMin
            : jsbi_1.default.greaterThan(bValue, bMax) ? bMax : bValue;
    }
    JSBIEx.Clamp = Clamp;
    function Mul(value, mul) {
        if (typeof value == 'number'
            && typeof mul == 'number'
            && !Number.isNaN(value)
            && Number.isFinite(value)
            && !Number.isNaN(mul)
            && Number.isFinite(mul)
            && Number.isSafeInteger(Math.floor(Math.abs(value)))
            && Number.isSafeInteger(Math.floor(Math.abs(mul)))
            && Number.isSafeInteger(Math.floor(Math.abs(value * mul)))) {
            return value * mul;
        }
        else {
            let bi = typeof value == 'number' ? toJSBI(value) : value;
            if (typeof mul == 'number') {
                if (Math.floor(mul) == mul) {
                    bi = jsbi_1.default.multiply(bi, toJSBI(mul));
                }
                else {
                    bi = jsbi_1.default.multiply(bi, toJSBI(mul * JSBIEx.precision));
                    bi = jsbi_1.default.divide(bi, JSBIEx.bprecision);
                }
            }
            else {
                bi = jsbi_1.default.multiply(bi, mul);
            }
            return bi;
        }
    }
    JSBIEx.Mul = Mul;
    function MulBI(value, mul) {
        return toJSBI(Mul(value, mul));
    }
    JSBIEx.MulBI = MulBI;
    function Div(value, div) {
        if (typeof value == 'number'
            && typeof div == 'number'
            && !Number.isNaN(value)
            && Number.isFinite(value)
            && !Number.isNaN(div)
            && Number.isFinite(div)
            && Number.isSafeInteger(Math.floor(Math.abs(value)))
            && Number.isSafeInteger(Math.floor(Math.abs(div)))
            && div != 0) {
            return value * div;
        }
        else {
            let bi = typeof value == 'number' ? toJSBI(value) : value;
            bi = jsbi_1.default.multiply(bi, JSBIEx.bprecision);
            bi = jsbi_1.default.divide(bi, toJSBI(div));
            if (jsbi_1.default.greaterThan(bi, JSBIEx.Number_MIN_SAFE_INTEGER) && jsbi_1.default.lessThan(bi, JSBIEx.Number_MAX_SAFE_INTEGER)) {
                return jsbi_1.default.toNumber(bi) / JSBIEx.precision;
            }
            let bdiv = jsbi_1.default.divide(bi, JSBIEx.bprecision);
            if (jsbi_1.default.greaterThan(bdiv, JSBIEx.Number_MIN_SAFE_INTEGER) && jsbi_1.default.lessThan(bdiv, JSBIEx.Number_MAX_SAFE_INTEGER)) {
                return jsbi_1.default.toNumber(bdiv);
            }
            return bdiv;
        }
    }
    JSBIEx.Div = Div;
    function DivBI(value, div) {
        return toJSBI(Div(value, div));
    }
    JSBIEx.DivBI = DivBI;
    const jsbiPowMapCache = new Map();
    function ClearCache() {
        jsbiPowMapCache.clear();
    }
    JSBIEx.ClearCache = ClearCache;
    function jsbiMapPow(map, base, exponent, last) {
        let cursor = exponent;
        while (!map.has(cursor) && cursor > 0)
            cursor--;
        if (cursor == 0) {
            map.set(0, 1);
            cursor = 1;
        }
        for (let i = cursor; i <= exponent; i++) {
            let calc = map.get(i - 1);
            map.set(i, Mul(calc, base));
        }
        let calc = map.get(exponent);
        return Mul(calc, last);
    }
    function Pow(base, exponent) {
        if (!Number.isFinite(exponent) || exponent < 0)
            throw 'JSBIEx not supported ' + base + ' ' + exponent;
        let intExponent = Math.floor(exponent);
        let last = exponent == intExponent ? 1 : Math.pow(base, exponent - intExponent);
        let map = jsbiPowMapCache.get(base);
        if (!map) {
            map = new Map();
            jsbiPowMapCache.set(base, map);
        }
        return jsbiMapPow(map, base, intExponent, last);
    }
    JSBIEx.Pow = Pow;
})(JSBIEx = exports.JSBIEx || (exports.JSBIEx = {}));
//# sourceMappingURL=index.js.map