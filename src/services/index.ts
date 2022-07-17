import { Request } from "express";
import httpStatus from "http-status";
import { APIError } from "@d3lab/types";

function getUid(req: Request): string {
    if (req.session.passport) {
        return (
            req.session.passport.user.issuer +
            "-" +
            req.session.passport.user.id
        );
    } else {
        throw new APIError(
            httpStatus.BAD_REQUEST,
            "your login session was expired"
        );
    }
}

export { getUid };
export * as rust from "./rust";
export * as cosm from "./cosm";
