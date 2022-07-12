import fs from 'fs';
import path from 'path';
import {Request, Response, NextFunction} from 'express';
import httpStatus from 'http-status';
import {rust, cosm, getUid} from '@d3lab/services';
import {APIError} from '@d3lab/types';
import {sleep, saveCodeFiles} from '@d3lab/utils';

const cosminit = async (req: Request, res: Response, next: NextFunction) => {

    const uid = getUid(req)
    if (uid === undefined) {
        return next(new APIError(httpStatus.BAD_REQUEST, "your login session was expired"));
    }


    if (!cosm.checkTarget(req)) {
        return next(new APIError(httpStatus.BAD_REQUEST, "you must fill lesson & chapter name"))
    }

    try {
        const genfilePath =  path.join(cosm.getCosmFilePath(req.app.locals.cargoPrefix, uid, req.body.lesson, req.body.chapter), 'main.rs')
        console.log(genfilePath)
        await rust.cosmRun("cosm-init", uid, req.body.lesson, req.body.chapter);
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
        const data = await rust.cosmRun("cosm-build", uid, req.body.lesson, req.body.chapter);
        res.json({answer: data})

    } catch (err) {
        if (typeof err === 'string') {
            return next(new APIError(httpStatus.BAD_REQUEST, err));
        }
    }
}

const cosmLoadCodes = async (req: Request, res: Response, next: NextFunction) => {

}

export {
    cosminit,
    cosmBuild
}