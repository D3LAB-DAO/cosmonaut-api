import express from 'express';
import timeout from 'connect-timeout';

import conf from '@d3lab/config'
import rustRoute from './rust.route';
import cosmRoute from './cosm.route';
import { ensureLoggedIn } from "@d3lab/middlewares/auth";

const router = express.Router()
router.use(ensureLoggedIn('/signUp'))
router.use(timeout(conf.timeout.express));


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

router.get('*', (req, res) => {
    res.sendFile(conf.staticPath + "/index.html")
})

export default router