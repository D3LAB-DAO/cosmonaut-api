import { existsSync } from 'fs';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { rust, cosm, getUid } from "@d3lab/services";
import { RustFiles, APIError } from "@d3lab/types";
import conf from "@d3lab/config";
import {saveCodeFiles, srcStrip} from '@d3lab/utils'

const fmtCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const beforeFmtFiles: RustFiles = req.body["files"];
        const afterFmtFiles: RustFiles = {};

        if (conf.isLocalRust === true) {
            for (let [key, value] of Object.entries(beforeFmtFiles)) {
                afterFmtFiles[key] = await rust.rustfmt(value, conf.isLocalRust);
            }
        } else {
            for (let [key, value] of Object.entries(beforeFmtFiles)) {
                afterFmtFiles[key] = await rust.rustfmt(value);
            }
        }

        res.send({
            result: afterFmtFiles,
        });
    } catch (err) {
        next(err);
    }
};

const clippy = async (req: Request, res: Response, next: NextFunction) => {
    let uid;
    const lesson = Number(req.body.lesson);
    const chapter = Number(req.body.chapter);
    try {
        uid = getUid(req);
        cosm.checkTarget(lesson, chapter);
        await cosm.checkLessonRange(lesson, chapter);
    } catch (error) {
        return next(error);
    }

    const srcpath = cosm.getCosmFilePath(req.app.locals.cargoPrefix, uid, lesson, chapter, true)
    if (!existsSync(srcpath)) {
        next(new Error("This chapter does not exist on you"))
    }
    await saveCodeFiles(req.body['files'], srcpath)

    const dirpath = srcStrip(srcpath)
    try {
        const result = await cosm.Run("clippy", dirpath);
        res.json({result})

    } catch (err) {
        if (typeof err === 'string') {
            return next(new APIError(httpStatus.BAD_REQUEST, err));
        }
    }
}

export { fmtCodes, clippy };
