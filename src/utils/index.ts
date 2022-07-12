import path from "path";
import fs, { write } from "fs";
import { writeFile } from "fs/promises";
import { Base64, RustFiles } from "@d3lab/types";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function extracted(
    root: string,
    userPath: string,
    type: string
): string | undefined {
    const target = path.join(root, userPath);
    try {
        console.log(target);
        return fs.readFileSync(`${target}/${type}`, { encoding: "utf8" });
    } catch (err) {
        console.error(err);
    }
}

const b64ToStr = (raw: Base64): string => {
    return Buffer.from(raw, "base64").toString("utf-8");
};

async function _saveCode(path: string, file: Base64) {
    try {
        const stringCode = b64ToStr(file).trim();
        await writeFile(path, stringCode);
    } catch (err) {
        console.error(err);
    }
}

async function saveCodeFiles(files: RustFiles, prefix: string, uid: string, lesson: string, chapter: string) {
    try {
        for (let [key, value] of Object.entries(files)) {
            const fpath = getCosmFilePath(prefix, uid, lesson, chapter, key)
            await _saveCode(fpath, value);
        }
    } catch (err) {
        console.error(err);
    }
}

function getCosmFilePath(prefix: string, uid: string, lesson: string, chapter: string, filename: string): string {
    return path.join(process.cwd(), prefix, `${uid}/${lesson}/${chapter}/src/${filename}`)
}

export { sleep, extracted, b64ToStr, saveCodeFiles, getCosmFilePath };
