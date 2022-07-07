declare global {
    var MY_CWD: string;

    namespace Express {
        interface Request {
            isAuthenticated(): boolean;
        }
    }
}

declare module "express-session" {
    interface SessionData {
        returnTo: string
        user: string
        jwt: string
    }
}

export {};
