import express from 'express'
import {fmtCodes} from './handle'
const router = express.Router()

router.route('/fmt')
    .get((req, res) => {
        res.send("You need to use POST method to format your rust code!");
    })
    .post(fmtCodes)

export default router
export * from './handle'