import path from 'path';
import {Request} from 'express';

function getCosmFilePath(
    prefix: string,
    uid: string,
    lesson: string,
    chapter: string,
    withSrc: boolean
): string {
    if (withSrc) {
        return path.join(process.cwd(), prefix, `${uid}/lesson${lesson}/ch${chapter}/src`);
    }
    return path.join(process.cwd(), prefix, `${uid}/lesson${lesson}/ch${chapter}`);
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