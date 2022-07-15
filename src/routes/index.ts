import express from 'express';
import timeout from 'connect-timeout';

import conf from '@d3lab/config'
import authRoute from './auth.route';
import rustRoute from './rust.route';
import cosmRoute from './cosm.route';

const router = express.Router()

router.use(timeout(conf.timeout.express));

router.get('/', (req, res) => {
    res.sendFile(conf.staticPath + "/index.html")
})

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

router.get('*', (req, res) => {
    res.sendFile(conf.staticPath + "/index.html")
})

export default router