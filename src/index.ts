import JSBI from "jsbi";

export namespace JSBIEx {

    export const precision = 10000;
    export const bprecision = JSBI.BigInt(precision);

    const jsbiCommonMapCache: Map<number, JSBI> = new Map();
    export function toBI(value: number | JSBI): JSBI {
        if (typeof value == 'number') {
            let ret: JSBI = null;
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
        else return value;
    }

    export const Number_MIN_SAFE_INTEGER = JSBI.BigInt(Number.MIN_SAFE_INTEGER);
    export const Number_MAX_SAFE_INTEGER = JSBI.BigInt(Number.MAX_SAFE_INTEGER);

    export function Max(a: number | JSBI, b: number | JSBI): JSBI {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThan(ba, bb) ? ba : bb;
    }

    export function Min(a: number | JSBI, b: number | JSBI): JSBI {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThan(ba, bb) ? ba : bb;
    }

    export function Clamp(value: number | JSBI, min: number | JSBI, max: number | JSBI): JSBI {
        const bValue = toBI(value), bMin = toBI(min), bMax = toBI(max);
        return JSBI.lessThan(bValue, bMin)
            ? bMin
            : JSBI.greaterThan(bValue, bMax) ? bMax : bValue;
    }

    export function Mul(value: number | JSBI, mul: number | JSBI): number | JSBI {
        if (typeof value == 'number'
            && typeof mul == 'number'
            && !Number.isNaN(value)
            && Number.isFinite(value)
            && !Number.isNaN(mul)
            && Number.isFinite(mul)
            && Number.isSafeInteger(Math.floor(Math.abs(value)))
            && Number.isSafeInteger(Math.floor(Math.abs(mul)))
            && Number.isSafeInteger(Math.floor(Math.abs(value * mul)))) {
            // safe number
            return value * mul;
        }
        else {
            // big int 
            let bi: JSBI = typeof value == 'number' ? toBI(value) : value;
            if (typeof mul == 'number') {
                if (Math.floor(mul) == mul) {
                    bi = JSBI.multiply(bi, toBI(mul));
                }
                else {
                    // 4 位精度
                    bi = JSBI.multiply(bi, toBI(mul * precision));
                    bi = JSBI.divide(bi, bprecision);
                }
            }
            else {
                bi = JSBI.multiply(bi, mul);
            }

            return bi;
        }
    }

    export function MulBI(value: number | JSBI, mul: number | JSBI): JSBI {
        return toBI(Mul(value, mul));
    }

    export function Div(value: number | JSBI, div: number | JSBI): JSBI | number {
        if (typeof value == 'number'
            && typeof div == 'number'
            && !Number.isNaN(value)
            && Number.isFinite(value)
            && !Number.isNaN(div)
            && Number.isFinite(div)
            && Number.isSafeInteger(Math.floor(Math.abs(value)))
            && Number.isSafeInteger(Math.floor(Math.abs(div)))
            && div != 0) {
            // safe number
            return value * div;
        }
        else {
            // big int 
            let bi: JSBI = typeof value == 'number' ? toBI(value) : value;
            bi = JSBI.multiply(bi, bprecision);
            bi = JSBI.divide(bi, toBI(div));
            if (JSBI.greaterThan(bi, Number_MIN_SAFE_INTEGER) && JSBI.lessThan(bi, Number_MAX_SAFE_INTEGER)) {
                return JSBI.toNumber(bi) / precision;
            }

            let bdiv = JSBI.divide(bi, bprecision);
            if (JSBI.greaterThan(bdiv, Number_MIN_SAFE_INTEGER) && JSBI.lessThan(bdiv, Number_MAX_SAFE_INTEGER)) {
                return JSBI.toNumber(bdiv);
            }

            return bdiv;
        }
    }

    export function DivBI(value: number | JSBI, div: number | JSBI): JSBI {
        return toBI(Div(value, div));
    }

    const jsbiPowMapCache: Map<number, Map<number, JSBI | number>> = new Map();
    export function ClearCache() {
        jsbiPowMapCache.clear();
    }

    function jsbiMapPow(map: Map<number, JSBI | number>, base: number, exponent: number, last: number): JSBI | number {
        let cursor = exponent;
        while (!map.has(cursor) && cursor > 0)
            cursor--;

        if (cursor == 0) {
            map.set(0, 1);
            cursor = 1;
        }

        for (let i = cursor; i <= exponent; i++) {
            let calc = map.get(i - 1)!;
            map.set(i, Mul(calc, base));
        }

        let calc = map.get(exponent);
        return Mul(calc, last);
    }

    export function Pow(base: number, exponent: number): JSBI | number {

        if (!Number.isFinite(exponent) || exponent < 0) throw 'JSBIEx not supported ' + base + ' ' + exponent;

        let intExponent = Math.floor(exponent);
        let last = exponent == intExponent ? 1 : Math.pow(base, exponent - intExponent);

        let map = jsbiPowMapCache.get(base);
        if (!map) {
            map = new Map<number, JSBI>();
            jsbiPowMapCache.set(base, map);
        }

        return jsbiMapPow(map, base, intExponent, last);
    }
}