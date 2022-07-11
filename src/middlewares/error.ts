import httpStatus from "http-status";
import {Request, Response, NextFunction} from "express";
import config from "../config";
import { APIError } from "@d3lab/types";

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(error instanceof APIError)) {
        const statusCode = error.statusCode || httpStatus.BAD_REQUEST;
        const message = error.message || httpStatus[statusCode];
        error = new APIError(statusCode, message, false, err.stack);
    }
    next(error);
};

const errorHandler = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message } = err;
    if (config.nodeEnv === "production" && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[`${statusCode}_NAME`] as string;
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.nodeEnv === "development" && { stack: err.stack }),
    };

    if (config.nodeEnv === "development") {
        console.error(err);
    }

    res.status(statusCode).send(response);
};

export {
    errorConverter,
    errorHandler
}