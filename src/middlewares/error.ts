import httpStatus from "http-status";
import express from "express";
import config from "../config";


const errorConverter = (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    let error = err;
    if (!(error instanceof APIError)) {
        const statusCode =
            error.statusCode
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new APIError(statusCode, message, false, err.stack);
    }
    next(error);
};

const errorHandler = (err: APIError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    let { statusCode, message } = err;
    if (config.env === "production" && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[`${statusCode}_NAME`] as string;
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === "development" && { stack: err.stack }),
    };

    if (config.env === "development") {
        console.error(err);
    }

    res.status(statusCode).send(response);
};

class APIError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true,
        public stack = ""
    ) {
        super(message)
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {
    APIError,
    errorConverter,
    errorHandler
}