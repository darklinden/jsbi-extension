import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import { transformSync } from '@babel/core'
import { default as jsbi_to_bigint } from 'babel-plugin-transform-jsbi-to-bigint'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src_file = path.join(__dirname, '..', 'src', 'index.ts');
const cjs_file = path.join(__dirname, '..', 'dist', 'cjs', 'index.cjs');
const dts_file = path.join(__dirname, '..', 'dist', 'types', 'index.d.ts');

// wrap cjs
{
    let original = fs.readFileSync(src_file, { encoding: 'utf8' });

    const result = transformSync(original, {
        presets: ["@babel/preset-typescript"],
        filename: src_file,
        plugins: [jsbi_to_bigint,
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties", { "loose": true }]
        ]
    });

    fs.mkdirSync(path.join(__dirname, '..', 'dist', 'cjs'), { recursive: true });
    fs.writeFileSync(cjs_file, result.code);
}

// wrap dts
{
    let original = fs.readFileSync(dts_file, { encoding: 'utf8' });

    let lines = original.split('\n');

    // remove import
    lines.splice(0, 1);

    // replace JSBI
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        line = line.replace(/JSBI/g, 'bigint');
        lines[i] = line;
    }

    original = lines.join('\n');

    fs.writeFileSync(dts_file, original);
}
