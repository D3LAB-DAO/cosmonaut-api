import express from 'express';
import {cosm} from '@d3lab/controllers';

const router = express.Router();

router.route('/init')
    .post(cosm.cosminit)

export default router;