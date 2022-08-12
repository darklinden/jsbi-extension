import JSBI from "jsbi";
export declare namespace JSBIEx {
    const precision = 10000;
    const bprecision: JSBI;
    function toBI(value: number | JSBI): JSBI;
    const Number_MIN_SAFE_INTEGER: JSBI;
    const Number_MAX_SAFE_INTEGER: JSBI;
    function Max(a: number | JSBI, b: number | JSBI): JSBI;
    function Min(a: number | JSBI, b: number | JSBI): JSBI;
    function Clamp(value: number | JSBI, min: number | JSBI, max: number | JSBI): JSBI;
    function Mul(value: number | JSBI, mul: number | JSBI): number | JSBI;
    function MulBI(value: number | JSBI, mul: number | JSBI): JSBI;
    function Div(value: number | JSBI, div: number | JSBI): JSBI | number;
    function DivBI(value: number | JSBI, div: number | JSBI): JSBI;
    function ClearCache(): void;
    function Pow(base: number, exponent: number): JSBI | number;
}
