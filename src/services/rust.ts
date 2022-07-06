import {spawn} from "child_process";
import {Base64} from "@d3lab/types";

const b64ToStr = (raw: Base64): string => {
    return Buffer.from(raw, 'base64').toString('utf-8')
}

function rustfmt(raw: Base64): Promise<Base64> {
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

function rustfmt2(raw: Base64): Promise<Base64> {
    let subprocess = spawn("make", ["rustfmt"])
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

async function cosmRun(cmd: string, owner: string, proj: string, lecture: string): Promise<string> {
    let subprocess = spawn("make", [cmd, `OWNER=${owner}`, `PROJ=${proj}`, `LEC=${lecture}`])
    let result = "";

    subprocess.stdout.on('data', (data) => {
        if (data instanceof Buffer) {
            result += data.toString()
        }
    });

    return new Promise((resolve, reject) => {
        subprocess.on('close', (exitCode) => {
            resolve(result)
        })

    })
}

export {
    cosmRun,
    rustfmt,
    rustfmt2
};