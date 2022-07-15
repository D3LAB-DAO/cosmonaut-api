import express from 'express';

import conf from '@d3lab/config'
import rustRoute from './rust.route';
import cosmRoute from './cosm.route';
import { ensureLoggedIn } from "@d3lab/middlewares/auth";


const router = express.Router()
router.use(ensureLoggedIn(conf.front.login))

router.get('/', (req, res) => {
    res.json({msg: 'v1 check page'});
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