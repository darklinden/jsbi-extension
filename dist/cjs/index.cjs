export let JSBIEx;

(function (_JSBIEx) {
  const precision = _JSBIEx.precision = 10000;
  const bprecision = _JSBIEx.bprecision = BigInt(precision);
  const jsbiCommonMapCache = new Map();

  function toBI(value) {
    if (typeof value == 'number') {
      let ret = null;
      const intValue = Math.round(value);

      if (Math.abs(intValue) < 1000) {
        ret = jsbiCommonMapCache.get(intValue);

        if (!ret) {
          ret = BigInt(intValue);
          jsbiCommonMapCache.set(intValue, ret);
        }
      }

      return ret || BigInt(intValue);
    } else return value;
  }

  _JSBIEx.toBI = toBI;
  const Number_MIN_SAFE_INTEGER = _JSBIEx.Number_MIN_SAFE_INTEGER = BigInt(Number.MIN_SAFE_INTEGER);
  const Number_MAX_SAFE_INTEGER = _JSBIEx.Number_MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);

  function Max(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba > bb ? ba : bb;
  }

  _JSBIEx.Max = Max;

  function Min(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba < bb ? ba : bb;
  }

  _JSBIEx.Min = Min;

  function Clamp(value, min, max) {
    const bValue = toBI(value),
          bMin = toBI(min),
          bMax = toBI(max);
    return bValue < bMin ? bMin : bValue > bMax ? bMax : bValue;
  }

  _JSBIEx.Clamp = Clamp;

  function Mul(value, mul) {
    if (typeof value == 'number' && typeof mul == 'number' && !Number.isNaN(value) && Number.isFinite(value) && !Number.isNaN(mul) && Number.isFinite(mul) && Number.isSafeInteger(Math.floor(Math.abs(value))) && Number.isSafeInteger(Math.floor(Math.abs(mul))) && Number.isSafeInteger(Math.floor(Math.abs(value * mul)))) {
      // safe number
      return value * mul;
    } else {
      // big int 
      let bi = typeof value == 'number' ? toBI(value) : value;

      if (typeof mul == 'number') {
        if (Math.floor(mul) == mul) {
          bi = bi * toBI(mul);
        } else {
          // 4 位精度
          bi = bi * toBI(mul * precision);
          bi = bi / bprecision;
        }
      } else {
        bi = bi * mul;
      }

      return bi;
    }
  }

  _JSBIEx.Mul = Mul;

  function MulBI(value, mul) {
    return toBI(Mul(value, mul));
  }

  _JSBIEx.MulBI = MulBI;

  function Div(value, div) {
    if (typeof value == 'number' && typeof div == 'number' && !Number.isNaN(value) && Number.isFinite(value) && !Number.isNaN(div) && Number.isFinite(div) && Number.isSafeInteger(Math.floor(Math.abs(value))) && Number.isSafeInteger(Math.floor(Math.abs(div))) && div != 0) {
      // safe number
      return value * div;
    } else {
      // big int 
      let bi = typeof value == 'number' ? toBI(value) : value;
      bi = bi * bprecision;
      bi = bi / toBI(div);

      if (bi > Number_MIN_SAFE_INTEGER && bi < Number_MAX_SAFE_INTEGER) {
        return Number(bi) / precision;
      }

      let bdiv = bi / bprecision;

      if (bdiv > Number_MIN_SAFE_INTEGER && bdiv < Number_MAX_SAFE_INTEGER) {
        return Number(bdiv);
      }

      return bdiv;
    }
  }

  _JSBIEx.Div = Div;

  function DivBI(value, div) {
    return toBI(Div(value, div));
  }

  _JSBIEx.DivBI = DivBI;
  const jsbiPowMapCache = new Map();

  function ClearCache() {
    jsbiPowMapCache.clear();
  }

  _JSBIEx.ClearCache = ClearCache;

  function jsbiMapPow(map, base, exponent, last) {
    let cursor = exponent;

    while (!map.has(cursor) && cursor > 0) cursor--;

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
    if (!Number.isFinite(exponent) || exponent < 0) throw 'JSBIEx not supported ' + base + ' ' + exponent;
    let intExponent = Math.floor(exponent);
    let last = exponent == intExponent ? 1 : Math.pow(base, exponent - intExponent);
    let map = jsbiPowMapCache.get(base);

    if (!map) {
      map = new Map();
      jsbiPowMapCache.set(base, map);
    }

    return jsbiMapPow(map, base, intExponent, last);
  }

  _JSBIEx.Pow = Pow;
})(JSBIEx || (JSBIEx = {}));