import { spawn } from "child_process";
import { Base64 } from "@d3lab/types";
import {b64ToStr} from "@d3lab/utils"

function rustfmt(raw: Base64): Promise<Base64> {
    let subprocess = spawn("rustfmt");
    subprocess.stdin.write(b64ToStr(raw));
    subprocess.stdin.end();
    return new Promise((resolve, reject) => {
        subprocess.stdout.on("data", (data) => {
            if (data instanceof Buffer) {
                resolve(data.toString("base64"));
            }
        });

        subprocess.stderr.on("data", (err) => {
            if (err instanceof Buffer) {
                reject(err.toString("base64"));
            }
        });
    });
}

function rustfmt2(raw: Base64): Promise<Base64> {
    let subprocess = spawn("make", ["rustfmt"]);
    subprocess.stdin.write(b64ToStr(raw));
    subprocess.stdin.end();

    return new Promise((resolve, reject) => {
        subprocess.stdout.on("data", (data) => {
            if (data instanceof Buffer) {
                resolve(data.toString("base64"));
            }
        });

        subprocess.stderr.on("data", (err) => {
            if (err instanceof Buffer) {
                reject(err.toString("base64"));
            }
        });
    });
}

export { rustfmt, rustfmt2 };
