import path from 'path';
import fs from 'fs';

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function extracted(root: string, userPath: string, type: string) {
    const target = path.join(root, userPath);
    fs.readFile(`${target}/${type}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(data);
    });
}

export {
    sleep,
    extracted
}