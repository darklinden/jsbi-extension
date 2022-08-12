import JSBI from "jsbi";
export var JSBIEx;
(function (JSBIEx) {
    JSBIEx.precision = 10000;
    JSBIEx.bprecision = JSBI.BigInt(JSBIEx.precision);
    const jsbiCommonMapCache = new Map();
    function toBI(value) {
        if (typeof value == 'number') {
            let ret = null;
            const intValue = Math.round(value);
            if (Math.abs(intValue) < 1000) {
                ret = jsbiCommonMapCache.get(intValue);
                if (!ret) {
                    ret = JSBI.BigInt(intValue);
                    jsbiCommonMapCache.set(intValue, ret);
                }
            }
            return ret || JSBI.BigInt(intValue);
        }
        else
            return value;
    }
    JSBIEx.toBI = toBI;
    JSBIEx.Number_MIN_SAFE_INTEGER = JSBI.BigInt(Number.MIN_SAFE_INTEGER);
    JSBIEx.Number_MAX_SAFE_INTEGER = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
    function Max(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThan(ba, bb) ? ba : bb;
    }
    JSBIEx.Max = Max;
    function Min(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThan(ba, bb) ? ba : bb;
    }
    JSBIEx.Min = Min;
    function Clamp(value, min, max) {
        const bValue = toBI(value), bMin = toBI(min), bMax = toBI(max);
        return JSBI.lessThan(bValue, bMin)
            ? bMin
            : JSBI.greaterThan(bValue, bMax) ? bMax : bValue;
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
            let bi = typeof value == 'number' ? toBI(value) : value;
            if (typeof mul == 'number') {
                if (Math.floor(mul) == mul) {
                    bi = JSBI.multiply(bi, toBI(mul));
                }
                else {
                    bi = JSBI.multiply(bi, toBI(mul * JSBIEx.precision));
                    bi = JSBI.divide(bi, JSBIEx.bprecision);
                }
            }
            else {
                bi = JSBI.multiply(bi, mul);
            }
            return bi;
        }
    }
    JSBIEx.Mul = Mul;
    function MulBI(value, mul) {
        return toBI(Mul(value, mul));
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
            let bi = typeof value == 'number' ? toBI(value) : value;
            bi = JSBI.multiply(bi, JSBIEx.bprecision);
            bi = JSBI.divide(bi, toBI(div));
            if (JSBI.greaterThan(bi, JSBIEx.Number_MIN_SAFE_INTEGER) && JSBI.lessThan(bi, JSBIEx.Number_MAX_SAFE_INTEGER)) {
                return JSBI.toNumber(bi) / JSBIEx.precision;
            }
            let bdiv = JSBI.divide(bi, JSBIEx.bprecision);
            if (JSBI.greaterThan(bdiv, JSBIEx.Number_MIN_SAFE_INTEGER) && JSBI.lessThan(bdiv, JSBIEx.Number_MAX_SAFE_INTEGER)) {
                return JSBI.toNumber(bdiv);
            }
            return bdiv;
        }
    }
    JSBIEx.Div = Div;
    function DivBI(value, div) {
        return toBI(Div(value, div));
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
})(JSBIEx || (JSBIEx = {}));
//# sourceMappingURL=index.js.map