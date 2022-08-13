import JSBI from "jsbi";
export var BIEx;
(function (BIEx) {
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
        else if (typeof value == 'string') {
            return JSBI.BigInt(value);
        }
        return value;
    }
    BIEx.toBI = toBI;
    function toNumTry(value) {
        if (typeof value == 'number')
            return value;
        if (typeof value == 'string')
            value = toBI(value);
        if (JSBI.greaterThan(value, BIEx.Number_MIN_SAFE_INTEGER) && JSBI.lessThan(value, BIEx.Number_MAX_SAFE_INTEGER)) {
            return JSBI.toNumber(value);
        }
        return value;
    }
    BIEx.toNumTry = toNumTry;
    function toNum(value) {
        if (typeof value == 'number')
            return value;
        if (JSBI.lessThanOrEqual(value, BIEx.Number_MIN_SAFE_INTEGER)) {
            console.error('JSBIEx.toNum lessThanOrEqual Number.MIN_SAFE_INTEGER');
            return Number.MIN_SAFE_INTEGER + 1;
        }
        if (JSBI.greaterThanOrEqual(value, BIEx.Number_MAX_SAFE_INTEGER)) {
            console.error('JSBIEx.toNum greaterThanOrEqual Number.MAX_SAFE_INTEGER');
            return Number.MAX_SAFE_INTEGER - 1;
        }
        return JSBI.toNumber(value);
    }
    BIEx.toNum = toNum;
    BIEx.precision = 10000;
    BIEx.bprecision = toBI(BIEx.precision);
    BIEx.Number_MIN_SAFE_INTEGER = toBI(Number.MIN_SAFE_INTEGER);
    BIEx.Number_MAX_SAFE_INTEGER = toBI(Number.MAX_SAFE_INTEGER);
    function Max(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThan(ba, bb) ? a : b;
    }
    BIEx.Max = Max;
    function MaxBI(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThan(ba, bb) ? ba : bb;
    }
    BIEx.MaxBI = MaxBI;
    function Min(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThan(ba, bb) ? a : b;
    }
    BIEx.Min = Min;
    function MinBI(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThan(ba, bb) ? ba : bb;
    }
    BIEx.MinBI = MinBI;
    function E(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.equal(ba, bb);
    }
    BIEx.E = E;
    function NE(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.notEqual(ba, bb);
    }
    BIEx.NE = NE;
    function L(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThan(ba, bb);
    }
    BIEx.L = L;
    function LE(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThanOrEqual(ba, bb);
    }
    BIEx.LE = LE;
    function G(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThan(ba, bb);
    }
    BIEx.G = G;
    function GE(a, b) {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThanOrEqual(ba, bb);
    }
    BIEx.GE = GE;
    function Clamp(value, min, max) {
        const bValue = toBI(value), bMin = toBI(min), bMax = toBI(max);
        return JSBI.lessThan(bValue, bMin)
            ? min
            : JSBI.greaterThan(bValue, bMax)
                ? max
                : value;
    }
    BIEx.Clamp = Clamp;
    function ClampBI(value, min, max) {
        const bValue = toBI(value), bMin = toBI(min), bMax = toBI(max);
        return JSBI.lessThan(bValue, bMin)
            ? bMin
            : JSBI.greaterThan(bValue, bMax) ? bMax : bValue;
    }
    BIEx.ClampBI = ClampBI;
    function Add(a, b) {
        if (typeof a == 'number'
            && typeof b == 'number'
            && !Number.isNaN(a)
            && Number.isFinite(a)
            && !Number.isNaN(b)
            && Number.isFinite(b)
            && Number.isSafeInteger(Math.floor(Math.abs(a)))
            && Number.isSafeInteger(Math.floor(Math.abs(b)))
            && Number.isSafeInteger(Math.floor(Math.abs(a + b)))) {
            return a + b;
        }
        else {
            let ba = typeof a == 'number' ? toBI(a) : a;
            let bb = typeof b == 'number' ? toBI(b) : b;
            return toNumTry(JSBI.add(ba, bb));
        }
    }
    BIEx.Add = Add;
    function AddBI(a, b) {
        return toBI(Add(a, b));
    }
    BIEx.AddBI = AddBI;
    function Sub(a, b) {
        if (typeof a == 'number'
            && typeof b == 'number'
            && !Number.isNaN(a)
            && Number.isFinite(a)
            && !Number.isNaN(b)
            && Number.isFinite(b)
            && Number.isSafeInteger(Math.floor(Math.abs(a)))
            && Number.isSafeInteger(Math.floor(Math.abs(b)))
            && Number.isSafeInteger(Math.floor(Math.abs(a - b)))) {
            return a + b;
        }
        else {
            let ba = typeof a == 'number' ? toBI(a) : a;
            let bb = typeof b == 'number' ? toBI(b) : b;
            return toNumTry(JSBI.subtract(ba, bb));
        }
    }
    BIEx.Sub = Sub;
    function SubBI(a, b) {
        return toBI(Sub(a, b));
    }
    BIEx.SubBI = SubBI;
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
                    bi = JSBI.multiply(bi, toBI(mul * BIEx.precision));
                    bi = JSBI.divide(bi, BIEx.bprecision);
                }
            }
            else {
                bi = JSBI.multiply(bi, mul);
            }
            return bi;
        }
    }
    BIEx.Mul = Mul;
    function MulBI(value, mul) {
        return toBI(Mul(value, mul));
    }
    BIEx.MulBI = MulBI;
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
            bi = JSBI.multiply(bi, BIEx.bprecision);
            bi = JSBI.divide(bi, toBI(div));
            if (JSBI.greaterThan(bi, BIEx.Number_MIN_SAFE_INTEGER) && JSBI.lessThan(bi, BIEx.Number_MAX_SAFE_INTEGER)) {
                return JSBI.toNumber(bi) / BIEx.precision;
            }
            let bdiv = JSBI.divide(bi, BIEx.bprecision);
            if (JSBI.greaterThan(bdiv, BIEx.Number_MIN_SAFE_INTEGER) && JSBI.lessThan(bdiv, BIEx.Number_MAX_SAFE_INTEGER)) {
                return JSBI.toNumber(bdiv);
            }
            return bdiv;
        }
    }
    BIEx.Div = Div;
    function DivBI(value, div) {
        return toBI(Div(value, div));
    }
    BIEx.DivBI = DivBI;
    const jsbiPowMapCache = new Map();
    function ClearCache() {
        jsbiPowMapCache.clear();
    }
    BIEx.ClearCache = ClearCache;
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
    BIEx.Pow = Pow;
})(BIEx || (BIEx = {}));
//# sourceMappingURL=index.js.map