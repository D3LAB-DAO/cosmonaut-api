import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { rust } from "@d3lab/services";
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
    let uid;
    if (req.session.passport) {
        uid = req.session.passport.user.issuer + "-" + req.session.passport.user.id
    }
    if (uid === undefined) {
        return next(new APIError(httpStatus.BAD_REQUEST, "your login session was expired"));
    }
    const lesson = req.body.lesson ? req.body.lesson : undefined;
    const chapter = req.body.chapter ? req.body.chapter : undefined;
    if (lesson === undefined || chapter === undefined) {
        return next(new APIError(httpStatus.BAD_REQUEST, "you must fill lesson & chapter name"))
    }

    await saveCodeFiles(req.body['files'], req.app.locals.cargoPrefix, uid, lesson, chapter)

    try {
        const result = await rust.cosmRun("clippy", uid, lesson, chapter);
        res.json({result})

    } catch (err) {
        if (typeof err === 'string') {
            return next(new APIError(httpStatus.BAD_REQUEST, err));
        }
    }
}

export { fmtCodes, clippy };
