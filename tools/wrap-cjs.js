import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import { transformSync } from '@babel/core'
import { default as x } from 'babel-plugin-transform-jsbi-to-bigint'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src_path = path.join(__dirname, '..', 'src', 'index.ts');
const des_path = path.join(__dirname, '..', 'dist', 'cjs', 'index.cjs');

let original = fs.readFileSync(src_path, { encoding: 'utf8' });

const result = transformSync(original, {
    presets: ["@babel/preset-typescript"],
    filename: src_path,
    plugins: [x]
});

fs.writeFileSync(des_path, result.code);

const declare_path = path.join(__dirname, '..', 'dist', 'cjs', 'index.d.ts');
original = fs.readFileSync(declare_path, { encoding: 'utf8' });

let lines = original.split('\n');
lines.splice(0, 1);
for (let i = 1; i < lines.length; i++) {
    let line = lines[i];

    line = line.replace(/JSBI/g, 'bigint');
    lines[i] = line;
}

original = lines.join('\n');
fs.writeFileSync(declare_path, original);
