import express from 'express';
import {cosm} from '@d3lab/controllers';
import conf from '@d3lab/config'
import { ensureLoggedIn } from "@d3lab/middlewares/auth";

const router = express.Router();
router.use(ensureLoggedIn(conf.front.login))

router.route('/init')
    .post(cosm.cosminit)

router.route('/build')
    .post(cosm.cosmBuild)

export default router;