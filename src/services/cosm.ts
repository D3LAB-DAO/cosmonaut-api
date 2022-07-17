import path from 'path';
import {Request} from 'express';
import { spawn } from "child_process";
import pidtree from "pidtree";
import conf from "@d3lab/config";

function getCosmFilePath(
    prefix: string,
    uid: string,
    lesson: string,
    chapter: string,
    withSrc: boolean
): string {
    if (withSrc) {
        return path.join(process.cwd(), prefix, `${uid}/lesson${lesson}/chapter${chapter}/src`);
    }
    return path.join(process.cwd(), prefix, `${uid}/lesson${lesson}/chapter${chapter}`);
}

function checkTarget(req: Request): boolean {
    const lesson = req.body.lesson ? req.body.lesson : undefined;
    const chapter = req.body.chapter ? req.body.chapter : undefined;
    if (lesson === undefined || chapter === undefined) {
        return false;
    }
    return true;
}

async function Run(
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

export {
    getCosmFilePath,
    checkTarget,
    Run
}