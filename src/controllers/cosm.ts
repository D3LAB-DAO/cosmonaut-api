import path from 'path';
import fs from 'fs';
import {Request, Response, NextFunction} from "express";
import httpStatus from 'http-status';
import {rust} from "@d3lab/services";
import {sleep, APIError} from "@d3lab/utils";

const cosminit = async (req: Request, res: Response, next: NextFunction) => {
    const userid = 'tkxkd0159'
    const lesson = req.body.lesson ? req.body.lesson : undefined;
    const chapter = req.body.chapter ? req.body.chapter : undefined;
    if (lesson === undefined || chapter === undefined) {
        return next(new APIError(httpStatus.BAD_REQUEST, "you must use correct lesson & chapter name"))
    }

    try {
        const genfilePath =  path.join(process.cwd(), 'cargo-projects/cosm', `${userid}/${lesson}/${chapter}/src/main.rs`)
        await rust.cosmRun("cosm-init", userid, lesson, chapter);
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

export {
    cosminit
}