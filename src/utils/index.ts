import path from 'path';
import fs from 'fs';

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function extracted(root: string, userPath: string, type: string): string|undefined {
    const target = path.join(root, userPath);
    try {
        console.log(target)
        return fs.readFileSync(`${target}/${type}`, {encoding: 'utf8'});
    } catch (err) {
        console.error(err)
    }
}

export {
    sleep,
    extracted
}