import {Request} from 'express';

function getUid(req: Request): string | undefined {
    if (req.session.passport) {
        return req.session.passport.user.issuer + "-" + req.session.passport.user.id
    } else {
        return undefined
    }
}

export {
    getUid
}
export * as rust from './rust'
export * as cosm from './cosm'
