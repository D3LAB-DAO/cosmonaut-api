type Base64 = string;
type CargoReturn = string | null;

interface FmtFiles {
    [key: string]: Base64
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

export {
    Base64,
    CargoReturn,
    FmtFiles,
    APIError
};