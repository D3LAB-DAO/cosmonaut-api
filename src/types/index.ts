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

interface PassportEmail {
    value: string
    type?: string
}

interface PassportPhoto {
    value: string // URL of the image
}

interface PassportProfile {
    provider: string
    id: string
    displayName?: string
    name?: {
        familyName?: string
        givenName?: string
        middleName?: string
    }
    emails?: PassportEmail[]
    photos?: PassportPhoto[]

}

export {
    Base64,
    CargoReturn,
    FmtFiles,
    APIError,
    PassportProfile
};