import express from 'express';
import timeout from 'connect-timeout';
import conf from '@d3lab/config'

import authRoute from './auth.route'

const router = express.Router()
router.use('/auth', authRoute)
router.use(timeout(conf.timeout.express));

router.get('/', (req, res) => {
    res.sendFile(conf.staticPath + "/index.html")
})

export default router