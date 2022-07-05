import express from 'express';
import timeout from 'connect-timeout';

import rustRoute from './rust.route';
import cosmRoute from './cosm.route';

const router = express.Router()

router.use(timeout(8000));

router.get('/', (req, res) => {
    res.json({msg: 'Initial page', sessionID: req.sessionID});
})

const subRoutes = [
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