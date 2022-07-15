import express from 'express';
import {cosm} from '@d3lab/controllers';

const router = express.Router();

router.route('/init')
    .post(cosm.cosminit)

router.route('/build')
    .post(cosm.cosmBuild)

router.route('/code')
    .get(cosm.cosmLoadCodes)

export default router;