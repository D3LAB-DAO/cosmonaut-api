import express from 'express';
import {cosm} from '@d3lab/controllers';

const router = express.Router();

router.route('/init')
    .post(cosm.cosminit)

router.route('/build')
    .post(cosm.cosmBuild)

router.route('/code')
    .get(cosm.cosmLoadCodes)

router.route('/picture')
    .get(cosm.getLessonPicture)

router.route('/progress')
    .get(cosm.userProgress)

export default router;