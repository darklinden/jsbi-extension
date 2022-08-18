import { BIEx, NBI } from "../src/index";

let a: NBI, b: NBI, c: NBI;
a = 1000000000000;
b = 10000000000;

c = BIEx.Add(a, b)
console.log(BIEx.isBI(c), BIEx.toStr(c));

c = BIEx.Sub(a, b)
console.log(BIEx.isBI(c), BIEx.toStr(c));

c = BIEx.Mul(a, b)
console.log(BIEx.isBI(c), BIEx.toStr(c));

c = BIEx.Div(a, b)
console.log(BIEx.isBI(c), BIEx.toStr(c));

c = BIEx.Add(b, a)
console.log(BIEx.isBI(c), BIEx.toStr(c));

c = BIEx.Sub(b, a)
console.log(BIEx.isBI(c), BIEx.toStr(c));

c = BIEx.Mul(b, a)
console.log(BIEx.isBI(c), BIEx.toStr(c));

c = BIEx.Div(b, a)
console.log(BIEx.isBI(c), BIEx.toStr(c));
