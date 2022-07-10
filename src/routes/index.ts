import express from 'express';
import timeout from 'connect-timeout';

import authRoute from './auth.route';
import rustRoute from './rust.route';
import cosmRoute from './cosm.route';

const router = express.Router()

router.use(timeout(5000));

router.get('/', (req, res) => {
    res.json({msg: 'Initial page', sessionID: req.sessionID});
})

// TODO: add timeout for subprocess
const subRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/rust',
        route: rustRoute
    },
    {
        path: '/cosm',
        route: cosmRoute
    }
];

subRoutes.forEach((r) => {
    router.use(r.path, r.route);
});

export default router