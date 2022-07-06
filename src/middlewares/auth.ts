import { NextFunction, RequestHandler, Response, Request } from "express";

interface LoggedInOptions {
    redirectTo?: string | undefined; // URL to redirect to for login, defaults to /login
    setReturnTo?: boolean | undefined; // set redirectTo in session
}
interface LoggedOutOptions {
    redirectTo?: string | undefined;
}

function ensureLoggedIn(options?: LoggedInOptions | string): RequestHandler {
    if (typeof options == "string") {
        options = { redirectTo: options };
    }
    options = options || {};

    var url = options.redirectTo || "/login";
    var setReturnTo =
        options.setReturnTo === undefined ? true : options.setReturnTo;

    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            if (setReturnTo && req.session) {
                req.session.returnTo = req.originalUrl || req.url;
            }
            return res.redirect(url);
        }
        next();
    };
}

function ensureNotLoggedIn(
    options?: LoggedOutOptions | string
): RequestHandler {
    if (typeof options == "string") {
        options = { redirectTo: options };
    }
    options = options || {};

    var url = options.redirectTo || "/";

    return function (req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated && req.isAuthenticated()) {
            return res.redirect(url);
        }

        next();
    };
}

export { ensureLoggedIn, ensureNotLoggedIn };
