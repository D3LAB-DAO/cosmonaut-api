import path from "path";
import { spawn } from "child_process";
import pidtree from "pidtree";
import { Request } from "express";
import httpStatus from "http-status";
import conf from "@d3lab/config";
import { APIError } from "@d3lab/types";
import { pg } from "@d3lab/db";
import { getProgress } from "@d3lab/models/cosm";

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
    return cosmPath;
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

async function checkLessonRange(lesson: number, chapter?: number) {
    let pgClient;
    try {
        pgClient = await pg.getClient();
        const res = await pgClient.query(
            "SELECT threshold FROM lesson_range WHERE lesson = $1",
            [lesson]
        );
        if (res.rows[0] === undefined) {
            throw new APIError(
                httpStatus.BAD_REQUEST,
                "This lesson does not exist."
            );
        }

        if (chapter !== undefined) {
            if (!(res.rows[0]["threshold"] >= chapter && chapter > 0)) {
                throw new APIError(
                    httpStatus.BAD_REQUEST,
                    "This chapter does not exist."
                );
            }
        }
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        } else {
            console.error(error);
        }
    } finally {
        pgClient?.release();
    }
}

async function checkProjOrder(req: Request, lesson: number, chapter: number) {
    try {
        if (chapter === 1 && lesson !== 0) {
            const currentUserProgress = await getProgress(req, lesson - 1);
            if (currentUserProgress["chapter"] !== 0) {
                throw new APIError(
                    httpStatus.BAD_REQUEST,
                    "You should finish previous lesson before start new lesson"
                );
            }
        }

        const currentUserProgress = await getProgress(req, lesson);
        const savedLesson = currentUserProgress["lesson"];
        const savedChapter = currentUserProgress["chapter"];

        if (savedChapter === -1 && chapter !== 1) {
            throw new APIError(
                httpStatus.BAD_REQUEST,
                "You must start new lesson first"
            );
        }

        if (chapter !== 1) {
            if (lesson !== savedLesson || chapter !== savedChapter + 1) {
                throw new APIError(
                    httpStatus.BAD_REQUEST,
                    "You must finish previous chapter first"
                );
            }
        }
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        } else {
            console.error(error);
        }
    }
}

export { getCosmFilePath, checkTarget, Run, checkLessonRange, checkProjOrder };
