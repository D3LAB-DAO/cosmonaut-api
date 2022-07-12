import path from 'path';
import {Request} from 'express';

function getCosmFilePath(
    prefix: string,
    uid: string,
    lesson: string,
    chapter: string
): string {
    return path.join(process.cwd(), prefix, `${uid}/${lesson}/${chapter}/src`);
}

function checkTarget(req: Request): boolean {
    const lesson = req.body.lesson ? req.body.lesson : undefined;
    const chapter = req.body.chapter ? req.body.chapter : undefined;
    if (lesson === undefined || chapter === undefined) {
        return false;
    }
    return true;
}

export {
    getCosmFilePath,
    checkTarget
}