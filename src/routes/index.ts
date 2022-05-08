import express from 'express'
import {rust} from '../rust'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Initial page');
})

router.route('/fmt')
    .get((req, res) => {
        res.send("You need to use POST method to format your rust code!");
    })
    .post(async (req, res) => {
        // console.log(Buffer.from(fmtCode, 'base64').toString('utf-8'));
        try {
        let fmtCode = await rust.fmt(req.body);
        res.send({
            code: "success",
            result: fmtCode
        });
        } catch(err) {
            res.send({
                code: "fail",
                result: err
            })
        }
    })

export default router