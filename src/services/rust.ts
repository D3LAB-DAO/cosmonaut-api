import {spawn} from "child_process";
import {base64} from "../types";

const b64ToStr = (raw: base64): string => {
    return Buffer.from(raw, 'base64').toString('utf-8')
}

function rustfmt(raw: base64): Promise<base64> {
    let subprocess = spawn("rustfmt")
    subprocess.stdin.write(b64ToStr(raw))
    subprocess.stdin.end()
    return new Promise((resolve, reject) => {
        subprocess.stdout.on('data', (data) => {
            if (data instanceof Buffer) {
                resolve(data.toString('base64'))
            }
        });

        subprocess.stderr.on('data', (err) => {
            if (err instanceof Buffer) {
                reject(err.toString('base64'));
            }
        })

    })
}

const build = (): string => {
    return "I am rust build function"
}

export {
    build,
    rustfmt
};