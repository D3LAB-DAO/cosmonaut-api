import fs from 'fs';
import {Request, Response, NextFunction} from "express";
import httpStatus from 'http-status';
import {rust} from "@d3lab/services";
import {APIError} from "@d3lab/types";
import {sleep, saveCodeFiles, getCosmFilePath} from "@d3lab/utils";

const cosminit = async (req: Request, res: Response, next: NextFunction) => {
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
        return next(new APIError(httpStatus.BAD_REQUEST, "you must use correct lesson & chapter name"))
    }

    try {
        const genfilePath =  getCosmFilePath(req.app.locals.cargoPrefix, uid, lesson, chapter, 'main.rs')
        await rust.cosmRun("cosm-init", uid, lesson, chapter);
        await sleep(1000)
        if (fs.existsSync(genfilePath)) {
            res.json({isGen: true})
        } else {
            res.json({isGen: false})
        }
    } catch (err) {
        return next(new APIError(httpStatus.INTERNAL_SERVER_ERROR, "Occur unexpected error during make a cosm project"));
    }
}

const cosmBuild = async (req: Request, res: Response, next: NextFunction) => {
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
        const data = await rust.cosmRun("cosm-build", uid, lesson, chapter);
        res.json({answer: data})

    } catch (err) {
        if (typeof err === 'string') {
            return next(new APIError(httpStatus.BAD_REQUEST, err));
        }
    }
}

export {
    cosminit,
    cosmBuild
}