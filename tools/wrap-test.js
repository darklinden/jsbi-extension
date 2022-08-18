import * as fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const node_modules = path.join(__dirname, '..', 'node_modules')
const result = execSync("ls " + node_modules, { encoding: 'utf8' });
const packages = result.split('\n')

const folder = path.join(__dirname, '..', 'test', 'esm');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(folder, file_path => {

    let des_path = '';
    if (file_path.endsWith('.js')) {
        des_path = file_path.substring(0, file_path.length - 3) + '.mjs';
    }
    else if (file_path.endsWith('.js.map')) {
        des_path = file_path.substring(0, file_path.length - 7) + '.mjs.map';
    }

    if (des_path.length) {
        fs.rename(file_path, des_path, function (err) {
            if (err) console.log('ERROR: ' + err);

            let original = fs.readFileSync(des_path, { encoding: 'utf8' });

            let lines = original.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                const m = line.match(/from\W*['\"](.*)['\"]/);
                if (m) {
                    if (packages.indexOf(m[1]) == -1) {
                        line = line.replace(/from\W*\"(.*)\"/g, 'from \'' + '$1' + '.mjs\';');
                        lines[i] = line;
                    }
                }
            }

            original = lines.join('\n');
            fs.writeFileSync(des_path, original);
        });
    }
});