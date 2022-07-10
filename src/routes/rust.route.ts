import express from 'express';
import {rust} from '@d3lab/controllers';
import conf from '@d3lab/config'
import { ensureLoggedIn } from "@d3lab/middlewares/auth";

const router = express.Router();
router.use(ensureLoggedIn(conf.front.login))

router.route('/fmt')
    .get((req, res) => {
        res.send("You need to use POST method to format your rust code!");
    })
    .post(rust.fmtCodes)

export default router;