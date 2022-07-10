declare global {
    var MY_CWD: string;

    namespace Express {
        interface Request {
            isAuthenticated(): boolean;
        }

        interface User {
            id: string;
            issuer: string;
        }
    }
}

declare module "express-session" {
    interface SessionData {
        returnTo?: string
        progress?: object
        passport?: {
            user: {
                id: string
                issuer: string
            }
        }
    }
}

export {};
