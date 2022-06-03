import express from 'express';
import {rust} from '@d3lab/controllers';

const router = express.Router();

router.route('/fmt')
    .get((req, res) => {
        res.send("You need to use POST method to format your rust code!");
    })
    .post(rust.fmtCodes)

export default router;