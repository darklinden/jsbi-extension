import JSBI from "jsbi";

export type BI = JSBI;
export type NBI = number | BI;

export namespace BIEx {

    const jsbiCommonMapCache: Map<number, BI> = new Map();
    export function toBI(value: NBI): BI {
        if (typeof value == 'number') {
            let ret: BI = null;
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

    export function toNumTry(value: NBI): NBI {
        if (typeof value == 'number') return value;

        if (JSBI.greaterThan(value, Number_MIN_SAFE_INTEGER) && JSBI.lessThan(value, Number_MAX_SAFE_INTEGER)) {
            return JSBI.toNumber(value);
        }

        return value;
    }

    export function toNum(value: NBI): number {
        if (typeof value == 'number') return value;

        if (JSBI.lessThanOrEqual(value, Number_MIN_SAFE_INTEGER)) {
            console.error('JSBIEx.toNum lessThanOrEqual Number.MIN_SAFE_INTEGER');
            return Number.MIN_SAFE_INTEGER + 1;
        }
        if (JSBI.greaterThanOrEqual(value, Number_MAX_SAFE_INTEGER)) {
            console.error('JSBIEx.toNum greaterThanOrEqual Number.MAX_SAFE_INTEGER');
            return Number.MAX_SAFE_INTEGER - 1;
        }
        return JSBI.toNumber(value);
    }

    export const precision = 10000;
    export const bprecision: BI = toBI(precision);
    export const Number_MIN_SAFE_INTEGER: BI = toBI(Number.MIN_SAFE_INTEGER);
    export const Number_MAX_SAFE_INTEGER: BI = toBI(Number.MAX_SAFE_INTEGER);

    export function Max(a: NBI, b: NBI): NBI {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThan(ba, bb) ? a : b;
    }

    export function MaxBI(a: NBI, b: NBI): BI {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThan(ba, bb) ? ba : bb;
    }

    export function Min(a: NBI, b: NBI): NBI {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThan(ba, bb) ? a : b;
    }

    export function MinBI(a: NBI, b: NBI): BI {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThan(ba, bb) ? ba : bb;
    }

    export function E(a: NBI, b: NBI): boolean {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.equal(ba, bb);
    }

    export function NE(a: NBI, b: NBI): boolean {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.notEqual(ba, bb);
    }

    export function L(a: NBI, b: NBI): boolean {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThan(ba, bb);
    }

    export function LE(a: NBI, b: NBI): boolean {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.lessThanOrEqual(ba, bb);
    }

    export function G(a: NBI, b: NBI): boolean {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThan(ba, bb);
    }

    export function GE(a: NBI, b: NBI): boolean {
        const ba = toBI(a), bb = toBI(b);
        return JSBI.greaterThanOrEqual(ba, bb);
    }

    export function Clamp(value: NBI, min: NBI, max: NBI): NBI {
        const bValue = toBI(value), bMin = toBI(min), bMax = toBI(max);
        return JSBI.lessThan(bValue, bMin)
            ? min
            : JSBI.greaterThan(bValue, bMax)
                ? max
                : value;
    }

    export function ClampBI(value: NBI, min: NBI, max: NBI): BI {
        const bValue = toBI(value), bMin = toBI(min), bMax = toBI(max);
        return JSBI.lessThan(bValue, bMin)
            ? bMin
            : JSBI.greaterThan(bValue, bMax) ? bMax : bValue;
    }

    export function Add(a: NBI, b: NBI): NBI {
        if (typeof a == 'number'
            && typeof b == 'number'
            && !Number.isNaN(a)
            && Number.isFinite(a)
            && !Number.isNaN(b)
            && Number.isFinite(b)
            && Number.isSafeInteger(Math.floor(Math.abs(a)))
            && Number.isSafeInteger(Math.floor(Math.abs(b)))
            && Number.isSafeInteger(Math.floor(Math.abs(a + b)))) {
            // safe number
            return a + b;
        }
        else {
            let ba: BI = typeof a == 'number' ? toBI(a) : a;
            let bb: BI = typeof b == 'number' ? toBI(b) : b;
            return toNumTry(JSBI.add(ba, bb));
        }
    }

    export function AddBI(a: NBI, b: NBI): BI {
        return toBI(Add(a, b));
    }

    export function Sub(a: NBI, b: NBI): NBI {
        if (typeof a == 'number'
            && typeof b == 'number'
            && !Number.isNaN(a)
            && Number.isFinite(a)
            && !Number.isNaN(b)
            && Number.isFinite(b)
            && Number.isSafeInteger(Math.floor(Math.abs(a)))
            && Number.isSafeInteger(Math.floor(Math.abs(b)))
            && Number.isSafeInteger(Math.floor(Math.abs(a - b)))) {
            // safe number
            return a + b;
        }
        else {
            let ba: BI = typeof a == 'number' ? toBI(a) : a;
            let bb: BI = typeof b == 'number' ? toBI(b) : b;
            return toNumTry(JSBI.subtract(ba, bb));
        }
    }

    export function SubBI(a: NBI, b: NBI): BI {
        return toBI(Sub(a, b));
    }

    export function Mul(value: NBI, mul: NBI): NBI {
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
            let bi: BI = typeof value == 'number' ? toBI(value) : value;
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

    export function MulBI(value: NBI, mul: NBI): BI {
        return toBI(Mul(value, mul));
    }

    export function Div(value: NBI, div: NBI): BI | number {
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
            let bi: BI = typeof value == 'number' ? toBI(value) : value;
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

    export function DivBI(value: NBI, div: NBI): BI {
        return toBI(Div(value, div));
    }

    const jsbiPowMapCache: Map<number, Map<number, BI | number>> = new Map();
    export function ClearCache() {
        jsbiPowMapCache.clear();
    }

    function jsbiMapPow(map: Map<number, BI | number>, base: number, exponent: number, last: number): BI | number {
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

    export function Pow(base: number, exponent: number): BI | number {

        if (!Number.isFinite(exponent) || exponent < 0) throw 'JSBIEx not supported ' + base + ' ' + exponent;

        let intExponent = Math.floor(exponent);
        let last = exponent == intExponent ? 1 : Math.pow(base, exponent - intExponent);

        let map = jsbiPowMapCache.get(base);
        if (!map) {
            map = new Map<number, BI>();
            jsbiPowMapCache.set(base, map);
        }

        return jsbiMapPow(map, base, intExponent, last);
    }
}