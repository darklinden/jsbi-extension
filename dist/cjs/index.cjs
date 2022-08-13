export let BIEx;

(function (_BIEx) {
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

  _BIEx.toBI = toBI;

  function toNumTry(value) {
    if (typeof value == 'number') return value;

    if (value > Number_MIN_SAFE_INTEGER && value < Number_MAX_SAFE_INTEGER) {
      return Number(value);
    }

    return value;
  }

  _BIEx.toNumTry = toNumTry;

  function toNum(value) {
    if (typeof value == 'number') return value;

    if (value <= Number_MIN_SAFE_INTEGER) {
      console.error('JSBIEx.toNum lessThanOrEqual Number.MIN_SAFE_INTEGER');
      return Number.MIN_SAFE_INTEGER + 1;
    }

    if (value >= Number_MAX_SAFE_INTEGER) {
      console.error('JSBIEx.toNum greaterThanOrEqual Number.MAX_SAFE_INTEGER');
      return Number.MAX_SAFE_INTEGER - 1;
    }

    return Number(value);
  }

  _BIEx.toNum = toNum;
  const precision = _BIEx.precision = 10000;
  const bprecision = _BIEx.bprecision = toBI(precision);
  const Number_MIN_SAFE_INTEGER = _BIEx.Number_MIN_SAFE_INTEGER = toBI(Number.MIN_SAFE_INTEGER);
  const Number_MAX_SAFE_INTEGER = _BIEx.Number_MAX_SAFE_INTEGER = toBI(Number.MAX_SAFE_INTEGER);

  function Max(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba > bb ? a : b;
  }

  _BIEx.Max = Max;

  function MaxBI(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba > bb ? ba : bb;
  }

  _BIEx.MaxBI = MaxBI;

  function Min(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba < bb ? a : b;
  }

  _BIEx.Min = Min;

  function MinBI(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba < bb ? ba : bb;
  }

  _BIEx.MinBI = MinBI;

  function E(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba === bb;
  }

  _BIEx.E = E;

  function NE(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba !== bb;
  }

  _BIEx.NE = NE;

  function L(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba < bb;
  }

  _BIEx.L = L;

  function LE(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba <= bb;
  }

  _BIEx.LE = LE;

  function G(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba > bb;
  }

  _BIEx.G = G;

  function GE(a, b) {
    const ba = toBI(a),
          bb = toBI(b);
    return ba >= bb;
  }

  _BIEx.GE = GE;

  function Clamp(value, min, max) {
    const bValue = toBI(value),
          bMin = toBI(min),
          bMax = toBI(max);
    return bValue < bMin ? min : bValue > bMax ? max : value;
  }

  _BIEx.Clamp = Clamp;

  function ClampBI(value, min, max) {
    const bValue = toBI(value),
          bMin = toBI(min),
          bMax = toBI(max);
    return bValue < bMin ? bMin : bValue > bMax ? bMax : bValue;
  }

  _BIEx.ClampBI = ClampBI;

  function Add(a, b) {
    if (typeof a == 'number' && typeof b == 'number' && !Number.isNaN(a) && Number.isFinite(a) && !Number.isNaN(b) && Number.isFinite(b) && Number.isSafeInteger(Math.floor(Math.abs(a))) && Number.isSafeInteger(Math.floor(Math.abs(b))) && Number.isSafeInteger(Math.floor(Math.abs(a + b)))) {
      // safe number
      return a + b;
    } else {
      let ba = typeof a == 'number' ? toBI(a) : a;
      let bb = typeof b == 'number' ? toBI(b) : b;
      return toNumTry(ba + bb);
    }
  }

  _BIEx.Add = Add;

  function AddBI(a, b) {
    return toBI(Add(a, b));
  }

  _BIEx.AddBI = AddBI;

  function Sub(a, b) {
    if (typeof a == 'number' && typeof b == 'number' && !Number.isNaN(a) && Number.isFinite(a) && !Number.isNaN(b) && Number.isFinite(b) && Number.isSafeInteger(Math.floor(Math.abs(a))) && Number.isSafeInteger(Math.floor(Math.abs(b))) && Number.isSafeInteger(Math.floor(Math.abs(a - b)))) {
      // safe number
      return a + b;
    } else {
      let ba = typeof a == 'number' ? toBI(a) : a;
      let bb = typeof b == 'number' ? toBI(b) : b;
      return toNumTry(ba - bb);
    }
  }

  _BIEx.Sub = Sub;

  function SubBI(a, b) {
    return toBI(Sub(a, b));
  }

  _BIEx.SubBI = SubBI;

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

  _BIEx.Mul = Mul;

  function MulBI(value, mul) {
    return toBI(Mul(value, mul));
  }

  _BIEx.MulBI = MulBI;

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

  _BIEx.Div = Div;

  function DivBI(value, div) {
    return toBI(Div(value, div));
  }

  _BIEx.DivBI = DivBI;
  const jsbiPowMapCache = new Map();

  function ClearCache() {
    jsbiPowMapCache.clear();
  }

  _BIEx.ClearCache = ClearCache;

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

  _BIEx.Pow = Pow;
})(BIEx || (BIEx = {}));