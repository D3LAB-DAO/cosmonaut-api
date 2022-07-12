import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { rust, cosm, getUid } from "@d3lab/services";
import { RustFiles, APIError } from "@d3lab/types";
import conf from "@d3lab/config";
import {saveCodeFiles} from '@d3lab/utils'

const fmtCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const beforeFmtFiles: RustFiles = req.body["files"];
        const afterFmtFiles: RustFiles = {};

        if (conf.isLocalRust === "true") {
            for (let [key, value] of Object.entries(beforeFmtFiles)) {
                afterFmtFiles[key] = await rust.rustfmt(value);
            }
        } else {
            for (let [key, value] of Object.entries(beforeFmtFiles)) {
                afterFmtFiles[key] = await rust.rustfmt2(value);
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
    const uid = getUid(req)
    if (uid === undefined) {
        return next(new APIError(httpStatus.BAD_REQUEST, "your login session was expired"));
    }
    if (!cosm.checkTarget(req)) {
        return next(new APIError(httpStatus.BAD_REQUEST, "you must fill lesson & chapter name"))
    }

    const dirpath = cosm.getCosmFilePath(req.app.locals.cargoPrefix, uid, req.body.lesson, req.body.chapter)
    await saveCodeFiles(req.body['files'], dirpath)

    try {
        const result = await rust.cosmRun("clippy", uid, req.body.lesson, req.body.chapter);
        res.json({result})

    } catch (err) {
        if (typeof err === 'string') {
            return next(new APIError(httpStatus.BAD_REQUEST, err));
        }
    }
}

export { fmtCodes, clippy };
