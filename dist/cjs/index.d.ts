export declare namespace JSBIEx {
    const precision = 10000;
    const bprecision: bigint;
    function toBI(value: number | bigint): bigint;
    const Number_MIN_SAFE_INTEGER: bigint;
    const Number_MAX_SAFE_INTEGER: bigint;
    function Max(a: number | bigint, b: number | bigint): bigint;
    function Min(a: number | bigint, b: number | bigint): bigint;
    function Clamp(value: number | bigint, min: number | bigint, max: number | bigint): bigint;
    function Mul(value: number | bigint, mul: number | bigint): number | bigint;
    function MulBI(value: number | bigint, mul: number | bigint): bigint;
    function Div(value: number | bigint, div: number | bigint): bigint | number;
    function DivBI(value: number | bigint, div: number | bigint): bigint;
    function ClearCache(): void;
    function Pow(base: number, exponent: number): bigint | number;
}
