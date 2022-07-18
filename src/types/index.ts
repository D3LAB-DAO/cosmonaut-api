import { RequestHandler } from "express";
import { Query, ParamsDictionary } from "express-serve-static-core";

type Base64 = string;
type CargoReturn = string | null;

interface RustFiles {
    [key: string]: Base64;
}

class APIError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true,
        public stack = ""
    ) {
        super(message);
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

interface PassportEmail {
    value: string;
    type?: string;
}

interface PassportPhoto {
    value: string; // URL of the image
}

interface PassportProfile {
    provider?: string;
    id: string;
    displayName: string;
    name?: {
        familyName?: string;
        givenName?: string;
        middleName?: string;
    };
    emails?: PassportEmail[];
    photos?: PassportPhoto[];
}

interface expressAsyncHandler {
    <P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query>(
        handler: (
            ...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
        ) => void | Promise<void>
    ): RequestHandler<P, ResBody, ReqBody, ReqQuery>;
}

interface CosmAns {
    answer_type: string
    lesson: number
    result: string
    errors: any[]
    differences: any[]
}


export {
    Base64,
    CargoReturn,
    RustFiles,
    APIError,
    PassportProfile,
    expressAsyncHandler,
    CosmAns
};
