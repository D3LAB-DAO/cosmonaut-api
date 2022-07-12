import { spawn } from "child_process";
import pidtree from "pidtree";
import { Base64 } from "@d3lab/types";
import conf from "@d3lab/config";
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

async function cosmRun(
    cmd: string,
    projPath: string
): Promise<string> {
    let subprocess = spawn("make", [
        cmd,
        `TARGET_PATH=${projPath}`,
    ]);
    let result = "";
    let error = "";

    const subTimeout = setTimeout(() => {
        result = "";
        error = "Your code execution time is over the maximum\n";

        pidtree(subprocess.pid as number, (err, pids) => {
            if (pids === undefined) {
                return;
            } else {
                for (let i = 0; i < pids.length; i++) {
                    if (i === 0) {
                        process.kill(pids[i], "SIGTERM");
                    } else {
                        process.kill(pids[i], "SIGKILL");
                    }
                }
            }
        });
    }, conf.timeout.rust);

    subprocess.stdout.on("data", (data) => {
        if (data instanceof Buffer) {
            result += data.toString();
        }
    });

    subprocess.stderr.on("data", (data) => {
        if (data instanceof Buffer) {
            error += data.toString();
        }
    });

    return new Promise((resolve, reject) => {
        subprocess.on("close", (exitCode) => {
            clearTimeout(subTimeout)
            if (result !== "") {
                resolve(result);
            } else {
                reject(error.split('make')[0]);
            }
        });
    });
}

export { cosmRun, rustfmt, rustfmt2 };
