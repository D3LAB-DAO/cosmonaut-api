import { NextFunction, Request, Response } from "express";
import { rust } from "@d3lab/services";
import { RustFiles } from "@d3lab/types";
import conf from "@d3lab/config";

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

export { fmtCodes };
