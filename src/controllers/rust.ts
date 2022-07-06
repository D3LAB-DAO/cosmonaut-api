import {NextFunction, Request, Response} from "express";
import {rust} from "@d3lab/services";
import {FmtFiles} from "@d3lab/types";

const fmtCodes = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const beforeFmtFiles: FmtFiles = req.body['files'];
        const afterFmtFiles: FmtFiles = {};
        for (let [key, value] of Object.entries(beforeFmtFiles)) {
            afterFmtFiles[key] = await rust.rustfmt(value);
        }

        res.send({
            result: afterFmtFiles
        });
    } catch (err) {
        next(err)
    }
};

export {
    fmtCodes
};