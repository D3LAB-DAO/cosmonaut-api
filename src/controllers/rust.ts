import {Request, Response} from "express";
import {rust} from "@d3lab/services";
import {FmtFiles} from "@d3lab/types";

const fmtCodes = async (req: Request, res: Response) => {
    try {

        const beforeFmtFiles: FmtFiles = req.body['files'];
        const afterFmtFiles: FmtFiles = {};
        for (let [key, value] of Object.entries(beforeFmtFiles)) {
            afterFmtFiles[key] = await rust.rustfmt(value);
        }

        res.send({
            code: "success",
            result: afterFmtFiles
        });
    } catch (err) {
        res.send({
            code: "fail",
            result: err
        })
    }
};

export {
    fmtCodes
};