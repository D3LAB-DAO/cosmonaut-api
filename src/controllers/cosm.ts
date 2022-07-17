import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { cosm, getUid } from "@d3lab/services";
import { APIError } from "@d3lab/types";
import { sleep, saveCodeFiles, lodeCodeFiles, srcStrip } from "@d3lab/utils";
import { getAssetLoc, setAssetLoc, checkLessonRange } from "@d3lab/models/cosm";

const cosminit = async (req: Request, res: Response, next: NextFunction) => {
    const uid = getUid(req);
    if (uid === undefined) {
        return next(
            new APIError(
                httpStatus.BAD_REQUEST,
                "your login session was expired"
            )
        );
    }
    if (!cosm.checkTarget(req)) {
        return next(
            new APIError(
                httpStatus.BAD_REQUEST,
                "you must fill lesson & chapter name"
            )
        );
    }
    if (!await checkLessonRange(Number(req.body.lesson), Number(req.body.chapter))) {
        return next(new APIError(httpStatus.BAD_REQUEST, "This lesson or chapter does not exist."))
    }


    try {
        const genfilePath = path.join(
            cosm.getCosmFilePath(
                req.app.locals.cargoPrefix,
                uid,
                req.body.lesson,
                req.body.chapter,
                true
            ),
            "main.rs"
        );
        await cosm.Run(
            "cosm-init",
            srcStrip(genfilePath).split("/cargo-projects/")[1]
        );
        await sleep(1000);
        if (fs.existsSync(genfilePath)) {
            if (req.body.chapter === "1") {
                await setAssetLoc(req, "start");
            } else {
                await setAssetLoc(req, "doing");
            }
            res.json({ isGen: true });
        } else {
            res.json({ isGen: false });
        }
    } catch (err) {
        return next(
            new APIError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Occur unexpected error during make a cosm project"
            )
        );
    }
};

const cosmBuild = async (req: Request, res: Response, next: NextFunction) => {
    const uid = getUid(req);
    if (uid === undefined) {
        return next(
            new APIError(
                httpStatus.BAD_REQUEST,
                "your login session was expired"
            )
        );
    }
    if (!cosm.checkTarget(req)) {
        return next(
            new APIError(
                httpStatus.BAD_REQUEST,
                "you must fill lesson & chapter name"
            )
        );
    }
    if (!await checkLessonRange(Number(req.body.lesson), Number(req.body.chapter))) {
        return next(new APIError(httpStatus.BAD_REQUEST, "This lesson or chapter does not exist."))
    }

    const srcpath = cosm.getCosmFilePath(
        req.app.locals.cargoPrefix,
        uid,
        req.body.lesson,
        req.body.chapter,
        true
    );
    await saveCodeFiles(req.body["files"], srcpath);

    const dirpath = srcStrip(srcpath);
    try {
        const data = await cosm.Run("cosm-build", dirpath);

        if (true) {
            setAssetLoc(req, "done");
        }

        res.json({ answer: data });
    } catch (err) {
        if (typeof err === "string") {
            return next(new APIError(httpStatus.BAD_REQUEST, err));
        }
    }
};

const cosmLoadCodes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const uid = getUid(req);
    if (uid === undefined) {
        return next(
            new APIError(
                httpStatus.BAD_REQUEST,
                "your login session was expired"
            )
        );
    }
    if (!await checkLessonRange(Number(req.query.lesson), Number(req.query.chapter))) {
        return next(new APIError(httpStatus.BAD_REQUEST, "This lesson or chapter does not exist."))
    }

    if (req.query.lesson && req.query.chapter) {
        const srcpath = cosm.getCosmFilePath(
            req.app.locals.cargoPrefix,
            uid,
            req.query.lesson as string,
            req.query.chapter as string,
            true
        );
        const files = await lodeCodeFiles(srcpath);
        res.json(files);
    } else {
        return next(
            new APIError(
                httpStatus.BAD_REQUEST,
                "you must fill lesson & chapter name"
            )
        );
    }
};

const getLessonPicture = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let assetSuffix = await getAssetLoc(req);
    if (assetSuffix instanceof Error) {
        next(assetSuffix);
    } else {
        const assetPath = path.join(process.cwd(), assetSuffix);
        res.sendFile(assetPath);
    }
};

export { cosminit, cosmBuild, cosmLoadCodes, getLessonPicture };
