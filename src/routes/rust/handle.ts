import {Request, Response} from "express";
import rust from "@d3lab/internal/rust";
import {base64} from "@d3lab/internal/type";

const fmtCodes = async (req: Request, res: Response) => {
    try {
        interface FmtFiles {
            [key: string]: base64
        }
        const beforeFmtFiles: FmtFiles = req.body;
        const afterFmtFiles: FmtFiles = {};
        for (let [key, value] of Object.entries(beforeFmtFiles)) {
            afterFmtFiles[key] = await rust.fmt(value);
        }

        res.send({
            code: "success",
            result: afterFmtFiles
        });
    } catch(err) {
        res.send({
            code: "fail",
            result: err
        })
    }
};

export {
    fmtCodes
};