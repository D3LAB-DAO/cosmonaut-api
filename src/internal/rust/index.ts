import {spawn} from "child_process";
import {base64} from "../type";

function rustfmt(raw: base64): Promise<base64> {
    // echo "fn main(){println!(\"test function\");}"|rustfmt
    const b64ToStr = Buffer.from(raw, 'base64').toString('utf-8')
    let subprocess = spawn("rustfmt")
    subprocess.stdin.write(b64ToStr)
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

export default {
    build: (): string => {
        return "I am rust build function"
    },
    fmt: rustfmt
};