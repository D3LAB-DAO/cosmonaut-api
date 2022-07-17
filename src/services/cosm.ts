import path from "path";
import { spawn } from "child_process";
import pidtree from "pidtree";
import httpStatus from "http-status";
import conf from "@d3lab/config";
import { APIError } from "@d3lab/types";

function getCosmFilePath(
    prefix: string,
    uid: string,
    lesson: number,
    chapter: number,
    withSrc: boolean
): string {
    let cosmPath;
    if (withSrc) {
        cosmPath = path.join(
            process.cwd(),
            prefix,
            `${uid}/lesson${lesson}/chapter${chapter}/src`
        );
    } else {
        cosmPath = path.join(
            process.cwd(),
            prefix,
            `${uid}/lesson${lesson}/chapter${chapter}`
        );
    }
    return cosmPath

}

function checkTarget(lesson: number, chapter: number) {
    if (isNaN(lesson) || isNaN(chapter)) {
        throw new APIError(
            httpStatus.BAD_REQUEST,
            "you must fill lesson & chapter name"
        );
    }
}

async function Run(cmd: string, projPath: string): Promise<string> {
    let subprocess = spawn("make", [cmd, `TARGET_PATH=${projPath}`]);
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
            clearTimeout(subTimeout);
            if (result !== "") {
                resolve(result);
            } else {
                reject(error.split("make")[0]);
            }
        });
    });
}

export { getCosmFilePath, checkTarget, Run };
